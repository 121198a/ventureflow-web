"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";

export interface AuthUser {
  id?: string;
  email?: string;
  role?: "investor" | "founder" | "issuer" | string;
}

export function useAuthSession() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    try {
      // 1. Check server session via API
      const res = await fetch("/api/auth/session", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setRole(data.user.role || null);
          setLoading(false);
          return;
        }
      }

      // 2. Client-side Supabase check if configured
      if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        if (client) {
          const { data } = await client.auth.getSession();
          if (data?.session?.user) {
            const sbUser = data.session.user;
            const sbRole =
              (sbUser.user_metadata?.role as string) ||
              (sbUser.app_metadata?.role as string) ||
              null;

            setUser({
              id: sbUser.id,
              email: sbUser.email,
              role: sbRole || undefined,
            });
            setRole(sbRole);
            setLoading(false);
            return;
          }
        }
      }

      setUser(null);
      setRole(null);
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_OUT" || !session) {
            setUser(null);
            setRole(null);
            setLoading(false);
          } else if (session?.user) {
            const u = session.user;
            const r =
              (u.user_metadata?.role as string) ||
              (u.app_metadata?.role as string) ||
              null;

            setUser({ id: u.id, email: u.email, role: r || undefined });
            setRole(r);
            setLoading(false);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, [refreshSession]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        if (client) {
          await client.auth.signOut().catch(() => {});
        }
      }

      await fetch("/api/auth/logout", {
        method: "POST",
      }).catch(() => {});

      setUser(null);
      setRole(null);

      // Invalidate and redirect to login, replacing history to prevent back-navigation to protected pages
      window.location.replace("/login");
    } catch {
      window.location.replace("/login");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    role,
    loading,
    isAuthenticated: Boolean(user),
    logout,
    refreshSession,
  };
}
