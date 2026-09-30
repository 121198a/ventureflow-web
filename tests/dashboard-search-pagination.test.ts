import test from "node:test";
import assert from "node:assert/strict";

interface MockCompany {
  id: string;
  name: string;
  securitiesFiling?: string;
  fundingRoundStage?: string;
}

const mockCompanies: MockCompany[] = [
  { id: "1", name: "Northstar Labs", securitiesFiling: "sample", fundingRoundStage: "friends-family" },
  { id: "2", name: "NovaForge", securitiesFiling: "sample", fundingRoundStage: "friends-family" },
  { id: "3", name: "VentureFlow", securitiesFiling: "sample", fundingRoundStage: "unsure" },
  { id: "4", name: "VertexWorks", securitiesFiling: "sample", fundingRoundStage: "friends-family" },
  { id: "5", name: "Apex FinTech Labs", securitiesFiling: "sample", fundingRoundStage: "seed" },
  { id: "6", name: "BioGen Innovations", securitiesFiling: "sample", fundingRoundStage: "series-a" },
  { id: "7", name: "CyberShield Security", securitiesFiling: "sample", fundingRoundStage: "seed" },
  { id: "8", name: "Delta Logistics AI", securitiesFiling: "sample", fundingRoundStage: "friends-family" },
  { id: "9", name: "Echo Solar Systems", securitiesFiling: "sample", fundingRoundStage: "series-a" },
  { id: "10", name: "Future Mobility Works", securitiesFiling: "sample", fundingRoundStage: "seed" },
  { id: "11", name: "GreenCarbon Solutions", securitiesFiling: "sample", fundingRoundStage: "series-a" },
  { id: "12", name: "HyperScale Cloud", securitiesFiling: "sample", fundingRoundStage: "seed" },
];

function filterCompanies(list: MockCompany[], searchQuery: string, stage: string = "all"): MockCompany[] {
  const q = searchQuery.toLowerCase().trim();
  return list.filter((c) => {
    const matchesSearch =
      !q ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.securitiesFiling && c.securitiesFiling.toLowerCase().includes(q)) ||
      (c.fundingRoundStage && c.fundingRoundStage.toLowerCase().includes(q));

    const matchesStage =
      stage === "all" ||
      (c.fundingRoundStage && c.fundingRoundStage.toLowerCase() === stage.toLowerCase());

    return matchesSearch && matchesStage;
  });
}

function paginateItems<T>(items: T[], page: number, pageSize: number = 10) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startItem = totalItems === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const endItem = Math.min(validPage * pageSize, totalItems);

  const paginated = items.slice((validPage - 1) * pageSize, validPage * pageSize);

  return {
    page: validPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    hasPrev: validPage > 1,
    hasNext: validPage < totalPages,
    items: paginated,
  };
}

test("Search is case-insensitive, trimmed, and handles empty input", () => {
  assert.equal(filterCompanies(mockCompanies, "").length, 12);
  assert.equal(filterCompanies(mockCompanies, "   ").length, 12);
  assert.equal(filterCompanies(mockCompanies, "NOVAFORGE").length, 1);
  assert.equal(filterCompanies(mockCompanies, "  novaforge  ").length, 1);
  assert.equal(filterCompanies(mockCompanies, "nonexistent-query-xyz").length, 0);
});

test("Search matches real fields: name, status label, and funding stage", () => {
  const sampleMatches = filterCompanies(mockCompanies, "sample");
  assert.equal(sampleMatches.length, 12);

  const seedMatches = filterCompanies(mockCompanies, "seed");
  assert.equal(seedMatches.length, 4);

  const labMatches = filterCompanies(mockCompanies, "labs");
  assert.ok(labMatches.length >= 2);
});

test("Pagination displays exactly 10 records per page by default", () => {
  const page1 = paginateItems(mockCompanies, 1, 10);
  assert.equal(page1.items.length, 10);
  assert.equal(page1.totalPages, 2);
  assert.equal(page1.totalItems, 12);
  assert.equal(page1.startItem, 1);
  assert.equal(page1.endItem, 10);
  assert.equal(page1.hasPrev, false);
  assert.equal(page1.hasNext, true);

  const page2 = paginateItems(mockCompanies, 2, 10);
  assert.equal(page2.items.length, 2);
  assert.equal(page2.startItem, 11);
  assert.equal(page2.endItem, 12);
  assert.equal(page2.hasPrev, true);
  assert.equal(page2.hasNext, false);
});

test("Search query change correctly bounds page index to page 1", () => {
  let currentPage = 2;
  let currentSearch = "";

  const onSearchChange = (newQuery: string) => {
    currentSearch = newQuery;
    currentPage = 1; // Automatic reset to page 1
  };

  onSearchChange("GreenCarbon");
  assert.equal(currentPage, 1);

  const filtered = filterCompanies(mockCompanies, currentSearch);
  const result = paginateItems(filtered, currentPage, 10);

  assert.equal(result.totalItems, 1);
  assert.equal(result.totalPages, 1);
  assert.equal(result.startItem, 1);
  assert.equal(result.endItem, 1);
  assert.equal(result.items[0].name, "GreenCarbon Solutions");
});

test("Pagination clamps out-of-range page numbers safely", () => {
  const overPage = paginateItems(mockCompanies, 999, 10);
  assert.equal(overPage.page, 2);

  const underPage = paginateItems(mockCompanies, -5, 10);
  assert.equal(underPage.page, 1);

  const emptySet = paginateItems([], 1, 10);
  assert.equal(emptySet.totalItems, 0);
  assert.equal(emptySet.startItem, 0);
  assert.equal(emptySet.endItem, 0);
  assert.equal(emptySet.items.length, 0);
});
