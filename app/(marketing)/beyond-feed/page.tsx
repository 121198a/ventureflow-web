import type { Metadata } from "next";
import { BeyondFeed } from "@/components/sections/BeyondFeed";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Beyond the Feed — " + site.name,
  description:
    "Where a thesis goes to work. Verified track records, institutional research, and public accountability.",
};

export default function BeyondFeedPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <BeyondFeed />
    </div>
  );
}
