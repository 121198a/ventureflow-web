import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";
import { signSessionToken } from "@/lib/crypto";
import { formatToE164, maskPhoneNumber, maskEmail } from "@/lib/utils";

const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isPhone = (val: string) => /^\+?[0-9\s\-()]{7,25}$/.test(val);

const sendOtpSchema = z.object({
  action: z.literal("send"),
  type: z.enum(["phone", "email"]).optional(),
  destination: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  role: z.enum(["founder", "investor"]).default("founder"),
});

const verifyOtpSchema = z.object({
  action: z.literal("verify"),
  type: z.enum(["phone", "email"]).optional(),
  destination: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  token: z.string().trim().min(4, "OTP code must be at least 4 digits").max(10, "Invalid OTP code"),
  role: z.enum(["founder", "investor"]).default("founder"),
});

const otpRequestSchema = z.discriminatedUnion("action", [sendOtpSchema, verifyOtpSchema]);

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request payload format." },
        { status: 400 }
      );
    }

    if (typeof rawBody === "object" && rawBody !== null) {
      const b = rawBody as Record<string, unknown>;
      if (typeof b.destination === "string") b.destination = sanitizeHtml(b.destination.trim());
      if (typeof b.phone === "string") b.phone = sanitizeHtml(b.phone.trim());
      if (typeof b.email === "string") b.email = sanitizeHtml(b.email.trim());
      if (typeof b.token === "string") b.token = sanitizeHtml(b.token.trim());
    }

    const parsed = otpRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || "Invalid OTP request parameters." },
        { status: 400 }
      );
    }

    // Determine target destination strictly from current user request payload
    const rawDest = (parsed.data.destination || parsed.data.email || parsed.data.phone || "").trim();
    const isEmailDest = parsed.data.type === "email" || (parsed.data.type !== "phone" && isEmail(rawDest));
    const isPhoneDest = parsed.data.type === "phone" || (!isEmailDest && isPhone(rawDest));

    if (!isEmailDest && !isPhoneDest) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address or phone number." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Authentication service is not configured." },
        { status: 503 }
      );
    }

    const { supabase } = await import("@/lib/supabase/client");

    // =========================================================================
    // ACTION: SEND OTP
    // =========================================================================
    if (parsed.data.action === "send") {
      const rateLimit = checkRateLimit(`otp_send_${clientIp}`, 6, 10 * 60 * 1000);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many OTP requests. Please wait a few minutes before trying again.",
            retryAfter: rateLimit.retryAfter,
          },
          { status: 429 }
        );
      }

      // Case 1: EMAIL OTP
      if (isEmailDest) {
        const cleanEmail = rawDest.toLowerCase();
        console.log(`[Auth OTP] Dispatching Email OTP to destination: ${maskEmail(cleanEmail)}`);

        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true,
            data: {
              role: parsed.data.role,
            },
          },
        });

        if (error) {
          console.error(`[Auth OTP] Supabase rejected Email OTP for ${maskEmail(cleanEmail)}:`, error.message);
          const isRateLimit = error.message.toLowerCase().includes("rate limit") || error.status === 429;
          return NextResponse.json(
            {
              success: false,
              error: isRateLimit
                ? "Email rate limit exceeded. Please wait a few minutes or use phone authentication."
                : error.message || "Failed to send email verification code.",
            },
            { status: isRateLimit ? 429 : 400 }
          );
        }

        return NextResponse.json({
          success: true,
          type: "email",
          destination: cleanEmail,
          message: `Verification code sent to ${cleanEmail}. Check your inbox or spam folder.`,
        });
      }

      // Case 2: PHONE OTP
      if (isPhoneDest) {
        const cleanPhone = formatToE164(rawDest);
        console.log(`[Auth OTP] Dispatching SMS OTP to destination: ${maskPhoneNumber(cleanPhone)}`);

        const { error } = await supabase.auth.signInWithOtp({
          phone: cleanPhone,
          options: {
            channel: "sms",
            data: {
              role: parsed.data.role,
            },
          },
        });

        if (error) {
          console.error(`[Auth OTP] Supabase rejected SMS OTP for ${maskPhoneNumber(cleanPhone)}:`, error.message);
          return NextResponse.json(
            { success: false, error: error.message || "Failed to send verification OTP via SMS." },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          type: "phone",
          destination: cleanPhone,
          phone: cleanPhone,
          message: `Verification code sent via SMS to ${cleanPhone}.`,
        });
      }
    }

    // =========================================================================
    // ACTION: VERIFY OTP
    // =========================================================================
    if (parsed.data.action === "verify") {
      const rateLimit = checkRateLimit(`otp_verify_${clientIp}`, 10, 10 * 60 * 1000);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many verification attempts. Please request a new code.",
            retryAfter: rateLimit.retryAfter,
          },
          { status: 429 }
        );
      }

      const token = parsed.data.token;
      const role = parsed.data.role;

      // Case 1: VERIFY EMAIL OTP
      if (isEmailDest) {
        const cleanEmail = rawDest.toLowerCase();
        console.log(`[Auth OTP] Verifying Email OTP for destination: ${maskEmail(cleanEmail)}`);

        // Try standard email OTP token verification
        let verifyRes = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token,
          type: "email",
        });

        // Fallback to magiclink or signup verification if email template type differs
        if ((verifyRes.error || !verifyRes.data.user) && token.length > 5) {
          const magicRes = await supabase.auth.verifyOtp({
            email: cleanEmail,
            token,
            type: "magiclink",
          });
          if (magicRes.data.user) {
            verifyRes = magicRes;
          }
        }

        if (verifyRes.error || !verifyRes.data.user) {
          return NextResponse.json(
            { success: false, error: verifyRes.error?.message || "Invalid or expired verification code." },
            { status: 400 }
          );
        }

        resetRateLimit(`otp_send_${clientIp}`);
        resetRateLimit(`otp_verify_${clientIp}`);

        const verifiedRole =
          (verifyRes.data.user.user_metadata?.role as string) ||
          (verifyRes.data.user.app_metadata?.role as string) ||
          role;

        const res = NextResponse.json({
          success: true,
          message: "Email verified successfully. Session established.",
          user: {
            id: verifyRes.data.user.id,
            email: verifyRes.data.user.email || cleanEmail,
            role: verifiedRole,
          },
          session: verifyRes.data.session,
        });

        const vfToken = await signSessionToken({
          id: verifyRes.data.user.id,
          email: verifyRes.data.user.email || cleanEmail,
          role: verifiedRole,
        });

        res.cookies.set("vf_token", vfToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        res.cookies.set("vf_role", verifiedRole, { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
        res.cookies.set("vf_auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
        res.cookies.set(
          "vf_user",
          JSON.stringify({ id: verifyRes.data.user.id, email: verifyRes.data.user.email || cleanEmail, role: verifiedRole }),
          { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" }
        );

        if (verifyRes.data.session?.access_token) {
          res.cookies.set("sb_access_token", verifyRes.data.session.access_token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
          });
        }

        return res;
      }

      // Case 2: VERIFY PHONE OTP
      if (isPhoneDest) {
        const cleanPhone = formatToE164(rawDest);
        console.log(`[Auth OTP] Verifying SMS OTP for destination: ${maskPhoneNumber(cleanPhone)}`);

        const rawDigits = rawDest.replace(/[^\d]/g, "");
        const candidates = [
          cleanPhone,
          rawDest.startsWith("+") ? rawDest : `+${rawDigits}`,
          rawDigits.length === 10 ? `+91${rawDigits}` : null,
          rawDigits.length === 10 ? `+1${rawDigits}` : null,
          rawDigits,
        ].filter((c): c is string => Boolean(c));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let error: any = null;
        let verifiedPhone: string = cleanPhone;

        for (const phoneCand of Array.from(new Set(candidates))) {
          const result = await supabase.auth.verifyOtp({
            phone: phoneCand,
            token,
            type: "sms",
          });

          if (result.data?.user) {
            data = result.data;
            error = null;
            verifiedPhone = phoneCand;
            break;
          }

          error = result.error;
        }

        if (error || !data?.user) {
          return NextResponse.json(
            { success: false, error: error?.message || "Invalid or expired verification code." },
            { status: 400 }
          );
        }

        resetRateLimit(`otp_send_${clientIp}`);
        resetRateLimit(`otp_verify_${clientIp}`);

        const verifiedRole =
          (data.user.user_metadata?.role as string) ||
          (data.user.app_metadata?.role as string) ||
          role;

        const res = NextResponse.json({
          success: true,
          message: "Phone verified successfully. Session established.",
          user: {
            id: data.user.id,
            phone: data.user.phone || verifiedPhone,
            role: verifiedRole,
          },
          session: data.session,
        });

        const vfToken = await signSessionToken({
          id: data.user.id,
          phone: data.user.phone || verifiedPhone,
          role: verifiedRole,
        });

        res.cookies.set("vf_token", vfToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        res.cookies.set("vf_role", verifiedRole, { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
        res.cookies.set("vf_auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
        res.cookies.set(
          "vf_user",
          JSON.stringify({ id: data.user.id, phone: data.user.phone || verifiedPhone, role: verifiedRole }),
          { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" }
        );

        if (data.session?.access_token) {
          res.cookies.set("sb_access_token", data.session.access_token, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
          });
        }

        return res;
      }
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
