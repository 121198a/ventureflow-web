import { redirect, notFound } from "next/navigation";
import { offerings, getOffering, getDynamicOffering } from "@/lib/offerings-data";

export function generateStaticParams() {
  return offerings.map((o) => ({ slug: o.slug }));
}

/**
 * Legacy compatibility route. The canonical reference URL is /:slug.
 * Keep this route only so old bookmarks do not create a duplicate DealDetail.
 */
export default async function LegacyOfferingRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = (await getDynamicOffering(slug)) || getOffering(slug);
  if (!offering) notFound();

  redirect(`/${offering.slug}`);
}
