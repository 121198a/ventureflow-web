import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

// Strong password complexity: min 8, uppercase, lowercase, number, symbol
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Invalid email address.")
    .max(254, "Email address is too long.")
    .email("Please provide a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password is too long.")
    .regex(
      PASSWORD_REGEX,
      "Password must contain an uppercase letter, lowercase letter, number, and special character."
    ),
  confirmPassword: z.string(),
  agreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Use and Privacy Policy.",
  }),
  role: z.enum(["founder", "investor"]).default("founder"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const clientIp = getClientIp(request);

    const rateLimit = checkRateLimit(`signup_${clientIp}`, 8, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many signup attempts. Please try again later.",
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

    // 2. Parse & sanitize
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
      if (typeof b.role === "string") b.role = sanitizeHtml(b.role.trim());
    }

    // 3. Schema validation
    const parsed = signupSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || "Invalid registration data." },
        { status: 400 }
      );
    }

    const { email, password, role } = parsed.data;

    // 4. Delegate to Auth provider (Supabase / Auth0)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });

        if (error) {
          // Generic user-facing message to prevent email harvesting
          return NextResponse.json(
            { success: false, error: "Unable to create account. Please try again." },
            { status: 400 }
          );
        }

        resetRateLimit(`signup_${clientIp}`);
        return NextResponse.json({
          success: true,
          message: "Account created successfully.",
          user: { id: data.user?.id, email: data.user?.email, role },
          session: data.session,
        });
      } catch {
        return NextResponse.json(
          { success: false, error: "Unable to create account. Please try again." },
          { status: 400 }
        );
      }
    }

    // Fail closed when authentication service is not configured
    return NextResponse.json(
      { success: false, error: "Authentication service is not configured." },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
