import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase/client";

// Password complexity regex: uppercase, lowercase, number, special char, min 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const requestResetSchema = z.object({
  step: z.literal("request").default("request"),
  email: z
    .string()
    .trim()
    .min(5, "Please enter a valid email or phone number.")
    .max(254, "Input too long."),
});

const confirmResetSchema = z
  .object({
    step: z.literal("confirm"),
    token: z
      .string()
      .trim()
      .min(4, "Recovery token or code is required.")
      .max(256, "Invalid recovery token."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password too long.")
      .regex(
        PASSWORD_REGEX,
        "Password must contain an uppercase letter, lowercase letter, number, and special character."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`reset_${clientIp}`, 6, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many password reset attempts. Please try again later.",
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
      if (typeof b.token === "string") b.token = sanitizeHtml(b.token.trim());
    }

    const bodyObj = (rawBody || {}) as Record<string, unknown>;
    const step = bodyObj.step === "confirm" ? "confirm" : "request";

    if (step === "confirm") {
      const parsedConfirm = confirmResetSchema.safeParse(bodyObj);
      if (!parsedConfirm.success) {
        const firstIssue = parsedConfirm.error.issues[0];
        return NextResponse.json(
          { success: false, error: firstIssue?.message || "Invalid password reset details." },
          { status: 400 }
        );
      }

      const { token, password } = parsedConfirm.data;

      // If Supabase is configured, attempt password update with session / token
      if (isSupabaseConfigured()) {
        try {
          const client = getSupabaseClient();
          if (client) {
            // Attempt verifyOtp or updateUser
            const { error: otpError } = await client.auth.verifyOtp({
              token_hash: token,
              type: "recovery",
            });

            if (!otpError) {
              const { error: updateError } = await client.auth.updateUser({
                password,
              });

              if (updateError) {
                return NextResponse.json(
                  { success: false, error: updateError.message || "Failed to update password." },
                  { status: 400 }
                );
              }
            } else {
              // Try direct update in case session was established
              const { error: directError } = await client.auth.updateUser({ password });
              if (directError) {
                return NextResponse.json(
                  {
                    success: false,
                    error:
                      "The recovery token is invalid, already used, or has expired. Please request a new link.",
                  },
                  { status: 400 }
                );
              }
            }
          }
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: "The recovery token is invalid or has expired.",
            },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: "Password changed successfully! You can now log in with your new password.",
        },
        { status: 200 }
      );
    }

    // Step === "request"
    const parsedRequest = requestResetSchema.safeParse(bodyObj);
    if (!parsedRequest.success) {
      const firstIssue = parsedRequest.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || "Please provide an email or phone number." },
        { status: 400 }
      );
    }

    const { email } = parsedRequest.data;

    if (isSupabaseConfigured() && email.includes("@")) {
      try {
        const client = getSupabaseClient();
        if (client) {
          const origin =
            request.headers.get("origin") ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            "http://localhost:3000";
          await client.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin.replace(/\/$/, "")}/login?flow=reset&step=confirm`,
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Auth Reset] Reset email dispatch warning:", err);
        }
      }
    }

    // Rule 10: DO NOT LEAK WHETHER AN ACCOUNT EXISTS
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account is associated with this information, password recovery instructions have been sent.",
        step: "confirm",
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
