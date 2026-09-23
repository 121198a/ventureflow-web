import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Recovery request schema matching UI fields in Image 2
const recoverSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(60, "First name is too long."),
  middleName: z
    .string()
    .trim()
    .max(60, "Middle name is too long.")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(60, "Last name is too long."),
  dob: z
    .string()
    .trim()
    .min(4, "Date of birth is required.")
    .max(20, "Invalid date format.")
    .refine((val) => {
      // Validate common date formats: MM/DD/YYYY, YYYY-MM-DD, M/D/YYYY
      const date = new Date(val);
      return !isNaN(date.getTime()) && date.getFullYear() > 1900 && date <= new Date();
    }, {
      message: "Please enter a valid date of birth (MM/DD/YYYY).",
    }),
});

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`recover_${clientIp}`, 6, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many recovery attempts. Please try again later.",
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 900),
          },
        }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request format." },
        { status: 400 }
      );
    }

    // Sanitize input
    if (typeof rawBody === "object" && rawBody !== null) {
      const b = rawBody as Record<string, unknown>;
      if (typeof b.firstName === "string") b.firstName = sanitizeHtml(b.firstName.trim());
      if (typeof b.middleName === "string") b.middleName = sanitizeHtml(b.middleName.trim());
      if (typeof b.lastName === "string") b.lastName = sanitizeHtml(b.lastName.trim());
      if (typeof b.dob === "string") b.dob = sanitizeHtml(b.dob.trim());
    }

    const parsed = recoverSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || "Invalid recovery information." },
        { status: 400 }
      );
    }

    // Security Rule 10: DO NOT LEAK WHETHER AN ACCOUNT EXISTS
    // Return a uniform, safe response that guides the user to verification or support
    return NextResponse.json(
      {
        success: true,
        message:
          "If the details match an account in our system, recovery instructions have been sent to your registered contact method.",
        step: "protect",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
