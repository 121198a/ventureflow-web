"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/ui/ErrorView";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4 antialiased font-sans">
        <ErrorView
          code={500}
          errorDigest={error?.digest}
          primaryAction={{
            label: "Try Again",
            onClick: () => reset(),
            icon: RotateCcw,
          }}
        />
      </body>
    </html>
  );
}
