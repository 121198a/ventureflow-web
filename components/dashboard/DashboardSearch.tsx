"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface DashboardSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  id?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Production-ready responsive dashboard search bar.
 * Occupies approx. 1/4 width on desktop (w-full md:w-1/4 min-w-[220px] max-w-[320px]),
 * expanding to full width on mobile viewports.
 * Uses existing UnBound X styling tokens (Figtree font, hairline border, shadow-2xs).
 */
export function DashboardSearch({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  id = "dashboard-search-input",
  ariaLabel = "Search records",
  className = "",
}: DashboardSearchProps) {
  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className={`relative w-full md:w-1/4 min-w-[200px] max-w-sm ${className}`}>
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
        <Search className="size-4" aria-hidden="true" />
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        spellCheck="false"
        className="w-full rounded-lg border border-slate-200/90 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-all duration-150 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 font-sans"
      />
      {value.trim().length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
