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
    title: "Startup & Investor Profiles",
    icon: ShieldCheck,
    summary: "A clear starting point for every relationship.",
    details:
      "Build structured profiles with story, product and team. Owners choose which sections each person can see.",
  },
  {
    num: 2,
    title: "Documents & Access Control",
    icon: FileText,
    summary: "The right files in front of the right people.",
    details:
      "Keep decks and supporting files in one place, with per-document access and a record of who opened what.",
  },
  {
    num: 3,
    title: "Pipeline & Saved Startups",
    icon: Users,
    summary: "Track conversations without a separate spreadsheet.",
    details:
      "Organise startups into saved lists, set simple stages, and keep follow-ups tied to the next step.",
  },
  {
    num: 4,
    title: "Workspace Updates",
    icon: Send,
    summary: "Short, consistent updates for everyone involved.",
    details:
      "Share highlights, challenges and next steps on a regular rhythm, and keep a searchable history.",
  },
  {
    num: 5,
    title: "Introductions & Messages",
    icon: CheckCircle2,
    summary: "Start conversations with context.",
    details:
      "Request introductions from a profile and keep messages next to the documents they refer to.",
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
              How VentureFlow Powers Institutional Closes
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
            A shared workspace for founders and investors. Replace scattered decks,
            untracked email threads and loose notes with one searchable history.
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
