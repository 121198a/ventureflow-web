import type { Metadata } from "next";
import AboutSection from "@/components/sections/About/AboutSection";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn why VentureFlow was founded: to replace unverified social investing claims with an immutable, verifiable ledger for market theses.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | VentureFlow",
    description:
      "Learn why VentureFlow was founded: to replace unverified social investing claims with an immutable, verifiable ledger for market theses.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "About VentureFlow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | VentureFlow",
    description:
      "Learn why VentureFlow was founded: to replace unverified social investing claims with an immutable, verifiable ledger for market theses.",
    images: ["/brand/og-image.png"],
  },
};

export default function AboutPage() {
  return <AboutSection />;
}
