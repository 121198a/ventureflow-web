import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { sanitizeRedirectUrl, formatToE164 } from "../lib/utils.ts";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit.ts";

test("Security: sanitizeRedirectUrl blocks malicious protocol, bypass and CRLF targets", () => {
  const fallback = "/investor/dashboard";
  
  // Protocol-relative and backslash bypasses
  assert.equal(sanitizeRedirectUrl("//evil.com", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("/\\evil.com", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("/%5Cevil.com", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("//attacker.org/steal", fallback), fallback);

  // Full absolute URLs
  assert.equal(sanitizeRedirectUrl("https://evil.com/phish", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("http://attacker.com", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("javascript:alert(1)", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("/javascript:alert(1)", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("data:text/html,<script>", fallback), fallback);

  // CRLF injection attempts
  assert.equal(sanitizeRedirectUrl("/dashboard\r\nSet-Cookie:bad=1", fallback), fallback);
  assert.equal(sanitizeRedirectUrl("/dashboard\nLocation:evil.com", fallback), fallback);

  // Valid internal paths
  assert.equal(sanitizeRedirectUrl("/platform", fallback), "/platform");
  assert.equal(sanitizeRedirectUrl("/investor/dashboard?tab=theses", fallback), "/investor/dashboard?tab=theses");
  assert.equal(sanitizeRedirectUrl("/blog/architecture-of-a-verified-thesis", fallback), "/blog/architecture-of-a-verified-thesis");
});

test("Security: No sensitive credentials or private keys exposed in NEXT_PUBLIC_* variables", () => {
  function walkDir(dir: string): string[] {
    let files: string[] = [];
    for (const item of fs.readdirSync(dir)) {
      if (["node_modules", ".next", ".git"].includes(item)) continue;
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) files = files.concat(walkDir(full));
      else if (full.endsWith(".ts") || full.endsWith(".tsx") || full.endsWith(".js") || full.endsWith(".mjs")) {
        files.push(full);
      }
    }
    return files;
  }

  const codeFiles = walkDir(".");
  const exposed: { file: string; match: string }[] = [];

  for (const file of codeFiles) {
    const content = fs.readFileSync(file, "utf8");
    const matches = content.match(/NEXT_PUBLIC_[A-Z0-9_]*(?:SECRET|SERVICE_ROLE|PRIVATE|PASSWORD)[A-Z0-9_]*/gi);
    if (matches) {
      matches.forEach(m => exposed.push({ file, match: m }));
    }
  }

  assert.equal(exposed.length, 0, `Found client-exposed secret keys: ${JSON.stringify(exposed)}`);
});

test("A11y & Structure: app/layout.tsx provides an accessible Skip Link targeting #main-content", () => {
  const layoutContent = fs.readFileSync(path.join("app", "layout.tsx"), "utf8");
  assert.match(layoutContent, /href="#main-content"/, "Skip link targeting #main-content must exist in root layout");
  assert.match(layoutContent, /Skip to main content/, "Skip link text must be present for assistive technology");
  assert.match(layoutContent, /focus:not-sr-only/, "Skip link must be visibly highlighted when keyboard focused");
});

test("A11y: ThesisJourney and TradeCompete maintain valid sequential heading hierarchy", () => {
  const thesisContent = fs.readFileSync(path.join("components", "sections", "ThesisJourney.tsx"), "utf8");
  assert.doesNotMatch(
    thesisContent,
    /<h4[^>]*>[\s\S]*?The Monopoly Tax/,
    "ThesisJourney must not skip heading levels (The Monopoly Tax must be h3, not h4)"
  );
  assert.match(
    thesisContent,
    /<h3[^>]*>[\s\S]*?The Monopoly Tax/,
    "The Monopoly Tax thesis card must be rendered with an h3 heading"
  );

  const tradeContent = fs.readFileSync(path.join("components", "sections", "TradeCompete.tsx"), "utf8");
  assert.match(
    tradeContent,
    /<h2[^>]*>[\s\S]*?Keep notes next to the conversation/,
    "TradeCompete primary section title must be h2"
  );
  assert.match(
    tradeContent,
    /<h2[^>]*>[\s\S]*?Save the startups you want to follow/,
    "TradeCompete secondary section title must be h2"
  );
});

test("SEO & Security: Authenticated and sensitive error routes disallow crawler indexing", () => {
  const forbiddenContent = fs.readFileSync(path.join("app", "forbidden.tsx"), "utf8");
  assert.match(forbiddenContent, /index:\s*false/, "Forbidden error page must be noindex");

  const notFoundContent = fs.readFileSync(path.join("app", "not-found.tsx"), "utf8");
  assert.match(notFoundContent, /index:\s*false/, "Not found error page must be noindex");

  const unauthContent = fs.readFileSync(path.join("app", "unauthorized.tsx"), "utf8");
  assert.match(unauthContent, /index:\s*false/, "Unauthorized error page must be noindex");

  const founderLoginContent = fs.readFileSync(path.join("app", "(platform)", "founder", "login", "page.tsx"), "utf8");
  assert.match(founderLoginContent, /index:\s*false/, "Founder login page must be noindex in metadata");

  const investorLoginContent = fs.readFileSync(path.join("app", "(platform)", "investor", "login", "page.tsx"), "utf8");
  assert.match(investorLoginContent, /index:\s*false/, "Investor login page must be noindex in metadata");
});

test("Security: Rate limiter protects critical submission endpoints under repeated flood attempts", () => {
  const testIp = `test_security_check_${Date.now()}`;
  resetRateLimit(testIp);

  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testIp, 5, 60000);
    assert.equal(res.allowed, true, `Attempt ${i + 1} should be permitted`);
  }

  // 6th attempt must be rejected
  const blockedRes = checkRateLimit(testIp, 5, 60000);
  assert.equal(blockedRes.allowed, false, "Flood attempt beyond limit must be blocked");
  assert.ok(blockedRes.retryAfter && blockedRes.retryAfter > 0, "Blocked attempt must return a retryAfter duration");

  resetRateLimit(testIp);
});

test("E.164: Phone input format accurately handles international country codes", () => {
  // Direct + international
  assert.equal(formatToE164("+44 7911 123456"), "+447911123456");
  assert.equal(formatToE164("+1 (555) 234-5678"), "+15552345678");

  // Local 10-digit Indian mobile starting with 9
  assert.equal(formatToE164("9876543210"), "+919876543210");

  // Local 10-digit US starting with 2-5
  assert.equal(formatToE164("4155552671"), "+14155552671");

  // Empty string fails safely
  assert.equal(formatToE164(""), "");
});
