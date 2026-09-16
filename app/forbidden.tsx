import { ErrorView } from "@/components/ui/ErrorView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Access Forbidden | UnBound X",
  description: "You do not have permission to access this resource or page.",
};

export default function Forbidden() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <ErrorView code={403} />
    </div>
  );
}
