import type { Metadata } from "next";
import { UBverseHero } from "@/components/sections/UBverse/UBverseHero";
import { CompanySpaceSection } from "@/components/sections/UBverse/CompanySpaceSection";
import { UBverseRaising } from "@/components/sections/UBverse/UBverseRaising";
import { UBverseJourney } from "@/components/sections/UBverse/UBverseJourney";
import { UBverseCohort } from "@/components/sections/UBverse/UBverseCohort";
import { UBverseProcess } from "@/components/sections/UBverse/UBverseProcess";
import { UBverseRails } from "@/components/sections/UBverse/UBverseRails";
import { UBverseEconomics } from "@/components/sections/UBverse/UBverseEconomics";
import { UBverseMarketplace } from "@/components/sections/UBverse/UBverseMarketplace";
import { UBverseCta } from "@/components/sections/UBverse/UBverseCta";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "UBverse Private Markets",
  description:
    "UBverse extends the UnBound X verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
  alternates: {
    canonical: "/ubverse",
  },
  openGraph: {
    title: "UBverse Private Markets — " + site.name,
    description:
      "UBverse extends the UnBound X verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
    url: `${SITE_URL}/ubverse`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "UBverse Private Markets — " + site.name,
    description:
      "UBverse extends the UnBound X verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
    images: ["/brand/og-image.png"],
  },
};

export default function UBversePage() {
  return (
    // No wrapping <div> here on purpose: a wrapper with `overflow-x-hidden`
    // (even without `overflow-y` set) forces the browser to compute
    // `overflow-y: auto`, which creates a new Block Formatting Context.
    // A BFC *contains* negative margins internally instead of letting them
    // bleed through to affect siblings outside it — which silently broke
    // <UBverseCta />'s negative bottom margin (the mechanism that overlaps
    // it with the dark footer) and produced the large white gap. Since none
    // of these sections rely on horizontal-overflow clipping, a Fragment
    // (no extra box, no BFC) is the correct fix rather than tuning margins.
    <>
      {/* 1. Hero Section */}
      <UBverseHero />

      {/* 2. Halden Diagnostics Company Space Mockup */}
      <CompanySpaceSection />

      {/* 3. Dark Section: Real companies, raising now */}
      <UBverseRaising />

      {/* 4. Timeline: Where a company goes to work */}
      <UBverseJourney />

      {/* 5. Accelerator Cohort Space */}
      <UBverseCohort />

      {/* 6. Process: Follow the company before making a decision */}
      <UBverseProcess />

      {/* 7. Regulated Rails */}
      <UBverseRails />

      {/* 8. Economics: $0 to list your company Space */}
      <UBverseEconomics />

      {/* 9. Laptop Industry Showcase (Built in space / robotics / energy / fintech) */}
      <UBverseMarketplace />

      {/* 10. Pre-Footer CTA: There is a place for your company here */}
      <UBverseCta />
    </>
  );
}
