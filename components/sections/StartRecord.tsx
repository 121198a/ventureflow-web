"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";

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

  return (
    <section className="overflow-hidden bg-gradient-to-b from-white to-slate-50/50 px-5 pt-20 sm:pt-28 pb-28 sm:pb-36 lg:pb-44 border-t border-slate-200/80">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Dual Phone Perspective Mockup */}
        <Reveal direction="left" className="relative order-2 flex justify-center py-6 lg:order-1">
          <div className="relative">
            {/* Foreground Phone */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <PhoneFrame className="rotate-[-4deg] shadow-2xl">
                <FeedMini />
              </PhoneFrame>
            </motion.div>

            {/* Background Peeking Phone */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="absolute -right-8 top-6 z-0 hidden opacity-90 sm:-right-12 sm:block"
            >
              <PhoneFrame className="origin-center scale-90 rotate-[8deg] sm:scale-95 shadow-xl">
                <InvestMini />
              </PhoneFrame>
            </motion.div>
          </div>
        </Reveal>

        {/* Live Auto-Typing Dynamic Heading */}
        <Reveal direction="right" delay={0.1} className="order-1 text-center lg:order-2 lg:text-left">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
            Your first thesis could be about <br />
            <span className="inline-block text-blue-600 font-black min-h-[1.25em]">
              {text}
              <span className="animate-pulse text-blue-600 font-normal">|</span>
            </span>
          </h2>

          <p className="mt-4 max-w-md mx-auto lg:mx-0 text-sm sm:text-base text-slate-600 leading-relaxed">
            You do not need capital under management to build an institutional track record. You need an underlying argument, a target price, and a timeframe.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <AuthButton
              flow="signup"
              icon={false}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] focus-ring"
            >
              <span>Start your record</span>
              <ArrowRight size={16} />
            </AuthButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeedMini() {
  return (
    <div className="flex h-full flex-col bg-white px-4 py-3 text-slate-900 select-none">
      <p className="text-xs font-bold text-slate-900">Live Thesis</p>
      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-pill bg-blue-600 text-[10px] font-bold text-white shadow-xs">
            MV
          </span>
          <p className="text-micro font-bold text-slate-900">Marcus Vance</p>
        </div>
        <p className="mt-2 text-micro leading-snug text-slate-600">
          Hyperscaler accelerator demand confirms sustainable multi-quarter operating margin expansion&hellip;
        </p>
        <div className="mt-2 flex justify-between text-micro font-semibold text-slate-600 bg-white p-1.5 rounded-lg border border-slate-100">
          <span>Target $280</span>
          <span>Horizon 90d</span>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-pill bg-indigo-600 text-[10px] font-bold text-white shadow-xs">
            JM
          </span>
          <p className="text-micro font-bold text-slate-900">Jacob Martin</p>
        </div>
        <div className="mt-2 flex items-center justify-between text-micro font-semibold">
          <span className="text-slate-700">$NVDA</span>
          <span className="rounded-pill bg-emerald-100 px-2 py-0.5 text-emerald-700 font-bold">Verified Hit</span>
        </div>
      </div>
    </div>
  );
}

function InvestMini() {
  return (
    <div className="flex h-full flex-col bg-white px-4 py-3 text-slate-900 select-none">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-900">Invest</p>
        <span className="h-4 w-4 rounded-pill border border-slate-200" />
      </div>

      <div className="mt-3 h-24 w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 border border-slate-100">
        <svg viewBox="0 0 180 64" className="h-full w-full" fill="none" aria-hidden="true">
          <path
            d="M2 52 C22 48 25 42 42 45 S65 30 78 35 S100 21 115 27 S140 12 153 18 S170 9 178 5"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-600"
          />
        </svg>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs font-semibold pt-3 border-t border-slate-100">
        <span className="text-slate-600">$100.00</span>
        <span className="text-emerald-700 font-bold">+10.00%</span>
      </div>
    </div>
  );
}