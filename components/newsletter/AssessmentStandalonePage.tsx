"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles, RotateCcw, Calendar } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { computeReadinessBriefing, type AssessmentMeta } from "@/lib/newsletter/assessments";
import { ConsultationModal } from "@/components/newsletter/ConsultationModal";
import { cn } from "@/lib/utils";

export function AssessmentStandalonePage({ meta }: { meta: AssessmentMeta }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "yes" | "mid" | "no">>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBriefingReady, setIsBriefingReady] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

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
      setError(`Please answer all ${totalQuestions} checkpoints before generating your briefing.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
      setEmailStatus("sent");
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
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-[760px] px-5 py-12 sm:py-16">
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 text-[0.85rem] text-brand hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Newsletter
        </Link>

        <p className="eyebrow mt-8 text-brand">Institutional Readiness Diagnostic</p>
        <h1 className="mt-3 font-editorial text-[2.2rem] leading-tight text-ink sm:text-[2.6rem]">
          {meta.title}
        </h1>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink/80">
          {meta.subtitle}. Answer each checkpoint candidly. A weak number or unmodeled term found
          now becomes an actionable preparation plan before meeting institutional leads.
        </p>

        {/* Card */}
        <div className="mt-10 rounded-xl border border-hairline bg-surface-alt p-6 sm:p-8">
          {!isBriefingReady ? (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>
                    Checkpoint {currentIdx + 1} of {totalQuestions}
                  </span>
                  <span>{answeredCount} of {totalQuestions} completed</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full bg-brand transition-all duration-300"
                    style={{
                      width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Category */}
              <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-brand">
                {currentQ.cat}
              </span>

              {/* Question */}
              <h2 className="mt-4 font-editorial text-[1.4rem] leading-snug text-ink sm:text-[1.6rem]">
                {currentQ.q}
              </h2>

              {/* Options */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleSelectAnswer("yes")}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all cursor-pointer",
                    currentAns === "yes"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs"
                      : "border-hairline bg-surface text-ink/80 hover:border-brand"
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
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all cursor-pointer",
                    currentAns === "mid"
                      ? "border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-xs"
                      : "border-hairline bg-surface text-ink/80 hover:border-brand"
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
                    "flex flex-col items-center justify-center rounded-lg border-2 p-4 text-center transition-all cursor-pointer",
                    currentAns === "no"
                      ? "border-neutral-500 bg-neutral-100 text-neutral-900 font-bold shadow-xs"
                      : "border-hairline bg-surface text-ink/80 hover:border-brand"
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

              {/* Context */}
              <div className="mt-6 rounded-lg border border-hairline bg-surface p-4">
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

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-hairline pt-4">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold disabled:opacity-40"
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
                      aria-label={`Jump to checkpoint ${i + 1}`}
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
                    className="inline-flex items-center gap-1.5 rounded-md bg-surface border border-hairline px-4 py-2 text-xs font-semibold hover:border-brand"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleCalculateBriefing}
                    className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-brand-strong transition-colors disabled:opacity-60 cursor-pointer shadow-sm"
                  >
                    {loading ? "Generating Briefing..." : "View my readiness briefing →"}
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              <div
                className={cn(
                  "rounded-xl border p-6 text-left",
                  briefing.status === "ready"
                    ? "border-emerald-500/40 bg-emerald-50/50"
                    : briefing.status === "partial"
                    ? "border-amber-500/40 bg-amber-50/50"
                    : "border-navy/20 bg-surface"
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

                <h3 className="mt-3 font-editorial text-[1.45rem] leading-tight text-ink">
                  {briefing.verdictTitle}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/80">
                  {briefing.verdictDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-hairline">
                  {Object.entries(briefing.categories).map(([cat, stat]) => (
                    <span
                      key={cat}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-[0.72rem] font-semibold",
                        stat.ok === stat.total
                          ? "border-emerald-300 bg-white text-emerald-800"
                          : "border-hairline bg-white/70 text-ink/75"
                      )}
                    >
                      {cat}: {stat.ok}/{stat.total}
                    </span>
                  ))}
                </div>
              </div>

              {/* Priority items */}
              {briefing.priorityItems.length > 0 ? (
                <div>
                  <h4 className="text-[0.85rem] font-bold uppercase tracking-wider text-brand">
                    Priority Action Items ({briefing.priorityItems.length})
                  </h4>
                  <div className="mt-3 space-y-3">
                    {briefing.priorityItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-hairline border-l-4 border-l-amber-500 bg-surface p-4"
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

              {/* Email Form */}
              <div className="rounded-lg border border-hairline bg-surface p-5">
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
                      className="flex-1 rounded-md border border-hairline bg-surface-alt px-3 py-2 text-[0.85rem] outline-none focus:border-brand"
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

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-md bg-navy px-4 py-3 text-[0.85rem] font-bold text-white hover:bg-navy/90 transition-colors"
                >
                  <Calendar className="size-4" />
                  Schedule Working Session
                </button>
                <Link
                  href="/newsletter/how-it-works"
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-surface px-4 py-3 text-[0.85rem] font-semibold text-ink hover:border-brand transition-colors"
                >
                  See Platform Workflow
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        articleHeadline={meta.title}
      />

      <SiteFooter />
    </div>
  );
}
