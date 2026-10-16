"use client";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { Search } from "lucide-react";
import { departments, locations, roles } from "@/data/careers";
import { JobCard } from "@/components/careers/JobCard";
import { useFormDraft } from "@/hooks/useFormDraft";

export function JobBoard() {
  const { values, setValues, clearDraft } = useFormDraft("careers-job-search", {
    query: "",
    dept: "All",
    loc: "All",
  });
  const query = values.query;
  const dept = values.dept;
  const loc = values.loc;

  const setQuery = (q: string) => setValues({ ...values, query: q });
  const setDept = (d: string) => setValues({ ...values, dept: d });
  const setLoc = (l: string) => setValues({ ...values, loc: l });

  const filtered = useMemo(
    () =>
      roles.filter((r) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          `${r.title} ${r.description} ${r.department} ${r.location}`
            .toLowerCase()
            .includes(q);
        return (
          matchQ &&
          (dept === "All" || r.department === dept) &&
          (loc === "All" || r.location === loc)
        );
      }),
    [query, dept, loc],
  );

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-5 md:flex-row md:items-center md:justify-between">
        <label className="flex w-full items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 md:max-w-sm">
          <Search size={16} className="shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles, teams, locations"
            aria-label="Search roles"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <FilterGroup label="Team" options={["All", ...departments]} value={dept} onChange={setDept} />
          <FilterGroup label="Location" options={["All", ...locations]} value={loc} onChange={setLoc} />
        </div>
      </div>

      <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {filtered.length} open {filtered.length === 1 ? "role" : "roles"}
      </p>

      <ul className="mt-4 grid gap-4">
        <AnimatePresence initial={false}>
          {filtered.map((r) => (
            <JobCard key={r.slug} role={r} />
          ))}
        </AnimatePresence>
      </ul>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 px-6 text-center">
          <div className="relative mb-3 h-20 w-20">
            <Image
              src="/illustrations/empty-state-noresults.svg"
              alt="No positions found"
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="display text-xl">No roles match that search.</p>
          <p className="mt-3 max-w-md text-sm text-text-secondary">
            Send your work to careers@ventureflow.example — we keep good people in mind.
          </p>
          <button
            type="button"
            onClick={() => {
              clearDraft();
            }}
            className="mt-6 rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground focus-ring cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={value === o ? "career-filter-pill-active" : "career-filter-pill"}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
