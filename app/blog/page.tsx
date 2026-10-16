import type { Metadata } from "next";
import { BlogClient } from "@/components/blog/BlogClient";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog & Market Briefings",
  description:
    "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the VentureFlow team.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog & Market Briefings — " + site.name,
    description:
      "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the VentureFlow team.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Market Briefings — " + site.name,
    description:
      "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the VentureFlow team.",
    images: ["/brand/og-image.png"],
  },
};

export default function BlogPage() {
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "VentureFlow Market Briefings",
    description: "Briefings on thesis-driven investing, cap tables, and private market mechanics.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: `${SITE_URL}/logo/vf-mark.png`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogClient />
    </>
  );
}

