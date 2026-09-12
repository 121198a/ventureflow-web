"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
          <AlertTriangle size={28} />
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          An unexpected error occurred. Please try again or return to the home page.
        </p>

        {error?.digest && (
          <p className="mt-2 font-mono text-[11px] text-slate-400">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Try again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all active:scale-95"
          >
            <Home size={14} />
            <span>Return home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
