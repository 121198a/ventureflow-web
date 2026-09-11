"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArticleCard } from "@/components/blog/ArticleCard";
import type { BlogPost } from "@/types/blog";
import { SearchX } from "lucide-react";

interface ArticleGridProps {
  posts: BlogPost[];
  onResetSearch?: () => void;
  className?: string;
}

export function ArticleGrid({ posts, onResetSearch, className = "" }: ArticleGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-12 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
          <SearchX size={24} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900">No articles matched your criteria</h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          Try adjusting your search terms or selecting another category filter.
        </p>
        {onResetSearch && (
          <button
            type="button"
            onClick={onResetSearch}
            className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.35,
              delay: Math.min(index * 0.05, 0.3),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <ArticleCard post={post} variant="standard" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
