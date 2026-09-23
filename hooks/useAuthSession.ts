"use client";

import { useEffect, useState, useCallback } from "react";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";

export interface AuthUser {
  id?: string;
  email?: string;
  role?: "investor" | "founder" | "issuer" | string;
}

interface SessionState {
  user: AuthUser | null;
  role: string | null;
  loading: boolean;
  initialized: boolean;
}

// Module-level session cache and subscriber store
// Guarantees singleton session resolution with zero duplicate API requests across components
let globalState: SessionState = {
  user: null,
  role: null,
  loading: true,
  initialized: false,
};

const listeners = new Set<() => void>();
let inFlightPromise: Promise<{ user: AuthUser | null; role: string | null }> | null = null;
let authSubscriptionInitialized = false;

function updateGlobalState(next: Partial<SessionState>) {
  globalState = { ...globalState, ...next };
  listeners.forEach((listener) => listener());
}

async function fetchSessionInternal(force = false): Promise<{ user: AuthUser | null; role: string | null }> {
  if (inFlightPromise && !force) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      // 1. Check server cryptographic session via API
      const res = await fetch("/api/auth/session", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.authenticated && data.user) {
          const user: AuthUser = data.user;
          const role = data.user.role || null;
          updateGlobalState({ user, role, loading: false, initialized: true });
          return { user, role };
        }
      }

      // 2. Client-side Supabase check if configured
      if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        if (client) {
          const { data } = await client.auth.getSession().catch(() => ({ data: null }));
          if (data?.session?.user) {
            const sbUser = data.session.user;
            const sbRole =
              (sbUser.user_metadata?.role as string) ||
              (sbUser.app_metadata?.role as string) ||
              null;

            const user: AuthUser = {
              id: sbUser.id,
              email: sbUser.email,
              role: sbRole || undefined,
            };

            // Sync verified Supabase session to server cookies so edge middleware validates
            await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token,
                role: sbRole,
                email: sbUser.email,
                id: sbUser.id,
              }),
            }).catch(() => {});

            updateGlobalState({ user, role: sbRole, loading: false, initialized: true });
            return { user, role: sbRole };
          }
        }
      }

      // 3. Unauthenticated baseline
      updateGlobalState({ user: null, role: null, loading: false, initialized: true });
      return { user: null, role: null };
    } catch {
      updateGlobalState({ user: null, role: null, loading: false, initialized: true });
      return { user: null, role: null };
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

function initSupabaseSubscription() {
  if (authSubscriptionInitialized || typeof window === "undefined" || !isSupabaseConfigured()) {
    return;
  }

  const client = getSupabaseClient();
  if (!client) return;

  authSubscriptionInitialized = true;
  client.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      updateGlobalState({ user: null, role: null, loading: false, initialized: true });
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    } else if (session?.user) {
      const u = session.user;
      const r =
        (u.user_metadata?.role as string) ||
        (u.app_metadata?.role as string) ||
        null;

      const user: AuthUser = { id: u.id, email: u.email, role: r || undefined };
      updateGlobalState({ user, role: r, loading: false, initialized: true });

      // Keep server cookie synced on refresh or signin
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          role: r,
          email: u.email,
          id: u.id,
        }),
      }).catch(() => {});
    }
  });
}

export function useAuthSession() {
  const [state, setState] = useState<SessionState>(() => globalState);

  useEffect(() => {
    initSupabaseSubscription();

    const listener = () => {
      setState(globalState);
    };

    listeners.add(listener);

    // Initial fetch if not already initialized
    if (!globalState.initialized) {
      fetchSessionInternal();
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const refreshSession = useCallback(async () => {
    updateGlobalState({ loading: true });
    return fetchSessionInternal(true);
  }, []);

  const logout = useCallback(async () => {
    updateGlobalState({ loading: true });
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

      updateGlobalState({ user: null, role: null, loading: false, initialized: true });

      // Invalidate and hard-redirect to login, wiping client history and preventing back-navigation
      window.location.replace("/login");
    } catch {
      updateGlobalState({ user: null, role: null, loading: false, initialized: true });
      window.location.replace("/login");
    }
  }, []);

  return {
    user: state.user,
    role: state.role,
    loading: state.loading,
    isAuthenticated: Boolean(state.user),
    logout,
    refreshSession,
  };
}
