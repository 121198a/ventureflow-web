"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pt-32 pb-16 sm:pt-40 md:pt-48 md:pb-24"
    >
      <div className="subtle-grid absolute inset-0 -z-20" aria-hidden />
      <div
        className="gradient-blob absolute -top-24 -left-24 -z-10 h-[420px] w-[420px] rounded-full bg-brand"
        aria-hidden
      />
      <div
        className="gradient-blob absolute -top-10 right-0 -z-10 h-[320px] w-[320px] rounded-full bg-signal"
        aria-hidden
      />

      <div className={section}>
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold tracking-wider text-text-secondary uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Careers · UnBound X
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="display mt-7 max-w-4xl text-[clamp(2.1rem,7.5vw,5.5rem)]">
            Build what
            <br />
            comes <span className="text-brand">next.</span>
          </h1>
        </Reveal>

        <div className="mt-9 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <Reveal delay={0.16}>
            <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
              We are a small, senior team building the connective tissue
              between founders, investors and the capital that moves between
              them. Fewer people, higher trust, real ownership.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Magnetic>
                <button
                  onClick={() => scrollToTarget("#roles")}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-[0_16px_40px_rgba(37,99,235,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  View open roles
                  <ArrowUpRight size={16} />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollToTarget("#life")}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40"
                >
                  Meet the culture
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-soft sm:mt-16">
            <motion.div style={{ y, scale }} className="relative aspect-[16/9] w-full">
              <Image
                src="/images/life-studio.jpg"
                alt="The UnBound X team working together in a bright studio"
                fill
                priority
                sizes="(min-width: 1240px) 1190px, 100vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
