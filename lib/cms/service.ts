import { z } from "zod";
import type { CmsRepository, ListPagesQuery } from "./repository.ts";
import {
  categoryInputSchema, navItemInputSchema, pageInputSchema, pageUpdateSchema, redirectInputSchema, slugSchema,
  type AuditAction, type CmsCategory, type CmsPage, type CmsRedirect, type NavGroup, type NavTreeItem, type PageStatus,
} from "./types.ts";

export class CmsError extends Error {
  code: "VALIDATION" | "CONFLICT" | "NOT_FOUND" | "FORBIDDEN" | "UNAUTHENTICATED";
  details?: unknown;
  constructor(code: CmsError["code"], message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const r = schema.safeParse(value);
  if (!r.success) {
    throw new CmsError("VALIDATION", "Invalid input.", r.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })));
  }
  return r.data;
}

export const PUBLIC_MAX_PAGE_SIZE = 50;

export type PublicPage = Omit<CmsPage, "id" | "status" | "createdAt">;
const toPublic = (p: CmsPage): PublicPage => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  category: p.category,
  content: p.content,
  version: p.version,
  seo: p.seo,
  sidebar: p.sidebar,
  publishedAt: p.publishedAt,
  updatedAt: p.updatedAt,
});

export class CmsService {
  private repo: CmsRepository;
  constructor(repo: CmsRepository) { this.repo = repo; }

  private async audit(action: AuditAction, entityType: "page" | "navigation" | "redirect" | "category", entityId: string, actorId: string, metadata: Record<string, unknown> = {}) {
    await this.repo.insertAudit({ action, entityType, entityId, actorId, metadata });
  }

  /* ---------------- public reads ---------------- */
  async getPublishedPage(slug: string): Promise<PublicPage | null> {
    if (!slugSchema.safeParse(slug).success) return null;
    const page = await this.repo.findPageBySlug(slug, { status: "published" });
    return page ? toPublic(page) : null;
  }

  async listPublished(opts: { category?: string; search?: string; page?: number; pageSize?: number; sort?: ListPagesQuery["sort"] } = {}) {
    const page = Math.max(1, Math.floor(opts.page ?? 1));
    const pageSize = Math.min(PUBLIC_MAX_PAGE_SIZE, Math.max(1, Math.floor(opts.pageSize ?? 20)));
    const category = opts.category && slugSchema.safeParse(opts.category).success ? opts.category : undefined;
    const { items, total } = await this.repo.listPages({
      status: "published", category, search: opts.search?.trim().slice(0, 100) || undefined,
      page, pageSize, sort: opts.sort ?? "title",
    });
    return { items: items.map((p) => ({ slug: p.slug, title: p.title, description: p.description, category: p.category, updatedAt: p.updatedAt })), total, page, pageSize };
  }

  async search(query: string) {
    const q = query.trim().slice(0, 100);
    if (q.length < 2) return [];
    const { items } = await this.repo.listPages({ status: "published", search: q, page: 1, pageSize: 20, sort: "title" });
    return items.map((p) => ({ slug: p.slug, title: p.title, description: p.description, category: p.category }));
  }

  async getCategories(): Promise<CmsCategory[]> {
    return (await this.repo.listCategories()).filter((c) => c.status === "active");
  }

  async getNavigation(): Promise<NavGroup[]> {
    const [cats, items] = await Promise.all([this.getCategories(), this.repo.listNavigation()]);
    const visible = items.filter((i) => i.status === "active" && i.visibility === "public");
    const byParent = new Map<string | null, typeof visible>();
    for (const i of visible) {
      const k = i.parentId ?? null;
      byParent.set(k, [...(byParent.get(k) ?? []), i]);
    }
    const build = (parent: string | null): NavTreeItem[] =>
      (byParent.get(parent) ?? []).sort((a, b) => a.sortOrder - b.sortOrder)
        .map((i) => ({ id: i.id, label: i.label, href: i.href, slug: i.slug, children: build(i.id) }));
    const groups: NavGroup[] = [];
    for (const c of cats) {
      const roots = (byParent.get(null) ?? []).filter((i) => i.category === c.slug).sort((a, b) => a.sortOrder - b.sortOrder);
      if (!roots.length) continue;
      groups.push({ category: c.slug, name: c.name, items: roots.map((i) => ({ id: i.id, label: i.label, href: i.href, slug: i.slug, children: build(i.id) })) });
    }
    return groups;
  }

  async resolveRedirect(path: string): Promise<CmsRedirect | null> {
    if (!/^\/[a-z0-9\-/_]*$/.test(path)) return null;
    return this.repo.findRedirect(path);
  }

  /* ---------------- admin ---------------- */
  async getPageForAdmin(slug: string) {
    const p = await this.repo.findPageBySlug(parse(slugSchema, slug));
    if (!p) throw new CmsError("NOT_FOUND", "Page not found.");
    return p;
  }
  async listForAdmin(q: Partial<ListPagesQuery> = {}) {
    return this.repo.listPages({ page: 1, pageSize: 100, sort: "updated", ...q });
  }

  async createPage(raw: unknown, actorId: string) {
    const input = parse(pageInputSchema, raw);
    if (await this.repo.findPageBySlug(input.slug)) throw new CmsError("CONFLICT", "A page with this slug already exists.");
    const page = await this.repo.insertPage({ ...input, status: "draft" });
    await this.snapshot(page, actorId);
    await this.audit("CREATE_PAGE", "page", page.id, actorId, { slug: page.slug, version: page.version });
    return page;
  }

  async updatePage(slug: string, raw: unknown, actorId: string) {
    const patch = parse(pageUpdateSchema, raw);
    const current = await this.getPageForAdmin(slug);
    const next = await this.repo.updatePage(current.id, { ...patch, version: current.version + 1 });
    await this.snapshot(next, actorId);
    await this.audit("UPDATE_PAGE", "page", next.id, actorId, { slug, version: next.version, fields: Object.keys(patch) });
    return next;
  }

  private async transition(slug: string, status: PageStatus, action: AuditAction, actorId: string) {
    const current = await this.getPageForAdmin(slug);
    if (status === "published" && current.content.length === 0) throw new CmsError("VALIDATION", "Cannot publish a page with no content.");
    const next = await this.repo.updatePage(current.id, {
      status,
      publishedAt: status === "published" ? (current.publishedAt ?? new Date().toISOString()) : current.publishedAt ?? null,
    });
    await this.audit(action, "page", next.id, actorId, { slug, from: current.status, to: status, version: next.version });
    return next;
  }
  publishPage(slug: string, actorId: string) { return this.transition(slug, "published", "PUBLISH_PAGE", actorId); }
  unpublishPage(slug: string, actorId: string) { return this.transition(slug, "draft", "UNPUBLISH_PAGE", actorId); }
  archivePage(slug: string, actorId: string) { return this.transition(slug, "archived", "ARCHIVE_PAGE", actorId); }

  async deletePage(slug: string, actorId: string) {
    const current = await this.getPageForAdmin(slug);
    await this.repo.deletePage(current.id);
    await this.audit("DELETE_PAGE", "page", current.id, actorId, { slug });
  }

  async getVersions(slug: string) {
    const p = await this.getPageForAdmin(slug);
    return this.repo.listVersions(p.id);
  }

  async updateNavigation(raw: unknown, actorId: string) {
    const items = parse(z.array(navItemInputSchema).max(300), raw);
    const saved = await this.repo.replaceNavigation(items);
    await this.audit("UPDATE_NAVIGATION", "navigation", "all", actorId, { count: saved.length });
    return saved;
  }

  async upsertCategory(raw: unknown, actorId: string) {
    const c = await this.repo.upsertCategory(parse(categoryInputSchema, raw));
    await this.audit("UPDATE_NAVIGATION", "category", c.id, actorId, { slug: c.slug });
    return c;
  }

  async createRedirect(raw: unknown, actorId: string) {
    const r = parse(redirectInputSchema, raw);
    const back = await this.repo.findRedirect(r.newPath);
    if (back && back.newPath === r.oldPath) throw new CmsError("VALIDATION", "This redirect would create a loop.");
    if ((await this.repo.listRedirects()).some((x) => x.oldPath === r.oldPath)) throw new CmsError("CONFLICT", "A redirect for this path already exists.");
    const saved = await this.repo.insertRedirect(r);
    await this.audit("CREATE_REDIRECT", "redirect", saved.id, actorId, { oldPath: r.oldPath, newPath: r.newPath });
    return saved;
  }
  async updateRedirect(id: string, raw: unknown, actorId: string) {
    const r = parse(redirectInputSchema.innerType().partial(), raw);
    const saved = await this.repo.updateRedirect(id, r);
    await this.audit("UPDATE_REDIRECT", "redirect", id, actorId, { fields: Object.keys(r) });
    return saved;
  }
  listRedirects() { return this.repo.listRedirects(); }

  private async snapshot(p: CmsPage, actorId: string) {
    await this.repo.insertVersion({
      pageId: p.id, version: p.version, content: p.content, createdBy: actorId,
      metadata: { title: p.title, description: p.description, category: p.category, seo: p.seo, sidebar: p.sidebar },
    });
  }
}
