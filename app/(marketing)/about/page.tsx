import type { Metadata } from "next";
import AboutSection from "@/components/sections/About/AboutSection";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — " + site.name,
  description:
    "Everyone online is a great investor. None of them have a record. UnBound X is the place that keeps score.",
};

export default function AboutPage() {
  return <AboutSection />;
}
