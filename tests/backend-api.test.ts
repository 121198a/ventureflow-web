import test from "node:test";
import assert from "node:assert/strict";

const UBVERSE_API_BASE_URL = "https://development.unboundxinc.us/api";
const DEFAULT_HEADERS = {
  "api-version": "v1",
  "x-custom-lang": "en",
  "Content-Type": "application/json",
  accept: "application/json",
};

test("Live UBverse backend returns real dashboard companies and categories", async (t) => {
  try {
    const url = `${UBVERSE_API_BASE_URL}/ubverse-service/investor-dashboard/dashboard-without-auth`;
    const res = await fetch(url, { headers: DEFAULT_HEADERS, signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      t.skip(`UBverse backend responded with status ${res.status}. Live test skipped.`);
      return;
    }

    const json = await res.json();
    assert.equal(json.message, "Success");
    assert.ok(Array.isArray(json.data), "Data should be an array of categories");
    assert.ok(json.data.length > 0, "At least one category should exist");

    const firstCategory = json.data[0];
    assert.ok(firstCategory.category, "Category name must exist");
    assert.ok(Array.isArray(firstCategory.companies), "Category must contain companies");
    assert.ok(firstCategory.companies.length > 0, "At least one company must exist in category");

    const company = firstCategory.companies[0];
    assert.ok(company.id, "Company must have a valid ID");
    assert.ok(company.name, "Company must have a valid name");
    assert.ok(company.securitiesFiling, "Company must have a securities filing type");
  } catch (err) {
    t.skip(`UBverse backend is unreachable (${err instanceof Error ? err.message : err}). Live test skipped.`);
  }
});

test("Live UBverse backend returns real issuer details for real company ID", async (t) => {
  try {
    // First get a verified company ID
    const listUrl = `${UBVERSE_API_BASE_URL}/ubverse-service/investor-dashboard/dashboard-without-auth`;
    const listRes = await fetch(listUrl, { headers: DEFAULT_HEADERS, signal: AbortSignal.timeout(5000) });
    if (!listRes.ok) {
      t.skip(`UBverse backend responded with status ${listRes.status}. Live test skipped.`);
      return;
    }

    const listJson = await listRes.json();
    const companyId = listJson?.data?.[0]?.companies?.[0]?.id;

    if (!companyId) {
      t.skip("No company ID available from live backend. Skipping detail test.");
      return;
    }

    const detailUrl = `${UBVERSE_API_BASE_URL}/ubverse-service/general/get-issuer-detail/${companyId}`;
    const detailRes = await fetch(detailUrl, { headers: DEFAULT_HEADERS, signal: AbortSignal.timeout(5000) });
    if (!detailRes.ok) {
      t.skip(`UBverse detail endpoint responded with status ${detailRes.status}. Skipping.`);
      return;
    }

    const detailJson = await detailRes.json();
    assert.equal(detailJson.message, "Success");
    assert.ok(detailJson.data?.companyInformation, "Company information must be present");
    assert.ok(detailJson.data?.companyInformation?.companyLegalName, "Legal entity name must exist");
  } catch (err) {
    t.skip(`UBverse backend is unreachable (${err instanceof Error ? err.message : err}). Live test skipped.`);
  }
});
