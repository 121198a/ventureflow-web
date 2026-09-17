"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import { Button } from "@/components/ui/button";

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "role_required" | "error" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<{ id: string; email?: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState<"investor" | "founder">("investor");
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      const errorParam = searchParams.get("error");
      const errorDesc = searchParams.get("error_description");
      const code = searchParams.get("code");
      const roleParam = (searchParams.get("role") || "").toLowerCase();

      // 1. Provider returned an explicit error
      if (errorParam || errorDesc) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          errorDesc || errorParam || "Authentication was cancelled or failed with the provider."
        );
        return;
      }

      // 2. Check Supabase configuration
      if (!isSupabaseConfigured()) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          "Supabase environment variables are missing in this environment. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
        );
        return;
      }

      const client = getSupabaseClient();
      if (!client) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("Unable to initialize Supabase client.");
        return;
      }

      try {
        let activeSession = null;

        // 3. Exchange code for session if code exists
        if (code) {
          const { data, error } = await client.auth.exchangeCodeForSession(code);
          if (error) {
            if (!isMounted) return;
            setStatus("error");
            setErrorMessage(error.message || "Failed to exchange authorization code for session.");
            return;
          }
          activeSession = data?.session;
        } else {
          // Check if session already exists or was parsed from hash
          const { data } = await client.auth.getSession();
          activeSession = data?.session;
        }

        if (!activeSession || !activeSession.user) {
          if (!isMounted) return;
          setStatus("error");
          setErrorMessage("No active session could be established. Please try signing in again.");
          return;
        }

        const user = activeSession.user;
        let role =
          (user.user_metadata?.role as string) ||
          (user.app_metadata?.role as string) ||
          "";

        // 4. If user doesn't have a role yet but one was provided in the query
        if (!role && (roleParam === "investor" || roleParam === "founder" || roleParam === "issuer")) {
          const normalized = roleParam === "issuer" ? "founder" : roleParam;
          await client.auth.updateUser({
            data: { role: normalized },
          });
          role = normalized;
        }

        // 5. If role is still missing, require user to configure their role (Rule 7: Do NOT guess)
        if (!role) {
          if (!isMounted) return;
          setUserSession({ id: user.id, email: user.email });
          setStatus("role_required");
          return;
        }

        // 6. Role is verified - sync session to server cookie
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: activeSession.access_token,
            refreshToken: activeSession.refresh_token,
            role,
            email: user.email,
            id: user.id,
          }),
        }).catch(() => {});

        if (!isMounted) return;
        setStatus("success");

        const target = role === "founder" || role === "issuer" ? "/founder/dashboard" : "/investor/dashboard";
        router.replace(target);
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "An unexpected error occurred during authentication."
        );
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  const handleConfirmRole = async () => {
    setSavingRole(true);
    try {
      const client = getSupabaseClient();
      if (client && userSession) {
        await client.auth.updateUser({
          data: { role: selectedRole },
        });

        const { data } = await client.auth.getSession();
        if (data?.session) {
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: data.session.access_token,
              role: selectedRole,
              email: userSession.email,
              id: userSession.id,
            }),
          }).catch(() => {});
        }
      }

      setStatus("success");
      const target = selectedRole === "founder" ? "/founder/dashboard" : "/investor/dashboard";
      router.replace(target);
    } catch {
      setErrorMessage("Failed to save role configuration. Please try again.");
      setStatus("error");
    } finally {
      setSavingRole(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#fdf2fa] via-[#f3f7ff] to-[#eaf6ff] flex items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-hairline bg-white/80 p-8 shadow-xl backdrop-blur-md text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full overflow-hidden shadow-md border border-white">
          <Image
            src="/logo/unboundx-mark.png"
            width={64}
            height={64}
            alt="UnBound X"
            className="h-full w-full object-cover rounded-full"
            priority
          />
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto size-8 animate-spin text-brand" />
            <h1 className="text-xl font-bold tracking-tight">Verifying Secure Session</h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Exchanging security credentials with UnBound X. You will be redirected shortly...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
            <h1 className="text-xl font-bold tracking-tight text-emerald-950">Session Verified</h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Redirecting to your dashboard...
            </p>
          </div>
        )}

        {status === "role_required" && (
          <div className="space-y-5 text-left">
            <div className="text-center">
              <ShieldCheck className="mx-auto size-8 text-brand mb-2" />
              <h1 className="text-xl font-bold tracking-tight text-ink">Account Role Setup</h1>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Your authenticated profile does not have an assigned product role yet. Please choose
                how you plan to use UnBound X:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label
                onClick={() => setSelectedRole("investor")}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedRole === "investor"
                    ? "border-brand bg-brand/5 shadow-xs"
                    : "border-hairline bg-background hover:bg-surface-alt"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={selectedRole === "investor"}
                  onChange={() => setSelectedRole("investor")}
                  className="mt-1 size-4 accent-[var(--color-brand)]"
                />
                <div>
                  <p className="text-sm font-bold text-ink">Investor</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Explore verified company offerings, allocate capital, and build your thesis track record.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setSelectedRole("founder")}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedRole === "founder"
                    ? "border-brand bg-brand/5 shadow-xs"
                    : "border-hairline bg-background hover:bg-surface-alt"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={selectedRole === "founder"}
                  onChange={() => setSelectedRole("founder")}
                  className="mt-1 size-4 accent-[var(--color-brand)]"
                />
                <div>
                  <p className="text-sm font-bold text-ink">Founder / Issuer</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Launch capital raises, manage deal pages, track investor interest, and manage offerings.
                  </p>
                </div>
              </label>
            </div>

            <Button
              onClick={handleConfirmRole}
              disabled={savingRole}
              className="w-full justify-center mt-4"
            >
              {savingRole ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving Role...
                </span>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink">Authentication Notice</h1>
              <p className="mt-2 text-xs text-destructive/90 leading-relaxed bg-destructive/5 rounded-lg p-3 border border-destructive/20 text-left">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button href="/login" className="w-full justify-center">
                Return to Login
              </Button>
              <Link
                href="/legal/support"
                className="text-xs text-muted-foreground hover:text-ink underline"
              >
                Need help? Contact support
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-hairline/60">
          <UnboundXBrand className="text-sm font-bold opacity-75" />
        </div>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fdf2fa]">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
