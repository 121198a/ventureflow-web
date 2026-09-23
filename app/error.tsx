"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/ui/ErrorView";
import { RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Application error caught by boundary:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <ErrorView
        code={500}
        errorDigest={error?.digest}
        primaryAction={{
          label: "Try Again",
          onClick: () => reset(),
          icon: RotateCcw,
        }}
      />
    </div>
  );
}
