import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DealDetail } from "@/components/site/deal-detail";
import { offerings, getOffering } from "@/lib/offerings-data";

export function generateStaticParams() {
  return offerings.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offering = getOffering(slug);
  if (!offering) notFound();
  return {
    title: `${offering.name} — UBverse`,
    description: `Funding round: ${offering.round}.`,
    alternates: {
      canonical: `/offerings/${slug}`,
    },
  };
}

export default async function OfferingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = getOffering(slug);
  if (!offering) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <DealDetail offering={offering} />
      <SiteFooter />
    </div>
  );
}
