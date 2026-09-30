import { z } from "zod";

/** Slug rules: lowercase kebab-case, no spaces, no unsafe characters. */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugSchema = z
  .string()
  .min(1)
  .max(96)
  .regex(SLUG_REGEX, "Slug must be lowercase kebab-case (a-z, 0-9, hyphens).");

/** Only same-site paths, mailto: and https: links are allowed inside CMS content. */
const safeHref = z
  .string()
  .min(1)
  .max(500)
  .refine(
    (v) => /^\/(?!\/)[^\s]*$/.test(v) || /^https:\/\/[^\s]+$/.test(v) || /^mailto:[^\s]+$/.test(v),
    "Links must be a site path, an https:// URL or a mailto: address."
  );

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), level: z.union([z.literal(1), z.literal(2), z.literal(3)]), text: z.string().min(1).max(300) }),
  z.object({ type: z.literal("paragraph"), text: z.string().min(1).max(5000) }),
  z.object({ type: z.literal("list"), ordered: z.boolean().optional(), items: z.array(z.string().min(1).max(1000)).min(1).max(100) }),
  z.object({
    type: z.literal("table"),
    columns: z.array(z.string().min(1).max(200)).min(1).max(12),
    rows: z.array(z.array(z.string().max(1000)).max(12)).max(200),
  }),
  z.object({ type: z.literal("callout"), title: z.string().max(200).optional(), content: z.string().min(1).max(3000) }),
  z.object({ type: z.literal("link"), label: z.string().min(1).max(200), href: safeHref }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const seoSchema = z
  .object({
    title: z.string().max(120).optional(),
    description: z.string().max(320).optional(),
    canonicalPath: z.string().max(200).optional(),
    ogImage: safeHref.optional(),
    noindex: z.boolean().optional(),
  })
  .strict();
export type SeoMetadata = z.infer<typeof seoSchema>;

export const sidebarSchema = z
  .object({
    /** Navigation group this page belongs to (defaults to its category). */
    group: z.string().max(100).optional(),
    hidden: z.boolean().optional(),
  })
  .strict();
export type SidebarConfig = z.infer<typeof sidebarSchema>;

export const PAGE_STATUSES = ["draft", "published", "archived"] as const;
export const statusSchema = z.enum(PAGE_STATUSES);
export type PageStatus = z.infer<typeof statusSchema>;

export const pageInputSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  category: slugSchema.optional(),
  content: z.array(contentBlockSchema).max(500),
  seo: seoSchema.optional(),
  sidebar: sidebarSchema.optional(),
});
export type PageInput = z.infer<typeof pageInputSchema>;

export const pageUpdateSchema = pageInputSchema.omit({ slug: true }).partial();
export type PageUpdate = z.infer<typeof pageUpdateSchema>;

export const categoryInputSchema = z.object({
  name: z.string().min(1).max(100),
  slug: slugSchema,
  description: z.string().max(300).optional(),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  status: z.enum(["active", "hidden"]).default("active"),
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

export const navItemInputSchema = z.object({
  label: z.string().min(1).max(120),
  slug: slugSchema.optional(),
  href: z.string().min(1).max(300).regex(/^\/(?!\/)[^\s]*$/, "href must be a site path"),
  category: slugSchema.optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  visibility: z.enum(["public", "hidden"]).default("public"),
  status: z.enum(["active", "inactive"]).default("active"),
});
export type NavItemInput = z.infer<typeof navItemInputSchema>;

const sitePath = z.string().min(1).max(300).regex(/^\/(?!\/)[a-z0-9\-/_]*$/, "Path must be a lowercase site path.");
export const redirectInputSchema = z
  .object({
    oldPath: sitePath,
    newPath: sitePath,
    statusCode: z.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)]).default(301),
    active: z.boolean().default(true),
  })
  .refine((v) => v.oldPath !== v.newPath, "oldPath and newPath must differ.");
export type RedirectInput = z.infer<typeof redirectInputSchema>;

/* ---------- stored shapes ---------- */
export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  content: ContentBlock[];
  status: PageStatus;
  version: number;
  seo?: SeoMetadata;
  sidebar?: SidebarConfig;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
};

export type CmsPageVersion = {
  id: string;
  pageId: string;
  version: number;
  content: ContentBlock[];
  metadata: { title: string; description?: string; category?: string; seo?: SeoMetadata; sidebar?: SidebarConfig };
  createdAt: string;
  createdBy: string;
};

export type CmsCategory = CategoryInput & { id: string };
export type CmsNavItem = NavItemInput & { id: string };
export type CmsRedirect = RedirectInput & { id: string; createdAt: string };

export type AuditAction =
  | "CREATE_PAGE" | "UPDATE_PAGE" | "PUBLISH_PAGE" | "UNPUBLISH_PAGE" | "ARCHIVE_PAGE" | "DELETE_PAGE"
  | "UPDATE_NAVIGATION" | "CREATE_REDIRECT" | "UPDATE_REDIRECT";

export type CmsAuditLog = {
  id: string;
  action: AuditAction;
  entityType: "page" | "navigation" | "redirect" | "category";
  entityId: string;
  actorId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type NavTreeItem = { id: string; label: string; href: string; slug?: string; children: NavTreeItem[] };
export type NavGroup = { category: string; name: string; items: NavTreeItem[] };
