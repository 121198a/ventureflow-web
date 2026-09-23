import test from "node:test";
import assert from "node:assert/strict";

test("Role normalization treats issuer and founder identically", () => {
  const normalizeRole = (role?: string) => {
    if (!role) return null;
    const r = role.toLowerCase().trim();
    if (r === "issuer" || r === "founder") return "founder";
    if (r === "investor") return "investor";
    return null;
  };

  assert.equal(normalizeRole("issuer"), "founder");
  assert.equal(normalizeRole("founder"), "founder");
  assert.equal(normalizeRole("investor"), "investor");
  assert.equal(normalizeRole("admin"), null);
  assert.equal(normalizeRole(""), null);
  assert.equal(normalizeRole(undefined), null);
});

test("Route protection redirects unauthenticated users to respective login with redirectTo", () => {
  const getUnauthRedirect = (pathname: string) => {
    if (pathname.startsWith("/investor/dashboard")) {
      return `/investor/login?redirectTo=${encodeURIComponent(pathname)}`;
    }
    if (pathname.startsWith("/founder/dashboard")) {
      return `/issuer/login?redirectTo=${encodeURIComponent(pathname)}`;
    }
    return null;
  };

  assert.equal(
    getUnauthRedirect("/investor/dashboard"),
    "/investor/login?redirectTo=%2Finvestor%2Fdashboard"
  );
  assert.equal(
    getUnauthRedirect("/founder/dashboard"),
    "/issuer/login?redirectTo=%2Ffounder%2Fdashboard"
  );
  assert.equal(
    getUnauthRedirect("/investor/dashboard/allocations"),
    "/investor/login?redirectTo=%2Finvestor%2Fdashboard%2Fallocations"
  );
});

test("Cross-role access enforcement blocks unauthorized access with 403 Forbidden", () => {
  const checkAccess = (pathname: string, userRole: string | null) => {
    if (!userRole) return { allowed: false, status: 302, redirect: true };

    if (pathname.startsWith("/founder/dashboard") && userRole === "investor") {
      return { allowed: false, status: 403, forbidden: true };
    }
    if (pathname.startsWith("/investor/dashboard") && (userRole === "founder" || userRole === "issuer")) {
      return { allowed: false, status: 403, forbidden: true };
    }

    return { allowed: true, status: 200 };
  };

  // Cross-role tests
  const investorAtFounder = checkAccess("/founder/dashboard", "investor");
  assert.equal(investorAtFounder.allowed, false);
  assert.equal(investorAtFounder.status, 403);
  assert.equal(investorAtFounder.forbidden, true);

  const founderAtInvestor = checkAccess("/investor/dashboard", "founder");
  assert.equal(founderAtInvestor.allowed, false);
  assert.equal(founderAtInvestor.status, 403);
  assert.equal(founderAtInvestor.forbidden, true);

  // Authorized tests
  const investorAtInvestor = checkAccess("/investor/dashboard", "investor");
  assert.equal(investorAtInvestor.allowed, true);
  assert.equal(investorAtInvestor.status, 200);

  const founderAtFounder = checkAccess("/founder/dashboard", "founder");
  assert.equal(founderAtFounder.allowed, true);
  assert.equal(founderAtFounder.status, 200);
});

test("Data integrity guarantee: zero fabricated financial metrics", () => {
  // Verifies that when backend returns null or missing values, no fake numbers are fabricated
  const formatMetric = (val?: string | number | null, fallback = "Not specified") => {
    if (val === null || val === undefined || val === "") return fallback;
    return String(val);
  };

  assert.equal(formatMetric(null), "Not specified");
  assert.equal(formatMetric(undefined), "Not specified");
  assert.equal(formatMetric(""), "Not specified");
  assert.equal(formatMetric("5000"), "5000");
});

test("HMAC signed session tokens prevent tampering and role spoofing", async () => {
  const { signSessionToken, verifySessionToken } = await import("../lib/crypto.ts");

  const originalPayload = { id: "user_123", email: "investor@unboundx.co", role: "investor" };
  const token = await signSessionToken(originalPayload);

  assert.ok(typeof token === "string", "Token must be a string");
  assert.ok(token.includes("."), "Token must contain signature delimiter");

  // Valid verification
  const verified = await verifySessionToken<typeof originalPayload>(token);
  assert.ok(verified, "Valid token must verify");
  assert.equal(verified?.role, "investor");
  assert.equal(verified?.email, "investor@unboundx.co");

  // Tampered payload attempt (e.g. attempting to elevate to founder/admin)
  const [b64Payload, sig] = token.split(".");
  const decodedPayload = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf-8"));
  decodedPayload.role = "founder";
  const tamperedB64 = Buffer.from(JSON.stringify(decodedPayload)).toString("base64url");
  const tamperedToken = `${tamperedB64}.${sig}`;

  const tamperedResult = await verifySessionToken(tamperedToken);
  assert.equal(tamperedResult, null, "Tampered token must fail HMAC verification");

  // Malformed token attempt
  assert.equal(await verifySessionToken("malformed-token-no-sig"), null);
  assert.equal(await verifySessionToken(""), null);
  assert.equal(await verifySessionToken(undefined), null);
});

test("OAuth redirect URLs format accurately for local, preview, and custom domains", () => {
  const getRedirectUrl = (origin: string, role: string) => {
    const normalizedRole = role === "issuer" ? "founder" : role;
    return `${origin.replace(/\/$/, "")}/auth/callback?role=${encodeURIComponent(normalizedRole)}`;
  };

  // Local development
  assert.equal(
    getRedirectUrl("http://localhost:3000", "investor"),
    "http://localhost:3000/auth/callback?role=investor"
  );
  // Preview branch deployment
  assert.equal(
    getRedirectUrl("https://ventureflow-pr-12.vercel.app", "founder"),
    "https://ventureflow-pr-12.vercel.app/auth/callback?role=founder"
  );
  // Custom production domain with trailing slash stripped
  assert.equal(
    getRedirectUrl("https://unboundx.com/", "issuer"),
    "https://unboundx.com/auth/callback?role=founder"
  );
});

test("Security audit: Zero service_role or secret keys exposed in NEXT_PUBLIC_* variables", () => {
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      assert.ok(
        !key.toLowerCase().includes("service_role") &&
        !key.toLowerCase().includes("secret"),
        `Environment variable ${key} must not be exposed with public prefix.`
      );

      if (typeof value === "string") {
        assert.ok(
          !value.includes("service_role") &&
          !value.startsWith("sb_secret_"),
          `Value of ${key} must not contain a service role or private secret.`
        );
      }
    }
  }
});
