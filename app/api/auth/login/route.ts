import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";
import { signSessionToken } from "@/lib/crypto";

// Strict Zod schema for server-side validation (supports email or phone identifier)
const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isPhone = (val: string) => /^\+?[0-9\s\-()]{7,25}$/.test(val);

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

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Invalid credentials")
    .max(254, "Invalid credentials")
    .refine((val) => isEmail(val) || isPhone(val), {
      message: "Invalid credentials",
    }),
  password: z
    .string()
    .min(1, "Invalid credentials")
    .max(128, "Invalid credentials"),
  role: z.enum(["founder", "investor"]).default("founder"),
});

function toErrorString(err: unknown, fallback = "Invalid email or password."): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (Array.isArray(err) && err.length > 0) {
    return toErrorString(err[0], fallback);
  }
  if (typeof err === "object") {
    const record = err as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
    for (const val of Object.values(record)) {
      const resolved = toErrorString(val, "");
      if (resolved) return resolved;
    }
  }
  return fallback;
}

export async function POST(request: Request) {
  try {
    // 1. IP / client identifier extraction for rate limiting
    const clientIp = getClientIp(request);

    const rateLimit = checkRateLimit(`login_${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again later.",
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

    // 2. Parse & sanitize JSON payload
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request format." },
        { status: 400 }
      );
    }

    // Sanitize string fields
    if (typeof rawBody === "object" && rawBody !== null) {
      const b = rawBody as Record<string, unknown>;
      if (typeof b.email === "string") b.email = sanitizeHtml(b.email.trim());
      if (typeof b.role === "string") b.role = sanitizeHtml(b.role.trim());
    }

    // 3. Server-side schema validation
    const parsed = loginSchema.safeParse(rawBody);
    if (!parsed.success) {
      // Use generic error message to prevent enumeration attacks
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 400 }
      );
    }

    const { email, role } = parsed.data;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let backendError: string | null = null;

    // 4. Delegate to UBverse Backend Authentication
    try {
      const { loginBackendUser } = await import("@/lib/ubverse-api");
      const backendAuth = await loginBackendUser({
        email,
        password: parsed.data.password,
      });

      if (backendAuth.success) {
        resetRateLimit(`login_${clientIp}`);
        const res = NextResponse.json({
          success: true,
          user: { email, role },
          data: backendAuth.data,
        });

        const vfToken = await signSessionToken({ email, role });
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
          JSON.stringify({ email, role }),
          { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" }
        );

        return res;
      }

      if (backendAuth.status === 400 || backendAuth.status === 401) {
        backendError = toErrorString(backendAuth.error, "Invalid email or password.");
      }
    } catch (backendErr) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Auth Login] Backend auth attempt warning:", backendErr);
      }
    }

    // 5. Delegate to standard authentication provider (Supabase)
    if (supabaseUrl && supabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        const isEmailAddress = isEmail(email) && !isPhone(email);
        const cleanPhone = !isEmailAddress ? formatToE164(email) : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let authError: any = null;
        let matchedPhone: string = cleanPhone || email;

        if (isEmailAddress) {
          const res = await supabase.auth.signInWithPassword({
            email,
            password: parsed.data.password,
          });
          data = res.data;
          authError = res.error;
        } else {
          // Robust candidate checking: handles E.164 (+91, +1), local numbers, and raw digits
          const rawDigits = email.replace(/[^\d]/g, "");
          const candidates: string[] = [];

          if (email.startsWith("+")) {
            candidates.push(`+${rawDigits}`);
          } else {
            if (rawDigits.length === 10) {
              if (/^[6-9]/.test(rawDigits)) {
                candidates.push(`+91${rawDigits}`);
                candidates.push(`+1${rawDigits}`);
              } else {
                candidates.push(`+1${rawDigits}`);
                candidates.push(`+91${rawDigits}`);
              }
            } else if (rawDigits.length === 12 && rawDigits.startsWith("91")) {
              candidates.push(`+${rawDigits}`);
            } else if (rawDigits.length === 11 && rawDigits.startsWith("1")) {
              candidates.push(`+${rawDigits}`);
            } else {
              candidates.push(`+${rawDigits}`);
            }
            candidates.push(rawDigits);
          }

          for (const cand of Array.from(new Set(candidates))) {
            const res = await supabase.auth.signInWithPassword({
              phone: cand,
              password: parsed.data.password,
            });

            if (res.data?.user) {
              data = res.data;
              authError = null;
              matchedPhone = cand;
              break;
            }

            if (res.error) {
              authError = res.error;
              matchedPhone = cand;
              const isPhoneNotConfirmed =
                res.error.message.toLowerCase().includes("phone not confirmed") ||
                res.error.message.toLowerCase().includes("phone_not_confirmed");
              if (isPhoneNotConfirmed) {
                break;
              }
            }
          }
        }

        if (authError) {
          const isPhoneNotConfirmed =
            authError.message.toLowerCase().includes("phone not confirmed") ||
            authError.message.toLowerCase().includes("phone_not_confirmed");

          if (isPhoneNotConfirmed && !isEmailAddress) {
            // Automatically dispatch OTP so user can confirm and proceed without friction
            await supabase.auth.signInWithOtp({ phone: matchedPhone }).catch(() => null);
            return NextResponse.json(
              {
                success: false,
                requiresOtp: true,
                phone: matchedPhone,
                error: "Phone not confirmed. A 6-digit verification code has been sent to your phone.",
              },
              { status: 403 }
            );
          }

          return NextResponse.json(
            { success: false, error: authError.message || toErrorString(backendError) },
            { status: 401 }
          );
        }

        const verifiedRole =
          (data.user?.user_metadata?.role as string) ||
          (data.user?.app_metadata?.role as string) ||
          role;

        resetRateLimit(`login_${clientIp}`);
        const res = NextResponse.json({
          success: true,
          user: {
            id: data.user?.id,
            email: data.user?.email || (isEmailAddress ? email : undefined),
            phone: data.user?.phone || (!isEmailAddress ? (cleanPhone || email) : undefined),
            role: verifiedRole,
          },
          session: data.session,
        });

        const vfToken = await signSessionToken({
          id: data.user?.id,
          email: data.user?.email || email,
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
          JSON.stringify({ id: data.user?.id, email: data.user?.email || email, role: verifiedRole }),
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
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }
    }

    if (backendError) {
      return NextResponse.json(
        { success: false, error: toErrorString(backendError) },
        { status: 401 }
      );
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
