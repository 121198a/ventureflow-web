import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const supportSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(5, "Email is required.")
    .max(254, "Email is too long.")
    .email("Please provide a valid email address."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters.")
    .max(2000, "Message is too long."),
});

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`support_${clientIp}`, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many support requests submitted. Please try again later.",
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

    if (typeof rawBody === "object" && rawBody !== null) {
      const b = rawBody as Record<string, unknown>;
      if (typeof b.name === "string") b.name = sanitizeHtml(b.name.trim());
      if (typeof b.email === "string") b.email = sanitizeHtml(b.email.trim());
      if (typeof b.phone === "string") b.phone = sanitizeHtml(b.phone.trim());
      if (typeof b.message === "string") b.message = sanitizeHtml(b.message.trim());
    }

    const parsed = supportSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || "Invalid support request details." },
        { status: 400 }
      );
    }

    // In production, this can send to Zendesk, Crisp, or Zenith support chat service
    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your recovery request has been received. Our support team will review your details and contact you shortly.",
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
