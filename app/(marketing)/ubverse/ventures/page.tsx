import type { Metadata } from "next";
import { UBverseRaising } from "@/components/sections/UBverse/UBverseRaising";
import { UBverseCohort } from "@/components/sections/UBverse/UBverseCohort";
import { UBverseMarketplace } from "@/components/sections/UBverse/UBverseMarketplace";
import { UBverseRails } from "@/components/sections/UBverse/UBverseRails";
import { UBverseEconomics } from "@/components/sections/UBverse/UBverseEconomics";
import { UBverseCta } from "@/components/sections/UBverse/UBverseCta";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ventures — UBverse by " + site.name,
  description:
    "Explore regulated venture rounds, vetted startup cohorts, and high-growth venture opportunities.",
};

export default function UBverseVenturesPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <UBverseRaising />
      <UBverseCohort />
      <UBverseMarketplace />
      <UBverseRails />
      <UBverseEconomics />
      <UBverseCta />
    </div>
  );
}
