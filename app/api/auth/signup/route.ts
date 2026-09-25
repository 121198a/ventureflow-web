import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";
import { signSessionToken } from "@/lib/crypto";

// Strong password complexity: min 8, uppercase, lowercase, number, symbol
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isPhone = (val: string) => /^\+?[0-9\s\-()]{7,25}$/.test(val);

function formatToE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(5, "Please provide a valid email or phone number.")
      .max(254, "Identifier is too long.")
      .refine((val) => isEmail(val) || isPhone(val), {
        message: "Please provide a valid email address or phone number.",
      }),
    phone: z.string().optional(),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
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

    const { email, phone, password, role } = parsed.data;
    const isEmailAddress = isEmail(email) && !isPhone(email);
    const cleanPhone = phone ? formatToE164(phone) : (!isEmailAddress ? formatToE164(email) : null);

    // 4. Delegate to Auth provider (Supabase / Auth0)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        const { data, error } = await supabase.auth.signUp(
          isEmailAddress
            ? {
                email,
                password,
                options: {
                  data: { role },
                },
              }
            : {
                phone: cleanPhone || email,
                password,
                options: {
                  data: { role },
                },
              }
        );

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message || "Unable to create account. Please try again." },
            { status: 400 }
          );
        }

        resetRateLimit(`signup_${clientIp}`);
        const res = NextResponse.json({
          success: true,
          message: "Account created successfully.",
          user: {
            id: data.user?.id,
            email: data.user?.email || (isEmailAddress ? email : undefined),
            phone: data.user?.phone || (!isEmailAddress ? (cleanPhone || email) : undefined),
            role,
          },
          session: data.session,
        });

        if (data.session) {
          const vfToken = await signSessionToken({
            id: data.user?.id,
            email: data.user?.email || email,
            role,
          });

          res.cookies.set("vf_token", vfToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          res.cookies.set("vf_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
          res.cookies.set("vf_auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
          res.cookies.set(
            "vf_user",
            JSON.stringify({ id: data.user?.id, email: data.user?.email || email, role }),
            { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" }
          );
          if (data.session.access_token) {
            res.cookies.set("sb_access_token", data.session.access_token, {
              path: "/",
              maxAge: 60 * 60 * 24 * 7,
              sameSite: "lax",
            });
          }
        }

        return res;
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
