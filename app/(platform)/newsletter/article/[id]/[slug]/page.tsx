import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { ShareButton } from "@/components/site/share-button";
import { EmailCaptureForm } from "@/components/site/email-capture-form";
import { ArticleCTAHandler } from "@/components/newsletter/ArticleCTAHandler";
import {
  getNewsletterArticle,
  getAllArticleConfigs,
} from "@/lib/newsletter/api";
import type { ArticleBlock } from "@/lib/newsletter-data";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

export function generateStaticParams() {
  const configs = getAllArticleConfigs();
  const paramsList: { id: string; slug: string }[] = [];

  for (const c of configs) {
    paramsList.push({ id: c.articleId, slug: c.slug });
    if (c.altSlugs) {
      for (const alt of c.altSlugs) {
        paramsList.push({ id: c.articleId, slug: alt });
      }
    }
  }

  return paramsList;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, slug } = await params;
  const result = await getNewsletterArticle(id, slug);

  if (!result) {
    return {
      title: "Article Not Found | UBverse Newsletter",
      robots: { index: false, follow: false },
    };
  }

  const { article, config } = result;
  const canonicalPath = config.frontendPath;
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

function RenderBlock({
  block,
  articleId,
  headline,
  assessmentKey,
}: {
  block: ArticleBlock;
  articleId: string;
  headline: string;
  assessmentKey?: import("@/lib/newsletter/assessments").AssessmentKey;
}) {
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
                  <th
                    key={c}
                    className="px-5 py-3 text-[0.8rem] uppercase tracking-wide"
                    style={{ fontWeight: 700 }}
                  >
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
        <ArticleCTAHandler
          heading={block.heading}
          text={block.text}
          buttonLabel={block.buttonLabel}
          note={block.note}
          articleId={articleId}
          articleHeadline={headline}
          assessmentKey={assessmentKey}
        />
      );

    case "recap":
      return (
        <div className="mt-8 rounded-lg border border-hairline p-7">
          <p className="font-editorial text-[1.4rem] leading-tight text-ink">{block.heading}</p>
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

export default async function NewsletterArticlePage({ params }: PageProps) {
  const { id, slug } = await params;
  const result = await getNewsletterArticle(id, slug);

  if (!result) {
    notFound();
  }

  const { article, config, isFallback, errorMessage } = result;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-[720px] px-5 py-10 sm:py-14">
        {/* Breadcrumb back link */}
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 text-[0.85rem] text-brand hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Newsletter
        </Link>

        {/* Kicker & Headline */}
        <p className="eyebrow mt-8 text-brand">{article.kicker}</p>
        <Reveal as="h1" className="mt-3 font-editorial text-[2rem] leading-tight sm:text-[2.4rem] text-ink">
          {article.headline}
        </Reveal>

        {/* Metadata */}
        <div className="mt-4 flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground">
          <span>{article.date}</span>
          <span aria-hidden>·</span>
          <span>{article.read}</span>
        </div>

        {/* Summary */}
        <p className="mt-8 text-[1.05rem] leading-[1.8] text-ink/85">{article.summary}</p>

        {/* Author / Trust bar */}
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

        {/* Table of Contents */}
        {article.body && (() => {
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

        {/* Article Body Blocks */}
        {article.body && article.body.length > 0 ? (
          <div className="mt-2">
            {article.body.map((block, i) => (
              <RenderBlock
                key={i}
                block={block}
                articleId={config.articleId}
                headline={article.headline}
                assessmentKey={config.ctaConfig.assessmentKey}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-hairline bg-surface-alt p-6 text-[0.85rem] leading-relaxed text-ink/70">
            {isFallback && errorMessage
              ? errorMessage
              : "Article content is being synchronized from the platform."}
          </div>
        )}

        <div className="mt-12 border-t border-hairline pt-6">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 text-[0.9rem] text-brand underline"
          >
            Browse all briefings
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
