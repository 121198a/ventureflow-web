"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function UBverseCta() {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative z-20 mt-14 sm:mt-24 md:mt-28 pb-8 sm:pb-0">
      <div className="relative px-4 sm:absolute sm:inset-x-0 sm:top-0 sm:-translate-y-1/2">
        <motion.div
          initial={mounted && !reduce ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45 }}
          className="card-fintech mx-auto flex w-full max-w-[1120px] flex-col items-start gap-8 p-6 md:p-10 shadow-lg md:flex-row md:items-center md:justify-between"
        >
          {/* Left Column */}
          <div className="max-w-xl text-left">
            <h3 className="text-2xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              There is a place for your company here.
            </h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
              Build your Company Space, share what you&apos;re working on, and
              give investors a place to follow your progress.
            </p>
            <div className="mt-6">
              {/* "Start your Company Space" routes to /platform */}
              <TransitionLink
                href="/platform"
                className="btn-pill-primary px-6 py-3 text-xs font-bold cursor-pointer"
              >
                <span>Start your Company Space</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </TransitionLink>
            </div>
          </div>

          {/* Right Column (Dual Links) */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-6 pt-6 lg:pt-0 border-t lg:border-l border-slate-200 lg:pl-10">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Building a company?
              </span>
              <TransitionLink
                href="/platform"
                className="mt-0.5 inline-block text-xs font-semibold text-blue-600 hover:underline"
              >
                Start your Company Space
              </TransitionLink>
              
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Looking for companies?
              </span>
              <TransitionLink
                href="/platform"
                className="mt-0.5 inline-block text-xs font-semibold text-blue-600 hover:underline"
              >
                Explore what&apos;s being built
              </TransitionLink>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
