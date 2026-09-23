import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit.ts";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Invalid credentials")
    .max(254, "Invalid credentials")
    .email("Invalid credentials"),
  password: z
    .string()
    .min(1, "Invalid credentials")
    .max(128, "Invalid credentials"),
  role: z.enum(["founder", "investor"]).default("founder"),
});

const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(5, "Invalid email address")
      .max(254, "Invalid email address")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().optional(),
    role: z.enum(["founder", "investor"]).default("founder"),
    agreed: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to proceed" }),
    }),
  })
  .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

test("Login schema accepts valid founder credentials", () => {
  const result = loginSchema.safeParse({
    email: "founder@ventureflow.io",
    password: "CorrectPassword123!",
    role: "founder",
  });
  assert.equal(result.success, true);
});

test("Login schema rejects invalid emails", () => {
  const result = loginSchema.safeParse({
    email: "not-an-email",
    password: "Password123!",
    role: "founder",
  });
  assert.equal(result.success, false);
});

test("Login schema rejects empty passwords", () => {
  const result = loginSchema.safeParse({
    email: "founder@ventureflow.io",
    password: "",
    role: "founder",
  });
  assert.equal(result.success, false);
});

test("Signup schema enforces complexity and terms agreement", () => {
  const weak = signupSchema.safeParse({
    email: "founder@ventureflow.io",
    password: "weak",
    agreed: true,
    role: "founder",
  });
  assert.equal(weak.success, false);

  const missingAgreement = signupSchema.safeParse({
    email: "founder@ventureflow.io",
    password: "StrongPassword123!",
    agreed: false,
    role: "founder",
  });
  assert.equal(missingAgreement.success, false);

  const valid = signupSchema.safeParse({
    email: "founder@ventureflow.io",
    password: "StrongPassword123!",
    confirmPassword: "StrongPassword123!",
    agreed: true,
    role: "founder",
  });
  assert.equal(valid.success, true);
});

test("Sanitization cleans malicious script tags from email input", () => {
  const dirty = "test<script>alert(1)</script>@domain.com";
  const clean = sanitizeHtml(dirty.trim());
  assert.equal(clean.includes("<script>"), false);
});

test("Auth rate limiting protects endpoints under repeated attempts", () => {
  const ip = "auth_test_ip_unique";
  resetRateLimit(ip);

  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(ip, 5, 60000);
    assert.equal(res.allowed, true);
  }

  const blocked = checkRateLimit(ip, 5, 60000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
});

test("Open redirect prevention sanitizes and validates redirect destinations", async () => {
  const { sanitizeRedirectUrl } = await import("../lib/utils.ts");

  // Valid internal paths
  assert.equal(sanitizeRedirectUrl("/investor/dashboard"), "/investor/dashboard");
  assert.equal(sanitizeRedirectUrl("/founder/dashboard?query=1"), "/founder/dashboard?query=1");
  assert.equal(sanitizeRedirectUrl("/login"), "/login");

  // Malicious / external / protocol-relative targets rejected and fallback returned
  assert.equal(sanitizeRedirectUrl("https://evil.com"), "/");
  assert.equal(sanitizeRedirectUrl("http://evil.com"), "/");
  assert.equal(sanitizeRedirectUrl("//evil.com"), "/");
  assert.equal(sanitizeRedirectUrl("/\\evil.com"), "/");
  assert.equal(sanitizeRedirectUrl("/javascript:alert(1)"), "/");
  assert.equal(sanitizeRedirectUrl("data:text/html,<script>alert(1)</script>"), "/");
  assert.equal(sanitizeRedirectUrl("/%2f/evil.com"), "/");
  assert.equal(sanitizeRedirectUrl(""), "/");
  assert.equal(sanitizeRedirectUrl(null), "/");
  assert.equal(sanitizeRedirectUrl(undefined), "/");

  // Custom fallback respected
  assert.equal(sanitizeRedirectUrl("//evil.com", "/investor/dashboard"), "/investor/dashboard");
});
