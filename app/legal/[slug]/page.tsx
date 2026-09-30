import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { LegalShell } from "@/components/legal/LegalShell";
import { CmsBlocks } from "@/components/legal/CmsBlocks";
import { CmsErrorState } from "@/components/legal/CmsErrorState";
import { getPublishedPage, resolveRedirect } from "@/lib/cms/server";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  try {
    return { page: await getPublishedPage(slug), failed: false as const };
  } catch {
    return { page: null, failed: true as const };
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await load(slug);
  if (!page) return { title: "Legal document", robots: { index: false } };
  const seoTitle = page.seo?.title;
  const title = page.title;
  const description = page.seo?.description || page.description;
  const canonical = page.seo?.canonicalPath || `/legal/${slug}`;
  const images = page.seo?.ogImage ? [page.seo.ogImage] : undefined;
  return {
    // An explicit SEO title is used verbatim; otherwise the root template appends the site name.
    title: seoTitle ? { absolute: seoTitle } : title,
    description,
    alternates: { canonical },
    robots: page.seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: { title: seoTitle || `${title} — VentureFlow`, description, url: canonical, type: "article", images },
    twitter: { card: images ? "summary_large_image" : "summary", title: seoTitle || `${title} — VentureFlow`, description, images },
  };
}

export default async function LegalPage({ params }: Params) {
  const { slug } = await params;
  const { page, failed } = await load(slug);

  if (failed) {
    return (
      <LegalShell activeSlug={slug}>
        <CmsErrorState />
      </LegalShell>
    );
  }

  if (!page) {
    // Old paths keep working through CMS redirects.
    let target: { newPath: string; statusCode: number } | null = null;
    try {
      target = await resolveRedirect(`/legal/${slug}`);
    } catch {
      target = null;
    }
    if (target) {
      if (target.statusCode === 301 || target.statusCode === 308) permanentRedirect(target.newPath);
      redirect(target.newPath);
    }
    notFound();
  }

  const updated = new Date(page.updatedAt);
  return (
    <LegalShell activeSlug={slug}>
      <article className="gb-legal-content">
        <h1>{page.title}</h1>
        {!Number.isNaN(updated.getTime()) && (
          <p className="!mb-6 text-sm text-slate-500">
            Last updated{" "}
            <time dateTime={updated.toISOString()}>
              {updated.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </p>
        )}
        {page.content.length ? (
          <CmsBlocks blocks={page.content} />
        ) : (
          <p>This document does not have any content yet. Please check back soon.</p>
        )}
      </article>
    </LegalShell>
  );
}
