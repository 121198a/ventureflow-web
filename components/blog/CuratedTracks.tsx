"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileCheck,
  PieChart,
  BookOpen,
  TrendingUp,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { curatedTracks } from "@/lib/blog-data";

const iconMap = {
  PieChart: PieChart,
  TrendingUp: TrendingUp,
  FileCheck: FileCheck,
  Users: Users,
};

export function CuratedTracks() {
  return (
    <section id="playbooks" className="scroll-mt-24 relative overflow-hidden py-14 sm:py-20 border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <BookOpen size={13} className="text-blue-600" />
              <span>Frameworks & Handbooks</span>
            </div>
            <h2 className="display mt-3 text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-tight text-slate-900">
              Insider Playbooks for Maximum Conviction
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
              Practical frameworks, cap table tools, and diligence
              frameworks tested across real market outcomes.
            </p>
          </Reveal>
        </div>

        {/* 4 Thematic Cards Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {curatedTracks.map((track, i) => {
            const Icon = iconMap[track.iconName as keyof typeof iconMap] || TrendingUp;
            const isFirst = i === 0;

            return (
              <Reveal key={track.id} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`card-fintech-interactive group relative flex flex-col justify-between p-6 ${
                    isFirst
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600"
                      : "bg-slate-50/70 hover:bg-white text-slate-900"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isFirst
                            ? "bg-white/20 text-white border border-white/20"
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}
                      >
                        {track.badge}
                      </span>
                      <div
                        className={`grid h-8 w-8 place-items-center rounded-lg ${
                          isFirst ? "bg-white/15 text-white" : "bg-white text-blue-600 shadow-2xs border border-slate-200/60"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                    </div>

                    <h3
                      className={`mt-5 text-lg font-bold tracking-tight ${
                        isFirst ? "text-white" : "text-slate-900 group-hover:text-blue-600"
                      }`}
                    >
                      {track.title}
                    </h3>

                    <p
                      className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                        isFirst ? "text-blue-100" : "text-slate-600"
                      }`}
                    >
                      {track.description}
                    </p>
                  </div>

                  <div className={`mt-6 pt-4 border-t ${isFirst ? "border-white/15" : "border-slate-100"}`}>
                    <Link
                      href={`/blog/${track.slug}`}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all ${
                        isFirst
                          ? "text-white hover:underline"
                          : "text-blue-600 group-hover:translate-x-1"
                      }`}
                    >
                      <span>{track.ctaText}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
