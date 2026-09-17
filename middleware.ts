import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/crypto";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isInvestorDashboard = pathname.startsWith("/investor/dashboard");
  const isFounderDashboard = pathname.startsWith("/founder/dashboard");

  if (!isInvestorDashboard && !isFounderDashboard) {
    return NextResponse.next();
  }

  const vfToken = request.cookies.get("vf_token")?.value;
  const sbAccessToken = request.cookies.get("sb_access_token")?.value;
  const vfAuth = request.cookies.get("vf_auth")?.value;

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

  // 2. Check Supabase access token or vf_auth fallback
  if (!isAuthenticated) {
    if (sbAccessToken || vfAuth === "1") {
      isAuthenticated = true;
      const rawRole = request.cookies.get("vf_role")?.value?.toLowerCase();
      if (rawRole) verifiedRole = rawRole;
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
