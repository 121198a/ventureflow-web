"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AssessmentModal } from "./AssessmentModal";
import { PlatformWorkflowModal } from "./PlatformWorkflowModal";
import { ConsultationModal } from "./ConsultationModal";
import type { AssessmentKey } from "@/lib/newsletter/assessments";
import Link from "next/link";

interface ArticleCTAHandlerProps {
  heading?: string;
  text: string;
  buttonLabel: string;
  note?: string;
  articleId: string;
  articleHeadline?: string;
  assessmentKey?: AssessmentKey;
  customAction?: "assessment" | "briefing" | "how-it-works" | "book-call";
}

export function ArticleCTAHandler({
  heading,
  text,
  buttonLabel,
  note,
  articleId,
  articleHeadline,
  assessmentKey,
  customAction,
}: ArticleCTAHandlerProps) {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [briefingMode, setBriefingMode] = useState(false);

  const labelLower = buttonLabel.toLowerCase();
  const textLower = text.toLowerCase();

  const isAssessment =
    customAction === "assessment" ||
    labelLower.includes("assessment") ||
    labelLower.includes("pitch check") ||
    labelLower.includes("close check") ||
    textLower.includes("assessment checks");

  const isBriefing =
    customAction === "briefing" ||
    labelLower.includes("briefing");

  const isPlatform =
    customAction === "how-it-works" ||
    labelLower.includes("platform works") ||
    labelLower.includes("how the platform") ||
    labelLower.includes("how it works");

  const isConsultation =
    customAction === "book-call" ||
    labelLower.includes("consultation") ||
    labelLower.includes("book a call") ||
    labelLower.includes("schedule");

  const isOfferingsLink =
    labelLower.includes("active offerings") || labelLower.includes("view active");

  const isServicesLink =
    labelLower.includes("service tiers") || labelLower.includes("compare service");

  const isSpacesLink =
    labelLower.includes("company spaces") || labelLower.includes("explore company");

  const handleClick = () => {
    if (isBriefing) {
      setBriefingMode(true);
      setIsAssessmentOpen(true);
    } else if (isAssessment) {
      setBriefingMode(false);
      setIsAssessmentOpen(true);
    } else if (isPlatform) {
      setIsPlatformOpen(true);
    } else if (isConsultation) {
      setIsConsultationOpen(true);
    } else {
      // Default to platform walkthrough if generic
      setIsPlatformOpen(true);
    }
  };

  return (
    <>
      <div className="mt-8 rounded-lg border border-hairline bg-surface-alt p-7 text-center">
        {heading && (
          <p className="font-editorial text-[1.4rem] leading-tight text-ink">{heading}</p>
        )}
        <p
          className={`mx-auto max-w-[480px] text-[0.95rem] leading-relaxed text-ink/75 ${
            heading ? "mt-3" : ""
          }`}
        >
          {text}
        </p>

        {isOfferingsLink ? (
          <Link
            href="/offerings"
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[0.9rem] text-primary-foreground transition-colors hover:bg-brand-strong"
            style={{ fontWeight: 700 }}
          >
            {buttonLabel}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        ) : isServicesLink ? (
          <Link
            href="/services"
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[0.9rem] text-primary-foreground transition-colors hover:bg-brand-strong"
            style={{ fontWeight: 700 }}
          >
            {buttonLabel}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        ) : isSpacesLink ? (
          <Link
            href="/spaces"
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[0.9rem] text-primary-foreground transition-colors hover:bg-brand-strong"
            style={{ fontWeight: 700 }}
          >
            {buttonLabel}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[0.9rem] text-primary-foreground transition-colors hover:bg-brand-strong cursor-pointer"
            style={{ fontWeight: 700 }}
          >
            {buttonLabel}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        )}

        {note && <p className="mt-3 text-[0.78rem] text-muted-foreground">{note}</p>}
      </div>

      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        assessmentKey={assessmentKey}
        articleId={articleId}
        initialBriefingMode={briefingMode}
        onOpenConsultation={() => setIsConsultationOpen(true)}
        onOpenPlatform={() => setIsPlatformOpen(true)}
      />

      <PlatformWorkflowModal
        isOpen={isPlatformOpen}
        onClose={() => setIsPlatformOpen(false)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        articleHeadline={articleHeadline}
      />
    </>
  );
}

{/* abhi ye hai ki issue is there ye bd write behaviour ka code akrne ka logic hmlog idar likhte hai code mai na ki api 
  newsletter ka jo abharticle api diaplay karna h wo logic code mai likhna chahiye article ka bhi jo logic baataya usse   */} 
