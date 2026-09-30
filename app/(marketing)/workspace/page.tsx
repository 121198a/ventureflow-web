import type { Metadata } from "next";
import { WorkspaceHero } from "@/components/sections/Workspace/WorkspaceHero";
import { CompanySpaceSection } from "@/components/sections/Workspace/CompanySpaceSection";
import { WorkspaceRaising } from "@/components/sections/Workspace/WorkspaceRaising";
import { WorkspaceJourney } from "@/components/sections/Workspace/WorkspaceJourney";
import { WorkspaceCohort } from "@/components/sections/Workspace/WorkspaceCohort";
import { WorkspaceProcess } from "@/components/sections/Workspace/WorkspaceProcess";
import { WorkspaceRails } from "@/components/sections/Workspace/WorkspaceRails";
import { WorkspaceEconomics } from "@/components/sections/Workspace/WorkspaceEconomics";
import { WorkspaceMarketplace } from "@/components/sections/Workspace/WorkspaceMarketplace";
import { WorkspaceCta } from "@/components/sections/Workspace/WorkspaceCta";
import { site, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "VentureFlow Private Markets",
  description:
    "VentureFlow extends the VentureFlow verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
  alternates: {
    canonical: "/workspace",
  },
  openGraph: {
    title: "VentureFlow Private Markets — " + site.name,
    description:
      "VentureFlow extends the VentureFlow verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
    url: `${SITE_URL}/workspace`,
    type: "website",
    images: ["/brand/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureFlow Private Markets — " + site.name,
    description:
      "VentureFlow extends the VentureFlow verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
    images: ["/brand/og-image.png"],
  },
};

export default function WorkspacePage() {
  return (
    // No wrapping <div> here on purpose: a wrapper with `overflow-x-hidden`
    // (even without `overflow-y` set) forces the browser to compute
    // `overflow-y: auto`, which creates a new Block Formatting Context.
    // A BFC *contains* negative margins internally instead of letting them
    // bleed through to affect siblings outside it — which silently broke
    // <WorkspaceCta />'s negative bottom margin (the mechanism that overlaps
    // it with the dark footer) and produced the large white gap. Since none
    // of these sections rely on horizontal-overflow clipping, a Fragment
    // (no extra box, no BFC) is the correct fix rather than tuning margins.
    <>
      {/* 1. Hero Section */}
      <WorkspaceHero />

      {/* 2. Halden Diagnostics Company Space Mockup */}
      <CompanySpaceSection />

      {/* 3. Dark Section: Real companies, raising now */}
      <WorkspaceRaising />

      {/* 4. Timeline: Where a company goes to work */}
      <WorkspaceJourney />

      {/* 5. Accelerator Cohort Space */}
      <WorkspaceCohort />

      {/* 6. Process: Follow the company before making a decision */}
      <WorkspaceProcess />

      {/* 7. Regulated Rails */}
      <WorkspaceRails />

      {/* 8. Economics: $0 to list your company Space */}
      <WorkspaceEconomics />

      {/* 9. Laptop Industry Showcase (Built in space / robotics / energy / fintech) */}
      <WorkspaceMarketplace />

      {/* 10. Pre-Footer CTA: There is a place for your company here */}
      <WorkspaceCta />
    </>
  );
}
