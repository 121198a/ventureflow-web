import type { Metadata } from "next";
import { WorkspaceRaising } from "@/components/sections/Workspace/WorkspaceRaising";
import { WorkspaceCohort } from "@/components/sections/Workspace/WorkspaceCohort";
import { WorkspaceMarketplace } from "@/components/sections/Workspace/WorkspaceMarketplace";
import { WorkspaceRails } from "@/components/sections/Workspace/WorkspaceRails";
import { WorkspaceEconomics } from "@/components/sections/Workspace/WorkspaceEconomics";
import { WorkspaceCta } from "@/components/sections/Workspace/WorkspaceCta";

export const metadata: Metadata = {
  title: "Ventures",
  description:
    "Explore regulated venture rounds, vetted startup cohorts, and high-growth venture opportunities.",
  alternates: {
    canonical: "/workspace/ventures",
  },
  openGraph: {
    title: "Ventures — VentureFlow by Veyron X",
    description:
      "Explore regulated venture rounds, vetted startup cohorts, and high-growth venture opportunities.",
    url: "/workspace/ventures",
  },
};

export default function WorkspaceVenturesPage() {
  return (
    <main id="main-content" className="pt-16 sm:pt-20">
      <WorkspaceRaising />
      <WorkspaceCohort />
      <WorkspaceMarketplace />
      <WorkspaceRails />
      <WorkspaceEconomics />
      <WorkspaceCta />
    </main>
  );
}
