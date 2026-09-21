"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordField } from "./password-field";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "./oauth-buttons";
import { Loader2 } from "lucide-react";

function LoginFormInner({ role = "founder" }: { role?: "founder" | "investor" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid email or password.");
        return;
      }

      if (data.session) {
        try {
          const { supabase } = await import("@/lib/supabase/client");
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        } catch (sessionErr) {
          console.error("Session persistence error:", sessionErr);
        }
      }

      setSubmitted(true);
      const verifiedRole = data.user?.role || role;
      let destination =
        verifiedRole === "founder" ? "/founder/dashboard" : "/investor/dashboard";

      if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
        destination = redirectTo;
      }

      setTimeout(() => {
        router.push(destination);
      }, 500);
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <svg viewBox="0 0 24 24" className="size-6 stroke-[2.5]" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-base font-bold text-slate-900">Login Successful</p>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
          Welcome back to your {role === "founder" ? "Founder" : "Investor"} portal. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  const canSubmit = email.trim().length > 3 && password.length > 0 && !loading;

  return (
    <form className="w-full space-y-4 sm:space-y-4.5" onSubmit={handleSubmit} autoComplete="off">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs leading-relaxed text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-900">
          Enter your email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="Email"
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
          style={{ fontWeight: 500 }}
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-900">
          Enter your password
        </label>
        <PasswordField
          id="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (errorMessage) setErrorMessage(null);
          }}
        />
      </div>

      {/* Remember Me & Forgot Password Row */}
      <div className="flex items-center justify-between pt-0.5 text-xs">
        <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
          />
          <span>Remember me</span>
        </label>
        <Link
          href="/legal/support"
          className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Submit Button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-pill-primary w-full py-3 text-sm font-semibold rounded-full shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all mt-1"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          "Login"
        )}
      </button>

      {/* Social Divider */}
      <div className="pt-2">
        <div className="flex items-center gap-3 text-micro sm:text-xs text-slate-400 font-medium">
          <span className="h-px flex-1 bg-slate-200" />
          Or
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="mt-3">
          <OAuthButtons role={role} onError={(msg) => setErrorMessage(msg)} />
        </div>
      </div>

      {/* Bottom Switch to Sign Up */}
      <div className="border-t border-slate-100 pt-4 mt-2 text-center text-xs text-slate-600">
        <span>Don&apos;t have an account on UnBound X yet? </span>
        <Link
          href={role === "founder" ? "/signup" : "/investor/signup"}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Get Started
        </Link>
      </div>
    </form>
  );
}

export function LoginForm({ role = "founder" }: { role?: "founder" | "investor" }) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-ink/60">Loading login form...</div>}>
      <LoginFormInner role={role} />
    </Suspense>
  );
}
