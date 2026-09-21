"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Info, Loader2 } from "lucide-react";
import { PasswordField } from "./password-field";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "./oauth-buttons";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function SignupFormInner({ role = "founder" }: { role?: "founder" | "investor" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordValid = PASSWORD_RULE.test(password);
  const canContinue = email.length > 3 && passwordValid && passwordsMatch && agreed && !loading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!passwordValid) {
      setErrorMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol."
      );
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setErrorMessage("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          confirmPassword,
          agreed,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Unable to complete registration.");
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
      if (data.session) {
        const verifiedRole = data.user?.role || role;
        let destination =
          verifiedRole === "founder" ? "/founder/dashboard" : "/investor/dashboard";

        if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
          destination = redirectTo;
        }

        setTimeout(() => {
          router.push(destination);
        }, 500);
      }
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
        <p className="text-base font-bold text-slate-900">
          {role === "founder" ? "Application Submitted" : "Account Created"}
        </p>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
          {role === "founder"
            ? "Your founder application has been received. Redirecting you to your founder dashboard..."
            : "Your investor profile has been created successfully. Redirecting you to your investor portal..."}
        </p>
        <div className="mt-5">
          <Link
            href={role === "founder" ? "/founder/dashboard" : "/investor/dashboard"}
            className="btn-pill-primary px-6 py-2.5 text-xs font-semibold"
          >
            Go to Dashboard &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="w-full space-y-4 sm:space-y-4.5" onSubmit={handleSubmit} autoComplete="off">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs leading-relaxed text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-900">
          What is your email address?
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

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900"
        >
          <span>Set a password for your account</span>
          {role === "investor" && <Info className="size-3.5 text-slate-400" />}
        </label>
        <PasswordField
          id="password"
          placeholder="Password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (errorMessage) setErrorMessage(null);
          }}
        />
        <p className="mt-1.5 text-micro sm:text-xs text-slate-500 leading-relaxed font-normal">
          Create a password with at least 8 characters, using an uppercase, lowercase, number, and
          symbol.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-900">
          Confirm password
        </label>
        <PasswordField
          id="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(val) => {
            setConfirmPassword(val);
            if (errorMessage) setErrorMessage(null);
          }}
        />
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-1 text-micro text-destructive font-medium">Passwords do not match.</p>
        )}
      </div>

      {/* Agreement Checkbox */}
      <label className="flex items-start gap-2.5 pt-1 text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-blue-600 cursor-pointer"
        />
        <span>
          By creating an account, I agree to the UBverse{" "}
          <Link
            href="/legal/terms-condition"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            Terms of Use
          </Link>
          ,{" "}
          <Link
            href="/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/ubverse-disclaimer-for-unboundx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            Disclaimer
          </Link>
          .
        </span>
      </label>

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

      {/* Bottom Actions Row: Disclosures & Continue */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-2">
        <Link
          href="/legal/investment-disclaimers"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          Disclaimers and Disclosures
        </Link>
        <button
          type="submit"
          disabled={!canContinue}
          className="btn-pill-primary px-8 py-2.5 text-xs sm:text-sm font-semibold rounded-full shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </form>
  );
}

export function SignupForm({ role = "founder" }: { role?: "founder" | "investor" }) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-ink/60">Loading registration form...</div>}>
      <SignupFormInner role={role} />
    </Suspense>
  );
}
