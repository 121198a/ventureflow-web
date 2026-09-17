import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  fetchIssuerDetail,
  fetchDashboardCompanies,
  type BackendIssuerDetailData,
  type BackendCompanySummary,
} from "@/lib/ubverse-api";
import { verifySessionToken } from "@/lib/crypto";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.replace(/^Bearer\s+/i, "").trim();
    const sbAccessToken = bearerToken || cookieStore.get("sb_access_token")?.value;
    const vfToken = cookieStore.get("vf_token")?.value;
    const vfAuth = cookieStore.get("vf_auth")?.value;

    let isAuthenticated = false;
    let verifiedRole: string | null = null;

    // 1. Verify cryptographic HMAC session token first
    if (vfToken) {
      const verified = await verifySessionToken<{ role?: string; email?: string }>(vfToken);
      if (verified?.role) {
        isAuthenticated = true;
        verifiedRole = verified.role.toLowerCase();
      }
    }

    // 2. Fallback to Supabase token verification
    if (!isAuthenticated && sbAccessToken && isSupabaseConfigured()) {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        const { data } = await supabase.auth.getUser(sbAccessToken);
        if (data?.user) {
          isAuthenticated = true;
          verifiedRole =
            ((data.user.user_metadata?.role as string) ||
              (data.user.app_metadata?.role as string) ||
              "")
              .toLowerCase() || null;
        }
      } catch {
        // Token invalid
      }
    }

    // 3. Fallback to vf_auth cookie for local sessions
    if (!isAuthenticated && vfAuth === "1") {
      isAuthenticated = true;
      const rawRole = cookieStore.get("vf_role")?.value?.toLowerCase();
      if (rawRole) verifiedRole = rawRole;
    }

    // Enforce authentication
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Authentication required to access founder dashboard." },
        { status: 401 }
      );
    }

    // Enforce role authorization (Block cross-role access)
    if (verifiedRole && verifiedRole !== "founder" && verifiedRole !== "issuer") {
      return NextResponse.json(
        { success: false, error: "Access forbidden: Founder/Issuer role required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    const availableCompanies: BackendCompanySummary[] = await fetchDashboardCompanies();

    let issuerDetail: BackendIssuerDetailData | null = null;

    if (companyId) {
      issuerDetail = await fetchIssuerDetail(companyId);
    } else if (availableCompanies.length > 0) {
      // Look for Unbound X or primary company if companyId omitted
      const defaultCompany =
        availableCompanies.find((c) => c.name.toLowerCase().includes("unbound")) ||
        availableCompanies[0];

      if (defaultCompany?.id) {
        issuerDetail = await fetchIssuerDetail(defaultCompany.id);
      }
    }

    return NextResponse.json({
      success: true,
      hasCompany: Boolean(issuerDetail),
      issuerDetail,
      availableCompanies,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Founder Dashboard API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve founder deal data from backend service.",
        hasCompany: false,
        issuerDetail: null,
        availableCompanies: [],
      },
      { status: 500 }
    );
  }
}
