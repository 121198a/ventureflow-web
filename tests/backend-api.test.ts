import test from "node:test";
import assert from "node:assert/strict";

const UBVERSE_API_BASE_URL = "https://development.unboundxinc.us/api";
const DEFAULT_HEADERS = {
  "api-version": "v1",
  "x-custom-lang": "en",
  "Content-Type": "application/json",
  accept: "application/json",
};

test("Live UBverse backend returns real dashboard companies and categories", async () => {
  const url = `${UBVERSE_API_BASE_URL}/ubverse-service/investor-dashboard/dashboard-without-auth`;
  const res = await fetch(url, { headers: DEFAULT_HEADERS });
  assert.equal(res.status, 200, "Backend API must respond with 200 OK");

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
});

test("Live UBverse backend returns real issuer details for real company ID", async () => {
  // First get a verified company ID
  const listUrl = `${UBVERSE_API_BASE_URL}/ubverse-service/investor-dashboard/dashboard-without-auth`;
  const listRes = await fetch(listUrl, { headers: DEFAULT_HEADERS });
  const listJson = await listRes.json();
  const companyId = listJson?.data?.[0]?.companies?.[0]?.id;

  assert.ok(companyId, "Must obtain a real company ID from live backend");

  const detailUrl = `${UBVERSE_API_BASE_URL}/ubverse-service/general/get-issuer-detail/${companyId}`;
  const detailRes = await fetch(detailUrl, { headers: DEFAULT_HEADERS });
  assert.equal(detailRes.status, 200, "Issuer detail endpoint must respond with 200 OK");

  const detailJson = await detailRes.json();
  assert.equal(detailJson.message, "Success");
  assert.ok(detailJson.data?.companyInformation, "Company information must be present");
  assert.ok(detailJson.data?.companyInformation?.companyLegalName, "Legal entity name must exist");
});
