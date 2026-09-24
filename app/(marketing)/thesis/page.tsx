import type { Metadata } from "next";
import { ThesisJourney } from "@/components/sections/ThesisJourney";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thesis Journey",
  description:
    "Follow an investment thesis from formulation to verdict. Track target prices, horizons, and real-time market accuracy on a public ledger.",
  alternates: {
    canonical: "/thesis",
  },
  openGraph: {
    title: "Thesis Journey — " + site.name,
    description:
      "Follow an investment thesis from formulation to verdict. Track target prices, horizons, and real-time market accuracy on a public ledger.",
    url: `${SITE_URL}/thesis`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thesis Journey — " + site.name,
    description:
      "Follow an investment thesis from formulation to verdict. Track target prices, horizons, and real-time market accuracy on a public ledger.",
    images: ["/brand/og-image.png"],
  },
};

export default function ThesisPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <ThesisJourney />
    </div>
  );
}
