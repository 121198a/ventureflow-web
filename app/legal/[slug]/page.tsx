import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalShell } from "@/components/legal/LegalShell";
import { getCmsPage, rewriteCmsLinks, sanitizeCmsHtml, LEGAL_PAGES } from "@/lib/cms";

export const revalidate = 3600;

export function generateStaticParams() {
  return LEGAL_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  if (!page) return { title: "Legal document not found — UnBound X" };
  return {
    title: page.title + " — UnBound X",
    description: `${page.title} for the UnBound X platform.`,
    alternates: { canonical: `/legal/${slug}` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCmsPage(slug);

  if (!page) notFound();

  const rawHtml = page.content?.html || page.content?.body || "";
  const html = sanitizeCmsHtml(rewriteCmsLinks(rawHtml));

  return (
    <LegalShell activeSlug={slug}>
      {html.trim() ? (
        <article className="gb-legal-content" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">{page.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            This document doesn&apos;t have any content yet. Please check back soon.
          </p>
        </div>
      )}
    </LegalShell>
  );
}
