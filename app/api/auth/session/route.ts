import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { signSessionToken, verifySessionToken } from "@/lib/crypto";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    const sbAccessToken = bearerToken || cookieStore.get("sb_access_token")?.value;
    const vfToken = cookieStore.get("vf_token")?.value;

    let user: { id?: string; email?: string; role?: string | null } | null = null;

    // 1. If Supabase token is present and Supabase is configured, verify cryptographically with Supabase
    if (sbAccessToken && isSupabaseConfigured()) {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        const { data, error } = await supabase.auth.getUser(sbAccessToken);
        if (!error && data?.user) {
          const verifiedRole =
            (data.user.user_metadata?.role as string) ||
            (data.user.app_metadata?.role as string) ||
            null;

          user = {
            id: data.user.id,
            email: data.user.email,
            role: verifiedRole,
          };

          return NextResponse.json({
            authenticated: true,
            user,
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Auth Session] Supabase getUser verification error:", err);
        }
      }
    }

    // 2. Cryptographic HMAC session verification
    if (vfToken) {
      try {
        const verified = await verifySessionToken<{ id?: string; email?: string; role?: string }>(vfToken);
        if (verified?.email) {
          user = {
            id: verified.id || verified.email,
            email: verified.email,
            role: verified.role || null,
          };

          return NextResponse.json({
            authenticated: true,
            user,
          });
        }
      } catch {
        // Invalid or tampered token
      }
    }

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        error: "Failed to resolve session.",
      },
      { status: 200 }
    );
  }
}

/**
 * POST /api/auth/session
 * Allows client to sync an active session into HTTP cookies after OAuth or client-side login.
 */
export async function POST(request: Request) {
  try {
    let body: {
      accessToken?: string;
      refreshToken?: string;
      role?: string;
      email?: string;
      id?: string;
    } = {};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { accessToken, role = "investor", email, id } = body;
    const res = NextResponse.json({ success: true });

    if (email) {
      const vfToken = await signSessionToken({ id: id || email, email, role });
      res.cookies.set("vf_token", vfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      res.cookies.set("vf_user", JSON.stringify({ id: id || email, email, role }), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    res.cookies.set("vf_auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    res.cookies.set("vf_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });

    if (accessToken) {
      res.cookies.set("sb_access_token", accessToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    return res;
  } catch {
    return NextResponse.json({ success: false, error: "Failed to persist session" }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Invalidates and clears session cookies.
 */
export async function DELETE() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.delete("vf_token");
  res.cookies.delete("vf_auth");
  res.cookies.delete("vf_role");
  res.cookies.delete("vf_user");
  res.cookies.delete("sb_access_token");
  res.cookies.delete("sb_refresh_token");
  return res;
}
