import { notFound, redirect } from "next/navigation";
import { offerings, getOffering } from "@/lib/offerings-data";

export function generateStaticParams() {
  return offerings.map((o) => ({ slug: o.slug }));
}

export default async function BareOfferingRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offering = getOffering(slug);
  if (!offering) notFound();

  redirect(`/offerings/${slug}`);
}

