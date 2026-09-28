import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/crypto";
import { getSupabaseConfig } from "@/lib/supabase/client";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isInvestorDashboard = pathname.startsWith("/investor/dashboard");
  const isFounderDashboard = pathname.startsWith("/founder/dashboard");

  if (!isInvestorDashboard && !isFounderDashboard) {
    return NextResponse.next();
  }

  const vfToken = request.cookies.get("vf_token")?.value;
  const sbAccessToken = request.cookies.get("sb_access_token")?.value;

  let verifiedRole: string | null = null;
  let isAuthenticated = false;

  // 1. Verify cryptographic HMAC session token first
  if (vfToken) {
    const verified = await verifySessionToken<{ role?: string; email?: string }>(vfToken);
    if (verified?.role) {
      isAuthenticated = true;
      verifiedRole = verified.role.toLowerCase();
    }
  }

  // 2. Fall back to verifying a Supabase access token directly against the
  // Supabase Auth REST API (fetch-based, so it works fine on the Edge
  // runtime). We ask Supabase itself who this token belongs to — we never
  // trust a locally-set cookie's claimed role/identity.
  // SECURITY: we deliberately do NOT trust a bare "vf_auth=1"/"vf_role"
  // cookie here — those cookies are unsigned and trivially forgeable via
  // devtools (Application -> Cookies), so they must never be treated as
  // proof of authentication or role.
  if (!isAuthenticated && sbAccessToken) {
    const config = getSupabaseConfig();
    if (config) {
      try {
        const res = await fetch(`${config.url}/auth/v1/user`, {
          headers: {
            apikey: config.key,
            Authorization: `Bearer ${sbAccessToken}`,
          },
        });
        if (res.ok) {
          const user = await res.json();
          isAuthenticated = true;
          const rawRole =
            (user?.user_metadata?.role as string | undefined) ||
            (user?.app_metadata?.role as string | undefined);
          if (rawRole) verifiedRole = rawRole.toLowerCase();
        }
      } catch {
        // Network/verification failure -> treat as unauthenticated (fail closed)
      }
    }
  }

  // 3. Unauthenticated users -> redirect to respective login
  if (!isAuthenticated) {
    const fullTarget = pathname + search;
    if (isInvestorDashboard) {
      const loginUrl = new URL("/investor/login", request.url);
      loginUrl.searchParams.set("redirectTo", fullTarget);
      return NextResponse.redirect(loginUrl);
    }
    if (isFounderDashboard) {
      const loginUrl = new URL("/issuer/login", request.url);
      loginUrl.searchParams.set("redirectTo", fullTarget);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Cross-role protection: Investor attempting Founder dashboard
  if (isFounderDashboard && verifiedRole === "investor") {
    const forbiddenUrl = new URL("/forbidden", request.url);
    return NextResponse.rewrite(forbiddenUrl, { status: 403 });
  }

  // 5. Cross-role protection: Founder/Issuer attempting Investor dashboard
  if (isInvestorDashboard && (verifiedRole === "founder" || verifiedRole === "issuer")) {
    const forbiddenUrl = new URL("/forbidden", request.url);
    return NextResponse.rewrite(forbiddenUrl, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/investor/dashboard/:path*",
    "/investor/dashboard",
    "/founder/dashboard/:path*",
    "/founder/dashboard",
  ],
};
