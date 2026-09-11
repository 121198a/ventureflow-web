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


export const UBVERSE_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_UBVERSE_DASHBOARD_URL ||
  "https://development.unboundxinc.us/api/ubverse-service/investor-dashboard/dashboard-without-auth";

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
  brandLine: "Connect. Share. Invest.",
  tagline: "Become someone worth listening to.",
  description:
    "Post an investment idea and let the market track it. UnBound X turns social investing claims into a public, verifiable record - target, horizon, and outcome, hit or miss.",
};


export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://unboundx.example").replace(/\/$/, "");

export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "/";
