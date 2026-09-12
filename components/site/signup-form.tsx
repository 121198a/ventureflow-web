"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, Loader2 } from "lucide-react";
import { PasswordField } from "./password-field";
import { Button } from "@/components/ui/button";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function SignupForm({ role = "founder" }: { role?: "founder" | "investor" }) {
  const router = useRouter();
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
        const destination = role === "founder" ? "/for-founders" : "/platform";
        router.push(destination);
      }
    } catch {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[440px] rounded-lg border border-hairline bg-surface-alt p-6 text-center">
        <p className="text-[0.95rem] text-ink" style={{ fontWeight: 600 }}>
          {role === "founder" ? "Application Submitted" : "Account Created"}
        </p>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-ink/70">
          Your account has been registered successfully. We have verified your credentials.
        </p>
      </div>
    );
  }

  return (
    <form className="max-w-[440px] space-y-5" onSubmit={handleSubmit}>
      {errorMessage && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-[0.85rem] text-destructive"
        >
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-[0.9rem] text-ink" style={{ fontWeight: 600 }}>
          What is your email address?
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="Email"
          className="w-full rounded-md border border-hairline bg-background px-4 py-3 text-[0.9rem] outline-none focus:border-brand"
          style={{ fontWeight: 500 }}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 flex items-center gap-1.5 text-[0.9rem] text-ink"
          style={{ fontWeight: 600 }}
        >
          Set a password for your account
          {role === "investor" && <Info className="size-3.5 text-muted-foreground" />}
        </label>
        <PasswordField id="password" placeholder="Password" value={password} onChange={setPassword} />
        {role === "founder" && (
          <p className="mt-2 text-[0.78rem] leading-relaxed text-muted-foreground">
            Create a password with at least 8 characters, using an uppercase, lowercase, number, and
            symbol.
          </p>
        )}
      </div>

      <div>
        <PasswordField
          id="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-2 text-[0.78rem] text-destructive">Passwords do not match.</p>
        )}
      </div>

      <label className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-ink/85">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-hairline accent-[var(--color-brand)]"
        />
        <span>
          By creating an account, I agree to the UBverse{" "}
          <Link href="/legal/terms-condition" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            Terms of Use
          </Link>
          ,{" "}
          <Link href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/legal/ubverse-disclaimer-for-unboundx" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            Disclaimer
          </Link>
          .
        </span>
      </label>

      <div className="flex items-center justify-between border-t border-hairline pt-6">
        <Link
          href="/legal/investment-disclaimers"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[0.85rem] text-brand underline"
        >
          Disclaimers and Disclosures
        </Link>
        <Button type="submit" disabled={!canContinue}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
}
