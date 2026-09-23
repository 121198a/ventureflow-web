"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";
import { Magnetic } from "@/components/motion/Magnetic";
import { AmbientLight } from "@/components/motion/AmbientLight";
import { cn } from "@/lib/utils";

const phrases = [
  "semiconductor capex cycles.",
  "energy infrastructure demand.",
  "enterprise cloud adoption.",
  "central bank rate shifts.",
  "commercial aerospace backlogs.",
];

export function StartRecord() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activePhoneIndex, setActivePhoneIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      const speed = isDeleting ? 30 : 65;
      timeout = setTimeout(() => {
        setText((prev) =>
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  const phones = [
    {
      id: "feed",
      label: "Thesis Feed",
      theme: "feed" as const,
      time: "12:26",
      content: <FeedMini />,
    },
    {
      id: "verdict",
      label: "Audited Record",
      theme: "thesis" as const,
      time: "12:27",
      content: <VerdictMini />,
    },
    {
      id: "invest",
      label: "Execution",
      theme: "invest" as const,
      time: "12:28",
      content: <InvestMini />,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white px-5 pt-20 sm:pt-28 pb-28 sm:pb-36 lg:pb-44 border-t border-slate-200/80">
      {/* Ambient background lighting */}
      <AmbientLight color="rgba(37, 99, 235, 0.07)" size={550} intensity={0.9} />

      <div className="relative z-10 mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Three-Phone Mockup Showcase (Balanced Row on Desktop, Real Carousel on Mobile/Tablet) */}
        <Reveal direction="left" className="relative order-2 flex flex-col items-center py-6 lg:order-1">
          {/* Desktop Balanced 3-Phone Triptych (>= lg) */}
          <div
            className="relative hidden lg:flex items-center justify-center w-full h-[460px]"
            style={{ perspective: 1200 }}
          >
            {/* Ambient Multi-layer Floating Floor Shadows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 left-1/2 h-16 w-[380px] -translate-x-1/2 rounded-full bg-slate-900/15 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 left-1/2 h-8 w-[280px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-xl"
            />

            {/* Left Phone (Audited Record / Verdict) */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotateZ: [-6, -4.5, -6],
              }}
              transition={{
                y: { duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 },
                rotateZ: { duration: 7.0, repeat: Infinity, ease: "easeInOut", delay: 0.1 },
              }}
              className="absolute left-4 xl:left-8 z-10 opacity-95"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(10deg) rotateX(6deg) rotateZ(-5.5deg) translateZ(-35px) scale(0.92)",
              }}
            >
              <PhoneFrame
                theme="thesis"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={true}
                time="12:27"
                className="w-[220px] xl:w-[235px]"
              >
                <VerdictMini />
              </PhoneFrame>
            </motion.div>

            {/* Center Phone (Foreground Thesis Formulation Feed) */}
            <motion.div
              animate={{
                y: [0, -7, 0],
                rotateZ: [0, 0.5, 0],
              }}
              transition={{
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 6.8, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative z-20"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(-2deg) rotateX(4deg) translateZ(15px)",
              }}
            >
              <PhoneFrame
                theme="feed"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={true}
                className="w-[230px] xl:w-[245px] shadow-2xl"
              >
                <FeedMini />
              </PhoneFrame>
            </motion.div>

            {/* Right Phone (Invest & Execution Performance) */}
            <motion.div
              animate={{
                y: [0, -9, 0],
                rotateZ: [6, 7.5, 6],
              }}
              transition={{
                y: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.35 },
                rotateZ: { duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
              }}
              className="absolute right-4 xl:right-8 z-10 opacity-95"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(-10deg) rotateX(6deg) rotateZ(6deg) translateZ(-35px) scale(0.92)",
              }}
            >
              <PhoneFrame
                theme="invest"
                showWifi={true}
                showStatusBar={true}
                showHomeIndicator={true}
                time="12:28"
                className="w-[220px] xl:w-[235px]"
              >
                <InvestMini />
              </PhoneFrame>
            </motion.div>
          </div>

          {/* Mobile & Tablet Interactive Carousel (< lg) */}
          <div className="flex flex-col items-center w-full lg:hidden">
            {/* Carousel Active Phone */}
            <div className="relative flex items-center justify-center w-full py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phones[activePhoneIndex].id}
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-20 flex justify-center"
                >
                  <PhoneFrame
                    theme={phones[activePhoneIndex].theme}
                    showWifi={true}
                    showStatusBar={true}
                    showHomeIndicator={true}
                    time={phones[activePhoneIndex].time}
                    className="w-[220px] min-[380px]:w-[240px] sm:w-[260px] shadow-xl"
                  >
                    {phones[activePhoneIndex].content}
                  </PhoneFrame>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Arrows for Tablet & Mobile Touch Navigation */}
              <button
                type="button"
                onClick={() =>
                  setActivePhoneIndex((prev) => (prev === 0 ? phones.length - 1 : prev - 1))
                }
                className="absolute left-0 sm:left-4 z-30 grid size-9 place-items-center rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus-ring cursor-pointer"
                aria-label="Previous phone preview"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActivePhoneIndex((prev) => (prev === phones.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-0 sm:right-4 z-30 grid size-9 place-items-center rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus-ring cursor-pointer"
                aria-label="Next phone preview"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Interactive Carousel Pagination Tabs & Dots */}
            <div className="mt-5 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/80">
                {phones.map((phone, idx) => (
                  <button
                    key={phone.id}
                    type="button"
                    onClick={() => setActivePhoneIndex(idx)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer",
                      activePhoneIndex === idx
                        ? "bg-white text-blue-700 shadow-2xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {phone.label}
                  </button>
                ))}
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5 mt-1">
                {phones.map((phone, idx) => (
                  <button
                    key={phone.id}
                    type="button"
                    onClick={() => setActivePhoneIndex(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all cursor-pointer",
                      activePhoneIndex === idx ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    )}
                    aria-label={`Go to ${phone.label}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Live Auto-Typing Dynamic Heading */}
        <Reveal direction="right" delay={0.1} className="order-1 text-center lg:order-2 lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs mb-4">
            <span>Instant Thesis Formulation</span>
          </span>

          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
            Your first thesis could be about <br />
            <span className="inline-block text-blue-600 font-black min-h-[1.25em]">
              {text}
              <span className="animate-pulse text-blue-600 font-normal">|</span>
            </span>
          </h2>

          <p className="mt-4 max-w-md mx-auto lg:mx-0 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            You do not need capital under management to build an institutional track record. You need an underlying argument, a target price, and a timeframe.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <Magnetic strength={0.2}>
              <AuthButton
                flow="signup"
                icon={false}
                className="btn-pill-primary px-8"
              >
                <span>Start your record</span>
                <ArrowRight size={16} />
              </AuthButton>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeedMini() {
  return (
    <div className="flex h-full flex-col justify-between bg-white px-3.5 py-2.5 text-slate-900 select-none">
      <div>
        <p className="text-xs font-bold text-slate-900 tracking-tight">Live Thesis</p>
        
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-pill bg-blue-600 text-[9px] font-bold text-white shadow-xs">
              MV
            </span>
            <p className="text-[11px] font-bold text-slate-900 leading-tight">Marcus Vance</p>
          </div>
          <p className="mt-1.5 text-[10px] leading-snug text-slate-600">
            Hyperscaler accelerator demand confirms sustainable multi-quarter operating margin expansion&hellip;
          </p>
          <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-100">
            <span>Target <b className="text-slate-900">$280</b></span>
            <span className="text-slate-300">|</span>
            <span>Horizon <b className="text-slate-900">90d</b></span>
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-pill bg-blue-600 text-[9px] font-bold text-white shadow-xs">
              JM
            </span>
            <p className="text-[11px] font-bold text-slate-900 leading-tight">Jacob Martin</p>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-800 font-bold">$NVDA</span>
            <span className="rounded-pill bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-emerald-700 font-bold text-[9px]">
              Verified Hit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvestMini() {
  return (
    <div className="flex h-full flex-col justify-between bg-white px-3.5 py-2.5 text-slate-900 select-none">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900 tracking-tight">Invest</p>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="mt-2.5 h-20 w-full overflow-hidden rounded-xl bg-gradient-to-tr from-blue-50/70 via-emerald-50/40 to-white p-1 border border-slate-100 shadow-xs">
          <svg viewBox="0 0 180 64" className="h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M2 52 C22 48 25 42 42 45 S65 30 78 35 S100 21 115 27 S140 12 153 18 S170 9 178 5"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-semibold pt-2 border-t border-slate-100">
        <span className="text-slate-600 font-medium">$100.00</span>
        <span className="rounded-pill bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-emerald-700 font-bold text-[10px]">
          +10.00%
        </span>
      </div>
    </div>
  );
}

function VerdictMini() {
  return (
    <div className="flex h-full flex-col justify-between bg-white px-3.5 py-2.5 text-slate-900 select-none">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900 tracking-tight">Public Record</p>
          <span className="rounded-pill bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-emerald-700 font-bold text-[9px]">
            Audited
          </span>
        </div>

        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-center shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Hit Accuracy</p>
          <p className="text-2xl font-black text-blue-600 leading-tight my-0.5">68.4%</p>
          <p className="text-[10px] text-slate-500 font-medium">38 closed theses</p>
        </div>

        <div className="mt-2 rounded-xl border border-slate-100 bg-white p-2 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-pill bg-emerald-600 text-[9px] font-bold text-white shadow-xs">
              ✓
            </span>
            <div>
              <p className="text-[10px] font-bold text-slate-900 leading-tight">$NVDA Call</p>
              <p className="text-[9px] text-emerald-600 font-semibold">+24.8% Outcome</p>
            </div>
          </div>
          <span className="text-[9px] font-medium text-slate-400">Locked</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 pt-2 border-t border-slate-100">
        <span>Verified Ledger</span>
        <span className="text-blue-600 font-semibold">Immutable</span>
      </div>
    </div>
  );
}