"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Info, Loader2 } from "lucide-react";
import { PasswordField } from "./password-field";
import { OAuthButtons } from "./oauth-buttons";
import { AuthDivider, AuthRule } from "./auth-card";
import {
  AUTH_HELPER_CLASS,
  AUTH_LABEL_GAP,
  AUTH_STACK_GAP,
  FieldLabel,
  InputField,
} from "./input-field";

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
      <div className="w-full rounded-[20px] border border-[#e0e8f5] bg-[#f8faff] p-6 text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <svg viewBox="0 0 24 24" className="size-6 stroke-[2.5]" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-base font-bold text-[#0b1a33]">
          {role === "founder" ? "Application Submitted" : "Account Created"}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
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
    <form className={`flex w-full flex-col ${AUTH_STACK_GAP}`} onSubmit={handleSubmit} autoComplete="off">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-[14px] border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs leading-relaxed text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {/* Email address */}
      <InputField
        id="email"
        label="What is your email address?"
        placeholder="Email"
        value={email}
        onChange={(val) => {
          setEmail(val);
          if (errorMessage) setErrorMessage(null);
        }}
      />

      {/* Password + requirements */}
      <div className="flex flex-col">
        <div className={`flex flex-col ${AUTH_LABEL_GAP}`}>
          <FieldLabel htmlFor="password" className="flex items-center justify-between">
            <span>Set a password for your account</span>
            {role === "investor" && <Info className="size-4 text-slate-400" aria-hidden />}
          </FieldLabel>
          <PasswordField
            id="password"
            placeholder="Password"
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (errorMessage) setErrorMessage(null);
            }}
          />
        </div>
        <p className={`mt-[clamp(0.35rem,1vh,0.6rem)] ${AUTH_HELPER_CLASS}`}>
          Create a password with at least 8 characters, using an uppercase, lowercase, number, and symbol.
        </p>
      </div>

      {/* Confirm password (label is screen-reader only, matching the design) */}
      <div className="-mt-[clamp(0.1rem,0.35vh,0.25rem)] flex flex-col">
        <FieldLabel htmlFor="confirmPassword" srOnly>
          Confirm password
        </FieldLabel>
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
          <p className="mt-1.5 text-micro font-medium text-destructive">Passwords do not match.</p>
        )}
      </div>

      {/* Agreement */}
      <label className="-mt-[clamp(0.1rem,0.35vh,0.25rem)] flex cursor-pointer select-none items-start gap-[clamp(0.75rem,1.2vw,1.1rem)] text-[length:clamp(0.85rem,1.08vw,1.15rem)] font-medium leading-[1.55] text-[#1c2740]">
        <span className="relative mt-[0.2em] grid size-[clamp(1.1rem,1.35vw,1.45rem)] shrink-0 place-items-center">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="peer size-full cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-[#8f98a8] bg-white transition-colors checked:border-blue-600 checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/15"
          />
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute size-[70%] stroke-white opacity-0 peer-checked:opacity-100"
            fill="none"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="lg:pr-[1.2vw]">
          By creating an account, I agree to the UBverse{" "}
          <Link
            href="/legal/terms-condition"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline underline-offset-2 hover:text-blue-800"
          >
            Terms of Use,
          </Link>{" "}
          <Link
            href="/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline underline-offset-2 hover:text-blue-800"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/ubverse-disclaimer-for-unboundx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline underline-offset-2 hover:text-blue-800"
          >
            Disclaimer
          </Link>
          .
        </span>
      </label>

      {/* Social */}
      <div className="flex flex-col gap-[clamp(0.7rem,1.9vh,1.15rem)]">
        <AuthDivider />
        <OAuthButtons role={role} onError={(msg) => setErrorMessage(msg)} />
      </div>

      {/* Footer row: disclosures + Continue */}
      <div className="flex flex-col gap-[clamp(0.9rem,2.65vh,1.6rem)]">
        <AuthRule />
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/legal/investment-disclaimers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[length:clamp(0.85rem,1.06vw,1.15rem)] font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800"
          >
            Disclaimers and Disclosures
          </Link>
          <button
            type="submit"
            disabled={!canContinue}
            className="btn-pill-primary h-[clamp(2.6rem,5.3vh,3.2rem)] min-w-[clamp(7.5rem,9.4vw,10rem)] px-8 text-[length:clamp(1rem,1.14vw,1.2rem)] disabled:cursor-not-allowed disabled:bg-[#c8dffd] disabled:text-white disabled:shadow-none"
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
