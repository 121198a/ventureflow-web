import type { CmsRepository, ListPagesQuery, NewPage, PagePatch } from "./repository.ts";
import type {
  CategoryInput, CmsAuditLog, CmsCategory, CmsNavItem, CmsPage, CmsPageVersion, CmsRedirect, NavItemInput, RedirectInput,
} from "./types.ts";

const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

/** TEST-ONLY adapter. Production content lives in the database, never in memory. */
export class MemoryCmsRepository implements CmsRepository {
  pages: CmsPage[] = [];
  versions: CmsPageVersion[] = [];
  categories: CmsCategory[] = [];
  nav: CmsNavItem[] = [];
  redirects: CmsRedirect[] = [];
  audit: CmsAuditLog[] = [];

  async findPageBySlug(slug: string, opts?: { status?: CmsPage["status"] }) {
    const hit = this.pages.find((p) => p.slug === slug && (opts?.status ? p.status === opts.status : p.status !== "archived"));
    return hit ? structuredClone(hit) : null;
  }
  async listPages(q: ListPagesQuery) {
    let rows = this.pages.filter((p) => (q.status ? p.status === q.status : true) && (q.category ? p.category === q.category : true));
    if (q.search) {
      const s = q.search.toLowerCase();
      rows = rows.filter((p) => (p.title + " " + (p.description ?? "") + " " + JSON.stringify(p.content)).toLowerCase().includes(s));
    }
    rows.sort((a, b) =>
      q.sort === "title" ? a.title.localeCompare(b.title)
      : q.sort === "published" ? (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
      : b.updatedAt.localeCompare(a.updatedAt));
    const start = (q.page - 1) * q.pageSize;
    return { items: structuredClone(rows.slice(start, start + q.pageSize)), total: rows.length };
  }
  async insertPage(p: NewPage) {
    const row: CmsPage = { id: id(), version: 1, createdAt: now(), updatedAt: now(), ...structuredClone(p) };
    this.pages.push(row);
    return structuredClone(row);
  }
  async updatePage(pid: string, patch: PagePatch) {
    const row = this.pages.find((p) => p.id === pid);
    if (!row) throw new Error("not found");
    const { publishedAt, ...rest } = patch;
    Object.assign(row, structuredClone(rest), { updatedAt: now() });
    if (publishedAt !== undefined) row.publishedAt = publishedAt ?? undefined;
    return structuredClone(row);
  }
  async deletePage(pid: string) {
    this.pages = this.pages.filter((p) => p.id !== pid);
    this.versions = this.versions.filter((v) => v.pageId !== pid);
  }
  async insertVersion(v: Omit<CmsPageVersion, "id" | "createdAt">) {
    const row = { id: id(), createdAt: now(), ...structuredClone(v) };
    this.versions.push(row);
    return structuredClone(row);
  }
  async listVersions(pageId: string) {
    return structuredClone(this.versions.filter((v) => v.pageId === pageId).sort((a, b) => b.version - a.version));
  }
  async listCategories() {
    return structuredClone([...this.categories].sort((a, b) => a.sortOrder - b.sortOrder));
  }
  async upsertCategory(c: CategoryInput) {
    const ex = this.categories.find((x) => x.slug === c.slug);
    if (ex) { Object.assign(ex, c); return structuredClone(ex); }
    const row = { id: id(), ...c };
    this.categories.push(row);
    return structuredClone(row);
  }
  async listNavigation() {
    return structuredClone([...this.nav].sort((a, b) => a.sortOrder - b.sortOrder));
  }
  async replaceNavigation(items: NavItemInput[]) {
    this.nav = items.map((i) => ({ id: id(), ...structuredClone(i) }));
    return structuredClone(this.nav);
  }
  async listRedirects() { return structuredClone(this.redirects); }
  async findRedirect(oldPath: string) {
    const r = this.redirects.find((x) => x.oldPath === oldPath && x.active);
    return r ? structuredClone(r) : null;
  }
  async insertRedirect(r: RedirectInput) {
    if (this.redirects.some((x) => x.oldPath === r.oldPath)) throw new Error("duplicate");
    const row = { id: id(), createdAt: now(), ...r };
    this.redirects.push(row);
    return structuredClone(row);
  }
  async updateRedirect(rid: string, r: Partial<RedirectInput>) {
    const row = this.redirects.find((x) => x.id === rid);
    if (!row) throw new Error("not found");
    Object.assign(row, r);
    return structuredClone(row);
  }
  async insertAudit(a: Omit<CmsAuditLog, "id" | "createdAt">) {
    this.audit.push({ id: id(), createdAt: now(), ...structuredClone(a) });
  }
  async listAudit(entityType?: string, entityId?: string) {
    return structuredClone(this.audit.filter((a) => (!entityType || a.entityType === entityType) && (!entityId || a.entityId === entityId)));
  }
}
