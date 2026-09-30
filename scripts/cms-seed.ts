/**
 * Seeds the VentureFlow CMS database (idempotent; never overwrites existing pages).
 * Usage: npm run cms:seed   (needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local)
 */
import { CmsService } from "../lib/cms/service.ts";
import { SupabaseCmsRepository } from "../lib/cms/supabase-repository.ts";
import { seedPages } from "../data/cms-seed/pages.ts";
import { seedCategories, seedNavigation, seedRedirects } from "../data/cms-seed/structure.ts";

const ACTOR = "system:seed";

async function main() {
  const repo = new SupabaseCmsRepository();
  const cms = new CmsService(repo);

  for (const c of seedCategories) await cms.upsertCategory(c, ACTOR);
  console.log(`categories: ${seedCategories.length}`);

  let created = 0;
  for (const page of seedPages) {
    if (await repo.findPageBySlug(page.slug)) continue;
    await cms.createPage(page, ACTOR);
    await cms.publishPage(page.slug, ACTOR);
    created++;
  }
  console.log(`pages: ${created} created, ${seedPages.length - created} already present`);

  if ((await repo.listNavigation()).length === 0) {
    await cms.updateNavigation(seedNavigation, ACTOR);
    console.log(`navigation: ${seedNavigation.length} items`);
  } else console.log("navigation: already present, left untouched");

  const existing = new Set((await repo.listRedirects()).map((r: { oldPath: string }) => r.oldPath));
  let redirects = 0;
  for (const r of seedRedirects) if (!existing.has(r.oldPath)) { await cms.createRedirect(r, ACTOR); redirects++; }
  console.log(`redirects: ${redirects} created`);
}

main().catch((e) => { console.error("Seed failed:", e instanceof Error ? e.message : e); process.exit(1); });
