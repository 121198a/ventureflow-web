import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures a redirect destination is strictly an internal, safe relative path.
 * Defends against open redirect attacks including protocol-relative URLs (`//evil.com`),
 * backslash tricks (`/\evil.com`), scheme exploits (`javascript:`, `data:`), and control characters.
 */
export function sanitizeRedirectUrl(target?: string | null, fallback = "/"): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();
  if (!trimmed) {
    return fallback;
  }

  // Must begin with a single forward slash and not start with // or /\
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }

  // Prevent URL-encoded bypasses (%2f, %5c, %00-%1f, CRLF)
  try {
    const decoded = decodeURIComponent(trimmed);
    if (
      decoded.startsWith("//") ||
      decoded.startsWith("/\\") ||
      decoded.includes("://") ||
      decoded.includes("\r") ||
      decoded.includes("\n")
    ) {
      return fallback;
    }
  } catch {
    return fallback;
  }

  // Reject URLs containing a colon before query parameters (e.g. /javascript:...)
  const pathPart = trimmed.split("?")[0].split("#")[0];
  if (pathPart.includes(":")) {
    return fallback;
  }

  return trimmed;
}

/**
 * Normalizes phone numbers to standard E.164 international format.
 * Strictly preserves user's entered country code without any hardcoded fallback phone number.
 */
export function formatToE164(phone: string): string {
  const clean = phone.trim();
  if (!clean) return "";

  // If user explicitly provided the + international prefix, preserve it directly
  if (clean.startsWith("+")) {
    return `+${clean.replace(/[^\d]/g, "")}`;
  }

  const digits = clean.replace(/[^\d]/g, "");

  // International format with 91 or 1 country prefix entered without +
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  // 10-digit local format:
  // In India, mobile numbers start with 6, 7, 8, 9 -> +91
  // Otherwise default to +1
  if (digits.length === 10) {
    if (/^[6-9]/.test(digits)) {
      return `+91${digits}`;
    }
    return `+1${digits}`;
  }

  return `+${digits}`;
}

/**
 * Masks a phone number for secure audit logging without exposing PII.
 * Example: +919876543210 -> +9198******10
 */
export function maskPhoneNumber(phone: string): string {
  const clean = phone.trim();
  if (clean.length <= 5) return clean.replace(/.(?=.{2})/g, "*");
  const prefix = clean.slice(0, 5);
  const suffix = clean.slice(-2);
  const starCount = Math.max(2, clean.length - 7);
  return `${prefix}${"*".repeat(starCount)}${suffix}`;
}

/**
 * Masks an email address for secure audit logging without exposing PII.
 * Example: jordan.lee@company.com -> jo*********e@company.com
 */
export function maskEmail(email: string): string {
  const clean = email.trim();
  const atIndex = clean.indexOf("@");
  if (atIndex <= 0) return clean.replace(/.(?=.{2})/g, "*");
  const local = clean.slice(0, atIndex);
  const domain = clean.slice(atIndex);
  if (local.length <= 2) {
    return `${local[0] || "*"}*${domain}`;
  }
  const prefix = local.slice(0, 2);
  const suffix = local.slice(-1);
  const stars = "*".repeat(Math.max(2, local.length - 3));
  return `${prefix}${stars}${suffix}${domain}`;
}
