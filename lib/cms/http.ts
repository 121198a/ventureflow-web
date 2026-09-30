import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "../rate-limit";
import { CmsError } from "./service";
import { requireAdmin } from "./admin-request";
import { invalidateCms } from "./server";

const STATUS = { VALIDATION: 400, UNAUTHENTICATED: 401, FORBIDDEN: 403, NOT_FOUND: 404, CONFLICT: 409 } as const;
const headers = { "Cache-Control": "no-store" };

export const ok = (data: unknown, init?: { status?: number; cache?: string }) =>
  NextResponse.json({ success: true, data }, { status: init?.status ?? 200, headers: init?.cache ? { "Cache-Control": init.cache } : headers });

export function fail(error: unknown) {
  if (error instanceof CmsError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message, details: error.code === "VALIDATION" ? error.details : undefined } },
      { status: STATUS[error.code], headers }
    );
  }
  // Never leak database errors, stack traces or infrastructure details.
  console.error("[cms] unexpected error:", error instanceof Error ? error.name : "unknown");
  return NextResponse.json({ success: false, error: { code: "UNAVAILABLE", message: "Content service is temporarily unavailable." } }, { status: 503, headers });
}

const PUBLIC_CACHE = "public, s-maxage=300, stale-while-revalidate=600";

/** Public, read-only handler with a per-IP rate limit. */
export async function publicRoute(request: Request, fn: () => Promise<unknown>) {
  const rl = checkRateLimit(`cms:${getClientIp(request)}`, 120, 60_000);
  if (!rl.allowed) return NextResponse.json({ success: false, error: { code: "RATE_LIMITED", message: "Too many requests." } }, { status: 429, headers: { ...headers, "Retry-After": String(rl.retryAfter ?? 60) } });
  try {
    const data = await fn();
    return data === null ? fail(new CmsError("NOT_FOUND", "Page not found.")) : ok(data, { cache: PUBLIC_CACHE });
  } catch (e) { return fail(e); }
}

/** Admin-only handler: verifies the caller server-side, then invalidates caches after success. */
export async function adminRoute(request: Request, fn: (actorId: string) => Promise<unknown>, status = 200) {
  try {
    const { actorId } = await requireAdmin(request);
    const rl = checkRateLimit(`cms-admin:${actorId}`, 60, 60_000);
    if (!rl.allowed) return NextResponse.json({ success: false, error: { code: "RATE_LIMITED", message: "Too many requests." } }, { status: 429, headers });
    const data = await fn(actorId);
    invalidateCms();
    return ok(data ?? { done: true }, { status });
  } catch (e) { return fail(e); }
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    const text = await request.text();
    if (text.length > 1_000_000) throw new CmsError("VALIDATION", "Request body too large.");
    return JSON.parse(text || "null");
  } catch (e) {
    if (e instanceof CmsError) throw e;
    throw new CmsError("VALIDATION", "Request body must be valid JSON.");
  }
}
