import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DealDetail } from "@/components/site/deal-detail";
import { offerings, getOffering, getDynamicOffering } from "@/lib/offerings-data";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return offerings.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offering = (await getDynamicOffering(slug)) || getOffering(slug);
  if (!offering) {
    return {
      title: "Offering Not Found | UBverse",
    };
  }

  return {
    title: `${offering.name} — UBverse`,
    description: `Funding round: ${offering.round}.`,
    alternates: {
      canonical: `${SITE_URL}/${offering.slug}`,
    },
    openGraph: {
      url: `${SITE_URL}/${offering.slug}`,
      title: `${offering.name} — UBverse`,
      description: `Funding round: ${offering.round}.`,
    },
  };
}

/**
 * Canonical company/deal route.
 *
 * The reference UBverse URL is /:slug (for example /virani-chem-pvt-limited),
 * not /offerings/:slug. The page intentionally uses the same DealDetail and
 * getDynamicOffering -> issuer-detail backend flow as the previous route.
 */
export default async function OfferingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = (await getDynamicOffering(slug)) || getOffering(slug);
  if (!offering) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <DealDetail offering={offering} />
      <SiteFooter />
    </div>
  );
}
