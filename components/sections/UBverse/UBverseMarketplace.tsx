"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LaptopFrame } from "@/components/ui/LaptopFrame";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArrowRight } from "lucide-react";

const categories = ["fintech.", "climate.", "space.", "robotics.", "energy.", "biotech."];

export function UBverseMarketplace() {
  const [categoryIndex, setCategoryIndex] = useState(0);

  // Auto changing category ticker
  useEffect(() => {
    const categoryInterval = setInterval(() => {
      setCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 2400);
    return () => clearInterval(categoryInterval);
  }, []);

  return (
    <section className="bg-white px-5 py-20 sm:py-28 border-t border-slate-100 overflow-hidden">
      <div className="mx-auto max-w-[900px] text-center">
        {/* Clean Rotating Heading */}
        <Reveal delay={0.1}>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
            The next company worth backing <br />
            could be built in{" "}
            <span className="inline-block text-blue-600 font-black min-w-[110px] sm:min-w-[140px] text-left">
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
      <Reveal delay={0.25} className="mt-10 sm:mt-14 w-full max-w-[580px] mx-auto overflow-hidden px-1">
        <div className="flex justify-center w-full max-w-full overflow-hidden">
          <LaptopFrame
            alt="UBverse marketplace showcased on a laptop with live capital raises, spotlight startups, and featured deals"
          />
        </div>
      </Reveal>

      {/* "Start your Space" CTA — visually placed BELOW the laptop */}
      <Reveal delay={0.3} className="mt-8 sm:mt-10 flex justify-center">
        <TransitionLink
          href="/login?flow=signup"
          className="btn-pill-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 transition-all cursor-pointer"
        >
          <span>Start your Space</span>
          <ArrowRight className="h-4 w-4" />
        </TransitionLink>
      </Reveal>
    </section>
  );
}