"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { scrollToTarget } from "@/providers/SmoothScrollProvider";

interface DashboardPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  scrollTargetId?: string;
  className?: string;
}

/**
 * Generates page numbers with ellipsis for large page sets.
 * e.g. [1, 2, 3, 4, 5] or [1, '...', 4, 5, 6, '...', 12]
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis-1");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis-2");
  }

  pages.push(totalPages);
  return pages;
}

export function DashboardPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  scrollTargetId,
  className = "",
}: DashboardPaginationProps) {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageSelect = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);

    if (scrollTargetId && typeof window !== "undefined") {
      scrollToTarget(`#${scrollTargetId}`, { offset: -90 });
    }
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs text-slate-600 ${className}`}
    >
      {/* Range summary text */}
      <div className="font-medium text-slate-500 order-2 sm:order-1 text-center sm:text-left">
        Showing <span className="font-semibold text-slate-800">{startItem}</span>–
        <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalItems}</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageSelect(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          <span className="hidden min-[400px]:inline">Previous</span>
        </button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-400 font-mono select-none"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePageSelect(p)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={isCurrent ? `Current page, page ${p}` : `Go to page ${p}`}
                className={`min-w-8 h-8 rounded-md px-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 border border-transparent"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Mobile Compact Page Indicator */}
        <div className="sm:hidden px-2 py-1 font-semibold text-slate-700">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageSelect(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="hidden min-[400px]:inline">Next</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
