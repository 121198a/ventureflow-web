import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";
import { signSessionToken } from "@/lib/crypto";

function formatToE164(phone: string): string {
  const clean = phone.trim();
  if (clean.startsWith("+")) {
    return `+${clean.replace(/[^\d]/g, "")}`;
  }
  const digits = clean.replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    if (/^[6-9]/.test(digits)) {
      return `+91${digits}`;
    }
    return `+1${digits}`;
  }
  return `+${digits}`;
}

const isPhone = (val: string) => /^\+?[0-9\s\-()]{7,25}$/.test(val);

const sendOtpSchema = z.object({
  action: z.literal("send"),
  phone: z.string().trim().refine(isPhone, { message: "Invalid phone number format." }),
  role: z.enum(["founder", "investor"]).default("founder"),
});

const verifyOtpSchema = z.object({
  action: z.literal("verify"),
  phone: z.string().trim().refine(isPhone, { message: "Invalid phone number format." }),
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
      if (typeof b.phone === "string") b.phone = sanitizeHtml(b.phone.trim());
      if (typeof b.token === "string") b.token = sanitizeHtml(b.token.trim());
    }

    const parsed = otpRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || "Invalid OTP request." },
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

    // ACTION: SEND OTP
    if (parsed.data.action === "send") {
      const rateLimit = checkRateLimit(`otp_send_${clientIp}`, 5, 10 * 60 * 1000);
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

      const cleanPhone = formatToE164(parsed.data.phone);
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
        return NextResponse.json(
          { success: false, error: error.message || "Failed to send verification OTP via SMS." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent via SMS to ${cleanPhone}.`,
        phone: cleanPhone,
      });
    }

    // ACTION: VERIFY OTP
    if (parsed.data.action === "verify") {
      const rateLimit = checkRateLimit(`otp_verify_${clientIp}`, 8, 10 * 60 * 1000);
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

      const rawDigits = parsed.data.phone.replace(/[^\d]/g, "");
      const candidates = [
        formatToE164(parsed.data.phone),
        parsed.data.phone.startsWith("+") ? parsed.data.phone : `+${rawDigits}`,
        rawDigits.length === 10 ? `+91${rawDigits}` : null,
        rawDigits.length === 10 ? `+1${rawDigits}` : null,
        rawDigits,
      ].filter((c): c is string => Boolean(c));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let error: any = null;
      let verifiedPhone: string = formatToE164(parsed.data.phone);

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

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
