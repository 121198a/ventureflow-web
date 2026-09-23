import { AUTH_URL, BRANCH_PAGEVIEW_URL } from "@/lib/constants";

/**
 * Authentication Redirect Contract — implements the single specified flow
 * for every CTA that means "take me to the login page":
 *
 *   1. Track the click through Branch (best-effort, fire-and-forget).
 *   2. Open the existing login route in a NEW TAB, current tab stays open.
 *   3. A Branch failure must never block or delay reaching the login page.
 *   4. Rapid/duplicate clicks must never open more than one login tab.
 *
 * `https://api2.branch.io/v1/pageview` (BRANCH_PAGEVIEW_URL) is the
 * tracking call only — it is never used as the navigation destination.
 */

// Guards against a rapid double-click opening two login tabs.
let authRedirectInFlight = false;

function trackBranchPageview() {
  // Fire-and-forget: any failure here (network, ad-blocker, CSP) must be
  // swallowed silently and must never affect the redirect in openAuth().
  if (typeof window === "undefined") return;

  // Respect user cookie consent: only track if user explicitly accepted analytics
  try {
    const consent = localStorage.getItem("ub_cookie_consent");
    if (consent !== "accepted") {
      return;
    }
  } catch {
    return;
  }

  try {
    const payload = JSON.stringify({
      event: "pageview",
      url: window.location.href,
      timestamp: Date.now(),
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const sent = navigator.sendBeacon(
        BRANCH_PAGEVIEW_URL,
        new Blob([payload], { type: "application/json" }),
      );
      if (sent) return;
    }

    fetch(BRANCH_PAGEVIEW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* analytics failure must never surface to the user */
    });
  } catch {
    /* swallow — tracking is best-effort only */
  }
}

/**
 * The ONE place that decides what happens when someone clicks a CTA that
 * should start sign-up/login — "Get started", "Start your record", "Create
 * your club's Space", "Explore UnBound X", and so on.
 *
 * Every such CTA across the app calls this instead of navigating via
 * <Link>/<TransitionLink>, so behavior (Branch tracking, new tab, no
 * duplicate tabs, single destination) only needs to be correct in one place.
 */
export function openAuth(flow: "signup" | "login" = "signup") {
  if (typeof window === "undefined") return;
  if (authRedirectInFlight) return;
  authRedirectInFlight = true;
  window.setTimeout(() => {
    authRedirectInFlight = false;
  }, 500);

  const url = AUTH_URL.startsWith("/") ? `${AUTH_URL}?flow=${flow}` : AUTH_URL;

  // Direct same-tab navigation to avoid aggressive browser popup blockers
  window.location.assign(url);

  // Branch tracking happens alongside
  trackBranchPageview();
}

/** Alias matching the Authentication Redirect Contract's handler name. */
export const handleAuthRedirect = openAuth;
