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
 *
 * SECURITY: the caller supplies an `accessToken` (from a real Supabase
 * sign-in / OAuth redirect), but email/id/role are NEVER trusted from the
 * request body — they are always re-derived from Supabase after verifying
 * the access token server-side. Otherwise anyone could POST an arbitrary
 * {email, role: "founder"} and mint themselves a valid signed session.
 */
export async function POST(request: Request) {
  try {
    let body: {
      accessToken?: string;
      refreshToken?: string;
      role?: string;
    } = {};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { accessToken, role: requestedRole } = body;

    if (!accessToken || !isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "A valid access token is required to create a session." },
        { status: 401 }
      );
    }

    // Verify the token directly against Supabase and derive identity/role
    // from the verified user record — never from client-supplied fields.
    const { supabase } = await import("@/lib/supabase/client");
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data?.user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired access token." },
        { status: 401 }
      );
    }

    const verifiedUser = data.user;
    const verifiedRole =
      (verifiedUser.user_metadata?.role as string | undefined) ||
      (verifiedUser.app_metadata?.role as string | undefined) ||
      // Only used if Supabase has no role on file yet (e.g. first OAuth
      // login); still comes from the caller's declared intent, not an
      // identity claim, and carries no extra privilege by itself.
      requestedRole ||
      "investor";

    const email = verifiedUser.email;
    const id = verifiedUser.id;

    const res = NextResponse.json({ success: true, user: { id, email, role: verifiedRole } });

    const vfToken = await signSessionToken({ id, email, role: verifiedRole });
    res.cookies.set("vf_token", vfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set("vf_user", JSON.stringify({ id, email, role: verifiedRole }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    res.cookies.set("vf_auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    res.cookies.set("vf_role", verifiedRole, { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    res.cookies.set("sb_access_token", accessToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

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
