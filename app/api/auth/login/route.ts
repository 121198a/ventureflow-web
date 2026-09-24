import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";
import { signSessionToken } from "@/lib/crypto";

// Strict Zod schema for server-side validation (supports email or phone identifier)
const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isPhone = (val: string) => /^\+?[0-9\s\-()]{7,25}$/.test(val);

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
        const isEmailAddress = isEmail(email);
        const { data, error } = await supabase.auth.signInWithPassword(
          isEmailAddress
            ? { email, password: parsed.data.password }
            : { phone: email, password: parsed.data.password }
        );

        if (error) {
          return NextResponse.json(
            { success: false, error: toErrorString(backendError) },
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
            email: data.user?.email || email,
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
