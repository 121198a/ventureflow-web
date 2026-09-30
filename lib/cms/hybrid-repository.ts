import type { CmsRepository, ListPagesQuery, NewPage, PagePatch } from "./repository.ts";
import type {
  CategoryInput,
  CmsAuditLog,
  CmsCategory,
  CmsNavItem,
  CmsPage,
  CmsPageVersion,
  CmsRedirect,
  NavItemInput,
  PageStatus,
  RedirectInput,
} from "./types.ts";
import { MemoryCmsRepository } from "./memory-repository.ts";
import { seedCategories, seedNavigation, seedRedirects } from "../../data/cms-seed/structure.ts";
import { seedPages } from "../../data/cms-seed/pages.ts";

function createFallbackStore(): MemoryCmsRepository {
  const store = new MemoryCmsRepository();
  const timestamp = "2026-01-01T00:00:00.000Z";

  // Pre-populate seed categories
  store.categories = seedCategories.map((c) => ({
    id: `seed-cat-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sortOrder,
    status: c.status,
  }));

  // Pre-populate seed navigation
  store.nav = seedNavigation.map((n) => ({
    id: `seed-nav-${n.slug || n.href.replace(/[^a-z0-9]/gi, "-")}`,
    label: n.label,
    slug: n.slug,
    href: n.href,
    category: n.category,
    parentId: n.parentId ?? null,
    sortOrder: n.sortOrder,
    visibility: n.visibility ?? "public",
    status: n.status ?? "active",
  }));

  // Pre-populate seed pages as published
  store.pages = seedPages.map((p) => ({
    id: `seed-page-${p.slug}`,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    content: p.content,
    seo: p.seo,
    sidebar: p.sidebar,
    status: "published" as PageStatus,
    version: 1,
    publishedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  // Pre-populate seed redirects
  store.redirects = seedRedirects.map((r) => ({
    id: `seed-redir-${r.oldPath.replace(/[^a-z0-9]/gi, "-")}`,
    oldPath: r.oldPath,
    newPath: r.newPath,
    statusCode: r.statusCode ?? 301,
    active: r.active ?? true,
    createdAt: timestamp,
  }));

  return store;
}

/**
 * Hybrid CMS repository that gracefully uses Supabase as authoritative when available
 * and falls back to pre-seeded static content when database is not configured or unseeded.
 */
export class HybridCmsRepository implements CmsRepository {
  private primary: CmsRepository;
  private fallback: MemoryCmsRepository;

  constructor(primary: CmsRepository, fallback?: MemoryCmsRepository) {
    this.primary = primary;
    this.fallback = fallback ?? createFallbackStore();
  }

  private hasSupabase(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async findPageBySlug(slug: string, opts?: { status?: PageStatus }): Promise<CmsPage | null> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.findPageBySlug(slug, opts);
        if (fromDb) return fromDb;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[CMS] Primary DB lookup failed for "${slug}", using fallback:`, err);
        }
      }
    }
    return this.fallback.findPageBySlug(slug, opts);
  }

  async listPages(q: ListPagesQuery): Promise<{ items: CmsPage[]; total: number }> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.listPages(q);
        if (fromDb.items.length > 0) return fromDb;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[CMS] Primary DB listPages failed, using fallback:", err);
        }
      }
    }
    return this.fallback.listPages(q);
  }

  async insertPage(p: NewPage): Promise<CmsPage> {
    if (this.hasSupabase()) {
      try {
        return await this.primary.insertPage(p);
      } catch (err) {
        console.error("[CMS] Primary DB insertPage failed, storing in fallback:", err);
      }
    }
    return this.fallback.insertPage(p);
  }

  async updatePage(id: string, patch: PagePatch): Promise<CmsPage> {
    if (this.hasSupabase()) {
      try {
        return await this.primary.updatePage(id, patch);
      } catch (err) {
        console.error("[CMS] Primary DB updatePage failed:", err);
      }
    }
    return this.fallback.updatePage(id, patch);
  }

  async deletePage(id: string): Promise<void> {
    if (this.hasSupabase()) {
      try {
        await this.primary.deletePage(id);
        return;
      } catch (err) {
        console.error("[CMS] Primary DB deletePage failed:", err);
      }
    }
    return this.fallback.deletePage(id);
  }

  async insertVersion(v: Omit<CmsPageVersion, "id" | "createdAt">): Promise<CmsPageVersion> {
    if (this.hasSupabase()) {
      try {
        return await this.primary.insertVersion(v);
      } catch (err) {
        console.error("[CMS] Primary DB insertVersion failed:", err);
      }
    }
    return this.fallback.insertVersion(v);
  }

  async listVersions(pageId: string): Promise<CmsPageVersion[]> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.listVersions(pageId);
        if (fromDb.length > 0) return fromDb;
      } catch (err) {
        console.warn("[CMS] Primary DB listVersions failed:", err);
      }
    }
    return this.fallback.listVersions(pageId);
  }

  async listCategories(): Promise<CmsCategory[]> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.listCategories();
        if (fromDb.length > 0) return fromDb;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[CMS] Primary DB listCategories failed, using fallback:", err);
        }
      }
    }
    return this.fallback.listCategories();
  }

  async upsertCategory(c: CategoryInput): Promise<CmsCategory> {
    if (this.hasSupabase()) {
      try {
        return await this.primary.upsertCategory(c);
      } catch (err) {
        console.error("[CMS] Primary DB upsertCategory failed:", err);
      }
    }
    return this.fallback.upsertCategory(c);
  }

  async listNavigation(): Promise<CmsNavItem[]> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.listNavigation();
        if (fromDb.length > 0) return fromDb;
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[CMS] Primary DB listNavigation failed, using fallback:", err);
        }
      }
    }
    return this.fallback.listNavigation();
  }

  async replaceNavigation(items: NavItemInput[]): Promise<CmsNavItem[]> {
    if (this.hasSupabase()) {
      try {
        return await this.primary.replaceNavigation(items);
      } catch (err) {
        console.error("[CMS] Primary DB replaceNavigation failed:", err);
      }
    }
    return this.fallback.replaceNavigation(items);
  }

  async listRedirects(): Promise<CmsRedirect[]> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.listRedirects();
        if (fromDb.length > 0) return fromDb;
      } catch (err) {
        console.warn("[CMS] Primary DB listRedirects failed:", err);
      }
    }
    return this.fallback.listRedirects();
  }

  async findRedirect(oldPath: string): Promise<CmsRedirect | null> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.findRedirect(oldPath);
        if (fromDb) return fromDb;
      } catch (err) {
        console.warn(`[CMS] Primary DB findRedirect failed for "${oldPath}":`, err);
      }
    }
    return this.fallback.findRedirect(oldPath);
  }

  async insertRedirect(r: RedirectInput): Promise<CmsRedirect> {
    if (this.hasSupabase()) {
      try {
        return await this.primary.insertRedirect(r);
      } catch (err) {
        console.error("[CMS] Primary DB insertRedirect failed:", err);
      }
    }
    return this.fallback.insertRedirect(r);
  }

  async updateRedirect(id: string, r: Partial<RedirectInput>): Promise<CmsRedirect> {
    if (this.hasSupabase()) {
      try {
        return await this.primary.updateRedirect(id, r);
      } catch (err) {
        console.error("[CMS] Primary DB updateRedirect failed:", err);
      }
    }
    return this.fallback.updateRedirect(id, r);
  }

  async insertAudit(a: Omit<CmsAuditLog, "id" | "createdAt">): Promise<void> {
    if (this.hasSupabase()) {
      try {
        await this.primary.insertAudit(a);
        return;
      } catch (err) {
        console.error("[CMS] Primary DB insertAudit failed:", err);
      }
    }
    return this.fallback.insertAudit(a);
  }

  async listAudit(entityType?: string, entityId?: string): Promise<CmsAuditLog[]> {
    if (this.hasSupabase()) {
      try {
        const fromDb = await this.primary.listAudit(entityType, entityId);
        if (fromDb.length > 0) return fromDb;
      } catch (err) {
        console.warn("[CMS] Primary DB listAudit failed:", err);
      }
    }
    return this.fallback.listAudit(entityType, entityId);
  }
}
