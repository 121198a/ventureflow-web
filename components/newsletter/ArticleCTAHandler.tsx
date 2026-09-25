"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AssessmentKey } from "@/lib/newsletter/assessments";

interface ArticleCTAHandlerProps {
  heading?: string;
  text: string;
  buttonLabel: string;
  note?: string;
  articleId: string;
  articleHeadline?: string;
  assessmentKey?: AssessmentKey;
  customAction?: "assessment" | "briefing" | "how-it-works" | "book-call";
  endpoint?: string;
}

const ARTICLE_CHECK_MAP: Record<string, string> = {
  "1": "pitch-check",
  "2": "close-check",
  "3": "followup-check",
  "4": "how-it-works",
  "5": "risk-check",
  "6": "ownership-check",
  "7": "valuation-check",
  "8": "runway-check",
  "9": "stage-check",
};

const ASSESSMENT_KEY_SLUG_MAP: Record<string, string> = {
  pitchCheck: "pitch-check",
  closeCheck: "close-check",
  followupCheck: "followup-check",
  updateCheck: "update-check",
  riskCheck: "risk-check",
  ownershipCheck: "ownership-check",
  valuationCheck: "valuation-check",
  runwayCheck: "runway-check",
  stageCheck: "stage-check",
};

export function ArticleCTAHandler({
  heading,
  text,
  buttonLabel,
  note,
  articleId,
  assessmentKey,
  customAction,
}: ArticleCTAHandlerProps) {
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

  // Determine standard, seamless destination route
  const getDestinationHref = (): string => {
    if (isOfferingsLink) return "/offerings";
    if (isServicesLink) return "/services";
    if (isSpacesLink) return "/spaces";

    if (isConsultation) {
      return "/newsletter/book-call";
    }

    if (isPlatform) {
      return "/newsletter/how-it-works";
    }

    const checkSlug =
      (assessmentKey && ASSESSMENT_KEY_SLUG_MAP[assessmentKey]) ||
      ARTICLE_CHECK_MAP[String(articleId)] ||
      "pitch-check";

    if (isBriefing) {
      return checkSlug === "how-it-works" ? "/newsletter/how-it-works" : `/newsletter/${checkSlug}#briefing`;
    }

    if (isAssessment) {
      return checkSlug === "how-it-works" ? "/newsletter/how-it-works" : `/newsletter/${checkSlug}`;
    }

    return "/newsletter/how-it-works";
  };

  const href = getDestinationHref();

  return (
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

      <Link
        href={href}
        prefetch={true}
        className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[0.9rem] text-primary-foreground transition-all duration-200 hover:bg-brand-strong hover:shadow-md hover:shadow-blue-900/10 active:scale-[0.985]"
        style={{ fontWeight: 700 }}
      >
        {buttonLabel}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>

      {note && <p className="mt-3 text-[0.78rem] text-muted-foreground">{note}</p>}
    </div>
  );
} 
