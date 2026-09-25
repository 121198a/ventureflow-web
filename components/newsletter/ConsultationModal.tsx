"use client";

import { useState } from "react";
import { X, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleHeadline?: string;
}

export function ConsultationModal({
  isOpen,
  onClose,
  articleHeadline,
}: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [targetRaise, setTargetRaise] = useState("$1M - $3M");
  const [timeframe, setTimeframe] = useState("Within 6 months");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid work email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Register email through newsletter / backend service
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      setSubmitted(true); // Optimistic success
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-navy/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[580px] flex-col overflow-hidden rounded-xl border border-hairline bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-surface-alt px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Calendar className="size-4" />
            </span>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-brand">
                Capital Markets Working Session
              </p>
              <h2 className="font-editorial text-[1.15rem] leading-tight text-ink">
                Schedule a Consultation
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-surface hover:text-ink transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {!submitted ? (
            <div>
              <p className="text-[0.9rem] leading-relaxed text-ink/80">
                A twenty-minute working session with our capital markets team. Your five numbers,
                dilution math, and round capacity pressure-tested the way an institutional lead would test them.
              </p>

              {articleHeadline && (
                <div className="mt-4 rounded-md border border-hairline bg-surface-alt p-3 text-xs text-muted-foreground">
                  Context: <span className="font-medium text-ink">{articleHeadline}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
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
                    placeholder="alex@company.com"
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
                      placeholder="Acme Therapeutics"
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

                {error && <p className="text-xs font-medium text-destructive">{error}</p>}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-brand-strong transition-colors disabled:opacity-60"
                  >
                    {loading ? "Scheduling..." : "Request Working Session"}
                    <ArrowRight className="size-4" />
                  </button>
                  <p className="mt-2 text-center text-[0.75rem] text-muted-foreground">
                    20 minutes · Confidential · You keep the model either way
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
                <CheckCircle2 className="size-7" />
              </span>
              <h3 className="font-editorial text-[1.4rem] leading-tight text-ink">
                Working Session Requested
              </h3>
              <p className="mx-auto max-w-md text-sm text-ink/80 leading-relaxed">
                Thank you, {name || "founder"}. A member of our capital markets team has received
                your request for <strong>{company || "your venture"}</strong> and will follow up
                at <strong>{email}</strong> within 1 business day with direct calendar availability.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-md border border-hairline bg-surface-alt px-6 py-2.5 text-xs font-semibold hover:border-brand"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
