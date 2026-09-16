"use client";

import { useState } from "react";
import { ErrorView } from "@/components/ui/ErrorView";

export default function Test500Page() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error("Simulated 500 error: caught by Next.js ErrorBoundary");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-xl font-bold text-slate-800">500 Error Boundary Test</h2>
        <p className="text-sm text-slate-600 mt-2">
          Click the button below to trigger a real runtime exception and test the 500 ErrorBoundary UI.
        </p>
        <button
          onClick={() => setShouldCrash(true)}
          className="mt-4 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-full cursor-pointer shadow-md"
        >
          Trigger 500 Error
        </button>
      </div>
      <div className="mt-8 w-full">
        <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
          Direct 500 ErrorView Preview:
        </p>
        <ErrorView code={500} />
      </div>
    </div>
  );
}
