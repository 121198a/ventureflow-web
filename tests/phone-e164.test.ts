import test from "node:test";
import assert from "node:assert/strict";
import { combineToE164, parseLocalPhone } from "../lib/countries.ts";

test("IN +91: local number only -> +918002488825", () => {
  assert.equal(combineToE164("+91", "8002488825"), "+918002488825");
});

test("IN +91: pasted +91 number is normalized without duplicating +91", () => {
  assert.equal(combineToE164("+91", "+918002488825"), "+918002488825");
  assert.equal(combineToE164("+91", "+91 80024 88825"), "+918002488825");
  assert.equal(combineToE164("+91", "918002488825"), "+918002488825");
  assert.equal(parseLocalPhone("+91", "+918002488825").local, "8002488825");
});

test("IN +91: a real local number that starts with 91 is not corrupted", () => {
  assert.equal(combineToE164("+91", "9123456789"), "+919123456789");
});

test("US +1: local number -> +1XXXXXXXXXX (and no +1+1)", () => {
  assert.equal(combineToE164("+1", "(415) 555-2671"), "+14155552671");
  assert.equal(combineToE164("+1", "+14155552671"), "+14155552671");
  assert.equal(combineToE164("+1", "14155552671"), "+14155552671");
});

test("changing country re-derives from the local number (no corruption)", () => {
  const { local } = parseLocalPhone("+91", "8002488825");
  assert.equal(combineToE164("+1", local), "+18002488825");
  assert.equal(combineToE164("+44", local), "+448002488825");
  assert.ok(!combineToE164("+1", local).includes("+91"));
});

test("pasting another country's +number reports the foreign calling code", () => {
  const r = parseLocalPhone("+91", "+14155552671");
  assert.equal(r.foreignDial, "+1");
  assert.equal(r.local, "4155552671");
  assert.equal(combineToE164("+91", "+14155552671"), "+14155552671");
});

test("UK trunk zero is dropped, Italy keeps its leading 0", () => {
  assert.equal(combineToE164("+44", "07911 123456"), "+447911123456");
  assert.equal(combineToE164("+39", "0612345678"), "+390612345678");
});

test("empty input yields empty E.164", () => {
  assert.equal(combineToE164("+91", ""), "");
  assert.equal(combineToE164("+91", "  "), "");
});
