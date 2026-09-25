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
  ArrowRight,
} from "lucide-react";
import { initiateOAuthSignIn } from "@/lib/supabase/client";
import { sanitizeRedirectUrl } from "@/lib/utils";
import { PhoneInput } from "@/components/site/phone-input";

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

  // Login Mode (Email vs Phone Number)
  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPhoneE164, setLoginPhoneE164] = useState("");

  // Signup Mode (Email vs Phone Number)
  const [signupMode, setSignupMode] = useState<"email" | "phone">("email");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPhoneE164, setSignupPhoneE164] = useState("");

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

  // Phone & Email OTP Flow states
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpDestination, setOtpDestination] = useState("");
  const [otpType, setOtpType] = useState<"phone" | "email">("email");
  const [otpSending, setOtpSending] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Feedback states
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);
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

  // Google / Facebook OAuth initiation
  const handleOAuth = async (provider: "google" | "facebook") => {
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
          `Unable to initiate ${provider === "google" ? "Google" : "Facebook"} authentication. Please try again.`
        )
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  // Handle standard Login submission
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetIdentifier =
      loginMode === "email" ? identifier.trim() : (loginPhoneE164 || loginPhone.trim());

    if (!targetIdentifier) {
      setFormError(loginMode === "email" ? "Enter your email address to continue." : "Enter your phone number to continue.");
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
          email: targetIdentifier,
          password,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.requiresOtp) {
          const target = data.phone || data.destination || targetIdentifier;
          setOtpDestination(target);
          setOtpType("phone");
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

  // Direct OTP Send handler (supports both email and phone destinations)
  const handleSendOtp = async () => {
    const target =
      loginMode === "email" ? identifier.trim() : (loginPhoneE164 || loginPhone.trim());
    const isEmailInput = loginMode === "email";

    if (!target) {
      setFormError(isEmailInput ? "Please enter your email address first." : "Please enter your phone number first.");
      return;
    }
    if (!isEmailInput && target.replace(/\D/g, "").length < 7) {
      setFormError("Please enter a valid phone number.");
      return;
    }
    if (isEmailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setOtpSending(true);
    setFormError(null);
    setOtpMessage(null);

    const targetType = isEmailInput ? "email" : "phone";

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          type: targetType,
          destination: target,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setFormError(parseErrorMessage(data.error, "Failed to send verification code. Please try again."));
        return;
      }

      const confirmedDest = data.destination || data.phone || target;
      setOtpDestination(confirmedDest);
      setOtpType(data.type || targetType);
      setOtpStep(true);
      setOtpMessage(data.message || `Verification code sent to ${confirmedDest}.`);
    } catch {
      setFormError("Network error while sending verification code. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP submission handler (supports both email and phone)
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
          type: otpType,
          destination: otpDestination,
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

  const handleResendOtp = async () => {
    if (!otpDestination) return;
    setOtpSending(true);
    setFormError(null);

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          type: otpType,
          destination: otpDestination,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setFormError(parseErrorMessage(data.error, "Unable to resend verification code. Please try again."));
        return;
      }

      setOtpMessage(data.message || `A new verification code has been dispatched to ${otpDestination}.`);
    } catch {
      setFormError("Network error while resending verification code.");
    } finally {
      setOtpSending(false);
    }
  };

  // Handle Signup submission
  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetDest =
      signupMode === "email" ? identifier.trim() : (signupPhoneE164 || signupPhone.trim());

    if (!targetDest) {
      setFormError(signupMode === "email" ? "Enter your email address." : "Enter your phone number.");
      return;
    }
    if (signupMode === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetDest)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (signupMode === "phone" && targetDest.replace(/\D/g, "").length < 7) {
      setFormError("Please enter a valid phone number.");
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
          email: targetDest,
          phone: signupMode === "phone" ? targetDest : undefined,
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

      // If signup with phone needs OTP confirmation
      if (signupMode === "phone" && !data.session) {
        setOtpDestination(targetDest);
        setOtpType("phone");
        setOtpStep(true);
        setOtpMessage("Account created. Please enter the 6-digit confirmation code sent to your phone to activate your account.");
        return;
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

  const renderLoginForm = () => (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Welcome back.
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
        Pick up where you left off.
      </p>

      {/* Status & Error Alerts */}
      {oauthError && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-left text-xs leading-relaxed text-amber-900"
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
          className="mt-3 rounded-xl border border-red-200 bg-red-50/90 p-2.5 text-left text-xs leading-relaxed text-red-700 flex items-start gap-2"
        >
          <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
          <span>{parseErrorMessage(formError)}</span>
        </div>
      )}

      {formSuccess ? (
        <div
          role="status"
          className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-center"
        >
          <CheckCircle2 className="size-7 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-emerald-900">{parseErrorMessage(formSuccess)}</p>
        </div>
      ) : otpStep ? (
        /* OTP Verification Screen */
        <form onSubmit={handleVerifyOtp} className="mt-4 text-left space-y-3.5">
          {otpMessage && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/90 p-2.5 text-xs leading-relaxed text-blue-900 flex items-start gap-2">
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
              className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-center text-xl tracking-[0.28em] font-mono font-bold text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Code sent to <span className="font-semibold text-slate-700">{otpDestination}</span>
              {otpType === "email" ? " (check your inbox/spam)" : " via SMS"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpCode.length < 4}
            className="w-full h-10 rounded-full bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin text-white" /> Verifying Code...
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
              className="text-blue-600 font-semibold hover:underline cursor-pointer disabled:opacity-50 text-[11px]"
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
              className="text-slate-500 hover:text-slate-800 underline cursor-pointer text-[11px]"
            >
              Back to Password Login
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLoginSubmit} autoComplete="on" className="mt-4 text-left space-y-3">
          {/* Auth Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/60 mb-2">
            <button
              type="button"
              onClick={() => {
                setLoginMode("email");
                if (formError) setFormError(null);
              }}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer font-semibold select-none ${
                loginMode === "email"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("phone");
                if (formError) setFormError(null);
              }}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer font-semibold select-none ${
                loginMode === "phone"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              Phone Number
            </button>
          </div>

          {loginMode === "email" ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="login-identifier"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                {identifier.trim().length >= 5 && identifier.includes("@") && (
                  <button
                    type="button"
                    disabled={otpSending}
                    onClick={handleSendOtp}
                    className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {otpSending ? "Sending OTP..." : "Sign in with Email OTP →"}
                  </button>
                )}
              </div>
              <input
                id="login-identifier"
                type="email"
                autoComplete="username"
                value={identifier}
                disabled={isSubmitting}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="you@example.com"
                required
                className="w-full h-10 rounded-xl border border-slate-200/90 bg-white px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => navigateFlow("recover")}
                  className="text-[11px] text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Forgot your email?
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="login-phone"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Phone number <span className="text-red-500">*</span>
                </label>
                {loginPhone.trim().length >= 7 && (
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
              <PhoneInput
                id="login-phone"
                value={loginPhone}
                defaultCountryCode="IN"
                onChange={(val, e164) => {
                  setLoginPhone(val);
                  setLoginPhoneE164(e164);
                  if (formError) setFormError(null);
                }}
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => navigateFlow("recover")}
                  className="text-[11px] text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  Forgot your phone number?
                </button>
              </div>
            </div>
          )}

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
                className="w-full h-10 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={() => navigateFlow("reset", { step: "request" })}
                className="text-[11px] text-blue-600 font-medium hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit Log In */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 mt-2 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin text-white" /> Signing in...
              </span>
            ) : (
              "Log in"
            )}
          </button>

          {/* Divider */}
          <div className="my-2.5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-normal text-slate-400 select-none">or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social Login 2-Column Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loadingProvider !== null || isSubmitting}
              aria-label="Continue with Google"
              className="h-10 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
            >
              {loadingProvider === "google" ? (
                <Loader2 className="size-3.5 animate-spin text-blue-600" />
              ) : (
                <GoogleIcon />
              )}
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("facebook")}
              disabled={loadingProvider !== null || isSubmitting}
              aria-label="Continue with Facebook"
              className="h-10 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
            >
              {loadingProvider === "facebook" ? (
                <Loader2 className="size-3.5 animate-spin text-blue-600" />
              ) : (
                <FacebookIcon />
              )}
              <span>Facebook</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  const renderSignupForm = () => (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Create Account
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500">
        Join UnBound X to build your verified track record.
      </p>

      {/* Status & Error Alerts */}
      {oauthError && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-left text-xs leading-relaxed text-amber-900"
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
          className="mt-3 rounded-xl border border-red-200 bg-red-50/90 p-2.5 text-left text-xs leading-relaxed text-red-700 flex items-start gap-2"
        >
          <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
          <span>{parseErrorMessage(formError)}</span>
        </div>
      )}

      {formSuccess ? (
        <div
          role="status"
          className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-center"
        >
          <CheckCircle2 className="size-7 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-emerald-900">{parseErrorMessage(formSuccess)}</p>
        </div>
      ) : otpStep ? (
        <form onSubmit={handleVerifyOtp} className="mt-4 text-left space-y-3.5">
          {otpMessage && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/90 p-2.5 text-xs leading-relaxed text-blue-900 flex items-start gap-2">
              <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{otpMessage}</span>
            </div>
          )}
          <div>
            <label htmlFor="signup-otp-code" className="block text-xs font-semibold text-slate-700 mb-1">
              Enter 6-digit confirmation code <span className="text-red-500">*</span>
            </label>
            <input
              id="signup-otp-code"
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
              className="w-full h-11 rounded-xl border border-slate-200/90 bg-white px-3.5 text-center text-xl tracking-[0.28em] font-mono font-bold text-slate-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Code sent to <span className="font-semibold text-slate-700">{otpDestination}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpCode.length < 4}
            className="w-full h-10 rounded-full bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin text-white" /> Confirming...
              </span>
            ) : (
              "Confirm & Activate Account"
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              disabled={otpSending}
              onClick={handleResendOtp}
              className="text-blue-600 font-semibold hover:underline cursor-pointer disabled:opacity-50 text-[11px]"
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
              className="text-slate-500 hover:text-slate-800 underline cursor-pointer text-[11px]"
            >
              Back to Signup Form
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit} autoComplete="on" className="mt-4 text-left space-y-3">
          {/* Signup Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/60 mb-2">
            <button
              type="button"
              onClick={() => {
                setSignupMode("email");
                if (formError) setFormError(null);
              }}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer font-semibold select-none ${
                signupMode === "email"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setSignupMode("phone");
                if (formError) setFormError(null);
              }}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer font-semibold select-none ${
                signupMode === "phone"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              Phone Number
            </button>
          </div>

          {signupMode === "email" ? (
            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="username"
                value={identifier}
                disabled={isSubmitting}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="you@example.com"
                required
                className="w-full h-10 rounded-xl border border-slate-200/90 bg-white px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="signup-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                Phone number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                id="signup-phone"
                value={signupPhone}
                defaultCountryCode="IN"
                onChange={(val, e164) => {
                  setSignupPhone(val);
                  setSignupPhoneE164(e164);
                  if (formError) setFormError(null);
                }}
              />
            </div>
          )}

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
                className="w-full h-10 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
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
                placeholder="Re-enter password"
                required
                className="w-full h-10 rounded-xl border border-slate-200/90 bg-white px-3.5 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-0.5">
            <input
              id="signup-agreed"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="signup-agreed" className="text-[11px] text-slate-500 leading-snug">
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
            className="w-full h-10 mt-2 inline-flex items-center justify-center rounded-full bg-[#1677ff] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin text-white" /> Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className="my-2.5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-normal text-slate-400 select-none">or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social Login 2-Column Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={loadingProvider !== null || isSubmitting}
              aria-label="Continue with Google"
              className="h-10 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
            >
              {loadingProvider === "google" ? (
                <Loader2 className="size-3.5 animate-spin text-blue-600" />
              ) : (
                <GoogleIcon />
              )}
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("facebook")}
              disabled={loadingProvider !== null || isSubmitting}
              aria-label="Continue with Facebook"
              className="h-10 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-60"
            >
              {loadingProvider === "facebook" ? (
                <Loader2 className="size-3.5 animate-spin text-blue-600" />
              ) : (
                <FacebookIcon />
              )}
              <span>Facebook</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

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
        <section
          className={`w-full ${
            flow === "login" || flow === "signup" ? "max-w-[1040px]" : "max-w-[440px]"
          } px-2 sm:px-4 text-center transition-all duration-300`}
        >
          <AnimatePresence mode="wait">
            {/* 1. DUAL-PANEL SPLIT CARD FOR LOGIN & SIGNUP */}
            {(flow === "login" || flow === "signup") && (
              <motion.div
                key="flow-auth-split-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="relative w-full min-h-[660px] rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-blue-950/15 overflow-hidden"
              >
                {/* DESKTOP SPLIT SLIDING CARD (hidden on mobile, visible on lg+) */}
                <div className="hidden lg:block relative w-full h-[660px] overflow-hidden">
                  {/* Left stationary panel: Signup Form */}
                  <div className="absolute top-0 left-0 w-1/2 h-full z-10 p-8 xl:p-12 flex flex-col justify-center overflow-y-auto">
                    <motion.div
                      animate={{
                        opacity: flow === "signup" ? 1 : 0,
                        x: flow === "signup" ? 0 : -24,
                        pointerEvents: flow === "signup" ? "auto" : "none",
                      }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full max-w-[360px] mx-auto text-left"
                    >
                      {renderSignupForm()}
                    </motion.div>
                  </div>

                  {/* Right stationary panel: Login Form */}
                  <div className="absolute top-0 right-0 w-1/2 h-full z-10 p-8 xl:p-12 flex flex-col justify-center overflow-y-auto">
                    <motion.div
                      animate={{
                        opacity: flow === "login" ? 1 : 0,
                        x: flow === "login" ? 0 : 24,
                        pointerEvents: flow === "login" ? "auto" : "none",
                      }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full max-w-[360px] mx-auto text-left"
                    >
                      {renderLoginForm()}
                    </motion.div>
                  </div>

                  {/* Sliding Hero / Overlay Panel */}
                  <motion.div
                    animate={{ x: flow === "signup" ? "100%" : "0%" }}
                    transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute top-0 left-0 w-1/2 h-full z-20 overflow-hidden shadow-2xl pointer-events-auto select-none"
                  >
                    {/* Double-width inner container sliding in opposite direction */}
                    <motion.div
                      animate={{ x: flow === "signup" ? "-50%" : "0%" }}
                      transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
                      className="relative h-full w-[200%] flex"
                    >
                      {/* Left half of overlay: Active during Login (invites to Sign Up) */}
                      <div className="relative w-1/2 h-full flex flex-col justify-between p-10 xl:p-12 text-white">
                        <Image
                          src="/images/auth-artwork.webp"
                          alt="UnBound X Authentication"
                          fill
                          priority
                          className="object-cover -z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#06122b]/95 via-[#0b214a]/88 to-[#1e0d3b]/92 -z-10" />

                        {/* Top brand */}
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full overflow-hidden border border-white/40 shadow-xs bg-white/10 backdrop-blur-sm p-0.5">
                            <Image
                              src="/logo/unboundx-mark.png"
                              alt="UnBound X"
                              width={32}
                              height={32}
                              className="size-full rounded-full object-cover"
                            />
                          </div>
                          <span className="font-bold text-sm tracking-wide text-white/90">UnBound X</span>
                        </div>

                        {/* Middle message */}
                        <div className="my-auto py-6 text-left">
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-semibold text-blue-200 uppercase tracking-wider mb-3">
                            New to the platform?
                          </span>
                          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
                            Start your verified track record.
                          </h2>
                          <p className="mt-3 text-sm text-slate-200/90 leading-relaxed max-w-[320px]">
                            Discover high-conviction investment ideas, lock entries, and build an auditable record as outcomes unfold.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigateFlow("signup")}
                            className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/10 px-7 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 cursor-pointer select-none active:scale-95"
                          >
                            <span>Let&apos;s Get Started</span>
                            <ArrowRight className="size-4" />
                          </button>
                        </div>

                        {/* Bottom security pill */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-300">
                          <ShieldCheck className="size-4 text-emerald-400" />
                          <span>Institutional security &bull; Private &bull; Audited</span>
                        </div>
                      </div>

                      {/* Right half of overlay: Active during Signup (invites to Log In) */}
                      <div className="relative w-1/2 h-full flex flex-col justify-between p-10 xl:p-12 text-white">
                        <Image
                          src="/images/auth-artwork.webp"
                          alt="UnBound X Authentication"
                          fill
                          priority
                          className="object-cover -z-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#06122b]/95 via-[#0b214a]/88 to-[#1e0d3b]/92 -z-10" />

                        {/* Top brand */}
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full overflow-hidden border border-white/40 shadow-xs bg-white/10 backdrop-blur-sm p-0.5">
                            <Image
                              src="/logo/unboundx-mark.png"
                              alt="UnBound X"
                              width={32}
                              height={32}
                              className="size-full rounded-full object-cover"
                            />
                          </div>
                          <span className="font-bold text-sm tracking-wide text-white/90">UnBound X</span>
                        </div>

                        {/* Middle message */}
                        <div className="my-auto py-6 text-left">
                          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-semibold text-blue-200 uppercase tracking-wider mb-3">
                            Already a member?
                          </span>
                          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
                            Welcome back.
                          </h2>
                          <p className="mt-3 text-sm text-slate-200/90 leading-relaxed max-w-[320px]">
                            Pick up where you left off. Sign in to access your verified track record, portfolio, and research.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigateFlow("login")}
                            className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/10 px-7 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900 cursor-pointer select-none active:scale-95"
                          >
                            <span>Sign In to Account</span>
                            <ArrowRight className="size-4" />
                          </button>
                        </div>

                        {/* Bottom security pill */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-300">
                          <ShieldCheck className="size-4 text-emerald-400" />
                          <span>Institutional security &bull; Private &bull; Audited</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* MOBILE / TABLET STACKED LAYOUT (visible on mobile, hidden on lg+) */}
                <div className="block lg:hidden w-full">
                  {/* Compact Hero Banner */}
                  <div className="relative h-36 w-full overflow-hidden p-5 flex flex-col justify-between text-white text-left">
                    <Image
                      src="/images/auth-artwork.webp"
                      alt="UnBound X"
                      fill
                      priority
                      className="object-cover -z-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#06122b]/95 via-[#0b214a]/88 to-[#1e0d3b]/92 -z-10" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image src="/logo/unboundx-mark.png" alt="UnBound X" width={24} height={24} className="rounded-full" />
                        <span className="font-bold text-xs tracking-wide">UnBound X</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="size-3" /> Secure Auth
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight">
                        {flow === "signup" ? "Join UnBound X" : "Welcome Back"}
                      </h2>
                      <p className="text-[11px] text-slate-200 truncate">
                        {flow === "signup"
                          ? "Start building your verified track record"
                          : "Pick up where you left off"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Segmented Toggle */}
                  <div className="px-5 pt-4">
                    <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => navigateFlow("login")}
                        className={`flex-1 py-1.5 text-xs rounded-lg transition-all font-semibold cursor-pointer ${
                          flow === "login"
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateFlow("signup")}
                        className={`flex-1 py-1.5 text-xs rounded-lg transition-all font-semibold cursor-pointer ${
                          flow === "signup"
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>

                  {/* Mobile Active Form Container */}
                  <div className="p-5 sm:p-6 text-left">
                    <AnimatePresence mode="wait">
                      {flow === "signup" ? (
                        <motion.div
                          key="mobile-signup"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {renderSignupForm()}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="mobile-login"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {renderLoginForm()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true" className="shrink-0">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}