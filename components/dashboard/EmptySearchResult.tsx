"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySearchResultProps {
  searchQuery: string;
  onClear: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function EmptySearchResult({
  searchQuery,
  onClear,
  title = "No results found",
  description,
  className = "",
}: EmptySearchResultProps) {
  return (
    <div
      role="status"
      className={`rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center shadow-xs animate-in fade-in duration-200 ${className}`}
    >
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400 mb-3.5">
        <Search className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
        {description || (
          <>
            We couldn&apos;t find anything matching &ldquo;
            <span className="font-semibold text-slate-700">{searchQuery}</span>&rdquo;.
          </>
        )}
      </p>
      <div className="mt-5">
        <Button
          type="button"
          onClick={onClear}
          size="sm"
          variant="outline"
          className="cursor-pointer"
        >
          Clear search
        </Button>
      </div>
    </div>
  );
}
