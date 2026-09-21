"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const companies = [
  {
    initials: "HD",
    name: "Halden Diagnostics",
    roles: "3 roles",
    active: true,
    popup: "Its own Space, inside the program.",
  },
  { initials: "RG", name: "Riverbend Grid", roles: "1 role" },
  { initials: "TS", name: "Tessella", roles: "2 roles" },
  { initials: "NM", name: "Nomos Metrics", roles: "2 roles" },
];

export function UBverseCohort() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="bg-white px-5 py-20 sm:py-28 border-t border-slate-100">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left Cohort Card */}
        <Reveal
          direction="left"
          className="gb-interactive-card relative overflow-visible rounded-lg border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xl shadow-slate-900/5"
        >
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-xs font-bold text-blue-600 shadow-xs">
              CF
            </span>
            <div>
              <p className="font-bold text-slate-900 text-base">Cadence Fall</p>
              <p className="text-xs text-slate-600">
                Accelerator cohort &middot; 12 weeks
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs font-bold tracking-wider text-slate-600">
            Companies
          </p>

          <div className="mt-2.5 flex flex-col gap-1.5">
            {companies.map((c) => (
              <div
                key={c.name}
                onMouseEnter={() => c.popup && setHovered(c.name)}
                onMouseLeave={() => c.popup && setHovered(null)}
                onClick={() => c.popup && setHovered(hovered === c.name ? null : c.name)}
                className={
                  "relative flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 rounded-lg px-3.5 py-3 transition-colors " +
                  (c.popup ? "cursor-pointer " : "") +
                  (c.active
                    ? "bg-blue-50/70 border border-blue-100"
                    : "hover:bg-slate-50")
                }
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                    {c.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                      {c.name}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {c.roles}
                    </p>
                  </div>
                </div>
                {c.active && (
                  <span className="rounded-pill bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 shrink-0">
                    Kept after demo day
                  </span>
                )}

                {/* Hover Popup: this company's own Space, kept after the program ends */}
                <AnimatePresence>
                  {c.popup && hovered === c.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="card-fintech absolute left-0 sm:left-8 top-full z-20 mt-2 w-64 sm:w-72 max-w-[calc(100vw-3rem)] p-3.5 text-left shadow-lg"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                          {c.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {c.name}
                          </p>
                          <p className="truncate text-xs text-slate-600">
                            {c.popup}
                          </p>
                        </div>
                        <span className="ml-auto shrink-0 rounded-pill bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                          Kept after demo day
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right Cohort Pitch */}
        <Reveal direction="right" delay={0.1}>
          <h3 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
            Give every company a place to keep building.
          </h3>
          <p className="mt-4 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
            Each company in a university or accelerator program gets its own
            Space. When the program ends, that Space stays with the company,
            along with the updates, relationships, and progress it built along
            the way.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <span className="rounded-pill bg-emerald-50 px-3 py-1 text-xs font-extrabold leading-none tracking-wide text-emerald-700">
              FREE
            </span>

            <span className="text-xs font-medium leading-5 text-slate-600">
              University programs and their startups list at no cost.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}