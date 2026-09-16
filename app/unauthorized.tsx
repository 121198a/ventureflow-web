import { ErrorView } from "@/components/ui/ErrorView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "401 - Unauthorized | UnBound X",
  description: "Authentication is required to view or access this page.",
};

export default function Unauthorized() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <ErrorView code={401} />
    </div>
  );
}
