import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

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
    const clientIp = getClientIp(request);

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

    // 1. Forward subscription to UBverse backend newsletter service
    let backendSucceeded = false;
    try {
      const { subscribeBackendNewsletter } = await import("@/lib/ubverse-api");
      const backendResult = await subscribeBackendNewsletter(email);
      backendSucceeded = backendResult.success;
      if (!backendResult.success && process.env.NODE_ENV === "development") {
        console.warn("[Newsletter] Backend API subscription rejected:", backendResult.message);
      }
    } catch (apiErr) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Newsletter] Backend API subscription warning:", apiErr);
      }
    }

    // 2. Persist to Supabase if configured
    let supabaseSucceeded = false;
    let alreadySubscribed = false;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase/client");

        // Check for an existing subscriber first so we can honestly report
        // "already subscribed" instead of silently upserting and calling it new.
        const { data: existing, error: lookupError } = await supabase
          .from("newsletter_subscribers")
          .select("email")
          .eq("email", email)
          .maybeSingle();

        if (!lookupError && existing) {
          alreadySubscribed = true;
          supabaseSucceeded = true;
        } else {
          const { error } = await supabase
            .from("newsletter_subscribers")
            .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: "email" });
          supabaseSucceeded = !error;
          if (error && process.env.NODE_ENV === "development") {
            console.warn("[Newsletter] Supabase storage error:", error);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Newsletter] Supabase storage warning:", err);
        }
      }
    }

    // Only report success if the subscription was actually persisted somewhere.
    if (!backendSucceeded && !supabaseSucceeded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to subscribe right now. Please try again later.",
        },
        { status: 502 }
      );
    }

    if (alreadySubscribed) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "You're already on the list — no action needed.",
      });
    }

    return NextResponse.json({
      success: true,
      alreadySubscribed: false,
      message: "You have been successfully subscribed to our weekly briefing.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
