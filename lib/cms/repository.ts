import type {
  CmsAuditLog, CmsCategory, CmsNavItem, CmsPage, CmsPageVersion, CmsRedirect,
  ContentBlock, PageStatus, SeoMetadata, SidebarConfig, NavItemInput, RedirectInput, CategoryInput,
} from "./types.ts";

export type NewPage = {
  slug: string; title: string; description?: string; category?: string;
  content: ContentBlock[]; seo?: SeoMetadata; sidebar?: SidebarConfig; status: PageStatus;
};
export type PagePatch = Partial<Omit<NewPage, "slug">> & { version?: number; publishedAt?: string | null };

export type ListPagesQuery = {
  status?: PageStatus; category?: string; search?: string;
  page: number; pageSize: number; sort: "title" | "updated" | "published";
};

/** Storage boundary. The Supabase implementation is production; the memory one exists for tests. */
export interface CmsRepository {
  findPageBySlug(slug: string, opts?: { status?: PageStatus }): Promise<CmsPage | null>;
  listPages(q: ListPagesQuery): Promise<{ items: CmsPage[]; total: number }>;
  insertPage(p: NewPage): Promise<CmsPage>;
  updatePage(id: string, patch: PagePatch): Promise<CmsPage>;
  deletePage(id: string): Promise<void>;

  insertVersion(v: Omit<CmsPageVersion, "id" | "createdAt">): Promise<CmsPageVersion>;
  listVersions(pageId: string): Promise<CmsPageVersion[]>;

  listCategories(): Promise<CmsCategory[]>;
  upsertCategory(c: CategoryInput): Promise<CmsCategory>;

  listNavigation(): Promise<CmsNavItem[]>;
  replaceNavigation(items: NavItemInput[]): Promise<CmsNavItem[]>;

  listRedirects(): Promise<CmsRedirect[]>;
  findRedirect(oldPath: string): Promise<CmsRedirect | null>;
  insertRedirect(r: RedirectInput): Promise<CmsRedirect>;
  updateRedirect(id: string, r: Partial<RedirectInput>): Promise<CmsRedirect>;

  insertAudit(a: Omit<CmsAuditLog, "id" | "createdAt">): Promise<void>;
  listAudit(entityType?: string, entityId?: string): Promise<CmsAuditLog[]>;
}
