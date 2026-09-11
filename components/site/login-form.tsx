"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordField } from "./password-field";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "./oauth-buttons";
import { Loader2 } from "lucide-react";

export function LoginForm({ role = "founder" }: { role?: "founder" | "investor" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const destination = role === "founder" ? "/for-founders" : "/platform";
      router.push(destination);
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
          Login Successful
        </p>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-ink/70">
          Welcome back to the {role === "founder" ? "Founder" : "Investor"} portal.
        </p>
      </div>
    );
  }

  const canSubmit = email.trim().length > 3 && password.length > 0 && !loading;

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
          Enter your email address
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
        <label htmlFor="password" className="mb-2 block text-[0.9rem] text-ink" style={{ fontWeight: 600 }}>
          Enter your password
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
      </div>

      <div className="flex items-center justify-between">
        <Link href="/legal/support" className="text-[0.9rem] text-brand underline">
          Forgot Password?
        </Link>
        <Button type="submit" disabled={!canSubmit}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </div>

      {role === "investor" && (
        <>
          <div className="flex items-center gap-4 pt-1 text-[0.78rem] text-muted-foreground">
            <span className="h-px flex-1 bg-hairline" />
            Or
            <span className="h-px flex-1 bg-hairline" />
          </div>
          <OAuthButtons />
        </>
      )}

      <div className="flex items-center justify-between border-t border-hairline pt-6">
        <p className="text-[0.85rem] text-ink/70">Don&apos;t have an account on UnBound X yet?</p>
        <Button href={role === "founder" ? "/signup" : "/investor/signup"} size="sm">
          Get Started
        </Button>
      </div>
    </form>
  );
}
