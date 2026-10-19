import type { Metadata } from "next";
import { CompanySpaceSection } from "@/components/sections/Workspace/CompanySpaceSection";
import { WorkspaceJourney } from "@/components/sections/Workspace/WorkspaceJourney";
import { WorkspaceProcess } from "@/components/sections/Workspace/WorkspaceProcess";
import { WorkspaceCta } from "@/components/sections/Workspace/WorkspaceCta";

export const metadata: Metadata = {
  title: "Company Spaces",
  description:
    "A dedicated company space where founders share progress, track metrics, and communicate directly with engaged investors.",
  alternates: {
    canonical: "/workspace/company",
  },
  openGraph: {
    title: "Company Spaces — VentureFlow by Veyron X",
    description:
      "A dedicated company space where founders share progress, track metrics, and communicate directly with engaged investors.",
    url: "/workspace/company",
  },
};

export default function CompanySpacesPage() {
  return (
    <main id="main-content" className="pt-16 sm:pt-20">
      <CompanySpaceSection />
      <WorkspaceJourney />
      <WorkspaceProcess />
      <WorkspaceCta />
    </main>
  );
}
