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
        className="input-fintech rounded-full py-2.5 pl-10 pr-10 text-xs sm:text-sm"
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
