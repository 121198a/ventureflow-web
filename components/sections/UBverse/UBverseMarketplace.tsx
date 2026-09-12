"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LaptopFrame } from "@/components/ui/LaptopFrame";
import { Reveal } from "@/components/ui/Reveal";

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
      <Reveal delay={0.25} className="mt-12 sm:mt-16 w-full max-w-[564px] mx-auto">
        <div className="flex justify-center">
          <LaptopFrame
            alt="UBverse marketplace showcased on a laptop with live capital raises, spotlight startups, and featured deals"
          />
        </div>
      </Reveal>
    </section>
  );
}