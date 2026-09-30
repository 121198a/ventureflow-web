export const PRODUCT_NAME = "VentureFlow";
export const COMPANY_NAME = "Veyron X";
export const FULL_BRAND = "VentureFlow by Veyron X";
export const BRAND_TAGLINE = "Connect. Collaborate. Build.";

export const nav = [
  ["Home", "/"],
  ["Workspace", "/workspace"],
  ["About", "/about"],
] as const;


export const AUTH_URL = process.env.NEXT_PUBLIC_LOGIN_URL || "/login";
/** @deprecated use AUTH_URL — kept so any missed reference still resolves. */
export const LOGIN_URL = AUTH_URL;

export const ANALYTICS_PAGEVIEW_URL =
  process.env.NEXT_PUBLIC_ANALYTICS_PAGEVIEW_URL || "";


export const WORKSPACE_API_BASE_URL =
  process.env.NEXT_PUBLIC_WORKSPACE_API_URL ||
  "https://api.ventureflow.example/api";

export const WORKSPACE_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_WORKSPACE_DASHBOARD_URL ||
  `${WORKSPACE_API_BASE_URL}/workspace-service/investor-dashboard/dashboard-without-auth`;

export const TERMS_URL = "/legal/terms-condition";
export const PRIVACY_URL = "/legal/privacy-policy";


export const WORKSPACE_APP_URL =
  process.env.NEXT_PUBLIC_WORKSPACE_APP_URL || "";
export const WORKSPACE_SERVICES_URL = `${WORKSPACE_APP_URL}/services`;

/** VXverse and workspace compatibility aliases */
export const VXVERSE_SERVICES_URL = WORKSPACE_SERVICES_URL;
export const VXVERSE_API_BASE_URL = WORKSPACE_API_BASE_URL;


export const socialLinks = {
  x: process.env.NEXT_PUBLIC_SOCIAL_X || "",
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "",
} as const;

export const site = {
  name: PRODUCT_NAME,
  company: COMPANY_NAME,
  fullBrand: FULL_BRAND,
  brandLine: BRAND_TAGLINE,
  tagline: "Startup–Investor Workspace",
  description:
    "VentureFlow by Veyron X is a startup–investor workspace for discovery, collaboration, introductions, documents and relationship management.",
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
  return "https://www.ventureflow.example";
}

export const SITE_URL = resolveSiteUrl();

export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "/";
