import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NEWSLETTER_ASSESSMENTS,
  type AssessmentKey,
} from "@/lib/newsletter/assessments";
import { AssessmentStandalonePage } from "@/components/newsletter/AssessmentStandalonePage";

const CHECK_SLUG_MAP: Record<string, AssessmentKey> = {
  "pitch-check": "pitchCheck",
  "close-check": "closeCheck",
  "followup-check": "followupCheck",
  "update-check": "updateCheck",
  "risk-check": "riskCheck",
  "ownership-check": "ownershipCheck",
  "valuation-check": "valuationCheck",
  "runway-check": "runwayCheck",
  "stage-check": "stageCheck",
};

interface PageProps {
  params: Promise<{ check: string }>;
}

export function generateStaticParams() {
  return Object.keys(CHECK_SLUG_MAP).map((check) => ({ check }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { check } = await params;
  const key = CHECK_SLUG_MAP[check];
  if (!key) {
    return {
      title: "Assessment Not Found | UBverse",
      robots: { index: false, follow: false },
    };
  }

  const meta = NEWSLETTER_ASSESSMENTS[key];
  return {
    title: `${meta.title} — UBverse Newsletter`,
    description: meta.subtitle,
    alternates: { canonical: `/newsletter/${check}` },
    openGraph: {
      title: `${meta.title} — UBverse Newsletter`,
      description: meta.subtitle,
      url: `/newsletter/${check}`,
    },
  };
}

export default async function CheckPage({ params }: PageProps) {
  const { check } = await params;
  const key = CHECK_SLUG_MAP[check];
  if (!key) {
    notFound();
  }

  const meta = NEWSLETTER_ASSESSMENTS[key];
  return <AssessmentStandalonePage meta={meta} />;
}
