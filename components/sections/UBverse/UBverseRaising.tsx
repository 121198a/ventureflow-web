"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const deals = [
  {
    initials: "AB",
    name: "Aegea Biotechnologies",
    sub: "Molecular diagnostics",
    tag: "506(C)",
    goal: "$3M",
    round: "Seed",
    min: "$100K",
    access: "Open to accredited",
    mark: "bg-gradient-to-br from-emerald-400 to-blue-500",
  },
  {
    initials: "PC",
    name: "Pycube",
    sub: "Hospital asset tracking",
    tag: "506(B)",
    goal: "$5M",
    round: "Series A",
    min: "$500K",
    access: "Private offering",
    mark: "bg-gradient-to-br from-amber-400 to-rose-500",
  },
  {
    initials: "BT",
    name: "Bio Tracers",
    sub: "Clinical tracing",
    tag: "506(C)",
    goal: "$2M",
    round: "Pre Series A",
    min: "$250K",
    access: "Open to accredited",
    mark: "bg-gradient-to-br from-violet-400 to-indigo-500",
  },
];

export function UBverseRaising() {
  return (
    <section id="raising" className="scroll-mt-24 relative overflow-hidden bg-[#0a1226] px-5 py-20 text-white sm:py-28">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/3 top-0 h-80 w-80 rounded-pill bg-blue-500/15 blur-3xl" />

      <Reveal className="relative z-10 mx-auto max-w-[820px] text-center">
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-slate-400">
          <span className="h-1.5 w-1.5 rounded-pill bg-blue-400 animate-pulse" />
          Now on UBverse
        </span>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Real companies, raising now.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-slate-400 leading-relaxed">
          Every one of these has a Space you can read before you decide anything.
        </p>
      </Reveal>

      {/* Raising Deal Cards */}
      <div className="relative z-10 mx-auto mt-16 grid max-w-[1100px] gap-6 md:grid-cols-3">
        {deals.map((d, i) => (
          <Reveal
            key={d.name}
            delay={i * 0.1}
            className="gb-interactive-card rounded-lg border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-bold text-white shadow-md ${d.mark}`}>
                  {d.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-sm sm:text-base leading-tight truncate">{d.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{d.sub}</p>
                </div>
              </div>
              <span className="shrink-0 self-start rounded-pill bg-blue-500/15 border border-blue-400/20 px-2.5 py-1 text-xs font-bold text-blue-300">
                {d.tag}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
              {d.goal}
              <span className="font-sans text-xs font-medium text-slate-400">funding goal</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
              <span>
                {d.round} &middot; min <b className="text-slate-400">{d.min}</b>
              </span>
              <span className="text-xs">{d.access}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="relative z-10 mt-14 text-center">
        <Link
          href="/platform"
          className="inline-flex items-center gap-2 rounded-pill bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Explore companies</span>
          <ArrowRight size={15} />
        </Link>
      </Reveal>
    </section>
  );
}