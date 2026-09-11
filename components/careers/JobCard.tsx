import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { CareerRole } from "@/types/careers";

export function JobCard({ role }: { role: CareerRole }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link
        href={`/careers/${role.slug}`}
        className="lift grid gap-4 rounded-2xl border border-border bg-background p-6 md:grid-cols-[1.4fr_1fr_auto] md:items-center"
      >
        <div>
          <h3 className="display text-xl transition-colors group-hover:text-brand md:text-2xl">
            {role.title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {role.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-text-secondary">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-brand">
            {role.department}
          </span>
          <span className="rounded-full border border-border px-3 py-1">{role.location}</span>
          <span className="rounded-full border border-border px-3 py-1">{role.type}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-transform group-hover:translate-x-1">
          View role
          <ArrowUpRight size={15} aria-hidden />
        </span>
      </Link>
    </motion.li>
  );
}
