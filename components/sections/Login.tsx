"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { site } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";
import {
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
  Calendar,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { initiateOAuthSignIn } from "@/lib/supabase/client";
import { sanitizeRedirectUrl } from "@/lib/utils";

type AuthFlow = "login" | "signup" | "recover" | "protect" | "support" | "reset";
type ResetStep = "request" | "confirm";

/**
 * Safely extracts a user-readable string from any error shape:
 * - Plain string: "Invalid password"
 * - Array of objects: [{ password: "invalid password" }]
 * - Object with keys: { password: "invalid password" }
 * - Error instance or unknown payload
 * Prevents React child rendering crashes: "Objects are not valid as a React child".
 */
export function parseErrorMessage(error: unknown, fallback = "An unexpected error occurred. Please try again."): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (Array.isArray(error)) {
    for (const item of error) {
      const parsed = parseErrorMessage(item, "");
      if (parsed) return parsed;
    }
  }
  if (typeof error === "object" && error !== null) {
    const rec = error as Record<string, unknown>;
    if (typeof rec.message === "string") return rec.message;
    if (Array.isArray(rec.message)) {
      const parsed = parseErrorMessage(rec.message, "");
      if (parsed) return parsed;
    }
    if (typeof rec.message === "object" && rec.message !== null) {
      const parsed = parseErrorMessage(rec.message, "");
      if (parsed) return parsed;
    }
    if (typeof rec.error === "string") return rec.error;
    for (const val of Object.values(rec)) {
      const parsed = parseErrorMessage(val, "");
      if (parsed) return parsed;
    }
  }
  return fallback;
}

export default function LoginPage({ initialFlow }: { initialFlow?: "signup" | "login" }) {
  const searchParams = useSearchParams();
  const flowParam = searchParams?.get("flow");
  const stepParam = searchParams?.get("step");
  const tokenParam = searchParams?.get("token") || searchParams?.get("code") || "";
  const roleParam = searchParams?.get("role");
  const redirectParam = searchParams?.get("redirectTo");

  // Determine initial active flow from URL query params
  const resolveInitialFlow = useCallback((): AuthFlow => {
    if (flowParam === "signup") return "signup";
    if (flowParam === "recover") return "recover";
    if (flowParam === "protect") return "protect";
    if (flowParam === "support") return "support";
    if (flowParam === "reset") return "reset";
    if (flowParam === "login") return "login";
    return initialFlow || "login";
  }, [flowParam, initialFlow]);

  const [flow, setFlow] = useState<AuthFlow>(resolveInitialFlow);
  const [role] = useState<"investor" | "founder">(() => {
    if (roleParam === "founder") return "founder";
    return "investor";
  });

  // Flow-specific state
  const [signupEmailMode, setSignupEmailMode] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>(
    stepParam === "confirm" || !!tokenParam ? "confirm" : "request"
  );

  // Form input fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Recovery form fields (Image 2)
  const [recoverFirstName, setRecoverFirstName] = useState("");
  const [recoverMiddleName, setRecoverMiddleName] = useState("");
  const [recoverLastName, setRecoverLastName] = useState("");
  const [recoverDob, setRecoverDob] = useState("");

  // Support form fields (Image 4)
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhoneCountry, setSupportPhoneCountry] = useState("+1");
  const [supportPhone, setSupportPhone] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  // Reset form fields
  const [resetToken, setResetToken] = useState(tokenParam);

  // Phone OTP Flow states
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSentPhone, setOtpSentPhone] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Feedback states
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with URL changes
  useEffect(() => {
    const nextFlow = resolveInitialFlow();
    setFlow(nextFlow);
    if (stepParam === "confirm" || tokenParam) {
      setResetStep("confirm");
      if (tokenParam) setResetToken(tokenParam);
    }
    setFormError(null);
    setFormSuccess(null);
    setOauthError(null);
  }, [flowParam, stepParam, tokenParam, resolveInitialFlow]);

  // Navigate between internal auth views cleanly while updating URL without reload
  const navigateFlow = (next: AuthFlow, queryExtra?: Record<string, string>) => {
    setFlow(next);
    setFormError(null);
    setFormSuccess(null);
    setOauthError(null);
    setIsSubmitting(false);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (next === "login") {
        url.searchParams.delete("flow");
        url.searchParams.delete("step");
      } else {
        url.searchParams.set("flow", next);
      }
      if (queryExtra) {
        Object.entries(queryExtra).forEach(([k, v]) => {
          if (v) url.searchParams.set(k, v);
          else url.searchParams.delete(k);
        });
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Safe redirect destination upon successful login
  const getDestinationUrl = (userRole?: string) => {
    const resolvedRole = userRole || role;
    const defaultDashboard =
      resolvedRole === "founder" ? "/founder/dashboard" : "/investor/dashboard";
    return sanitizeRedirectUrl(redirectParam, defaultDashboard);
  };

  // Google / Apple OAuth initiation
  const handleOAuth = async (provider: "google" | "apple") => {
    setOauthError(null);
    setFormError(null);

    setLoadingProvider(provider);
    try {
      const result = await initiateOAuthSignIn(provider, { role });
      if (!result.success && result.error) {
        setOauthError(parseErrorMessage(result.error));
      }
    } catch (err) {
      setOauthError(
        parseErrorMessage(
          err,
          `Unable to initiate ${provider === "google" ? "Google" : "Apple"} authentication. Please try again.`
        )
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  // Handle standard Login submission
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setFormError("Enter your email or phone number to continue.");
      return;
    }
    if (!password) {
      setFormError("Enter your password.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanIdentifier,
          password,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.requiresOtp) {
          setOtpSentPhone(data.phone || cleanIdentifier);
          setOtpStep(true);
          setOtpMessage(data.error || "Phone not confirmed. A 6-digit verification code has been sent to your phone.");
          setFormError(null);
          return;
        }

        setFormError(
          res.status === 429
            ? "Too many login attempts. Please wait a few minutes before trying again."
            : parseErrorMessage(data.error || data.message || data, "Invalid email or password.")
        );
        return;
      }

      // Sync Supabase client session if returned
      if (data.session) {
        try {
          const { supabase } = await import("@/lib/supabase/client");
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        } catch {
          // Non-blocking fallback
        }
      }

      setFormSuccess("Authentication successful! Redirecting to your dashboard...");
      const destination = getDestinationUrl(data.user?.role);
      setTimeout(() => {
        window.location.assign(destination);
      }, 500);
    } catch {
      setFormError("A network error occurred. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct OTP Send handler (for SMS login)
  const handleSendOtp = async () => {
    const cleanId = identifier.trim();
    if (!cleanId || cleanId.replace(/\D/g, "").length < 7) {
      setFormError("Please enter your phone number first.");
      return;
    }

    setOtpSending(true);
    setFormError(null);
    setOtpMessage(null);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          phone: cleanId,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setFormError(parseErrorMessage(data.error, "Failed to send verification code. Please try again."));
        return;
      }

      setOtpSentPhone(data.phone || cleanId);
      setOtpStep(true);
      setOtpMessage(data.message || `Verification code sent to ${data.phone || cleanId}.`);
    } catch {
      setFormError("Network error while sending verification code. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP submission handler
  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setFormError("Please enter the 6-digit verification code.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

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

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setFormError(parseErrorMessage(data.error || data.message, "Invalid or expired verification code."));
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

      setFormSuccess("Phone verified successfully! Redirecting to your dashboard...");
      const destination = getDestinationUrl(data.user?.role);
      setTimeout(() => {
        window.location.assign(destination);
      }, 500);
    } catch {
      setFormError("A network error occurred. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpSentPhone) return;
    setOtpSending(true);
    setFormError(null);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          phone: otpSentPhone,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setFormError(parseErrorMessage(data.error, "Unable to resend verification code. Please try again."));
        return;
      }

      setOtpMessage("A new 6-digit verification code has been dispatched via SMS.");
    } catch {
      setFormError("Network error while resending verification code.");
    } finally {
      setOtpSending(false);
    }
  };

  // Handle Signup submission
  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = identifier.trim();

    if (!cleanEmail) {
      setFormError("Enter your email address or phone number.");
      return;
    }
    if (!password) {
      setFormError("Enter a password.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setFormError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          confirmPassword,
          agreed: true,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          res.status === 429
            ? "Too many signup attempts. Please try again later."
            : parseErrorMessage(data.error || data.message || data, "Unable to create account. Please check your information.")
        );
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
          // Non-blocking fallback
        }
      }

      setFormSuccess(
        data.session
          ? "Account created successfully! Redirecting..."
          : "Account created! Please check your email to confirm your account."
      );

      if (data.session) {
        const destination = getDestinationUrl(data.user?.role);
        setTimeout(() => {
          window.location.assign(destination);
        }, 600);
      }
    } catch {
      setFormError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Recover Account submission (Image 2)
  const handleRecoverSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recoverFirstName.trim()) {
      setFormError("First name is required.");
      return;
    }
    if (!recoverLastName.trim()) {
      setFormError("Last name is required.");
      return;
    }
    if (!recoverDob.trim()) {
      setFormError("Date of birth is required.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: recoverFirstName.trim(),
          middleName: recoverMiddleName.trim() || undefined,
          lastName: recoverLastName.trim(),
          dob: recoverDob.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          res.status === 429
            ? "Too many recovery attempts. Please try again later."
            : parseErrorMessage(data.error || data.message || data, "Unable to process recovery request.")
        );
        return;
      }

      // Transition smoothly to Protect view (Image 3)
      navigateFlow("protect");
    } catch {
      setFormError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Contact Support submission (Image 4)
  const handleSupportSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supportName.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!supportEmail.trim()) {
      setFormError("Email is required.");
      return;
    }
    if (!supportMessage.trim()) {
      setFormError("Please enter a message describing your request.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const formattedPhone = supportPhone.trim()
        ? `${supportPhoneCountry} ${supportPhone.trim()}`
        : "";

      const res = await fetch("/api/auth/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supportName.trim(),
          email: supportEmail.trim(),
          phone: formattedPhone || undefined,
          message: supportMessage.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          res.status === 429
            ? "Too many requests. Please try again later."
            : parseErrorMessage(data.error || data.message || data, "Unable to submit support request.")
        );
        return;
      }

      setFormSuccess(
        parseErrorMessage(
          data.message,
          "Thank you! Your recovery request has been received. Our support team will review your details and contact you shortly."
        )
      );
    } catch {
      setFormError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password submission (Request step)
  const handleResetRequestSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clean = identifier.trim();
    if (!clean) {
      setFormError("Enter your registered email or phone number.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "request",
          email: clean,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          res.status === 429
            ? "Too many reset attempts. Please try again later."
            : parseErrorMessage(data.error || data.message || data, "Unable to request password reset.")
        );
        return;
      }

      setFormSuccess(
        parseErrorMessage(
          data.message,
          "If an account is associated with this email or phone, password recovery instructions have been sent."
        )
      );
    } catch {
      setFormError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Reset Confirm submission (Confirm step)
  const handleResetConfirmSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetToken.trim()) {
      setFormError("Enter your recovery token or code.");
      return;
    }
    if (!password) {
      setFormError("Enter a new password.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "confirm",
          token: resetToken.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          res.status === 429
            ? "Too many attempts. Please try again later."
            : parseErrorMessage(data.error || data.message || data, "The recovery token is invalid or has expired.")
        );
        return;
      }

      setFormSuccess(
        parseErrorMessage(
          data.message,
          "Password changed successfully! You can now log in with your new password."
        )
      );
    } catch {
      setFormError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Is header with brand on left and back button on right?
  const showTopNavHeader = flow !== "login" || signupEmailMode;

  return (
    <main className="min-h-dvh w-full bg-gradient-to-br from-[#fdf2fa] via-[#f3f7ff] to-[#eaf6ff] text-slate-900 flex flex-col justify-between px-4 py-4 sm:px-8 sm:py-6 relative overflow-x-hidden overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      {/* Background Soft Pastel Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-[-140px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute top-[10%] left-[-100px] h-[400px] w-[400px] rounded-full bg-purple-100/35 blur-3xl" />
        <div className="absolute top-[20%] right-[-100px] h-[420px] w-[420px] rounded-full bg-pink-100/35 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-100px] h-[450px] w-[450px] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between shrink-0">
        <TransitionLink
          href="/"
          className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
          aria-label="UnBound X Home"
        >
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full flex items-center justify-center shadow-2xs">
            <Image
              src="/logo/unboundx-mark.png"
              width={32}
              height={32}
              alt={site.name}
              className="h-full w-full object-cover rounded-full transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <UnboundXBrand className="text-base sm:text-lg font-bold" />
        </TransitionLink>

        {showTopNavHeader && (
          <button
            type="button"
            onClick={() => {
              if (flow === "support" && recoverFirstName) {
                navigateFlow("protect");
              } else if (flow === "protect") {
                navigateFlow("recover");
              } else if (signupEmailMode) {
                setSignupEmailMode(false);
              } else {
                navigateFlow("login");
              }
            }}
            aria-label="Go back"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-slate-200 bg-white/95 shadow-2xs hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ChevronLeft className="size-4 sm:size-5 stroke-[2.2]" />
          </button>
        )}
      </header>

      {/* Main Centered Content Card */}
      <div className="relative z-10 flex flex-1 items-center justify-center my-auto py-4 sm:py-6">
        <section className="w-full max-w-[420px] px-2 sm:px-0 text-center">
          <AnimatePresence mode="wait">
            {/* 1. LOGIN VIEW (Matches Attachment 1 / Image 1) */}
            {flow === "login" && (
              <motion.div
                key="flow-login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {/* Brand Logo with Ambient Aura */}
                <div className="relative mx-auto mb-4 grid h-16 w-16 sm:h-20 sm:w-20 place-items-center">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 opacity-20 blur-md"
                    aria-hidden="true"
                  />
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden shadow-[0_16px_40px_rgba(168,85,247,0.22)] border border-white/80 bg-white">
                    <Image
                      src="/logo/unboundx-mark.png"
                      width={80}
                      height={80}
                      alt={site.name}
                      className="h-full w-full object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Welcome back.
                </h1>
                <p className="mx-auto mt-1 text-xs sm:text-sm text-slate-500 font-normal">
                  Pick up where you left off.
                </p>

                {/* Status & Error Alerts */}
                {oauthError && (
                  <div
                    role="alert"
                    className="mt-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left text-xs leading-relaxed text-amber-900"
                  >
                    <p className="font-semibold flex items-center gap-1.5 mb-0.5">
                      <AlertCircle className="size-3.5 text-amber-700 shrink-0" />
                      Notice
                    </p>
                    <p>{parseErrorMessage(oauthError)}</p>
                  </div>
                )}

                {formError && (
                  <div
                    role="alert"
                    className="mt-3.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-left text-xs leading-relaxed text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{parseErrorMessage(formError)}</span>
                  </div>
                )}

                {formSuccess ? (
                  <div
                    role="status"
                    className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-center"
                  >
                    <CheckCircle2 className="size-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-900">{parseErrorMessage(formSuccess)}</p>
                  </div>
                ) : otpStep ? (
                  /* OTP Verification Screen */
                  <form onSubmit={handleVerifyOtp} className="mt-5 text-left space-y-4">
                    {otpMessage && (
                      <div className="rounded-xl border border-blue-200 bg-blue-50/90 p-3 text-xs leading-relaxed text-blue-900 flex items-start gap-2">
                        <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{otpMessage}</span>
                      </div>
                    )}

                    <div>
                      <label htmlFor="login-otp-code" className="block text-xs font-semibold text-slate-700 mb-1">
                        Enter 6-digit confirmation code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="login-otp-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={8}
                        placeholder="123456"
                        value={otpCode}
                        disabled={isSubmitting}
                        autoFocus
                        onChange={(e) => {
                          setOtpCode(e.target.value.replace(/\D/g, ""));
                          if (formError) setFormError(null);
                        }}
                        className="w-full h-12 rounded-xl border border-slate-200/90 bg-white px-3.5 text-center text-xl tracking-[0.28em] font-mono font-bold text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        Code sent to <span className="font-semibold text-slate-700">{otpSentPhone}</span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || otpCode.length < 4}
                      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-white" /> Verifying Code...
                        </span>
                      ) : (
                        "Verify & Log In"
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        disabled={otpSending}
                        onClick={handleResendOtp}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer disabled:opacity-50"
                      >
                        {otpSending ? "Resending..." : "Resend Code"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(false);
                          setFormError(null);
                          setOtpMessage(null);
                        }}
                        className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Back to Password Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} autoComplete="on" className="mt-5 text-left space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="login-identifier"
                          className="block text-xs font-semibold text-slate-700"
                        >
                          Email or Phone number <span className="text-red-500">*</span>
                        </label>
                        {identifier.replace(/\D/g, "").length >= 7 && !identifier.includes("@") && (
                          <button
                            type="button"
                            disabled={otpSending}
                            onClick={handleSendOtp}
                            className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
                          >
                            {otpSending ? "Sending OTP..." : "Sign in with SMS OTP →"}
                          </button>
                        )}
                      </div>
                      <input
                        id="login-identifier"
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="you@example.com"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                      <div className="flex justify-end mt-1.5">
                        <button
                          type="button"
                          onClick={() => navigateFlow("recover")}
                          className="text-[11px] sm:text-xs text-blue-600 font-medium hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                        >
                          Forgot your email / phone number?
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={password}
                          disabled={isSubmitting}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="Enter your password"
                          required
                          className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <div className="flex justify-end mt-1.5">
                        <button
                          type="button"
                          onClick={() => navigateFlow("reset", { step: "request" })}
                          className="text-[11px] sm:text-xs text-blue-600 font-medium hover:underline cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>

                    {/* Submit Log In */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 mt-3 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-white" /> Signing in...
                        </span>
                      ) : (
                        "Log in"
                      )}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="my-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-normal text-slate-400 select-none">or</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Social Login 2-Column Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth("google")}
                    disabled={loadingProvider !== null || isSubmitting}
                    aria-label="Continue with Google"
                    className="h-11 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {loadingProvider === "google" ? (
                      <Loader2 className="size-4 animate-spin text-blue-600" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth("apple")}
                    disabled={loadingProvider !== null || isSubmitting}
                    aria-label="Continue with Apple"
                    className="h-11 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {loadingProvider === "apple" ? (
                      <Loader2 className="size-4 animate-spin text-blue-600" />
                    ) : (
                      <AppleIcon />
                    )}
                    <span>Apple</span>
                  </button>
                </div>

                {/* Footer Switch */}
                <p className="mt-6 text-xs sm:text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigateFlow("signup")}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            )}

            {/* 2. SIGNUP VIEW */}
            {flow === "signup" && !signupEmailMode && (
              <motion.div
                key="flow-signup-landing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <div className="relative mx-auto mb-4 grid h-16 w-16 sm:h-20 sm:w-20 place-items-center">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden shadow-[0_16px_40px_rgba(168,85,247,0.22)] border border-white/80 bg-white">
                    <Image
                      src="/logo/unboundx-mark.png"
                      width={80}
                      height={80}
                      alt={site.name}
                      className="h-full w-full object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Join UnBound X
                </h1>
                <p className="mx-auto mt-2 max-w-[340px] text-xs sm:text-sm leading-relaxed text-slate-500">
                  Discover better investment ideas, track them against the market, and invest with more clarity.
                </p>

                {oauthError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left text-xs leading-relaxed text-amber-900"
                  >
                    <p className="font-semibold flex items-center gap-1.5 mb-0.5">
                      <AlertCircle className="size-3.5 text-amber-700 shrink-0" />
                      Notice
                    </p>
                    <p>{parseErrorMessage(oauthError)}</p>
                  </div>
                )}

                {/* Social Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => handleOAuth("google")}
                    disabled={loadingProvider !== null}
                    aria-label="Continue with Google"
                    className="w-full h-11 sm:h-12 inline-flex items-center justify-center gap-3 rounded-full border border-slate-200/90 bg-white/95 px-6 text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {loadingProvider === "google" ? (
                      <Loader2 className="size-4 animate-spin text-blue-600" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth("apple")}
                    disabled={loadingProvider !== null}
                    aria-label="Continue with Apple"
                    className="w-full h-11 sm:h-12 inline-flex items-center justify-center gap-3 rounded-full border border-slate-200/90 bg-white/95 px-6 text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {loadingProvider === "apple" ? (
                      <Loader2 className="size-4 animate-spin text-blue-600" />
                    ) : (
                      <AppleIcon />
                    )}
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-normal text-slate-400">or</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={() => setSignupEmailMode(true)}
                  className="w-full h-11 sm:h-12 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Continue with email or phone
                </button>

                <p className="mt-5 text-xs leading-relaxed text-slate-400">
                  By continuing, you agree to our{" "}
                  <TransitionLink href="/legal/terms-condition" className="font-semibold text-blue-600 hover:underline">
                    Terms
                  </TransitionLink>{" "}
                  and acknowledge our{" "}
                  <TransitionLink href="/legal/privacy-policy" className="font-semibold text-blue-600 hover:underline">
                    Privacy Policy
                  </TransitionLink>
                  .
                </p>

                <p className="mt-4 text-xs sm:text-sm text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigateFlow("login")}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </p>
              </motion.div>
            )}

            {/* 2b. SIGNUP EMAIL REGISTRATION FORM */}
            {flow === "signup" && signupEmailMode && (
              <motion.div
                key="flow-signup-form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="text-left"
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 text-center">
                  Create your account
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
                  Enter your credentials to create your UnBound X account.
                </p>

                {formError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs leading-relaxed text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{parseErrorMessage(formError)}</span>
                  </div>
                )}

                {formSuccess ? (
                  <div
                    role="status"
                    className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
                  >
                    <CheckCircle2 className="size-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-900">{parseErrorMessage(formSuccess)}</p>
                    <button
                      type="button"
                      onClick={() => navigateFlow("login")}
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Return to Log in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSignupSubmit} autoComplete="on" className="mt-5 space-y-3.5">
                    <div>
                      <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Email address or Phone number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="signup-email"
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="you@example.com or +1 (555) 000-0000"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={password}
                          disabled={isSubmitting}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="Min. 8 characters"
                          required
                          className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-confirm" className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="signup-confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={confirmPassword}
                          disabled={isSubmitting}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="Re-enter your password"
                          required
                          className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        id="signup-agreed"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <label htmlFor="signup-agreed" className="text-xs text-slate-500 leading-snug">
                        I agree to the{" "}
                        <TransitionLink href="/legal/terms-condition" className="text-blue-600 hover:underline">
                          Terms of Use
                        </TransitionLink>{" "}
                        and{" "}
                        <TransitionLink href="/legal/privacy-policy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </TransitionLink>
                        .
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 mt-4 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-white" /> Creating account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>
                )}

                <p className="mt-4 text-center text-xs sm:text-sm text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigateFlow("login")}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </p>
              </motion.div>
            )}

            {/* 3. RECOVER ACCOUNT VIEW (Matches Attachment 2 / Image 2) */}
            {flow === "recover" && (
              <motion.div
                key="flow-recover"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Recover your account
                </h1>
                <p className="mx-auto mt-1.5 text-xs sm:text-sm text-slate-500">
                  Enter your information that helps us verify your account.
                </p>

                {formError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50/90 p-3 text-left text-xs leading-relaxed text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{parseErrorMessage(formError)}</span>
                  </div>
                )}

                <form onSubmit={handleRecoverSubmit} autoComplete="on" className="mt-5 text-left space-y-3.5">
                  <div>
                    <label htmlFor="recover-firstName" className="block text-xs font-semibold text-slate-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="recover-firstName"
                      type="text"
                      autoComplete="given-name"
                      value={recoverFirstName}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setRecoverFirstName(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      placeholder="First Name"
                      required
                      className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label htmlFor="recover-middleName" className="block text-xs font-semibold text-slate-700 mb-1">
                      Middle Name (Optional)
                    </label>
                    <input
                      id="recover-middleName"
                      type="text"
                      autoComplete="additional-name"
                      value={recoverMiddleName}
                      disabled={isSubmitting}
                      onChange={(e) => setRecoverMiddleName(e.target.value)}
                      placeholder="Middle Name"
                      className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label htmlFor="recover-lastName" className="block text-xs font-semibold text-slate-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="recover-lastName"
                      type="text"
                      autoComplete="family-name"
                      value={recoverLastName}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setRecoverLastName(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      placeholder="Last Name"
                      required
                      className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label htmlFor="recover-dob" className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="recover-dob"
                        type="text"
                        autoComplete="bday"
                        value={recoverDob}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setRecoverDob(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="MM/DD/YYYY"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 mt-3 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin text-white" /> Searching...
                      </span>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>

                {/* Support Recovery Notice Box */}
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-left">
                  <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      If you don&apos;t remember some of the details, our support team can help you recover your account.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateFlow("support")}
                    className="w-full h-10 mt-3 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Contact our support team</span>
                    <Headphones className="size-4 text-blue-600" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 4. PROTECT ACCOUNT VIEW (Matches Attachment 3 / Image 3) */}
            {flow === "protect" && (
              <motion.div
                key="flow-protect"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
                  <ShieldCheck className="size-6 stroke-[2.2]" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Protect your account
                </h1>
                <p className="mx-auto mt-2 max-w-[360px] text-xs sm:text-sm text-slate-500 leading-relaxed">
                  If you no longer have access to the email associated with your account, our support team can help you recover it securely.
                </p>

                <button
                  type="button"
                  onClick={() => navigateFlow("support")}
                  className="w-full h-11 mt-6 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Contact Support
                </button>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigateFlow("login")}
                    className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    &larr; Back to login
                  </button>
                </div>
              </motion.div>
            )}

            {/* 5. CONTACT SUPPORT VIEW (Matches Attachment 4 / Image 4) */}
            {flow === "support" && (
              <motion.div
                key="flow-support"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Contact support
                </h1>
                <p className="mx-auto mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Share a few details and our team will help you recover your account.
                </p>

                {formError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50/90 p-3 text-left text-xs leading-relaxed text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{parseErrorMessage(formError)}</span>
                  </div>
                )}

                {formSuccess ? (
                  <div
                    role="status"
                    className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
                  >
                    <CheckCircle2 className="size-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-900">{parseErrorMessage(formSuccess)}</p>
                    <button
                      type="button"
                      onClick={() => navigateFlow("login")}
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Return to Log in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSupportSubmit} autoComplete="on" className="mt-5 text-left space-y-3.5">
                    <div>
                      <label htmlFor="support-name" className="block text-xs font-semibold text-slate-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="support-name"
                        type="text"
                        autoComplete="name"
                        value={supportName}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setSupportName(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="Your name"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label htmlFor="support-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="support-email"
                        type="email"
                        autoComplete="email"
                        value={supportEmail}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setSupportEmail(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="you@example.com"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label htmlFor="support-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={supportPhoneCountry}
                          onChange={(e) => setSupportPhoneCountry(e.target.value)}
                          aria-label="Country calling code"
                          className="h-11 rounded-xl border border-slate-200/90 bg-white px-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                          <option value="+1">+1 (US/CA)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+61">+61 (AU)</option>
                          <option value="+49">+49 (DE)</option>
                          <option value="+91">+91 (IN)</option>
                        </select>
                        <input
                          id="support-phone"
                          type="tel"
                          autoComplete="tel-national"
                          value={supportPhone}
                          disabled={isSubmitting}
                          onChange={(e) => setSupportPhone(e.target.value)}
                          placeholder="(555) 000-0000"
                          className="flex-1 h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="support-message" className="block text-xs font-semibold text-slate-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="support-message"
                        rows={3}
                        value={supportMessage}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setSupportMessage(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="Tell us how we can help"
                        required
                        className="w-full rounded-xl border border-slate-200/90 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none disabled:opacity-60"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 mt-3 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-white" /> Submitting...
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* 6. FORGOT PASSWORD VIEW (Reset flow) */}
            {flow === "reset" && (
              <motion.div
                key="flow-reset"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {resetStep === "confirm" ? "Create new password" : "Reset your password"}
                </h1>
                <p className="mx-auto mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[340px]">
                  {resetStep === "confirm"
                    ? "Enter your recovery token and choose a new password."
                    : "Enter your registered email or phone number to receive recovery instructions."}
                </p>

                {formError && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50/90 p-3 text-left text-xs leading-relaxed text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{parseErrorMessage(formError)}</span>
                  </div>
                )}

                {formSuccess ? (
                  <div
                    role="status"
                    className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
                  >
                    <CheckCircle2 className="size-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-emerald-900">{parseErrorMessage(formSuccess)}</p>
                    <div className="mt-4 flex flex-col gap-2">
                      {resetStep === "request" && (
                        <button
                          type="button"
                          onClick={() => {
                            setResetStep("confirm");
                            setFormSuccess(null);
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          I have a recovery token
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigateFlow("login")}
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Return to Log in
                      </button>
                    </div>
                  </div>
                ) : resetStep === "request" ? (
                  <form onSubmit={handleResetRequestSubmit} autoComplete="on" className="mt-5 text-left space-y-3.5">
                    <div>
                      <label htmlFor="reset-identifier" className="block text-xs font-semibold text-slate-700 mb-1">
                        Email or Phone number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reset-identifier"
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="you@example.com"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 mt-3 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-white" /> Sending recovery request...
                        </span>
                      ) : (
                        "Send recovery link"
                      )}
                    </button>

                    <div className="pt-2 text-center space-y-2">
                      <button
                        type="button"
                        onClick={() => setResetStep("confirm")}
                        className="text-xs text-blue-600 hover:underline cursor-pointer block w-full"
                      >
                        Already have a recovery token? Enter it here &rarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateFlow("login")}
                        className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer block w-full"
                      >
                        &larr; Back to login
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Reset Step: Confirm */
                  <form onSubmit={handleResetConfirmSubmit} autoComplete="off" className="mt-5 text-left space-y-3.5">
                    <div>
                      <label htmlFor="reset-token" className="block text-xs font-semibold text-slate-700 mb-1">
                        Recovery token or code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reset-token"
                        type="text"
                        value={resetToken}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setResetToken(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="Paste your reset token"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label htmlFor="reset-new-password" className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reset-new-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          disabled={isSubmitting}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="Min. 8 characters"
                          required
                          className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reset-confirm-password" className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reset-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          disabled={isSubmitting}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="Re-enter password"
                          required
                          className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 mt-3 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin text-white" /> Updating password...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </button>

                    <div className="pt-2 text-center space-y-2">
                      <button
                        type="button"
                        onClick={() => setResetStep("request")}
                        className="text-xs text-blue-600 hover:underline cursor-pointer block w-full"
                      >
                        Request new token instead
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateFlow("login")}
                        className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer block w-full"
                      >
                        &larr; Back to login
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Subtle Bottom Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto py-2 text-center text-[11px] text-slate-400 select-none">
        &copy; {new Date().getFullYear()} UnBound X Inc. All rights reserved.
      </footer>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.78-.07-1.53-.22-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 21.7c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.7Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.8A5.85 5.85 0 0 1 6.23 12c0-.63.11-1.24.31-1.8V7.68H3.3A9.74 9.74 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.32l3.24-2.52Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.17c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.28 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.7 5.38l3.24 2.52C7.31 7.89 9.46 6.17 12 6.17Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0 text-slate-900">
      <path d="M17.05 12.54c-.02-2.16 1.76-3.2 1.84-3.25a3.94 3.94 0 0 0-3.12-1.69c-1.32-.14-2.58.79-3.25.79-.68 0-1.71-.77-2.81-.75a4.14 4.14 0 0 0-3.5 2.13c-1.5 2.6-.38 6.43 1.07 8.53.71 1.03 1.54 2.18 2.64 2.14 1.06-.04 1.46-.69 2.75-.69 1.28 0 1.65.69 2.76.67 1.14-.02 1.86-1.04 2.55-2.07.8-1.16 1.13-2.29 1.15-2.35-.03-.01-2.2-.84-2.23-3.46ZM14.92 6.2a3.86 3.86 0 0 0 .88-2.77 3.93 3.93 0 0 0-2.54 1.31 3.68 3.68 0 0 0-.91 2.66 3.25 3.25 0 0 0 2.57-1.2Z" />
    </svg>
  );
}