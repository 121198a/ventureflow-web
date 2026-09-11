"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";

export function EditorialFeatureBanner() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 bg-white">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-r from-[#0a1226] via-[#0f1d3d] to-[#142852] p-8 sm:p-10 lg:p-14 text-white shadow-xl">
            {/* Ambient Background Elements */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="gb-subtle-grid absolute inset-0 opacity-10" />
              <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="absolute -bottom-10 left-1/3 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              {/* Text content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md border border-white/15">
                  <ShieldCheck size={14} className="text-blue-400" />
                  <span>The UnBound X Standard</span>
                </div>

                <h2 className="display mt-5 text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold tracking-tight text-white leading-[1.1]">
                  Turn market intuition into a{" "}
                  <span className="text-blue-400">verified track record.</span>
                </h2>

                <p className="mt-4 max-w-lg text-sm sm:text-base text-slate-300 leading-relaxed">
                  Anyone can claim to have called the market after the fact.
                  UnBound X establishes the immutable record-keeping layer for
                  equities and early-stage venture syndicates.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Non-editable timestamps</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Automated horizon settlement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Public credibility score</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <AuthButton
                    flow="signup"
                    icon={false}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-98"
                  >
                    <span>Start your record</span>
                    <ArrowRight size={15} />
                  </AuthButton>

                  <Link
                    href="/ubverse"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                  >
                    Explore UBverse
                  </Link>
                </div>
              </div>

              {/* Visual Frame: NVDA / GOOGL Live Thesis Card Preview */}
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Live Public Thesis
                      </span>
                    </div>
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-micro font-bold text-blue-300 border border-blue-400/30">
                      LONG · VERIFIED
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Ticker</span>
                      <span className="text-sm font-bold text-white">NVDA · NVIDIA Corp.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Entry Level</span>
                      <span className="text-sm font-bold text-white">$219.86</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Target Horizon</span>
                      <span className="text-sm font-bold text-emerald-400">$260.00 (Dec 2026)</span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-black/25 p-3.5 border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Current Progress</span>
                      <span className="font-bold text-emerald-400">+42.1% Hit</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-slate-400 text-center">
                    Published and immutable on UnBound X · Viewable by any investor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
