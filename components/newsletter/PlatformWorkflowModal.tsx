"use client";

import { useState } from "react";
import { X, ArrowRight, ShieldCheck, FileText, Users, Send, CheckCircle2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

const STEPS = [
  {
    num: 1,
    title: "Closing Rails & Allocation Ledger",
    icon: ShieldCheck,
    summary: "Lock in soft circles before momentum decays.",
    details:
      "Eliminate the 23-day closing gap with pre-drafted SAFE and convertible note rails. Investors sign with one click and receive verified wire instructions into a segregated broker-dealer escrow account.",
  },
  {
    num: 2,
    title: "Diligence Data Room & Cap Table",
    icon: FileText,
    summary: "Institutional transparency without document fragmentation.",
    details:
      "Host cap tables, historical financials, customer cohort models, and legal disclosures in an audit-ready virtual data room with granular access logging and watermark tracking.",
  },
  {
    num: 3,
    title: "Investor Pipeline & Round Capacity",
    icon: Users,
    summary: "Real-time visibility into committed versus funded capital.",
    details:
      "Manage incoming allocation requests, follow-up cadences, and lead investor syndicates. Keep all counter-parties aligned against firm round close deadlines.",
  },
  {
    num: 4,
    title: "Predictable LP Communications",
    icon: Send,
    summary: "Structured monthly updates that turn watchers into leads.",
    details:
      "Deliver consistent updates with quantitative highlights, challenges, runway math, and clear asks. Automated LP analytics track who is engaging before you return to market.",
  },
  {
    num: 5,
    title: "Broker-Dealer Escrow & Clearing",
    icon: CheckCircle2,
    summary: "Compliant capital clearing and cap table settlement.",
    details:
      "Funds land directly into FDIC-insured escrow. Upon round threshold completion, subscriptions are counter-signed and equity or debt allocations are formally issued.",
  },
];

export function PlatformWorkflowModal({
  isOpen,
  onClose,
  onOpenConsultation,
}: PlatformWorkflowModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

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

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-hairline bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-surface-alt px-6 py-4">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-brand">
              Platform Workflow
            </p>
            <h2 className="font-editorial text-[1.25rem] leading-tight text-ink">
              How UBverse Powers Institutional Closes
            </h2>
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
          <p className="text-[0.92rem] leading-relaxed text-ink/80">
            A unified capital markets execution platform. Replace scattered PDF decks,
            untracked email threads, and manual escrow tracking with a continuous closing ledger.
          </p>

          {/* Stepper Tabs */}
          <div className="mt-6 grid grid-cols-5 gap-1.5 border-b border-hairline pb-4">
            {STEPS.map((s, idx) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "flex flex-col items-center rounded-lg p-2 text-center transition-all",
                  activeStep === idx
                    ? "bg-brand/10 text-brand font-bold border border-brand/20"
                    : "text-muted-foreground hover:bg-surface-alt"
                )}
              >
                <span className="text-[0.75rem] font-bold">Step {s.num}</span>
              </button>
            ))}
          </div>

          {/* Active Step Details */}
          <div className="mt-6 rounded-xl border border-hairline bg-surface-alt p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand text-primary-foreground font-bold">
                {activeStep + 1}
              </span>
              <div>
                <h3 className="font-editorial text-[1.25rem] leading-tight text-ink">
                  {STEPS[activeStep].title}
                </h3>
                <p className="text-[0.82rem] font-semibold text-brand">
                  {STEPS[activeStep].summary}
                </p>
              </div>
            </div>

            <p className="mt-4 text-[0.92rem] leading-relaxed text-ink/85">
              {STEPS[activeStep].details}
            </p>
          </div>

          {/* CTA Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-5">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((i) => Math.max(0, i - 1))}
                className="rounded-md border border-hairline px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                Previous Step
              </button>
              <button
                type="button"
                disabled={activeStep === STEPS.length - 1}
                onClick={() => setActiveStep((i) => Math.min(STEPS.length - 1, i + 1))}
                className="rounded-md border border-hairline px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                Next Step
              </button>
            </div>

            {onOpenConsultation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-[0.85rem] font-bold text-primary-foreground hover:bg-brand-strong transition-colors"
              >
                <Calendar className="size-4" />
                Schedule Working Session
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
