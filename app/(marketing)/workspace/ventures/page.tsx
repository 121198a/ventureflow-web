import type { Metadata } from "next";
import { WorkspaceRaising } from "@/components/sections/Workspace/WorkspaceRaising";
import { WorkspaceCohort } from "@/components/sections/Workspace/WorkspaceCohort";
import { WorkspaceMarketplace } from "@/components/sections/Workspace/WorkspaceMarketplace";
import { WorkspaceRails } from "@/components/sections/Workspace/WorkspaceRails";
import { WorkspaceEconomics } from "@/components/sections/Workspace/WorkspaceEconomics";
import { WorkspaceCta } from "@/components/sections/Workspace/WorkspaceCta";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ventures — VentureFlow by " + site.name,
  description:
    "Explore regulated venture rounds, vetted startup cohorts, and high-growth venture opportunities.",
};

export default function WorkspaceVenturesPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <WorkspaceRaising />
      <WorkspaceCohort />
      <WorkspaceMarketplace />
      <WorkspaceRails />
      <WorkspaceEconomics />
      <WorkspaceCta />
    </div>
  );
}
