"use client";

import { motion } from "framer-motion";
import type { BlogCategory } from "@/types/blog";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: BlogCategory[];
  activeCategory: BlogCategory;
  onSelectCategory: (category: BlogCategory) => void;
  counts?: Record<BlogCategory, number>;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="relative w-full">
      {/* Scrollable Container with horizontal touch scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = counts ? counts[cat] : undefined;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer focus:outline-hidden",
                isActive ? "text-white" : "text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/70"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-full bg-blue-600 shadow-[0_6px_20px_rgba(37,99,235,0.25)]"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {cat}
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                      isActive
                        ? "bg-blue-800 text-blue-100"
                        : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
