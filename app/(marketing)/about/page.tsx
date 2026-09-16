import type { Metadata } from "next";
import AboutSection from "@/components/sections/About/AboutSection";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — " + site.name,
  description:
    "Learn why UnBound X was founded: to replace unverified social investing claims with an immutable, verifiable ledger for market theses.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutSection />;
}
