import type { Metadata } from "next";
import AboutSection from "@/components/sections/About/AboutSection";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn why UnBound X was founded: to replace unverified social investing claims with an immutable, verifiable ledger for market theses.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us — " + site.name,
    description:
      "Learn why UnBound X was founded: to replace unverified social investing claims with an immutable, verifiable ledger for market theses.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — " + site.name,
    description:
      "Learn why UnBound X was founded: to replace unverified social investing claims with an immutable, verifiable ledger for market theses.",
    images: ["/brand/og-image.png"],
  },
};

export default function AboutPage() {
  return <AboutSection />;
}
