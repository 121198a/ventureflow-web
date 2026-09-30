"use client";

import { CmsErrorState } from "@/components/legal/CmsErrorState";

export default function LegalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <CmsErrorState />
      <div className="mt-4 text-center">
        <button type="button" onClick={reset} className="text-sm font-semibold text-slate-600 underline underline-offset-2">
          Try again
        </button>
      </div>
    </div>
  );
}
