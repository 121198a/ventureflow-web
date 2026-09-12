import test from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit.ts";

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
