import type { Metadata } from "next";
import { Hero } from "@/components/careers/Hero";
import { Stats } from "@/components/careers/Stats";
import { WhyJoin } from "@/components/careers/WhyJoin";
import { LifeAtCompany } from "@/components/careers/LifeAtCompany";
import { Growth } from "@/components/careers/Growth";
import { JobBoard } from "@/components/careers/JobBoard";
import { HiringProcess } from "@/components/careers/HiringProcess";
import { ClosingCTA } from "@/components/careers/ClosingCTA";
import { Reveal } from "@/components/motion/Reveal";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Careers & Culture",
  description:
    "Join VentureFlow to build the verifiable record-keeping layer for investment ideas. Explore engineering, product, and research roles.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers & Culture | VentureFlow",
    description:
      "Join VentureFlow to build the verifiable record-keeping layer for investment ideas. Explore engineering, product, and research roles.",
    url: `${SITE_URL}/careers`,
    type: "website",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "Careers at VentureFlow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers & Culture | VentureFlow",
    description:
      "Join VentureFlow to build the verifiable record-keeping layer for investment ideas. Explore engineering, product, and research roles.",
    images: ["/brand/og-image.png"],
  },
};

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

export default function CareersPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Careers", item: `${SITE_URL}/careers` },
    ],
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Hero />
      <Stats />
      <WhyJoin />
      <LifeAtCompany />
      <Growth />

      <section id="roles" aria-labelledby="roles-title" className="scroll-mt-24 border-t border-border bg-card py-20 sm:py-28">
        <div className={section}>
          <Reveal>
            <p className="eyebrow">Open positions</p>
            <h2 id="roles-title" className="display mt-5 text-[clamp(1.9rem,4.5vw,3.2rem)]">Find your seat.</h2>
          </Reveal>
          <div className="mt-10">
            <JobBoard />
          </div>
        </div>
      </section>

      <HiringProcess />
      <ClosingCTA />
    </main>
  );
}
