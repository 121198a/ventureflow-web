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
  const offering = getOffering(slug) || (await getDynamicOffering(slug));
  if (!offering) {
    return {
      title: "Offering Not Found | UBverse",
      robots: { index: false, follow: false },
    };
  }

  const title = `${offering.name} — UBverse`;
  // Use the company's real long-form description when present so two
  // companies in the same round don't end up with an identical meta
  // description ("Funding round: Seed." for every seed-stage company).
  // Only fall back to the generic round line when no real copy exists.
  const rawDescription = offering.description?.trim();
  const description = rawDescription
    ? rawDescription.length > 155
      ? `${rawDescription.slice(0, 152)}...`
      : rawDescription
    : `Funding round: ${offering.round}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${offering.slug}`,
    },
    openGraph: {
      url: `${SITE_URL}/${offering.slug}`,
      title,
      description,
      type: "website",
      images: [
        {
          url: offering.imageUrl || "/brand/og-image.png",
          alt: offering.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [offering.imageUrl || "/brand/og-image.png"],
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
  const offering = getOffering(slug) || (await getDynamicOffering(slug));
  if (!offering) notFound();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteHeader />
      <div className="relative z-10">
        <DealDetail offering={offering} />
      </div>
      <SiteFooter />
    </div>
  );
}
