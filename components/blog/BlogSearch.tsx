"use client";

import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  loading?: boolean;
}

export function BlogSearch({
  value,
  onChange,
  className = "",
  placeholder = "Search market theses, venture playbooks, cap tables...",
  loading = false,
}: BlogSearchProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        {loading ? (
          <Loader2 size={16} className="animate-spin text-blue-600" />
        ) : (
          <Search size={16} />
        )}
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search articles"
        className="w-full rounded-full border border-slate-200/90 bg-white py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-blue-100"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
