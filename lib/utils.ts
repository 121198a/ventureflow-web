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
