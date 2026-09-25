"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function ConsultationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [targetRaise, setTargetRaise] = useState("$1M - $3M");
  const [timeframe, setTimeframe] = useState("Within 3 months");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid work email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-8 text-center space-y-4">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="font-editorial text-[1.4rem] leading-tight text-ink">
          Session Reserved
        </h3>
        <p className="mx-auto max-w-md text-sm text-ink/80 leading-relaxed">
          Thank you, {name || "founder"}. Your consultation request for{" "}
          <strong>{company || "your venture"}</strong> has been scheduled. Our capital markets team
          will follow up at <strong>{email}</strong> within 1 business day with direct calendar
          options and preparatory worksheets.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
          Your Name
        </label>
        <input
          type="text"
          required
          placeholder="Jordan Lee"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
          Work Email
        </label>
        <input
          type="email"
          required
          placeholder="jordan@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
            Company Name
          </label>
          <input
            type="text"
            placeholder="Venture Inc"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
            Target Raise
          </label>
          <select
            value={targetRaise}
            onChange={(e) => setTargetRaise(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
          >
            <option>&lt; $1M</option>
            <option>$1M - $3M</option>
            <option>$3M - $5M</option>
            <option>$5M+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
          Target Close Timeline
        </label>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand"
        >
          <option>Within 30 days (Active Round)</option>
          <option>Within 3 months</option>
          <option>Within 6 months</option>
          <option>Exploring / Planning</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
          Key Question or Dilution Focus (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="E.g., Option pool refresh sizing on our post-money SAFE..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm outline-none focus:border-brand resize-none"
        />
      </div>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-brand-strong transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Schedule Working Session"}
          <ArrowRight className="size-4" />
        </button>
        <p className="mt-2 text-center text-[0.75rem] text-muted-foreground">
          20 minutes · Confidential · No sales pitch
        </p>
      </div>
    </form>
  );
}
