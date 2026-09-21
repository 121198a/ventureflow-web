import type { Metadata } from "next";
import { BlogClient } from "@/components/blog/BlogClient";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog & Market Intelligence",
  description:
    "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the UnBound X team.",
  openGraph: {
    title: "Blog & Market Intelligence — " + site.name,
    description:
      "Clear, practical briefings on thesis-driven investing, cap table math, venture mechanics, and market signals from the UnBound X team.",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}

