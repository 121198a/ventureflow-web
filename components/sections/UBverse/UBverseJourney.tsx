"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

const milestones = [
  {
    date: "MAR 2025",
    title: "Prototype in the field",
    chips: [{ label: "Test site", value: "2" }],
  },
  {
    date: "SEP 2025",
    title: "Pilot converted to paid",
    chips: [
      { label: "Contract", value: "$140K" },
      { label: "Sites live", value: "4" },
    ],
  },
  {
    date: "APR 2026",
    title: "Second deployment shipped",
    chips: [
      { label: "Sites live", value: "9" },
      { label: "Team", value: "9" },
    ],
  },
];

export function UBverseJourney() {
  const [active, setActive] = useState(0);
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const refs = [ref0, ref1, ref2];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = refs.findIndex((r) => r.current === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0.1 }
    );
    refs.forEach((r) => r.current && observer.observe(r.current));
    return () => observer.disconnect();
    // refs are individually-stable useRef objects re-wrapped in a plain
    // array each render — safe to omit from deps (their identity never
    // changes), including them would just re-run this on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="beyond-the-raise" className="scroll-mt-24 bg-slate-100 px-5 py-20 sm:py-28 border-y border-slate-100">
      <div className="mx-auto max-w-[1100px] text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-pill border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-xs">
            Beyond the raise
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
            Where a company <span className="text-blue-600">goes to work.</span>
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1100px] gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        {/* Left Sticky Header */}
        <div className="lg:col-span-6 min-[1061px]:sticky min-[1061px]:top-28">
          <Reveal>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
              Show what your company has done.
            </h3>
            <p className="mt-4 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
              Post milestones as they happen: your first prototype, new customers, contracts, hires, deployments. Each update joins your company&apos;s history. Investors get a clearer view of how the business is progressing.
            </p>
          </Reveal>
        </div>

        {/* Right Milestones Stepper */}
        <div className="lg:col-span-6 flex flex-col gap-12 sm:gap-16 py-4">
          {milestones.map((m, i) => (
            <div
              key={m.title}
              ref={refs[i]}
              onClick={() => setActive(i)}
              className="flex gap-5 cursor-pointer group"
            >
              {/* Stepper Dot & Line */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "h-4 w-4 shrink-0 rounded-pill border-2 transition-all duration-300",
                    active >= i
                      ? "scale-110 border-blue-600 bg-blue-600 ring-4 ring-blue-100"
                      : "border-slate-300 bg-white group-hover:border-slate-400"
                  )}
                />
                {i < milestones.length - 1 && (
                  <span
                    className={cn(
                      "mt-2 w-0.5 flex-1 transition-colors duration-300 min-h-[80px]",
                      active > i ? "bg-blue-600" : "bg-slate-200"
                    )}
                  />
                )}
              </div>

              {/* Milestone Details */}
              <div className={cn("min-w-0 flex-1 transition-all duration-300", active === i ? "opacity-100" : "opacity-80 hover:opacity-100")}>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600">{m.date}</p>
                <h4 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{m.title}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.chips.map((c) => (
                    <span
                      key={c.label}
                      className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-xs border border-slate-200"
                    >
                      {c.label} <b className="text-slate-900 font-bold">{c.value}</b>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}