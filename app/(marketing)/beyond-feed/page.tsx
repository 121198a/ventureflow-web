import type { Metadata } from "next";
import { BeyondFeed } from "@/components/sections/BeyondFeed";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Beyond Social Feeds",
  description:
    "Turn market opinions into institutional credibility. Explore verified track records, filing intelligence, and audited scoring on VentureFlow.",
  alternates: {
    canonical: "/beyond-feed",
  },
  openGraph: {
    title: "Beyond Social Feeds — " + site.name,
    description:
      "Turn market opinions into institutional credibility. Explore verified track records, filing intelligence, and audited scoring on VentureFlow.",
    url: `${SITE_URL}/beyond-feed`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond Social Feeds — " + site.name,
    description:
      "Turn market opinions into institutional credibility. Explore verified track records, filing intelligence, and audited scoring on VentureFlow.",
    images: ["/brand/og-image.png"],
  },
};

export default function BeyondFeedPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <BeyondFeed />
    </div>
  );
}
