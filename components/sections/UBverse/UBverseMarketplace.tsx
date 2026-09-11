"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LaptopFrame } from "@/components/ui/LaptopFrame";
import { Reveal } from "@/components/ui/Reveal";

const categories = ["climate.", "space.", "robotics.", "energy.", "fintech.", "biotech."];

const spotlight = [
  { key: "dash", name: "DASH\nHEALTH", sub: "Dash Health", tag2: "Diagnostics. Delivered.", goal: "$2.5M", inst: "TBA", round: "TBA", bg: "bg-white", tone: "text-slate-900 border border-slate-200/80" },
  { key: "aegea", name: "AEGEA", sub: "Aegea Biotechnologies", tag2: "Ultrasensitive mutation detection", goal: "$2.7M", inst: "SAFE Note", round: "Seed", bg: "bg-[#0d1a17]", tone: "text-white" },
  { key: "bio", name: "BIO TRACERS", sub: "BioTracers", tag2: "Pioneering rapid detection of bacteria and sepsis.", goal: "$500K", inst: "SAFE Note", round: "Pre-Seed", bg: "bg-[#0b1330]", tone: "text-white" },
];

const featured = [
  { key: "f1", name: "Riverbend Grid", sub: "Grid-scale storage", tag: "506(C)", bg: "bg-[#0e2233]" },
  { key: "f2", name: "Tessella", sub: "Materials science", tag: "SAFE", bg: "bg-[#231a10]" },
  { key: "f3", name: "Nomos Metrics", sub: "Risk analytics", tag: "506(B)", bg: "bg-[#1a1024]" },
];

export function UBverseMarketplace() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<0 | 1>(0);
  const [categoryIndex, setCategoryIndex] = useState(0);

  // Auto changing category ticker
  useEffect(() => {
    const categoryInterval = setInterval(() => {
      setCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 2000);
    return () => clearInterval(categoryInterval);
  }, []);

  // Viewport detection for laptop frame
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOpen(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Screen transition inside laptop frame
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setScreen((s) => (s === 0 ? 1 : 0)), 3800);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <section className="bg-white px-5 py-20 sm:py-28 border-t border-slate-100">
      <div className="mx-auto max-w-[900px] text-center">

        {/* Clean Rotating Heading (No Underline) */}
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
            The next company worth backing <br />
            could be built in{" "}
            <span className="inline-block text-blue-600 font-black min-w-[140px] text-left">
              <AnimatePresence mode="wait">
                <motion.span
                  key={categories[categoryIndex]}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="inline-block"
                >
                  {categories[categoryIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-slate-600 leading-relaxed">
            The most innovative companies deserve to be seen. Start your Space, post the work, and let the record speak.
          </p>
        </Reveal>
      </div>

      {/* Laptop Frame Preview Window */}
      <Reveal delay={0.25} className="mt-14 max-w-5xl mx-auto">
        <div ref={wrapRef} className="flex justify-center">
          <LaptopFrame open={open}>
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="h-full w-full"
              >
                {screen === 0 ? <SpotlightScreen /> : <FeaturedScreen />}
              </motion.div>
            </AnimatePresence>
          </LaptopFrame>
        </div>
      </Reveal>
    </section>
  );
}

function LaptopNav() {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-2 sm:px-6 sm:py-2.5 select-none">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
        <span className="grid h-4 w-4 place-items-center rounded-md bg-blue-600 text-xs font-bold text-white shadow-2xs">
          U
        </span>
        <span>UBverse by UnBound X</span>
      </div>
      <div className="hidden items-center gap-4 text-xs font-semibold text-slate-600 sm:flex">
        <span className="hover:text-slate-700 cursor-pointer">For service providers</span>
        <span className="hover:text-slate-700 cursor-pointer">For founders</span>
        <span className="text-blue-600 font-bold hover:underline cursor-pointer">Invest in UnBound X</span>
        <span className="rounded-pill border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">Sign Up/Log in</span>
      </div>
    </div>
  );
}

function SpotlightScreen() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden bg-white text-slate-900 select-none">
      <LaptopNav />
      <div className="flex-1 overflow-y-auto px-2.5 py-2 min-[400px]:px-4 min-[400px]:py-3 sm:px-6 sm:py-4">
        {/* Banner */}
        <div className="grid grid-cols-1 gap-1.5 rounded-lg border border-slate-100 bg-slate-50/60 p-2 sm:grid-cols-[1fr_auto] sm:items-center sm:p-3.5">
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-blue-600">
              UnBound X capital raise open!
            </p>
            <p className="mt-0.5 text-[10px] sm:text-xs text-slate-600">
              The platform fusing finance with social connectivity
            </p>
          </div>
          <span className="hidden rounded-pill border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 sm:inline-block shadow-2xs">
            View Opportunity
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between sm:mt-4">
          <p className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-wider">Spotlight</p>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-600">View All</span>
        </div>

        <div className="mt-1.5 grid grid-cols-3 gap-1.5 sm:gap-3">
          {spotlight.map((s) => (
            <div key={s.key} className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-2xs">
              <div className={`${s.bg} ${s.tone} flex h-9 sm:h-12 items-center justify-center px-1 text-center md:h-16`}>
                <p className="whitespace-pre-line text-[10px] sm:text-xs font-extrabold leading-tight tracking-tight">
                  {s.name}
                </p>
              </div>
              <div className="p-1.5 sm:p-2.5">
                <p className="truncate text-[10px] sm:text-xs font-bold text-slate-900">{s.sub}</p>
                <p className="mt-0.5 truncate sm:break-words text-[9px] sm:text-xs text-slate-600">{s.tag2}</p>
                <div className="mt-1 flex items-center justify-between text-[9px] sm:text-xs font-semibold text-slate-600">
                  <span className="font-bold text-slate-900">{s.goal}</span>
                  <span className="rounded-md bg-slate-100 px-1 py-0.5 font-medium hidden min-[360px]:inline">{s.inst}</span>
                  <span className="text-slate-600 font-normal">{s.round}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex items-center justify-between sm:mt-4">
          <p className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-wider">Featured Start-ups</p>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-600">View All</span>
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5 opacity-80 sm:gap-3">
          {featured.map((f) => (
            <div key={f.key} className={`h-6 rounded-lg ${f.bg} sm:h-10 shadow-xs`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedScreen() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden bg-white text-slate-900 select-none"
    >
      <LaptopNav />
      <div className="flex-1 overflow-y-auto px-2.5 py-2 min-[400px]:px-4 min-[400px]:py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-wider">
            Featured Start-ups
          </p>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-600">View All</span>
        </div>

        <div className="mt-1.5 grid grid-cols-3 gap-1.5 sm:gap-3">
          {featured.map((f) => (
            <div
              key={f.key}
              className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-2xs"
            >
              <div
                className={`${f.bg} flex h-9 sm:h-12 items-center justify-center text-white md:h-16`}
              >
                <span className="rounded-pill bg-white/20 px-1.5 py-0.5 text-[9px] sm:text-xs font-bold backdrop-blur-xs">
                  Indicate Interest
                </span>
              </div>
              <div className="p-1.5 sm:p-2.5">
                <p className="truncate text-[10px] sm:text-xs font-bold text-slate-900">
                  {f.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-600">
                  {f.sub}
                </p>
                <span className="mt-1.5 inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-700">
                  {f.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3 sm:mt-5 sm:p-4">
          <p className="text-xs font-bold text-slate-900">Halden Diagnostics</p>
          <p className="mt-1 text-xs text-slate-600 leading-snug">
            First hospital contract signed &mdash; eighteen months of validation
            work, and the pilot converted.
          </p>
          <div className="mt-2 flex gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-pill bg-white px-2 py-0.5 border border-slate-200">
              Sites live 3
            </span>
            <span className="rounded-pill bg-white px-2 py-0.5 border border-slate-200">
              Tests 4,120
            </span>
            <span className="rounded-pill bg-white px-2 py-0.5 border border-slate-200">
              Team 14
            </span>
          </div>

          {/* <div>
            <Link
              href="/ubverse/companies"
              className="inline-flex items-center gap-2 rounded-pill bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <span>Start your Space</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}