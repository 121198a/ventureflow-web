import { NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limit";

// Strict Zod schema for server-side validation
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Invalid credentials")
    .max(254, "Invalid credentials")
    .email("Invalid credentials"),
  password: z
    .string()
    .min(1, "Invalid credentials")
    .max(128, "Invalid credentials"),
  role: z.enum(["founder", "investor"]).default("founder"),
});

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

    // 4. Delegate to UBverse Backend Authentication
    try {
      const { loginBackendUser } = await import("@/lib/ubverse-api");
      const backendAuth = await loginBackendUser({
        email,
        password: parsed.data.password,
      });

      if (backendAuth.success) {
        resetRateLimit(`login_${clientIp}`);
        return NextResponse.json({
          success: true,
          user: { email, role },
          data: backendAuth.data,
        });
      }

      // If backend explicitly rejected the user credentials, return that reason
      if (backendAuth.status === 400 || backendAuth.status === 401) {
        return NextResponse.json(
          { success: false, error: backendAuth.error || "Invalid email or password." },
          { status: 401 }
        );
      }
    } catch (backendErr) {
      console.warn("[Auth Login] Backend auth attempt warning:", backendErr);
    }

    // 5. Delegate to standard authentication provider (e.g. Supabase / Auth0)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: parsed.data.password,
        });

        if (error) {
          return NextResponse.json(
            { success: false, error: "Invalid email or password." },
            { status: 401 }
          );
        }

        resetRateLimit(`login_${clientIp}`);
        return NextResponse.json({
          success: true,
          user: { id: data.user?.id, email: data.user?.email, role },
          session: data.session,
        });
      } catch {
        // Generic failure
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
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
