import type { Metadata } from "next";
import { ThesisJourney } from "@/components/sections/ThesisJourney";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thesis Journey — " + site.name,
  description:
    "Follow an investment thesis from start to finish. A real argument with a target and a date, tracked publicly in real time.",
};

export default function ThesisPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <ThesisJourney />
    </div>
  );
}
