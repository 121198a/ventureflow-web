"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordField } from "./password-field";
import { OAuthButtons } from "./oauth-buttons";
import { AuthDivider, AuthRule } from "./auth-card";
import { PhoneInput } from "./phone-input";
import {
  AUTH_INPUT_CLASS,
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

  // Phone OTP Flow states
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSentPhone, setOtpSentPhone] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

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
        if (data.requiresOtp) {
          setOtpSentPhone(data.phone || targetIdentifier);
          setOtpStep(true);
          setOtpMessage(data.error || "Phone not confirmed. Enter the OTP code sent to your phone.");
          return;
        }
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

  const handleSendOtp = async () => {
    const targetPhone = phoneE164 || phone.trim();
    if (!targetPhone || targetPhone.replace(/\D/g, "").length < 7) {
      setErrorMessage("Please enter a valid phone number before requesting an OTP code.");
      return;
    }

    setOtpSending(true);
    setErrorMessage(null);
    setOtpMessage(null);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          phone: targetPhone,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to send verification code. Please try again.");
        return;
      }

      setOtpSentPhone(data.phone || targetPhone);
      setOtpStep(true);
      setOtpMessage(data.message || `Verification code sent to ${data.phone || targetPhone}.`);
    } catch {
      setErrorMessage("Network error while sending verification code.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setErrorMessage("Please enter the 6-digit verification code sent to your phone.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          phone: otpSentPhone,
          token: otpCode.trim(),
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid or expired verification code.");
        return;
      }

      if (data.session) {
        try {
          const { supabase } = await import("@/lib/supabase/client");
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        } catch {
          // Non-blocking
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
      setErrorMessage("Network error during verification. Please try again.");
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

  if (otpStep) {
    return (
      <form className={`flex w-full flex-col ${AUTH_STACK_GAP}`} onSubmit={handleVerifyOtp} autoComplete="off">
        {errorMessage && (
          <div
            role="alert"
            className="rounded-[14px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs leading-relaxed text-destructive"
          >
            {errorMessage}
          </div>
        )}

        {otpMessage && (
          <div className="rounded-[14px] border border-blue-200 bg-blue-50/80 px-4 py-3 text-xs leading-relaxed text-blue-900">
            {otpMessage}
          </div>
        )}

        <div className={`flex flex-col ${AUTH_LABEL_GAP}`}>
          <FieldLabel htmlFor="otp-token">Enter 6-digit verification code</FieldLabel>
          <input
            id="otp-token"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            placeholder="123456"
            value={otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value.replace(/\D/g, ""));
              if (errorMessage) setErrorMessage(null);
            }}
            className={AUTH_INPUT_CLASS}
            autoFocus
          />
          <p className="text-xs text-slate-500">
            Sent via SMS to <span className="font-semibold text-slate-700">{otpSentPhone}</span>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || otpCode.length < 4}
          className="btn-pill-primary h-[clamp(2.75rem,5.5vh,3.3rem)] w-full text-[length:clamp(1rem,1.14vw,1.2rem)] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-[clamp(12px,0.98vw,17px)] transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Verifying Code...
            </>
          ) : (
            "Verify & Sign In"
          )}
        </button>

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            disabled={otpSending}
            onClick={handleSendOtp}
            className="text-blue-600 font-semibold hover:underline cursor-pointer disabled:opacity-50"
          >
            {otpSending ? "Resending..." : "Resend Code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOtpStep(false);
              setErrorMessage(null);
            }}
            className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            Back to Password Login
          </button>
        </div>
      </form>
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
      <div className="flex rounded-[clamp(10px,0.8vw,14px)] bg-slate-100/90 p-1 border border-slate-200/60">
        <button
          type="button"
          onClick={() => {
            setAuthMode("email");
            if (errorMessage) setErrorMessage(null);
          }}
          className={`flex-1 py-2 text-[length:clamp(0.85rem,0.95vw,0.92rem)] rounded-[clamp(8px,0.65vw,11px)] transition-all font-semibold cursor-pointer select-none ${
            authMode === "email"
              ? "bg-white text-slate-900 shadow-2xs font-semibold"
              : "text-slate-500 hover:text-slate-900 font-medium"
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
          className={`flex-1 py-2 text-[length:clamp(0.85rem,0.95vw,0.92rem)] rounded-[clamp(8px,0.65vw,11px)] transition-all font-semibold cursor-pointer select-none ${
            authMode === "phone"
              ? "bg-white text-slate-900 shadow-2xs font-semibold"
              : "text-slate-500 hover:text-slate-900 font-medium"
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
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="phone">Enter your phone number</FieldLabel>
            <button
              type="button"
              disabled={otpSending}
              onClick={handleSendOtp}
              className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
            >
              {otpSending ? "Sending code..." : "Sign in with SMS OTP →"}
            </button>
          </div>
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
