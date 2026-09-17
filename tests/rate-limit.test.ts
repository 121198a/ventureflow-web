import test from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, resetRateLimit, getClientIp } from "../lib/rate-limit.ts";

test("Rate limiter allows requests under the maximum limit", () => {
  const id = "test_user_under_limit";
  resetRateLimit(id);

  const res1 = checkRateLimit(id, 3, 60000);
  assert.equal(res1.allowed, true);
  assert.equal(res1.remaining, 2);

  const res2 = checkRateLimit(id, 3, 60000);
  assert.equal(res2.allowed, true);
  assert.equal(res2.remaining, 1);

  const res3 = checkRateLimit(id, 3, 60000);
  assert.equal(res3.allowed, true);
  assert.equal(res3.remaining, 0);
});

test("Rate limiter blocks requests exceeding the maximum limit", () => {
  const id = "test_user_over_limit";
  resetRateLimit(id);

  for (let i = 0; i < 3; i++) {
    checkRateLimit(id, 3, 60000);
  }

  const blocked = checkRateLimit(id, 3, 60000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfter && blocked.retryAfter > 0);
});

test("Rate limiter resets correctly when resetRateLimit is called", () => {
  const id = "test_user_reset";
  resetRateLimit(id);

  for (let i = 0; i < 3; i++) {
    checkRateLimit(id, 3, 60000);
  }

  resetRateLimit(id);
  const fresh = checkRateLimit(id, 3, 60000);
  assert.equal(fresh.allowed, true);
  assert.equal(fresh.remaining, 2);
});

test("getClientIp correctly extracts IP from various platform headers", () => {
  // Cloudflare
  const cfReq = new Request("http://localhost", {
    headers: { "cf-connecting-ip": "203.0.113.195" },
  });
  assert.equal(getClientIp(cfReq), "203.0.113.195");

  // X-Forwarded-For with multiple proxies (take first)
  const xffReq = new Request("http://localhost", {
    headers: { "x-forwarded-for": "198.51.100.1, 192.0.2.1" },
  });
  assert.equal(getClientIp(xffReq), "198.51.100.1");

  // X-Real-IP
  const realIpReq = new Request("http://localhost", {
    headers: { "x-real-ip": "192.0.2.42" },
  });
  assert.equal(getClientIp(realIpReq), "192.0.2.42");

  // Fallback to localhost
  const emptyReq = new Request("http://localhost");
  assert.equal(getClientIp(emptyReq), "127.0.0.1");
});

