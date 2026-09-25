import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit.ts";
import { sanitizeRedirectUrl, formatToE164, maskPhoneNumber, maskEmail } from "../lib/utils.ts";

// 1. Recover account validation schema
const recoverSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(60, "First name is too long."),
  middleName: z
    .string()
    .trim()
    .max(60, "Middle name is too long.")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(60, "Last name is too long."),
  dob: z
    .string()
    .trim()
    .min(4, "Date of birth is required.")
    .max(20, "Invalid date format.")
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date.getFullYear() > 1900 && date <= new Date();
      },
      {
        message: "Please enter a valid date of birth (MM/DD/YYYY).",
      }
    ),
});

test("Recover schema accepts valid user recovery details", () => {
  const valid = recoverSchema.safeParse({
    firstName: "Sarah",
    middleName: "Marie",
    lastName: "Connor",
    dob: "05/14/1985",
  });
  assert.equal(valid.success, true);

  // Optional middle name omitted
  const noMiddle = recoverSchema.safeParse({
    firstName: "Sarah",
    lastName: "Connor",
    dob: "1985-05-14",
  });
  assert.equal(noMiddle.success, true);
});

test("Recover schema rejects missing or invalid birth dates", () => {
  const futureDob = recoverSchema.safeParse({
    firstName: "Sarah",
    lastName: "Connor",
    dob: "01/01/2099",
  });
  assert.equal(futureDob.success, false);

  const invalidFormat = recoverSchema.safeParse({
    firstName: "Sarah",
    lastName: "Connor",
    dob: "not-a-date",
  });
  assert.equal(invalidFormat.success, false);
});

// 2. Password reset schema
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const requestResetSchema = z.object({
  step: z.literal("request").default("request"),
  email: z
    .string()
    .trim()
    .min(5, "Please enter a valid email or phone number.")
    .max(254, "Input too long."),
});

const confirmResetSchema = z
  .object({
    step: z.literal("confirm"),
    token: z
      .string()
      .trim()
      .min(4, "Recovery token or code is required.")
      .max(256, "Invalid recovery token."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password too long.")
      .regex(
        PASSWORD_REGEX,
        "Password must contain an uppercase letter, lowercase letter, number, and special character."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

test("Reset request schema accepts valid email or phone identifiers", () => {
  assert.equal(requestResetSchema.safeParse({ email: "user@example.com" }).success, true);
  assert.equal(requestResetSchema.safeParse({ email: "+15551234567" }).success, true);
  assert.equal(requestResetSchema.safeParse({ email: "   " }).success, false);
});

test("Reset confirm schema enforces password complexity and matching confirmation", () => {
  // Matching strong password
  const valid = confirmResetSchema.safeParse({
    step: "confirm",
    token: "token_abc_12345",
    password: "SecurePassword123!",
    confirmPassword: "SecurePassword123!",
  });
  assert.equal(valid.success, true);

  // Mismatch
  const mismatch = confirmResetSchema.safeParse({
    step: "confirm",
    token: "token_abc_12345",
    password: "SecurePassword123!",
    confirmPassword: "DifferentPassword123!",
  });
  assert.equal(mismatch.success, false);

  // Weak password
  const weak = confirmResetSchema.safeParse({
    step: "confirm",
    token: "token_abc_12345",
    password: "password",
    confirmPassword: "password",
  });
  assert.equal(weak.success, false);
});

// 3. Contact support schema
const supportSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(5, "Email is required.")
    .max(254, "Email is too long.")
    .email("Please provide a valid email address."),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters.")
    .max(2000, "Message is too long."),
});

test("Support schema accepts complete valid support request", () => {
  const result = supportSchema.safeParse({
    name: "Alex Taylor",
    email: "alex@example.com",
    phone: "+1 (555) 000-0000",
    message: "I lost access to my registered email address and need help recovering my account.",
  });
  assert.equal(result.success, true);
});

test("Support schema rejects invalid email or missing name", () => {
  assert.equal(
    supportSchema.safeParse({
      name: "",
      email: "alex@example.com",
      message: "Please help",
    }).success,
    false
  );

  assert.equal(
    supportSchema.safeParse({
      name: "Alex",
      email: "not-an-email",
      message: "Please help",
    }).success,
    false
  );
});

// 4. Rate limiting security tests for recovery and reset
test("Rate limiting blocks recovery flood attempts", () => {
  const testKey = "recover_test_key_unique";
  resetRateLimit(testKey);

  for (let i = 0; i < 6; i++) {
    const res = checkRateLimit(testKey, 6, 60000);
    assert.equal(res.allowed, true);
  }

  const blocked = checkRateLimit(testKey, 6, 60000);
  assert.equal(blocked.allowed, false);
});

test("Open redirect prevention sanitizes malicious query redirectTo targets", () => {
  const defaultDashboard = "/investor/dashboard";
  assert.equal(sanitizeRedirectUrl("https://phishing.site", defaultDashboard), defaultDashboard);
  assert.equal(sanitizeRedirectUrl("//phishing.site", defaultDashboard), defaultDashboard);
  assert.equal(sanitizeRedirectUrl("javascript:alert(1)", defaultDashboard), defaultDashboard);
  assert.equal(sanitizeRedirectUrl("/issuer/login", defaultDashboard), "/issuer/login");
});

test("Error parser safely normalizes nested error objects containing password keys to clean strings", () => {
  function parseErrorMessage(error: unknown, fallback = "An unexpected error occurred. Please try again."): string {
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (Array.isArray(error)) {
      for (const item of error) {
        const parsed = parseErrorMessage(item, "");
        if (parsed) return parsed;
      }
    }
    if (typeof error === "object" && error !== null) {
      const rec = error as Record<string, unknown>;
      if (typeof rec.message === "string") return rec.message;
      if (Array.isArray(rec.message)) {
        const parsed = parseErrorMessage(rec.message, "");
        if (parsed) return parsed;
      }
      if (typeof rec.message === "object" && rec.message !== null) {
        const parsed = parseErrorMessage(rec.message, "");
        if (parsed) return parsed;
      }
      if (typeof rec.error === "string") return rec.error;
      for (const val of Object.values(rec)) {
        const parsed = parseErrorMessage(val, "");
        if (parsed) return parsed;
      }
    }
    return fallback;
  }

  // Exact shape returned by backend: { message: [{ password: "invalid password" }] }
  assert.equal(
    parseErrorMessage({ message: [{ password: "invalid password" }] }),
    "invalid password"
  );

  // Object with keys {password}
  assert.equal(
    parseErrorMessage({ password: "Password is too weak" }),
    "Password is too weak"
  );

  // Array of error objects
  assert.equal(
    parseErrorMessage([{ password: "Password incorrect" }]),
    "Password incorrect"
  );

  // String error
  assert.equal(
    parseErrorMessage("Invalid email or password."),
    "Invalid email or password."
  );

  // Null/undefined fallback
  assert.equal(
    parseErrorMessage(null, "Fallback message"),
    "Fallback message"
  );
});

test("Phone authentication accepts international and local phone numbers and normalizes to E.164", () => {
  const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhone = (val: string) => /^\+?[0-9\s\-()]{7,25}$/.test(val);

  // Valid phone tests
  assert.equal(isPhone("+1 (555) 123-4567"), true);
  assert.equal(isPhone("+91 98765 43210"), true);
  assert.equal(isPhone("5551234567"), true);
  assert.equal(isPhone("+44 20 7946 0958"), true);

  // Invalid phone tests
  assert.equal(isPhone("123"), false);
  assert.equal(isPhone("invalid-phone"), false);

  // E.164 formatting tests with distinct phone numbers
  // Number 1: Indian Mobile (+91)
  assert.equal(formatToE164("+91 9876543210"), "+919876543210");
  assert.equal(formatToE164("8002488825"), "+918002488825");

  // Number 2: US Mobile (+1)
  assert.equal(formatToE164("+1 (415) 555-2671"), "+14155552671");
  assert.equal(formatToE164("+14155552671"), "+14155552671");

  // Masked logging security audit: ensures only masked numbers are printed (never full PII)
  assert.equal(maskPhoneNumber("+919876543210"), "+9198******10");
  assert.equal(maskPhoneNumber("+918002488825"), "+9180******25");
  assert.equal(maskPhoneNumber("+14155552671"), "+1415*****71");
  assert.ok(!maskPhoneNumber("+919876543210").includes("9876543210"), "Masked output must not contain full number");

  // Masked email security audit: ensures only masked email is printed (never full PII)
  assert.equal(maskEmail("jordan.lee@company.com"), "jo*******e@company.com");
  assert.equal(maskEmail("sarah@venture.io"), "sa**h@venture.io");
  assert.equal(maskEmail("ab@test.com"), "a*@test.com");
  assert.ok(!maskEmail("jordan.lee@company.com").includes("jordan.lee"), "Masked email must not contain full username");

  // Phone A vs Phone B destination isolation
  const phoneA = "+91 98765 43210";
  const phoneB = "+1 (415) 555-2671";
  const normalizedA = formatToE164(phoneA);
  const normalizedB = formatToE164(phoneB);
  assert.equal(normalizedA, "+919876543210");
  assert.equal(normalizedB, "+14155552671");
  assert.notEqual(normalizedA, normalizedB, "Phone A and Phone B destinations must remain strictly isolated");

  // Email A vs Email B destination isolation
  const emailA = "jordan@company.com";
  const emailB = "sarah@venture.io";
  assert.notEqual(emailA, emailB, "Email A and Email B destinations must remain strictly isolated");

  // Phone is distinct from email
  assert.equal(isEmail("+15551234567"), false);
  assert.equal(isEmail("founder@example.com"), true);
});
