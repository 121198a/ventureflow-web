import type { Metadata } from "next";
import { BlogClient } from "@/components/blog/BlogClient";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog & Market Intelligence",
  description:
    "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the UnBound X team.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog & Market Intelligence — " + site.name,
    description:
      "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the UnBound X team.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Market Intelligence — " + site.name,
    description:
      "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the UnBound X team.",
    images: ["/brand/og-image.png"],
  },
};

export default function BlogPage() {
  return <BlogClient />;
}

