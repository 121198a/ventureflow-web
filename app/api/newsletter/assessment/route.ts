import { NextResponse } from "next/server";
import { z } from "zod";
import {
  NEWSLETTER_ASSESSMENTS,
  computeReadinessBriefing,
  type AssessmentKey,
} from "@/lib/newsletter/assessments";
import { NEWSLETTER_API_BASE_URL } from "@/lib/newsletter/config";

const AssessmentSubmissionSchema = z.object({
  assessmentKey: z.enum([
    "pitchCheck",
    "closeCheck",
    "followupCheck",
    "updateCheck",
    "riskCheck",
    "ownershipCheck",
    "valuationCheck",
    "runwayCheck",
    "stageCheck",
  ]),
  answers: z.record(z.string(), z.enum(["yes", "mid", "no"])),
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const parsed = AssessmentSubmissionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment data",
          details: parsed.error.issues,
        },
        { status: 422 }
      );
    }

    const { assessmentKey, answers, email, name } = parsed.data;
    const assessment = NEWSLETTER_ASSESSMENTS[assessmentKey as AssessmentKey];

    if (!assessment) {
      return NextResponse.json(
        { success: false, error: "Unknown assessment" },
        { status: 404 }
      );
    }

    // Convert string keys to numbers for evaluation
    const numericAnswers: Record<number, "yes" | "mid" | "no"> = {};
    for (const [k, v] of Object.entries(answers)) {
      const idx = parseInt(k, 10);
      if (!isNaN(idx)) {
        numericAnswers[idx] = v;
      }
    }

    const briefing = computeReadinessBriefing(assessment, numericAnswers);

    // If an email was provided, attempt to notify remote newsletter backend service
    if (email) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);

        await fetch(`${NEWSLETTER_API_BASE_URL}/ubverse-service/newsletter/send-email-result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Ventureflow-NewsletterService/1.0",
          },
          body: JSON.stringify({
            email,
            name: name || "",
            assessmentType: assessmentKey,
            score: briefing.score,
            total: briefing.total,
            status: briefing.status,
          }),
          signal: controller.signal,
        }).catch(() => {});

        clearTimeout(timeout);
      } catch {
        // Non-blocking background sync failure
      }
    }

    return NextResponse.json(
      {
        success: true,
        assessmentTitle: assessment.title,
        briefing,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to evaluate readiness assessment" },
      { status: 500 }
    );
  }
}
