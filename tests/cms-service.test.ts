import { test } from "node:test";
import assert from "node:assert/strict";
import { CmsService, CmsError } from "../lib/cms/service.ts";
import { MemoryCmsRepository } from "../lib/cms/memory-repository.ts";
import { isAdminUser, extractBearer } from "../lib/cms/admin-auth.ts";
import { seedPages } from "../data/cms-seed/pages.ts";
import { seedCategories, seedNavigation, seedRedirects } from "../data/cms-seed/structure.ts";
import { pageInputSchema } from "../lib/cms/types.ts";

const fresh = () => { const repo = new MemoryCmsRepository(); return { repo, cms: new CmsService(repo) }; };
const page = (over = {}) => ({ slug: "sample-page", title: "Sample", content: [{ type: "paragraph" as const, text: "Hello" }], ...over });
const rejects = (p: Promise<unknown>, code: string) => assert.rejects(p, (e: unknown) => e instanceof CmsError && e.code === code);

test("slug validation rejects unsafe and non-kebab slugs", async () => {
  const { cms } = fresh();
  for (const slug of ["Bad Slug", "UPPER", "a/b", "../x", "a_b", "-x", "x-", "", "x".repeat(97)]) {
    await rejects(cms.createPage(page({ slug }), "a1"), "VALIDATION");
  }
});

test("content blocks and links are validated", () => {
  assert.equal(pageInputSchema.safeParse(page({ content: [{ type: "link", label: "x", href: "javascript:alert(1)" }] })).success, false);
  assert.equal(pageInputSchema.safeParse(page({ content: [{ type: "link", label: "x", href: "//evil.example" }] })).success, false);
  assert.equal(pageInputSchema.safeParse(page({ content: [{ type: "link", label: "x", href: "/legal/support" }] })).success, true);
  assert.equal(pageInputSchema.safeParse(page({ content: [{ type: "heading", level: 4, text: "x" }] })).success, false);
});

test("create -> draft is not public; publish makes it public; unpublish hides it", async () => {
  const { cms } = fresh();
  await cms.createPage(page(), "admin-1");
  assert.equal(await cms.getPublishedPage("sample-page"), null);
  await cms.publishPage("sample-page", "admin-1");
  const pub = await cms.getPublishedPage("sample-page");
  assert.equal(pub?.title, "Sample");
  assert.ok(pub && !("status" in pub) && !("id" in pub), "public shape hides internal fields");
  await cms.unpublishPage("sample-page", "admin-1");
  assert.equal(await cms.getPublishedPage("sample-page"), null);
});

test("duplicate active slug is rejected; archived slug can be reused", async () => {
  const { cms } = fresh();
  await cms.createPage(page(), "a");
  await rejects(cms.createPage(page(), "a"), "CONFLICT");
  await cms.archivePage("sample-page", "a");
  assert.equal(await cms.getPublishedPage("sample-page"), null);
  await cms.createPage(page({ title: "Second" }), "a");
});

test("updates create new versions and keep history", async () => {
  const { cms } = fresh();
  await cms.createPage(page(), "a");
  await cms.updatePage("sample-page", { title: "V2" }, "a");
  const u = await cms.updatePage("sample-page", { content: [{ type: "paragraph", text: "V3 text" }] }, "b");
  assert.equal(u.version, 3);
  const versions = await cms.getVersions("sample-page");
  assert.deepEqual(versions.map((v) => v.version), [3, 2, 1]);
  assert.equal(versions[2].content[0].type, "paragraph");
  assert.equal(versions[1].metadata.title, "V2");
});

test("cannot publish an empty page", async () => {
  const { cms } = fresh();
  await cms.createPage(page({ content: [] }), "a");
  await rejects(cms.publishPage("sample-page", "a"), "VALIDATION");
});

test("every mutation writes an audit log with the actor and no content bodies", async () => {
  const { cms, repo } = fresh();
  await cms.createPage(page(), "actor-9");
  await cms.updatePage("sample-page", { title: "T" }, "actor-9");
  await cms.publishPage("sample-page", "actor-9");
  await cms.unpublishPage("sample-page", "actor-9");
  await cms.archivePage("sample-page", "actor-9");
  await cms.createPage(page({ slug: "other" }), "actor-9");
  await cms.deletePage("other", "actor-9");
  await cms.updateNavigation([], "actor-9");
  await cms.createRedirect({ oldPath: "/legal/a", newPath: "/legal/b" }, "actor-9");
  const actions = repo.audit.map((a) => a.action);
  for (const a of ["CREATE_PAGE", "UPDATE_PAGE", "PUBLISH_PAGE", "UNPUBLISH_PAGE", "ARCHIVE_PAGE", "DELETE_PAGE", "UPDATE_NAVIGATION", "CREATE_REDIRECT"]) assert.ok(actions.includes(a as never), a);
  assert.ok(repo.audit.every((x) => x.actorId === "actor-9"));
  assert.ok(!JSON.stringify(repo.audit).includes("Hello"));
});

test("public list paginates, filters by category, caps page size and searches", async () => {
  const { cms } = fresh();
  for (let i = 0; i < 5; i++) {
    await cms.createPage(page({ slug: `page-${i}`, title: `Doc ${i}`, category: i % 2 ? "legal" : "support" }), "a");
    await cms.publishPage(`page-${i}`, "a");
  }
  await cms.createPage(page({ slug: "hidden-draft", title: "Draft only" }), "a");
  const l = await cms.listPublished({ pageSize: 2, page: 2 });
  assert.equal(l.total, 5); assert.equal(l.items.length, 2);
  assert.equal((await cms.listPublished({ category: "legal" })).total, 2);
  assert.equal((await cms.listPublished({ pageSize: 9999 })).pageSize, 50);
  assert.equal((await cms.search("Draft only")).length, 0);
  assert.equal((await cms.search("doc 3")).length, 1);
  assert.equal((await cms.search("d")).length, 0);
});

test("navigation is built from data, grouped by active categories, nested and ordered", async () => {
  const { cms, repo } = fresh();
  for (const c of seedCategories) await cms.upsertCategory(c, "s");
  await cms.upsertCategory({ name: "Hidden", slug: "hidden", sortOrder: 1, status: "hidden" }, "s");
  await cms.updateNavigation(seedNavigation, "s");
  const nav = await cms.getNavigation();
  assert.deepEqual(nav.map((g) => g.category), ["legal", "community", "support"]);
  assert.equal(nav[0].items[0].href, "/legal/terms-condition");
  assert.ok(repo.nav.every((n) => n.href.startsWith("/legal/")));
});

test("redirects: resolve, reject loops/duplicates/unsafe paths", async () => {
  const { cms } = fresh();
  await cms.createRedirect({ oldPath: "/legal/old", newPath: "/legal/new", statusCode: 301 }, "a");
  assert.equal((await cms.resolveRedirect("/legal/old"))?.newPath, "/legal/new");
  assert.equal(await cms.resolveRedirect("/legal/none"), null);
  await rejects(cms.createRedirect({ oldPath: "/legal/new", newPath: "/legal/old" }, "a"), "VALIDATION");
  await rejects(cms.createRedirect({ oldPath: "/legal/old", newPath: "/legal/x" }, "a"), "CONFLICT");
  await rejects(cms.createRedirect({ oldPath: "//evil.example", newPath: "/legal/x" }, "a"), "VALIDATION");
  await rejects(cms.createRedirect({ oldPath: "/a", newPath: "/a" }, "a"), "VALIDATION");
});

test("admin check trusts only app_metadata.role; user_metadata and body claims are ignored", () => {
  assert.equal(isAdminUser({ id: "u1", app_metadata: { role: "admin" } }), true);
  assert.equal(isAdminUser({ id: "u1", app_metadata: { role: "ADMIN" } }), true);
  assert.equal(isAdminUser({ id: "u1", app_metadata: { role: "founder" } }), false);
  assert.equal(isAdminUser({ id: "u1", app_metadata: {}, ...{ user_metadata: { role: "admin" } } } as never), false);
  assert.equal(isAdminUser({ app_metadata: { role: "admin" } }), false, "needs an id");
  assert.equal(isAdminUser(null), false);
  assert.equal(extractBearer("Bearer short"), null);
  assert.equal(extractBearer(null), null);
  assert.equal(extractBearer("Bearer " + "a".repeat(40)), "a".repeat(40));
});

test("seed content is valid, brand-safe and free of regulated / previous-company claims", async () => {
  const { cms } = fresh();
  const banned = /finra|sipc|broker-?dealer|brokerage|reg(ulation)?\s?(cf|a\+?|d)\b|marv|alpaca|unbound|ubverse|clearing|custody|securities|sec-registered|awasthi/i;
  const slugs = new Set<string>();
  for (const pg of seedPages) {
    assert.equal(pageInputSchema.safeParse(pg).success, true, pg.slug);
    assert.ok(!slugs.has(pg.slug)); slugs.add(pg.slug);
    assert.ok(!banned.test(JSON.stringify(pg)), `banned term in ${pg.slug}`);
    await cms.createPage(pg, "seed");
    await cms.publishPage(pg.slug, "seed");
  }
  for (const n of seedNavigation) assert.ok(slugs.has(n.slug!), `nav points to missing page ${n.slug}`);
  for (const r of seedRedirects) assert.ok(!banned.test(r.newPath));
  for (const r of seedRedirects) {
    const target = r.newPath.replace("/legal/", "");
    assert.ok(slugs.has(target), `redirect target missing: ${r.newPath}`);
  }
});
test("Legal CMS: Hybrid repository resolves all published legal pages directly", async () => {
  const { HybridCmsRepository } = await import("../lib/cms/hybrid-repository.ts");
  const repo = new HybridCmsRepository(new MemoryCmsRepository());
  const cms = new CmsService(repo);

  // 1. Terms & Conditions
  const terms = await cms.getPublishedPage("terms-condition");
  assert.ok(terms, "terms-condition must exist");
  assert.equal(terms?.title, "Terms of Use");
  assert.ok(terms?.content.length && terms.content.length > 0, "terms must have content blocks");

  // 2. Privacy Policy
  const privacy = await cms.getPublishedPage("privacy-policy");
  assert.ok(privacy, "privacy-policy must exist");
  assert.equal(privacy?.title, "Privacy Policy");
  assert.ok(privacy?.content.length && privacy.content.length > 0, "privacy must have content blocks");

  // 3. Cookie Policy
  const cookie = await cms.getPublishedPage("cookie-policy");
  assert.ok(cookie, "cookie-policy must exist");
  assert.equal(cookie?.title, "Cookie Policy");

  // 4. Acceptable Use
  const acceptable = await cms.getPublishedPage("acceptable-use");
  assert.ok(acceptable, "acceptable-use must exist");
  assert.equal(acceptable?.title, "Acceptable Use Policy");

  // 5. Workspace Disclaimer
  const disclaimer = await cms.getPublishedPage("workspace-disclaimer-for-ventureflow");
  assert.ok(disclaimer, "workspace-disclaimer-for-ventureflow must exist");
  assert.equal(disclaimer?.title, "Workspace Disclaimer");

  // 6. Redirects
  const redirTerms = await cms.resolveRedirect("/legal/terms-and-conditions");
  assert.equal(redirTerms?.newPath, "/legal/terms-condition");

  const redirPrivacy = await cms.resolveRedirect("/legal/privacy");
  assert.equal(redirPrivacy?.newPath, "/legal/privacy-policy");

  const redirDisclaimers = await cms.resolveRedirect("/legal/investment-disclaimers");
  assert.equal(redirDisclaimers?.newPath, "/legal/workspace-disclaimer-for-ventureflow");

  // 7. Non-existent page returns null (for 404)
  const nonExistent = await cms.getPublishedPage("non-existent-legal-doc");
  assert.equal(nonExistent, null);

  // 8. Invalid slug returns null
  const invalidSlug = await cms.getPublishedPage("INVALID/SLUG..!");
  assert.equal(invalidSlug, null);
});