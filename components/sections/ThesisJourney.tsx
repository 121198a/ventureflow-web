"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { FundingTargetIcon } from "@/components/ui/CustomIcons";

const steps = [
  {
    title: "Formulate a thesis with a target and fixed horizon.",
    body: "Define your fundamental argument, precise target price, and validation deadline in an institutional framework.",
    chip: "Target $195.00 · Horizon 180d",
  },
  {
    title: "Benchmark progress against live market pricing.",
    body: "As market sessions execute, community members evaluate whether underlying catalysts are materializing as forecasted.",
    chip: "Live Price Tracking Active",
  },
  {
    title: "Immutable verdict recorded upon horizon close.",
    body: "Hits and misses are permanently committed to your public ledger. Credibility is calculated through audited accuracy.",
    chip: "Verified Hit Recorded · +36.8%",
  },
];

export function ThesisJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActive(0);
    } else if (latest < 0.7) {
      setActive(1);
    } else {
      setActive(2);
    }
  });

  return (
    <div
      id="thesis"
      ref={containerRef}
      className="relative scroll-mt-24 h-[420vh] bg-white border-y border-slate-100"
    >
      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 flex h-dvh w-full flex-col justify-between overflow-hidden px-4 sm:px-6 pt-16 sm:pt-20 lg:pt-[86px] pb-3 sm:pb-5">
        {/* Header */}
        <div className="mx-auto max-w-[1120px] text-center shrink-0">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
              <FundingTargetIcon size={13} className="text-blue-600" />
              <span>One Thesis &middot; Start to Finish</span>
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-1.5 sm:mt-2 max-w-[800px] text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-tight text-slate-900 tracking-tight">
              Online, ideas never get a verdict. <br />
              <span className="text-blue-600">This one will</span>.
            </h2>
          </Reveal>
        </div>

        {/* Stepper + Phone Container */}
        <div className="mx-auto w-full max-w-[1020px] my-auto">
          {/* Mobile Stepper Tabs (< lg) */}
          <div className="flex flex-col items-center gap-1.5 lg:hidden mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {steps.map((step, i) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    active === i
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <span>{i + 1}</span>
                  <span className="hidden min-[360px]:inline">{i === 0 ? "Argument" : i === 1 ? "Track" : "Verdict"}</span>
                </button>
              ))}
            </div>
            <div className="text-center px-2 max-w-sm">
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                {steps[active].title}
              </p>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-pill border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-micro font-medium text-slate-600">
                {active === 1 && <span className="h-1.5 w-1.5 rounded-pill bg-emerald-500 animate-pulse" />}
                {steps[active].chip}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-12 items-center">
            {/* Left Stepper (Desktop >= lg) */}
            <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between h-[280px] pl-2">
              <div
                className="absolute left-[15px] top-[14px] bottom-[18px] w-[2px] border-l-2 border-dotted border-slate-300 pointer-events-none"
                aria-hidden="true"
              />
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="absolute left-[15px] top-[14px] bottom-[18px] w-[2px] bg-blue-600 origin-top pointer-events-none"
                aria-hidden="true"
              />

              {steps.map((step, i) => (
                <div
                  key={step.title}
                  onClick={() => setActive(i)}
                  className="relative z-10 flex items-start gap-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-center pt-1">
                    <span
                      className={cn(
                        "h-3.5 w-3.5 rounded-pill border-2 transition-all duration-300",
                        active >= i
                          ? "scale-125 border-blue-600 bg-blue-600 ring-4 ring-blue-100"
                          : "border-slate-300 bg-white group-hover:border-slate-400"
                      )}
                    />
                  </div>

                  <div
                    className={cn(
                      "transition-all duration-300 flex-1",
                      active === i ? "opacity-100 translate-x-0" : "opacity-35 hover:opacity-60"
                    )}
                  >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 max-w-md text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.body}
                    </p>

                    {active === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-2"
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-pill border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                          {i === 1 && <span className="h-1.5 w-1.5 rounded-pill bg-emerald-500 animate-pulse" />}
                          {step.chip}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Phone Frame with Pixel-Accurate Status Bar & Notch (Image 2 Gradient Border) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div
                aria-hidden="true"
                className="phone relative w-[230px] h-[360px] min-[380px]:w-[245px] min-[380px]:h-[390px] sm:w-[260px] sm:h-[430px] lg:w-[265px] lg:h-[450px] xl:w-[275px] xl:h-[490px] flex-none rounded-[32px] sm:rounded-[36px] bg-[#070b14] p-[3px] sm:p-[3.5px] shadow-[0_25px_60px_-15px_rgba(5,10,24,0.4),0_12px_28px_-8px_rgba(5,10,24,0.3)] ring-1 ring-white/15 select-none"
              >
                {/* 4-Edge Perimeter Neon Gradient Ribbon */}
                <div
                  className="relative h-full w-full rounded-[29px] sm:rounded-[33px] p-[2.5px]"
                  style={{
                    background:
                      "conic-gradient(from 190deg at 50% 50%, #3b82f6 0deg, #6366f1 60deg, #8b5cf6 120deg, #06b6d4 180deg, #38bdf8 250deg, #1d4ed8 310deg, #3b82f6 360deg)",
                    boxShadow: "0 0 16px rgba(59, 130, 246, 0.32), inset 0 0 6px rgba(59, 130, 246, 0.32)",
                  }}
                >
                  {/* Outer Bloom */}
                  <div
                    className="pointer-events-none absolute inset-0 -z-10 rounded-[29px] sm:rounded-[33px] opacity-75 blur-[3px]"
                    style={{
                      background:
                        "conic-gradient(from 190deg at 50% 50%, #3b82f6 0deg, #6366f1 60deg, #8b5cf6 120deg, #06b6d4 180deg, #38bdf8 250deg, #1d4ed8 310deg, #3b82f6 360deg)",
                    }}
                  />

                  {/* Screen Glass Container */}
                  <div className="relative z-10 h-full w-full overflow-hidden rounded-[27px] sm:rounded-[31px] bg-white flex flex-col justify-between">
                  
                  {/* Status Bar Section */}
                  <div>
                    <div className="relative flex h-[36px] items-center justify-between px-3.5 pt-1 text-xs font-semibold text-slate-900 pointer-events-none">
                      {/* Left: Time + Chat Bubble + Blue Notification Dot */}
                      <div className="flex items-center gap-1">
                        <span className="font-bold tracking-tight text-xs">12:26</span>
                        <div className="relative flex items-center justify-center">
                          {/* Chat bubble outline */}
                          <svg className="h-[10px] w-[10px] text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                          {/* Blue unread dot */}
                          <span className="absolute -top-0.5 -right-0.5 h-[4px] w-[4px] rounded-pill bg-[#2563EB]" />
                        </div>
                      </div>

                      {/* Center: Correct Compact Pill Dynamic Island */}
                      <div className="absolute left-1/2 top-1.5 h-[16px] w-[76px] -translate-x-1/2 rounded-pill bg-[#111729]" />

                      {/* Right: Signal, Wi-Fi, 92%, Battery */}
                      <div className="flex items-center gap-1 text-slate-900">
                        {/* 4-level Signal Towers */}
                        <div className="flex items-end gap-[1px] h-[8px] pb-[0.5px]">
                          <span className="w-[1.5px] h-[2.5px] bg-slate-900 rounded-sm" />
                          <span className="w-[1.5px] h-[4px] bg-slate-900 rounded-sm" />
                          <span className="w-[1.5px] h-[5.5px] bg-slate-900 rounded-sm" />
                          <span className="w-[1.5px] h-[7px] bg-slate-900 rounded-sm" />
                        </div>

                        {/* Wi-Fi Icon */}
                        <svg className="h-[9px] w-[9px] text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h.01" />
                          <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                          <path d="M5 12.859a10 10 0 0 1 14 0" />
                          <path d="M1.5 9.288a15 15 0 0 1 21 0" />
                        </svg>

                        {/* Battery Percentage */}
                        <span className="font-bold text-xs tracking-tight">92%</span>

                        {/* Battery Container */}
                        <div className="relative flex items-center">
                          <div className="h-[8px] w-[15px] rounded-sm border border-slate-900 p-[1px] flex items-center">
                            <div className="h-full w-[90%] rounded-sm bg-slate-900" />
                          </div>
                          <span className="h-[3px] w-[1px] rounded-r-sm bg-slate-900 -ml-[0.5px]" />
                        </div>
                      </div>
                    </div>

                    {/* Top Action Bar (< and 3-dots) */}
                    <div className="flex h-[18px] items-center justify-between px-3 text-slate-900">
                      <svg className="h-[13px] w-[13px] cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 6-6 6 6 6" />
                      </svg>
                      <span className="flex h-[13px] w-[13px] flex-col items-center justify-center gap-[1.5px] cursor-pointer text-slate-600">
                        <i className="h-[2px] w-[2px] rounded-pill bg-current" />
                        <i className="h-[2px] w-[2px] rounded-pill bg-current" />
                        <i className="h-[2px] w-[2px] rounded-pill bg-current" />
                      </span>
                    </div>

                    {/* Article Content */}
                    <div className="px-3 pt-0.5 text-left">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="text-xs font-medium text-slate-600"
                        >
                          Asset Thesis &middot; {active === 2 ? "6mo ago" : active === 1 ? "3mo ago" : "4h ago"}
                        </motion.div>
                      </AnimatePresence>

                      <h4 className="mt-0.5 text-xs font-bold leading-tight tracking-tight text-slate-900">
                        The Monopoly Tax: Why the Biggest Buyers on Earth Are Funding AMD&apos;s Rise
                      </h4>

                      <div className="mt-1 flex gap-1">
                        <span className="inline-flex items-center rounded-pill border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-800">
                          $AMD
                        </span>
                        <span className="inline-flex items-center rounded-pill border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Bullish
                        </span>
                      </div>

                      {/* Author Info Row */}
                      <div className="mt-1.5 flex items-center justify-between border-t border-slate-100 pt-1">
                        <div>
                          <b className="block text-xs font-bold text-slate-900 leading-none">Arnav Awasthi</b>
                          <span className="text-xs text-slate-600">@arnav</span>
                        </div>
                        <span className="grid h-[22px] w-[22px] place-items-center rounded-pill bg-blue-600 text-[9px] font-bold text-white shadow-2xs">
                          AA
                        </span>
                      </div>

                      {/* Editorial Paragraphs */}
                      <div className="mt-1.5 space-y-1 text-xs text-slate-600 leading-relaxed">
                        <p className="m-0">
                          On August 4, <span className="font-semibold text-blue-600">$AMD</span> reported the best quarter in the company&apos;s 57-year history. Revenue rose 50 percent to a record $11.5 billion. The data center business more than doubled. Adjusted earnings per share grew 82 percent.
                        </p>

                        <p className="m-0 flex items-center gap-1 font-semibold text-slate-900">
                          <i className="block h-[11px] w-[2px] shrink-0 rounded-pill bg-[#0080FF]" />
                          <span>The stock fell 9 percent</span>
                        </p>

                        <p className="m-0">
                          That single sentence is the entire investment case, and the entire risk, compressed into one trading session. A company does not get punished for doubling its largest business unless the market has already paid for the doubling. Which means the only way to make money in <span className="font-semibold text-blue-600">$AMD</span> from here is to be right about something the crowd is not yet paying for.
                        </p>

                        <p className="m-0 text-xs text-slate-600">
                          There is exactly one such thing, and it is not a chip. It is the moment a monopoly becomes a duopoly, and it is worth more than any product cycle in this story.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Area (Action / Sheet / Navigation) */}
                  <div className="relative shrink-0">
                    {/* Step 1 Action Bar */}
                    <AnimatePresence>
                      {active === 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 bg-white px-3 py-1.5 flex items-center justify-between">
                            <div>
                              <span className="block text-xs font-medium text-slate-600">Since published</span>
                              <b className="block text-xs font-bold text-emerald-700">+5.00%</b>
                            </div>
                            <span className="inline-flex h-[24px] px-3 items-center justify-center rounded-pill bg-blue-50 text-xs font-bold text-blue-600 shadow-2xs">
                              View Price Target
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom Navigation */}
                    <div className="flex w-full justify-center bg-white pt-1 pb-1.5 border-t border-slate-100">
                      <div className="grid w-full grid-cols-4 px-2 text-center items-center">
                        <div className="flex flex-col items-center gap-[1px] text-blue-600">
                          <svg className="h-[12px] w-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                          <span className="text-xs font-bold">Social</span>
                        </div>
                        <div className="flex flex-col items-center gap-[1px] text-slate-600">
                          <svg className="h-[12px] w-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 14v4"/><path d="M11 10v8"/><path d="M15 6v12"/></svg>
                          <span className="text-xs font-semibold">Invest</span>
                        </div>
                        <div className="flex flex-col items-center gap-[1px] text-slate-600">
                          <svg className="h-[12px] w-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 4H6v7a6 6 0 0 0 12 0V4z"/></svg>
                          <span className="text-xs font-semibold">Compete</span>
                        </div>
                        <div className="flex flex-col items-center gap-[1px] text-slate-600">
                          <span
                            className="h-[12px] w-[12px] rounded-pill bg-cover bg-center"
                            style={{ backgroundImage: "url(https://i.pravatar.cc/100?img=12)" }}
                          />
                          <span className="text-xs font-semibold">Profile</span>
                        </div>
                      </div>
                    </div>

                    {/* Sliding Bottom Sheet for Step 2 and 3 */}
                    <div
                      className={cn(
                        "sheet absolute left-0 right-0 bottom-0 z-30 bg-white rounded-t-[16px] shadow-[0_-6px_25px_rgba(15,23,42,0.16)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col text-left overflow-hidden p-2 pb-2.5 border-t border-slate-100",
                        active > 0 ? "translate-y-0" : "translate-y-[105%]"
                      )}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45, ease: "easeInOut" }}
                        >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            AMD <span className="ml-0.5 rounded-md bg-emerald-100 px-1 py-0.2 text-xs font-bold text-emerald-700">Bullish</span>
                          </p>
                          <p className="text-xs text-slate-600">Advanced Micro Devices</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-600 leading-tight">Current price</p>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            ${active === 2 ? "800.00" : "620.00"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "mt-0.5 flex items-center justify-center gap-1 rounded-md py-0.5 text-xs font-bold",
                          active === 2
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        )}
                      >
                        {active === 2 ? "✓ Target Reached, Thesis Closed" : "↑ Price Moving With Thesis"}
                      </div>

                      <div className="mt-0.5 h-4.5 overflow-hidden rounded bg-slate-50 px-1 border border-slate-100">
                        <svg viewBox="0 0 180 40" className="h-full w-full" fill="none" aria-hidden="true">
                          <path
                            d="M2 31 C20 27 29 30 42 23 S65 27 78 17 S100 20 115 13 S139 15 153 8 S170 11 178 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-emerald-500"
                          />
                        </svg>
                      </div>

                      <div className="mt-0.5 flex justify-between text-xs font-semibold text-slate-600">
                        <span>Entry $500.00</span>
                        <span>Target $800.00</span>
                      </div>

                      <div className="mt-0.5 h-1 w-full rounded-pill bg-slate-200">
                        <div
                          className="h-1 rounded-pill bg-emerald-500 transition-all duration-700 ease-out"
                          style={{ width: active === 2 ? "100%" : "42%" }}
                        />
                      </div>

                      <div className="mt-0.5 flex justify-between text-xs text-slate-600">
                        <span>Published Aug 14</span>
                        <span>{active === 2 ? "6 of 6 mo elapsed" : "3 of 6 mo elapsed"}</span>
                      </div>

                      <div className="mt-0.5 flex justify-between text-xs pt-0.5 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600">Return since publish</p>
                          <p className="font-bold text-emerald-700 leading-tight">
                            +{active === 2 ? "60.00" : "24.00"}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-600">{active === 2 ? "Result" : "Distance to target"}</p>
                          <p className="font-bold text-slate-800 leading-tight">
                            {active === 2 ? "Reached" : "60.00% left"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 w-full rounded-md bg-slate-900 py-1 text-center text-xs font-bold text-white shadow-2xs">
                        View $AMD
                      </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom safety gap */}
      <div className="h-1 shrink-0" />
    </div>
  </div>
  );
}