import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { articles, getArticle, type ArticleBlock } from "@/lib/newsletter-data";
import { Reveal } from "@/components/site/reveal";
import { ShareButton } from "@/components/site/share-button";
import { EmailCaptureForm } from "@/components/site/email-capture-form";
import Image from "next/image";

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return <p className="mt-6 text-[1.05rem] leading-[1.8] text-ink/85">{block.text}</p>;

    case "h2":
      return (
        <h2
          id={`s-${block.roman.toLowerCase()}`}
          className="mt-12 scroll-mt-24 flex items-baseline gap-3 text-[1.5rem] leading-tight"
          style={{ fontWeight: 800 }}
        >
          <span className="text-[0.85rem] text-brand" style={{ fontWeight: 800 }}>
            {block.roman}
          </span>
          {block.text}
        </h2>
      );

    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-lg border border-hairline">
          <table className="w-full min-w-[480px] border-collapse text-left text-[0.88rem]">
            <thead>
              <tr className="border-b border-hairline bg-surface">
                {block.columns.map((c) => (
                  <th key={c} className="px-5 py-3 text-[0.8rem] uppercase tracking-wide" style={{ fontWeight: 700 }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-hairline last:border-b-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-5 py-3 align-top leading-[1.6] text-ink/85">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "quote":
      return (
        <blockquote className="mt-10 border-y border-hairline py-8 text-center font-editorial text-[1.3rem] italic leading-relaxed text-ink">
          {block.text}
        </blockquote>
      );

    case "darkbox":
      return (
        <div className="mt-6 rounded-lg bg-navy p-6 text-white sm:p-7">
          <p className="eyebrow text-white/60">{block.label}</p>
          <p className="mt-3 text-[1.05rem] italic leading-relaxed">{block.text}</p>
        </div>
      );

    case "cta":
      return (
        <div className="mt-8 rounded-lg border border-hairline bg-surface-alt p-7 text-center">
          {block.heading && (
            <p className="font-editorial text-[1.4rem] leading-tight">{block.heading}</p>
          )}
          <p className={`mx-auto max-w-[480px] text-[0.95rem] leading-relaxed text-ink/75 ${block.heading ? "mt-3" : ""}`}>
            {block.text}
          </p>
          <button
            type="button"
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[0.9rem] text-primary-foreground transition-colors hover:bg-brand-strong"
            style={{ fontWeight: 700 }}
          >
            {block.buttonLabel}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          {block.note && <p className="mt-3 text-[0.78rem] text-muted-foreground">{block.note}</p>}
        </div>
      );

    case "recap":
      return (
        <div className="mt-8 rounded-lg border border-hairline p-7">
          <p className="font-editorial text-[1.4rem] leading-tight">{block.heading}</p>
          <ol className="mt-4 space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink/85">
                <span className="shrink-0" style={{ fontWeight: 700 }}>
                  {i + 1}.
                </span>
                <span>
                  <span style={{ fontWeight: 700 }}>{item.bold}</span> {item.rest}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "emailCapture":
      return (
        <div className="mt-8 flex flex-col gap-4 rounded-lg border border-hairline p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.95rem]" style={{ fontWeight: 700 }}>
              {block.heading}
            </p>
            <p className="mt-1 text-[0.85rem] text-ink/70">{block.text}</p>
          </div>
          <EmailCaptureForm buttonLabel={block.buttonLabel} />
        </div>
      );
  }
}

export function generateStaticParams() {
  const bySlug = articles.map((a) => ({ slug: a.slug }));
  const byId = articles.map((a) => ({ slug: a.id }));
  return [...bySlug, ...byId];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return { title: "Article not found | UBverse", robots: { index: false, follow: false } };
  }

  // Canonical always points at the slug URL, even when this page was reached
  // via the numeric-id route, so search engines never see this as two pages.
  const canonicalPath = `/newsletter/article/${article.slug}`;
  const title = `${article.headline} — UBverse Newsletter`;

  return {
    title,
    description: article.summary,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description: article.summary,
      type: "article",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.summary,
    },
  };
}

export default async function NewsletterArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <article className="mx-auto max-w-[720px] px-5 py-10 sm:py-14">
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 text-[0.85rem] text-brand"
        >
          <ArrowLeft className="size-4" />
          Back to Newsletter
        </Link>

        <p className="eyebrow mt-8 text-brand">{article.kicker}</p>
        <Reveal as="h1" className="mt-3 font-editorial text-[2rem] leading-tight sm:text-[2.4rem]">
          {article.headline}
        </Reveal>
        <div className="mt-4 flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground">
          <span>{article.date}</span>
          <span aria-hidden>·</span>
          <span>{article.read}</span>
        </div>

        <p className="mt-8 text-[1.05rem] leading-[1.8] text-ink/85">{article.summary}</p>

        {article.body ? (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.8rem] text-muted-foreground">
              <Image
                src="/logo/unboundx-mark.png"
                alt=""
                width={28}
                height={28}
                className="size-7 shrink-0 rounded-full"
              />
              <span style={{ fontWeight: 700 }} className="text-ink">
                {article.kicker}
              </span>
              <span>
                {article.date} · {article.read}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
              <p className="text-[0.85rem] text-ink/60">Prepared for founders raising private capital</p>
              <ShareButton />
            </div>

            {(() => {
              const toc = article.body.filter(
                (b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2"
              );
              return toc.length > 0 ? (
                <nav aria-label="In this issue" className="mt-8 rounded-lg bg-surface-alt p-6">
                  <p className="eyebrow">In this issue</p>
                  <ul className="mt-3 space-y-2">
                    {toc.map((h) => (
                      <li key={h.roman}>
                        <a
                          href={`#s-${h.roman.toLowerCase()}`}
                          className="group inline-flex items-center gap-2 text-[0.9rem] text-ink/85 transition-colors hover:text-brand"
                          style={{ fontWeight: 600 }}
                        >
                          <ArrowRight className="size-3.5 shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-0.5" />
                          {h.roman} · {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null;
            })()}

            <div>
              {article.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-10 rounded-lg border border-hairline bg-surface-alt p-6 text-[0.85rem] leading-relaxed text-ink/70">
            The reference recording shows this route rendering a full long-form article. That body
            copy isn&apos;t present in any of the three supplied project files — only this summary is —
            so the full article text hasn&apos;t been fabricated here. Supply the source copy (or point
            this route at a CMS) to complete this page.
          </div>
        )}

        <Link
          href="/newsletter"
          className="mt-10 inline-flex items-center gap-2 text-[0.9rem] text-brand underline"
        >
          Browse all briefings
        </Link>
      </article>

      <SiteFooter />
    </div>
  );
}
