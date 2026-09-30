import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CmsRepository, ListPagesQuery, NewPage, PagePatch } from "./repository.ts";
import type {
  CategoryInput, CmsAuditLog, CmsCategory, CmsNavItem, CmsPage, CmsPageVersion, CmsRedirect, NavItemInput, RedirectInput,
} from "./types.ts";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

let client: SupabaseClient | null = null;
/** Service-role client. Server only: the key must never be prefixed NEXT_PUBLIC_. */
function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("CMS database is not configured.");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

function must(res: { data: any; error: { message: string; code?: string } | null }): any {
  if (res.error) {
    const e = new Error(res.error.message) as Error & { code?: string };
    e.code = res.error.code;
    throw e;
  }
  return res.data;
}

const page = (r: Row): CmsPage => ({
  id: r.id, slug: r.slug, title: r.title, description: r.description ?? undefined, category: r.category ?? undefined,
  content: r.content ?? [], status: r.status, version: r.version, seo: r.seo ?? undefined, sidebar: r.sidebar ?? undefined,
  publishedAt: r.published_at ?? undefined, updatedAt: r.updated_at, createdAt: r.created_at,
});
const cat = (r: Row): CmsCategory => ({ id: r.id, name: r.name, slug: r.slug, description: r.description ?? undefined, sortOrder: r.sort_order, status: r.status });
const nav = (r: Row): CmsNavItem => ({
  id: r.id, label: r.label, slug: r.slug ?? undefined, href: r.href, category: r.category ?? undefined,
  parentId: r.parent_id ?? null, sortOrder: r.sort_order, visibility: r.visibility, status: r.status,
});
const redir = (r: Row): CmsRedirect => ({ id: r.id, oldPath: r.old_path, newPath: r.new_path, statusCode: r.status_code, active: r.active, createdAt: r.created_at });

const cleanSearch = (s: string) => s.replace(/[%,()*\\_"']/g, " ").trim();

export class SupabaseCmsRepository implements CmsRepository {
  async findPageBySlug(slug: string, opts?: { status?: CmsPage["status"] }) {
    let q = db().from("cms_pages").select("*").eq("slug", slug);
    q = opts?.status ? q.eq("status", opts.status) : q.neq("status", "archived");
    const r = must(await q.limit(1));
    return r?.length ? page(r[0]) : null;
  }
  async listPages(q: ListPagesQuery) {
    let query = db().from("cms_pages").select("*", { count: "exact" });
    if (q.status) query = query.eq("status", q.status);
    if (q.category) query = query.eq("category", q.category);
    if (q.search) {
      const s = cleanSearch(q.search);
      if (s) query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%`);
    }
    query = q.sort === "title" ? query.order("title") : q.sort === "published" ? query.order("published_at", { ascending: false, nullsFirst: false }) : query.order("updated_at", { ascending: false });
    const from = (q.page - 1) * q.pageSize;
    const res = await query.range(from, from + q.pageSize - 1);
    return { items: (must(res) ?? []).map(page), total: res.count ?? 0 };
  }
  async insertPage(p: NewPage) {
    const r = must(await db().from("cms_pages").insert({
      slug: p.slug, title: p.title, description: p.description ?? null, category: p.category ?? null,
      content: p.content, seo: p.seo ?? null, sidebar: p.sidebar ?? null, status: p.status,
      published_at: p.status === "published" ? new Date().toISOString() : null,
    }).select().single());
    return page(r);
  }
  async updatePage(id: string, patch: PagePatch) {
    const row: Row = { updated_at: new Date().toISOString() };
    if (patch.title !== undefined) row.title = patch.title;
    if (patch.description !== undefined) row.description = patch.description;
    if (patch.category !== undefined) row.category = patch.category;
    if (patch.content !== undefined) row.content = patch.content;
    if (patch.seo !== undefined) row.seo = patch.seo;
    if (patch.sidebar !== undefined) row.sidebar = patch.sidebar;
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.version !== undefined) row.version = patch.version;
    if (patch.publishedAt !== undefined) row.published_at = patch.publishedAt;
    return page(must(await db().from("cms_pages").update(row).eq("id", id).select().single()));
  }
  async deletePage(id: string) { must(await db().from("cms_pages").delete().eq("id", id)); }

  async insertVersion(v: Omit<CmsPageVersion, "id" | "createdAt">) {
    const r = must(await db().from("cms_page_versions").insert({
      page_id: v.pageId, version: v.version, content: v.content, metadata: v.metadata, created_by: v.createdBy,
    }).select().single());
    return { id: r.id, pageId: r.page_id, version: r.version, content: r.content, metadata: r.metadata, createdAt: r.created_at, createdBy: r.created_by };
  }
  async listVersions(pageId: string) {
    const rows = must(await db().from("cms_page_versions").select("*").eq("page_id", pageId).order("version", { ascending: false })) ?? [];
    return rows.map((r: Row) => ({ id: r.id, pageId: r.page_id, version: r.version, content: r.content, metadata: r.metadata, createdAt: r.created_at, createdBy: r.created_by }));
  }

  async listCategories() { return (must(await db().from("cms_categories").select("*").order("sort_order")) ?? []).map(cat); }
  async upsertCategory(c: CategoryInput) {
    return cat(must(await db().from("cms_categories").upsert({ name: c.name, slug: c.slug, description: c.description ?? null, sort_order: c.sortOrder, status: c.status }, { onConflict: "slug" }).select().single()));
  }

  async listNavigation() { return (must(await db().from("cms_navigation").select("*").order("sort_order")) ?? []).map(nav); }
  async replaceNavigation(items: NavItemInput[]) {
    // Remove-then-insert; nav rows have no dependants besides self-references (cascade).
    must(await db().from("cms_navigation").delete().neq("id", "00000000-0000-0000-0000-000000000000"));
    if (!items.length) return [];
    const rows = must(await db().from("cms_navigation").insert(items.map((i) => ({
      label: i.label, slug: i.slug ?? null, href: i.href, category: i.category ?? null,
      parent_id: i.parentId ?? null, sort_order: i.sortOrder, visibility: i.visibility, status: i.status,
    }))).select()) ?? [];
    return rows.map(nav);
  }

  async listRedirects() { return (must(await db().from("cms_redirects").select("*").order("created_at")) ?? []).map(redir); }
  async findRedirect(oldPath: string) {
    const r = must(await db().from("cms_redirects").select("*").eq("old_path", oldPath).eq("active", true).limit(1));
    return r?.length ? redir(r[0]) : null;
  }
  async insertRedirect(r: RedirectInput) {
    return redir(must(await db().from("cms_redirects").insert({ old_path: r.oldPath, new_path: r.newPath, status_code: r.statusCode, active: r.active }).select().single()));
  }
  async updateRedirect(id: string, r: Partial<RedirectInput>) {
    const row: Row = {};
    if (r.oldPath !== undefined) row.old_path = r.oldPath;
    if (r.newPath !== undefined) row.new_path = r.newPath;
    if (r.statusCode !== undefined) row.status_code = r.statusCode;
    if (r.active !== undefined) row.active = r.active;
    return redir(must(await db().from("cms_redirects").update(row).eq("id", id).select().single()));
  }

  async insertAudit(a: Omit<CmsAuditLog, "id" | "createdAt">) {
    must(await db().from("cms_audit_logs").insert({ action: a.action, entity_type: a.entityType, entity_id: a.entityId, actor_id: a.actorId, metadata: a.metadata }));
  }
  async listAudit(entityType?: string, entityId?: string) {
    let q = db().from("cms_audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
    if (entityType) q = q.eq("entity_type", entityType);
    if (entityId) q = q.eq("entity_id", entityId);
    return (must(await q) ?? []).map((r: Row) => ({ id: r.id, action: r.action, entityType: r.entity_type, entityId: r.entity_id, actorId: r.actor_id, metadata: r.metadata, createdAt: r.created_at }));
  }
}
