import type { Metadata } from "next";
import { CompanySpaceSection } from "@/components/sections/UBverse/CompanySpaceSection";
import { UBverseJourney } from "@/components/sections/UBverse/UBverseJourney";
import { UBverseProcess } from "@/components/sections/UBverse/UBverseProcess";
import { UBverseCta } from "@/components/sections/UBverse/UBverseCta";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Company Spaces — UBverse by " + site.name,
  description:
    "A dedicated company space where founders share progress, track metrics, and communicate directly with engaged investors.",
};

export default function CompanySpacesPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <CompanySpaceSection />
      <UBverseJourney />
      <UBverseProcess />
      <UBverseCta />
    </div>
  );
}
