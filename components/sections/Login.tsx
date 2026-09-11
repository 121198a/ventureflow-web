"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { site } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";

export default function LoginPage({ initialFlow = "signup" }: { initialFlow?: "signup" | "login" }) {
  const [mode, setMode] = useState<"signup" | "login">(initialFlow);
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Enter your email to continue.");
      return;
    }
    if (!isValidEmail(trimmed)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          password: isSignup ? "SecurePass123!" : "TemporaryPassword123!",
          confirmPassword: isSignup ? "SecurePass123!" : undefined,
          agreed: true,
          role: "founder",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailError(
          res.status === 429
            ? "Too many attempts. Please try again later."
            : data.error || "Unable to continue. Please try again."
        );
        return;
      }

      setSuccessMessage(
        isSignup
          ? "Verification link has been sent to your email."
          : "Sign-in confirmation sent to your email."
      );
    } catch {
      setEmailError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {};

  const handleApple = () => {};

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#fdf2fa] via-[#f3f7ff] to-[#eaf6ff] text-slate-900 flex flex-col justify-between p-4 sm:p-10 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-140px] h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-100px] h-[420px] w-[420px] rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      {/* Brand Top Left */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between">
        <TransitionLink href="/" className="inline-flex items-center gap-2.5 group">
          <div className="relative h-7 w-7 overflow-hidden rounded-full flex items-center justify-center shadow-2xs">
            <Image
              src="/logo/unboundx-mark.png"
              width={28}
              height={28}
              alt={site.name}
              className="h-full w-full object-cover rounded-full transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <UnboundXBrand className="text-lg font-bold" />
        </TransitionLink>
      </header>

      {/* Main Centered Card Container */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <section className="w-full max-w-[420px] text-center">
          {/* Brand Icon */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full overflow-hidden shadow-[0_16px_40px_rgba(168,85,247,0.25)] border border-white/60"
          >
            <Image
              src="/logo/unboundx-mark.png"
              width={80}
              height={80}
              alt={site.name}
              className="h-full w-full object-cover rounded-full"
              priority
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {!emailMode ? (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h1
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent inline-block"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #ff5a00 0%, #d946ef 35%, #7c3aed 65%, #00a2ff 100%)",
                  }}
                >
                  {isSignup ? `Join ${site.name}` : "Welcome back"}
                </h1>
                <p className="mx-auto mt-2.5 max-w-[340px] text-xs sm:text-sm leading-relaxed text-slate-500">
                  {isSignup
                    ? "Discover better investment ideas, track them against the market, and invest with more clarity."
                    : "Log in to keep tracking your theses and building your verified record."}
                </p>

                {/* Social Login Buttons */}
                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogle}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.99] cursor-pointer"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={handleApple}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.99] cursor-pointer"
                  >
                    <AppleIcon />
                    Continue with Apple
                  </button>
                </div>

                {/* Divider */}
                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-medium text-slate-400">or</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Continue with Email */}
                <button
                  type="button"
                  onClick={() => setEmailMode(true)}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.99] cursor-pointer"
                >
                  Continue with email
                </button>

                {/* Terms Disclaimer */}
                <p className="mt-6 text-xs leading-relaxed text-slate-400">
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

                {/* Auth Mode Toggle */}
                <p className="mt-4 text-xs sm:text-sm text-slate-500">
                  {isSignup ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Log in
                      </button>
                    </>
                  ) : (
                    <>
                      New here?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Create an account
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="email-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="text-left"
              >
                <button
                  type="button"
                  onClick={() => setEmailMode(false)}
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enter your email</h1>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  We&apos;ll use this to securely {isSignup ? "create your account" : "sign you in"}.
                </p>

                {successMessage ? (
                  <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <p className="text-sm font-semibold text-emerald-800">{successMessage}</p>
                    <p className="mt-1 text-xs text-emerald-600">
                      Please check your inbox to complete the authentication step.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="mt-6">
                    <label htmlFor="email" className="mb-2 block text-xs font-bold text-slate-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="you@example.com"
                      required
                      maxLength={254}
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                      className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-4 ${
                        emailError
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                      }`}
                    />
                    {emailError && (
                      <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600">
                        {emailError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-3.5 flex h-12 w-full items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Spinner /> Sending link...
                        </span>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </form>
                )}
                <p className="mt-4 text-center text-xs text-slate-400">No password required.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.27c0-.78-.07-1.53-.22-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z" />
      <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.7Z" />
      <path fill="#FBBC05" d="M6.54 13.8A5.85 5.85 0 0 1 6.23 12c0-.63.11-1.24.31-1.8V7.68H3.3A9.74 9.74 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.32l3.24-2.52Z" />
      <path fill="#EA4335" d="M12 6.17c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.28 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.7 5.38l3.24 2.52C7.31 7.89 9.46 6.17 12 6.17Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.02-2.16 1.76-3.2 1.84-3.25a3.94 3.94 0 0 0-3.12-1.69c-1.32-.14-2.58.79-3.25.79-.68 0-1.71-.77-2.81-.75a4.14 4.14 0 0 0-3.5 2.13c-1.5 2.6-.38 6.43 1.07 8.53.71 1.03 1.54 2.18 2.64 2.14 1.06-.04 1.46-.69 2.75-.69 1.28 0 1.65.69 2.76.67 1.14-.02 1.86-1.04 2.55-2.07.8-1.16 1.13-2.29 1.15-2.35-.03-.01-2.2-.84-2.23-3.46ZM14.92 6.2a3.86 3.86 0 0 0 .88-2.77 3.93 3.93 0 0 0-2.54 1.31 3.68 3.68 0 0 0-.91 2.66 3.25 3.25 0 0 0 2.57-1.2Z" />
    </svg>
  );
}
{/* iss zip file ko deeply anlayze karo  */}
function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />;
}