import type { Metadata } from "next";
import { Spaces } from "@/components/sections/Spaces";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Collaborative Spaces",
  description:
    "Collaborative investing Spaces for analyst teams, student funds, and investment clubs to formulate, debate, and track investment theses.",
  alternates: {
    canonical: "/spaces",
  },
  openGraph: {
    title: "Collaborative Spaces — " + site.name,
    description:
      "Collaborative investing Spaces for analyst teams, student funds, and investment clubs to formulate, debate, and track investment theses.",
    url: `${SITE_URL}/spaces`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collaborative Spaces — " + site.name,
    description:
      "Collaborative investing Spaces for analyst teams, student funds, and investment clubs to formulate, debate, and track investment theses.",
    images: ["/brand/og-image.png"],
  },
};

export default function SpacesPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Spaces />
    </div>
  );
}
