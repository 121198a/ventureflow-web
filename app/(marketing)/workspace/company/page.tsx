import type { Metadata } from "next";
import { CompanySpaceSection } from "@/components/sections/Workspace/CompanySpaceSection";
import { WorkspaceJourney } from "@/components/sections/Workspace/WorkspaceJourney";
import { WorkspaceProcess } from "@/components/sections/Workspace/WorkspaceProcess";
import { WorkspaceCta } from "@/components/sections/Workspace/WorkspaceCta";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Company Spaces — VentureFlow by " + site.name,
  description:
    "A dedicated company space where founders share progress, track metrics, and communicate directly with engaged investors.",
};

export default function CompanySpacesPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <CompanySpaceSection />
      <WorkspaceJourney />
      <WorkspaceProcess />
      <WorkspaceCta />
    </div>
  );
}
