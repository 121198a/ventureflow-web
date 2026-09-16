import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustCompare } from "@/components/sections/TrustCompare";
import { ThesisJourney } from "@/components/sections/ThesisJourney";
import { Spaces } from "@/components/sections/Spaces";
import { BeyondFeed } from "@/components/sections/BeyondFeed";
import { TradeCompete } from "@/components/sections/TradeCompete";
import { StartRecord } from "@/components/sections/StartRecord";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: SITE_URL,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustCompare />
      <ThesisJourney />
      <Spaces />
      <BeyondFeed />
      <TradeCompete />
      <StartRecord />
    </main>
  );
}
