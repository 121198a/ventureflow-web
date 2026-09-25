import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleConfig } from "@/lib/newsletter/config";
import { articles } from "@/lib/newsletter-data";

interface LegacyPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const bySlug = articles.map((a) => ({ id: a.slug }));
  const byId = articles.map((a) => ({ id: a.id }));
  return [...bySlug, ...byId];
}

export async function generateMetadata({
  params,
}: LegacyPageProps): Promise<Metadata> {
  const { id } = await params;
  const config = getArticleConfig(id);

  if (!config) {
    return {
      title: "Article Not Found | UBverse Newsletter",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${config.fallbackHeadline} — UBverse Newsletter`,
    alternates: { canonical: config.frontendPath },
  };
}

export default async function LegacyArticleRedirectPage({
  params,
}: LegacyPageProps) {
  const { id } = await params;
  const config = getArticleConfig(id);

  if (!config) {
    notFound();
  }

  redirect(config.frontendPath);
}
