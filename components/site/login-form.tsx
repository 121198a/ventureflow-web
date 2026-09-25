"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordField } from "./password-field";
import { OAuthButtons } from "./oauth-buttons";
import { AuthDivider, AuthRule } from "./auth-card";
import { PhoneInput } from "./phone-input";
import {
  AUTH_LABEL_GAP,
  AUTH_STACK_GAP,
  FieldLabel,
  InputField,
} from "./input-field";
import { Loader2 } from "lucide-react";
import { sanitizeRedirectUrl } from "@/lib/utils";

function LoginFormInner({ role = "founder" }: { role?: "founder" | "investor" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const isValidPhone = (val: string) =>
    /^\+?[0-9\s\-()]{7,25}$/.test(val.trim());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetIdentifier =
      authMode === "email" ? email.trim() : (phoneE164 || phone.trim());

    if (authMode === "email") {
      if (!targetIdentifier || !password) {
        setErrorMessage("Please enter both email and password.");
        return;
      }

      if (!isValidEmail(targetIdentifier) && !isValidPhone(targetIdentifier)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
    } else {
      if (!phone.trim() || !password) {
        setErrorMessage("Please enter both phone number and password.");
        return;
      }

      if (phone.replace(/\D/g, "").length < 7) {
        setErrorMessage("Please enter a valid phone number.");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetIdentifier,
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
          if (process.env.NODE_ENV === "development") {
            console.error("Session persistence error:", sessionErr);
          }
        }
      }

      setSubmitted(true);
      const verifiedRole = data.user?.role || role;
      const defaultDest =
        verifiedRole === "founder" ? "/founder/dashboard" : "/investor/dashboard";
      const destination = redirectTo ? sanitizeRedirectUrl(redirectTo, defaultDest) : defaultDest;

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
      <div className="w-full rounded-[20px] border border-blue-100 bg-blue-50/40 p-6 text-center">
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <svg viewBox="0 0 24 24" className="size-6 stroke-[2.5]" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-base font-bold text-slate-900">Login Successful</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
          Welcome back to your {role === "founder" ? "Founder" : "Investor"} portal. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  const canSubmit =
    (authMode === "email" ? email.trim().length > 3 : phone.trim().length >= 7) &&
    password.length > 0 &&
    !loading;

  return (
    <form className={`flex w-full flex-col ${AUTH_STACK_GAP}`} onSubmit={handleSubmit} autoComplete="off">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-[14px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs leading-relaxed text-destructive"
        >
          {errorMessage}
        </div>
      )}

      {/* Auth mode selector */}
      <div className="flex rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => {
            setAuthMode("email");
            if (errorMessage) setErrorMessage(null);
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            authMode === "email"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("phone");
            if (errorMessage) setErrorMessage(null);
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            authMode === "phone"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Phone Number
        </button>
      </div>

      {/* Email / Phone input */}
      {authMode === "email" ? (
        <InputField
          id="email"
          label="Enter your email address"
          placeholder="Email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            if (errorMessage) setErrorMessage(null);
          }}
        />
      ) : (
        <div className={`flex flex-col ${AUTH_LABEL_GAP}`}>
          <FieldLabel htmlFor="phone">Enter your phone number</FieldLabel>
          <PhoneInput
            id="phone"
            value={phone}
            onChange={(val, e164) => {
              setPhone(val);
              setPhoneE164(e164);
              if (errorMessage) setErrorMessage(null);
            }}
          />
        </div>
      )}

      {/* Password */}
      <div className={`flex flex-col ${AUTH_LABEL_GAP}`}>
        <FieldLabel htmlFor="password">Enter your password</FieldLabel>
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

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between gap-3 text-[length:clamp(0.85rem,1.02vw,1.1rem)] font-medium">
        <label className="flex cursor-pointer select-none items-center gap-3 text-slate-700">
          <span className="relative grid size-[clamp(1.1rem,1.3vw,1.4rem)] shrink-0 place-items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="peer size-full cursor-pointer appearance-none rounded-[5px] border-[1.5px] border-slate-400 bg-white transition-colors checked:border-blue-600 checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/15"
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
          <span>Remember me</span>
        </label>
        <Link
          href={role === "investor" ? "/investor/forgot" : "/issuer/forgot"}
          className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-pill-primary h-[clamp(2.75rem,5.5vh,3.3rem)] w-full text-[length:clamp(1rem,1.14vw,1.2rem)] disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-white disabled:shadow-none"
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

      {/* Social */}
      <div className="flex flex-col gap-[clamp(0.7rem,1.9vh,1.15rem)]">
        <AuthDivider />
        <OAuthButtons role={role} onError={(msg) => setErrorMessage(msg)} />
      </div>

      {/* Switch to Get Started */}
      <div className="flex flex-col gap-[clamp(0.9rem,2.7vh,1.6rem)]">
        <AuthRule />
        <p className="text-center text-[length:clamp(0.85rem,1.02vw,1.1rem)] font-medium text-[#1c2740]">
          <span>Don&apos;t have an account on UnBound X yet? </span>
          <Link
            href={role === "founder" ? "/signup" : "/investor/signup"}
            className="whitespace-nowrap font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
          >
            Get Started
          </Link>
        </p>
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
