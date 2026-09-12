"use client";

import { useState, type FormEvent } from "react";

export function EmailCaptureForm({ buttonLabel }: { buttonLabel: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
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
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Subscription failed.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[0.85rem] font-medium text-emerald-800">
        Subscribed! Check your inbox for briefing updates.
      </div>
    );
  }

  return (
    <div className="w-full sm:w-auto">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="you@company.com"
          className="w-full min-w-0 rounded-md border border-hairline bg-background px-4 py-2.5 text-[0.85rem] outline-none focus:border-brand sm:w-56"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-md bg-brand px-5 py-2.5 text-[0.85rem] text-primary-foreground transition-colors hover:bg-brand-strong disabled:opacity-60"
          style={{ fontWeight: 700 }}
        >
          {loading ? "..." : buttonLabel}
        </button>
      </form>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
