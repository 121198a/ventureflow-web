import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit } from "@/lib/rate-limit";

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Invalid email address")
    .max(254, "Invalid email address")
    .email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(`newsletter_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many subscription requests. Please try again later.",
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
      if (typeof b.email === "string") b.email = sanitizeHtml(b.email.trim());
    }

    const parsed = subscribeSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Persist to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        await supabase
          .from("newsletter_subscribers")
          .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: "email" });
      } catch (err) {
        console.warn("[Newsletter] Supabase storage warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "You have been successfully subscribed to our weekly briefing.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
