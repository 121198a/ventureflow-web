"use client";

import { useState } from "react";
import {
  NEWSLETTER_ASSESSMENTS,
  computeReadinessBriefing,
  type AssessmentKey,
  type AssessmentMeta,
} from "@/lib/newsletter/assessments";
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentKey?: AssessmentKey;
  articleId?: string;
  onOpenConsultation?: () => void;
  onOpenPlatform?: () => void;
}

export function AssessmentModal({
  isOpen,
  onClose,
  assessmentKey,
  articleId = "1",
  onOpenConsultation,
  onOpenPlatform,
}: AssessmentModalProps) {
  // Resolve assessment
  let meta: AssessmentMeta = NEWSLETTER_ASSESSMENTS.pitchCheck;
  if (assessmentKey && NEWSLETTER_ASSESSMENTS[assessmentKey]) {
    meta = NEWSLETTER_ASSESSMENTS[assessmentKey];
  } else if (articleId) {
    const found = Object.values(NEWSLETTER_ASSESSMENTS).find(
      (a) => a.articleId === String(articleId)
    );
    if (found) meta = found;
  }

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "yes" | "mid" | "no">>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBriefingReady, setIsBriefingReady] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!isOpen) return null;

  const totalQuestions = meta.questions.length;
  const answeredCount = Object.keys(answers).length;
  const currentQ = meta.questions[currentIdx];
  const currentAns = answers[currentIdx];

  const handleSelectAnswer = (choice: "yes" | "mid" | "no") => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: choice }));
    setError(null);
    if (currentIdx < totalQuestions - 1) {
      setTimeout(() => setCurrentIdx((i) => i + 1), 180);
    }
  };

  const handleCalculateBriefing = async () => {
    if (answeredCount < totalQuestions) {
      setError(`Please answer all ${totalQuestions} questions before viewing your briefing.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Trigger internal assessment route
      await fetch("/api/newsletter/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentKey: meta.key,
          answers,
          email: email.trim() || undefined,
        }),
      }).catch(() => null);

      setIsBriefingReady(true);
    } catch {
      // Gracefully show computed briefing even if network request fails
      setIsBriefingReady(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailBriefing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setEmailStatus("sending");
    try {
      const res = await fetch("/api/newsletter/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentKey: meta.key,
          answers,
          email: email.trim(),
        }),
      });

      if (res.ok) {
        setEmailStatus("sent");
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("sent"); // Optimistic acknowledgement
    }
  };

  const briefing = computeReadinessBriefing(meta, answers);

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsBriefingReady(false);
    setError(null);
    setEmailStatus("idle");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[680px] flex-col overflow-hidden rounded-xl border border-hairline bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-surface-alt px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-brand">
                Institutional Readiness Check
              </p>
              <h2 className="font-editorial text-[1.15rem] leading-tight text-ink">
                {meta.title}
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

        {/* Modal Body */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {!isBriefingReady ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-[0.75rem] font-semibold text-muted-foreground">
                  <span>
                    Question {currentIdx + 1} of {totalQuestions}
                  </span>
                  <span>{answeredCount} answered</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className="h-full bg-brand transition-all duration-300"
                    style={{
                      width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Category Eyebrow */}
              <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-brand">
                {currentQ.cat}
              </span>

              {/* Question Text */}
              <h3 className="mt-4 font-editorial text-[1.35rem] leading-snug text-ink sm:text-[1.5rem]">
                {currentQ.q}
              </h3>

              {/* Options */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleSelectAnswer("yes")}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all",
                    currentAns === "yes"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-300 font-bold shadow-xs"
                      : "border-hairline bg-surface-alt text-ink/80 hover:border-brand hover:text-brand"
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      "size-5 mb-1.5",
                      currentAns === "yes" ? "text-emerald-600" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-[0.95rem]">In place</span>
                  <span className="text-[0.72rem] text-muted-foreground mt-0.5">Defensible today</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAnswer("mid")}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all",
                    currentAns === "mid"
                      ? "border-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/20 dark:text-amber-300 font-bold shadow-xs"
                      : "border-hairline bg-surface-alt text-ink/80 hover:border-brand hover:text-brand"
                  )}
                >
                  <Sparkles
                    className={cn(
                      "size-5 mb-1.5",
                      currentAns === "mid" ? "text-amber-600" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-[0.95rem]">In progress</span>
                  <span className="text-[0.72rem] text-muted-foreground mt-0.5">Partially modeled</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAnswer("no")}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all",
                    currentAns === "no"
                      ? "border-neutral-500 bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 font-bold shadow-xs"
                      : "border-hairline bg-surface-alt text-ink/80 hover:border-brand hover:text-brand"
                  )}
                >
                  <AlertCircle
                    className={cn(
                      "size-5 mb-1.5",
                      currentAns === "no" ? "text-neutral-600" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-[0.95rem]">Not yet</span>
                  <span className="text-[0.72rem] text-muted-foreground mt-0.5">Need to address</span>
                </button>
              </div>

              {/* Context notes */}
              <div className="mt-6 rounded-lg border border-hairline bg-surface-alt p-4">
                <p className="text-[0.75rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Why this matters in diligence
                </p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-ink/75">
                  {currentQ.why}
                </p>
              </div>

              {error && (
                <p className="mt-4 text-xs font-semibold text-destructive">{error}</p>
              )}

              {/* Navigation Footer */}
              <div className="mt-8 flex items-center justify-between border-t border-hairline pt-4">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[0.85rem] text-ink/70 hover:text-ink disabled:opacity-30"
                >
                  <ArrowLeft className="size-4" />
                  Previous
                </button>

                <div className="flex gap-1.5">
                  {meta.questions.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIdx(i)}
                      aria-label={`Jump to question ${i + 1}`}
                      className={cn(
                        "size-2.5 rounded-full transition-all",
                        i === currentIdx
                          ? "bg-brand scale-125"
                          : answers[i]
                          ? "bg-brand/50"
                          : "bg-hairline"
                      )}
                    />
                  ))}
                </div>

                {currentIdx < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((i) => i + 1)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-surface-alt border border-hairline px-4 py-2 text-[0.85rem] font-semibold text-ink hover:border-brand"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleCalculateBriefing}
                    className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-2 text-[0.85rem] font-bold text-primary-foreground hover:bg-brand-strong transition-colors disabled:opacity-60"
                  >
                    {loading ? "Evaluating..." : "Generate Briefing"}
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Readiness Briefing View */
            <div className="space-y-6">
              {/* Verdict Header */}
              <div
                className={cn(
                  "rounded-xl border p-6 text-left",
                  briefing.status === "ready"
                    ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : briefing.status === "partial"
                    ? "border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20"
                    : "border-navy/20 bg-surface-alt"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider",
                      briefing.status === "ready"
                        ? "bg-emerald-600 text-white"
                        : briefing.status === "partial"
                        ? "bg-amber-600 text-white"
                        : "bg-navy text-white"
                    )}
                  >
                    Score: {briefing.score} / {briefing.total} In Place
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-[0.75rem] text-muted-foreground hover:text-ink"
                  >
                    <RotateCcw className="size-3.5" />
                    Retake
                  </button>
                </div>

                <h3 className="mt-3 font-editorial text-[1.4rem] leading-tight text-ink">
                  {briefing.verdictTitle}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/80">
                  {briefing.verdictDescription}
                </p>

                {/* Category Breakdown */}
                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-hairline">
                  {Object.entries(briefing.categories).map(([cat, stat]) => (
                    <span
                      key={cat}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-[0.72rem] font-semibold",
                        stat.ok === stat.total
                          ? "border-emerald-300 bg-white text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "border-hairline bg-white/70 text-ink/75"
                      )}
                    >
                      {cat}: {stat.ok}/{stat.total}
                    </span>
                  ))}
                </div>
              </div>

              {/* Priority Action Items */}
              {briefing.priorityItems.length > 0 ? (
                <div>
                  <h4 className="text-[0.85rem] font-bold uppercase tracking-wider text-brand">
                    Priority Action Items Before Pitching ({briefing.priorityItems.length})
                  </h4>
                  <div className="mt-3 space-y-3">
                    {briefing.priorityItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-hairline border-l-4 border-l-amber-500 bg-surface-alt p-4"
                      >
                        <p className="text-[0.92rem] font-bold text-ink">{item.q}</p>
                        <div className="mt-2 text-[0.85rem] leading-relaxed text-ink/85">
                          <strong className="text-brand font-semibold">Do this: </strong>
                          {item.fix}
                        </div>
                        <div className="mt-1 text-[0.78rem] text-muted-foreground">
                          <strong>Why it matters: </strong>
                          {item.why}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-300 bg-emerald-50/50 p-4 text-emerald-900">
                  <p className="text-sm font-semibold">
                    ✓ All 8 institutional checkpoints are firmly in place.
                  </p>
                </div>
              )}

              {/* Email Briefing Form */}
              <div className="rounded-lg border border-hairline bg-surface-alt p-5">
                <p className="text-[0.9rem] font-bold text-ink">
                  Keep this diagnostic briefing
                </p>
                <p className="mt-1 text-[0.8rem] text-ink/70">
                  Receive the structured action checklist as an immutable audit record.
                </p>

                {emailStatus === "sent" ? (
                  <p className="mt-3 text-xs font-semibold text-emerald-700">
                    ✓ Diagnostic summary sent. Check your inbox shortly.
                  </p>
                ) : (
                  <form onSubmit={handleSendEmailBriefing} className="mt-3 flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="founder@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-md border border-hairline bg-surface px-3 py-2 text-[0.85rem] outline-none focus:border-brand"
                    />
                    <button
                      type="submit"
                      disabled={emailStatus === "sending"}
                      className="rounded-md bg-brand px-4 py-2 text-[0.85rem] font-semibold text-primary-foreground hover:bg-brand-strong transition-colors"
                    >
                      {emailStatus === "sending" ? "Sending..." : "Send Briefing"}
                    </button>
                  </form>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {onOpenConsultation && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenConsultation();
                    }}
                    className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-3 text-[0.85rem] font-bold text-white hover:bg-navy/90 transition-colors"
                  >
                    <Calendar className="size-4" />
                    Schedule Working Session
                  </button>
                )}

                {onOpenPlatform && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPlatform();
                    }}
                    className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-surface-alt px-4 py-3 text-[0.85rem] font-semibold text-ink hover:border-brand transition-colors"
                  >
                    See Platform Workflow
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
