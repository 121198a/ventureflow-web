"use client";

import { useState, type FormEvent } from "react";
import { useFormDraft } from "@/hooks/useFormDraft";

export function EmailCaptureForm({ buttonLabel }: { buttonLabel: string }) {
  const { values, setValues, clearDraft } = useFormDraft("email-capture-form", { email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = "email-capture-error";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = values.email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      let data: { success?: boolean; error?: string; alreadySubscribed?: boolean; message?: string };
      try {
        data = await res.json();
      } catch {
        // Response wasn't valid JSON — never claim success on an unparseable response.
        setError("Something went wrong on our end. Please try again.");
        return;
      }

      if (res.status === 429) {
        setError(data.error || "Too many attempts. Please wait a few minutes and try again.");
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error || "Subscription failed. Please try again.");
        return;
      }

      clearDraft();
      setAlreadySubscribed(Boolean(data.alreadySubscribed));
      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[0.85rem] font-medium text-emerald-800"
      >
        {alreadySubscribed
          ? "You're already on the list — no action needed."
          : "Subscribed! Check your inbox for briefing updates."}
      </div>
    );
  }

  return (
    <div className="w-full sm:w-auto">
      <form className="flex gap-2" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email-capture-input" className="sr-only">
          Email address
        </label>
        <input
          id="email-capture-input"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => {
            setValues({ email: e.target.value });
            if (error) setError(null);
          }}
          placeholder="you@company.com"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          disabled={loading}
          className="w-full min-w-0 rounded-md border border-hairline bg-background px-4 py-2.5 text-[0.85rem] outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand disabled:opacity-60 sm:w-56"
        />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="shrink-0 rounded-md bg-brand px-5 py-2.5 text-[0.85rem] text-primary-foreground transition-colors hover:bg-brand-strong disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontWeight: 700 }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-3 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              Subscribing…
            </span>
          ) : (
            buttonLabel
          )}
        </button>
      </form>
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
