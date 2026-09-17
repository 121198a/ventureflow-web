interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limiting map for sliding window
const attemptsMap = new Map<string, RateLimitEntry>();

// Clean up stale entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of attemptsMap.entries()) {
      if (now > entry.resetTime) {
        attemptsMap.delete(key);
      }
    }
  }, 10 * 60 * 1000);
  if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; retryAfter?: number; error?: string } {
  const now = Date.now();
  const entry = attemptsMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    attemptsMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      error: "Too many login attempts. Please try again later.",
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxAttempts - entry.count };
}

export function resetRateLimit(identifier: string) {
  attemptsMap.delete(identifier);
}

/**
 * Resolves the client IP address across diverse hosting platforms:
 * - Cloudflare (cf-connecting-ip)
 * - Vercel / Netlify / AWS ALB / Nginx (x-forwarded-for, x-real-ip)
 * - Hostinger / VPS reverse proxies
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

