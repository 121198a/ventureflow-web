import type { Metadata } from "next";
import { Spaces } from "@/components/sections/Spaces";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Spaces — " + site.name,
  description:
    "Collaborative investing Spaces. Build investment ideas, discuss theses, and decide on them together.",
};

export default function SpacesPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Spaces />
    </div>
  );
}
