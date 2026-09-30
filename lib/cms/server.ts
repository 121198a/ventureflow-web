import "server-only";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { CmsService } from "./service";
import { SupabaseCmsRepository } from "./supabase-repository";
import { HybridCmsRepository } from "./hybrid-repository";

/** Single resilient CMS service backed by the VentureFlow database with seed fallback. */
export const cms = new CmsService(new HybridCmsRepository(new SupabaseCmsRepository()));

export const CMS_TAG = "cms";
const opts = { tags: [CMS_TAG], revalidate: 3600 };

/** Cached public reads. Admin mutations call invalidateCms() so nothing stays stale. */
export const getPublishedPage = unstable_cache((slug: string) => cms.getPublishedPage(slug), ["cms-page"], opts);
export const getNavigation = unstable_cache(() => cms.getNavigation(), ["cms-nav"], opts);
export const getCategories = unstable_cache(() => cms.getCategories(), ["cms-categories"], opts);
export const listPublished = unstable_cache(
  (category: string | undefined, search: string | undefined, page: number, pageSize: number, sort: "title" | "updated" | "published") =>
    cms.listPublished({ category, search, page, pageSize, sort }),
  ["cms-list"], opts
);
export const resolveRedirect = unstable_cache((path: string) => cms.resolveRedirect(path), ["cms-redirect"], opts);

export function invalidateCms() {
  revalidateTag(CMS_TAG);
  revalidatePath("/legal", "layout");
  revalidatePath("/sitemap.xml");
}
