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
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "VentureFlow Private Markets",
  description:
    "VentureFlow extends the VentureFlow verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
  alternates: {
    canonical: "/workspace",
  },
  openGraph: {
    title: "VentureFlow Private Markets | VentureFlow",
    description:
      "VentureFlow extends the VentureFlow verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
    url: `${SITE_URL}/workspace`,
    type: "website",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "VentureFlow Private Markets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureFlow Private Markets | VentureFlow",
    description:
      "VentureFlow extends the VentureFlow verified thesis format into startup investing, institutional deal rooms, and Company Spaces.",
    images: ["/brand/og-image.png"],
  },
};

export default function WorkspacePage() {
  return (
    <main id="main-content" className="w-full">
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
    </main>
  );
}
