export const nav = [
  ["Home", "/"],
  ["UBverse", "/ubverse"],
  ["About", "/about"],
] as const;


export const AUTH_URL = process.env.NEXT_PUBLIC_LOGIN_URL || "/login";
/** @deprecated use AUTH_URL — kept so any missed reference still resolves. */
export const LOGIN_URL = AUTH_URL;

export const BRANCH_PAGEVIEW_URL =
  process.env.NEXT_PUBLIC_BRANCH_PAGEVIEW_URL || "https://api2.branch.io/v1/pageview";


export const UBVERSE_API_BASE_URL =
  process.env.NEXT_PUBLIC_UBVERSE_API_URL ||
  "https://development.unboundxinc.us/api";

export const UBVERSE_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_UBVERSE_DASHBOARD_URL ||
  `${UBVERSE_API_BASE_URL}/ubverse-service/investor-dashboard/dashboard-without-auth`;

export const TERMS_URL = "/legal/terms-condition";
export const PRIVACY_URL = "/legal/privacy-policy";


export const UBVERSE_APP_URL =
  process.env.NEXT_PUBLIC_UBVERSE_APP_URL || "";
export const UBVERSE_SERVICES_URL = `${UBVERSE_APP_URL}/services`;


export const socialLinks = {
  x: "https://x.com/UnBoundXapp",
  facebook: "https://www.facebook.com/profile.php?id=61579660851897",
  instagram: "https://www.instagram.com/unboundx.co/",
  linkedin: "https://www.linkedin.com/company/unboundx/",
} as const;

export const site = {
  name: "UnBound X",
  brandLine: "Formulate. Verify. Execute.",
  tagline: "The verifiable record-keeping layer for investment ideas.",
  description:
    "UnBound X turns market theses into immutable, verifiable track records. Set targets, specify horizons, and build audited credibility as outcomes unfold.",
};

function resolveSiteUrl(): string {
  // 1. Explicitly configured site URL (production custom domain or staging override)
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  // 2. Vercel deployment environment variables (available in production and preview builds)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  // 3. Fallback for local development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // 4. Default production canonical domain
  return "https://www.unboundxinc.com";
}

export const SITE_URL = resolveSiteUrl();

export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "/";
