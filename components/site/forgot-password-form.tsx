"use client";

import { useState, useId, useMemo, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, ChevronsUpDown, CheckCircle2, AlertCircle } from "lucide-react";
import { AUTH_INPUT_CLASS, AUTH_LABEL_GAP, FieldLabel } from "./input-field";
import { PasswordField } from "./password-field";
import { parseErrorMessage } from "@/components/sections/Login";

interface Country {
  name: string;
  code: string;
  dial: string;
}

const COUNTRIES: Country[] = [
  { name: "United States", code: "US", dial: "+1" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "United Arab Emirates", code: "AE", dial: "+971" },
  { name: "Netherlands", code: "NL", dial: "+31" },
  { name: "Switzerland", code: "CH", dial: "+41" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Brazil", code: "BR", dial: "+55" },
];

export function ForgotPasswordForm({ role = "investor" }: { role?: "founder" | "investor" }) {
  const router = useRouter();
  const emailInputId = useId();
  const phoneInputId = useId();
  const codeInputId = useId();
  const passwordInputId = useId();
  const confirmPasswordInputId = useId();

  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.dial.includes(q)
    );
  }, [countrySearch]);

  const handleRequestSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    const cleanPhone = phone.trim() ? `${selectedCountry.dial} ${phone.trim()}` : "";
    const targetIdentifier = cleanEmail || cleanPhone;

    if (!targetIdentifier) {
      setErrorMessage("Please enter your email or phone number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "request",
          email: targetIdentifier,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(
          res.status === 429
            ? "Too many requests. Please try again later."
            : parseErrorMessage(data.error, "Unable to request password recovery.")
        );
        return;
      }

      setSuccessMessage(
        parseErrorMessage(
          data.message,
          "Recovery instructions have been sent. Please enter the verification code to reset your password."
        )
      );
      setStep("verify");
    } catch {
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!verificationCode.trim()) {
      setErrorMessage("Please enter the verification code.");
      return;
    }
    if (!newPassword) {
      setErrorMessage("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "confirm",
          token: verificationCode.trim(),
          password: newPassword,
          confirmPassword,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(
          res.status === 429
            ? "Too many attempts. Please try again later."
            : parseErrorMessage(data.error, "The verification code is invalid or has expired.")
        );
        return;
      }

      setSuccessMessage("Password changed successfully! Redirecting to login...");
      const targetLogin = role === "investor" ? "/investor/login" : "/issuer/login";
      setTimeout(() => {
        router.push(targetLogin);
      }, 1200);
    } catch {
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isInvestor = role === "investor";
  const loginUrl = isInvestor ? "/investor/login" : "/issuer/login";

  return (
    <div className="flex flex-col gap-6">
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-[14px] border border-red-200 bg-red-50/90 px-4 py-3 text-xs leading-relaxed text-red-700"
        >
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{parseErrorMessage(errorMessage)}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-[14px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs leading-relaxed text-emerald-800"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{parseErrorMessage(successMessage)}</span>
        </div>
      )}

      {step === "request" ? (
        <form onSubmit={handleRequestSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor={emailInputId} className="text-slate-800 text-sm font-semibold">
              Please enter the email address or phone number linked to your account.
            </FieldLabel>
            <input
              id={emailInputId}
              type="text"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Email"
              className={AUTH_INPUT_CLASS}
            />
          </div>

          {isInvestor && (
            <>
              <div className="flex items-center gap-3 my-1">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">Or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="relative flex items-center gap-2" ref={dropdownRef}>
                {/* Country dropdown trigger */}
                <button
                  type="button"
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  disabled={isLoading}
                  className="h-[clamp(2.75rem,6.4vh,3.8rem)] rounded-[clamp(12px,0.98vw,17px)] border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 focus:outline-none focus:border-blue-600 transition-all shrink-0 cursor-pointer"
                  aria-label="Select country calling code"
                >
                  <span>{selectedCountry.code}</span>
                  <ChevronsUpDown className="size-3.5 text-slate-400" />
                </button>

                {/* Country search dropdown popover */}
                {countryDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl shadow-slate-900/10">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country"
                        autoFocus
                        className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setCountryDropdownOpen(false);
                            setCountrySearch("");
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-blue-50/80 rounded-lg transition-colors cursor-pointer ${
                            selectedCountry.code === c.code ? "bg-blue-50 font-bold text-blue-700" : "text-slate-700"
                          }`}
                        >
                          <span>{c.name}</span>
                          <span className="text-slate-400 font-mono">({c.dial})</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="py-4 text-center text-xs text-slate-400">No country found</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phone number input with dial code */}
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 select-none">
                    {selectedCountry.dial}
                  </span>
                  <input
                    id={phoneInputId}
                    type="tel"
                    value={phone}
                    disabled={isLoading}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Phone number"
                    className={`${AUTH_INPUT_CLASS} pl-14`}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between mt-2 pt-2">
            <Link
              href={loginUrl}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              &larr; Back to login
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-sm px-8 py-3 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Step 2: Verification code and new password */
        <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
          <div className={`flex flex-col ${AUTH_LABEL_GAP}`}>
            <FieldLabel htmlFor={codeInputId}>Verification Code / Token</FieldLabel>
            <input
              id={codeInputId}
              type="text"
              value={verificationCode}
              disabled={isLoading}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter 4-digit code or reset token"
              required
              className={AUTH_INPUT_CLASS}
            />
          </div>

          <div className={`flex flex-col ${AUTH_LABEL_GAP}`}>
            <FieldLabel htmlFor={passwordInputId}>New Password</FieldLabel>
            <PasswordField
              id={passwordInputId}
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(val) => {
                setNewPassword(val);
                if (errorMessage) setErrorMessage(null);
              }}
            />
          </div>

          <div className={`flex flex-col ${AUTH_LABEL_GAP}`}>
            <FieldLabel htmlFor={confirmPasswordInputId}>Confirm New Password</FieldLabel>
            <PasswordField
              id={confirmPasswordInputId}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                if (errorMessage) setErrorMessage(null);
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setErrorMessage(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              &larr; Back
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-sm px-8 py-3 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>Updating...</span>
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
