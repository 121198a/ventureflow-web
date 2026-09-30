import { ErrorView } from "@/components/ui/ErrorView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | VentureFlow",
  description: "The page or document you're looking for doesn't exist, has been moved, or the link may be invalid.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <ErrorView code={404} />
    </div>
  );
}
