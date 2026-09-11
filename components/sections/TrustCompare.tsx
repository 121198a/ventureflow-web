"use client";

import { CheckCircle2, MoreVertical, ThumbsUp, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

export function TrustCompare() {
  return (
    <section className="bg-slate-100 border-slate-200 px-5 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-[900px] text-center">
        <span className="inline-flex items-center rounded-pill border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-600">
          The shift
        </span>

        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
          <span className="text-blue-600"><CountUp value={61} suffix="%" /></span> of investors under 35 take investment ideas from social media.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs text-slate-600">
          FINRA Investor Education Foundation,{" "}
          <a
            href="https://www.finra.org/media-center/newsreleases/2025/finra-foundation-releases-sixth-wave-national-financial-capability"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-blue-600"
          >
            National Financial Capability Study, 2025
          </a>
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg font-medium text-slate-600">
          Most ideas disappear into the feed. The outcome usually disappears with them.
        </p>
      </Reveal>

      <div className="relative mx-auto mt-16 grid grid-cols-1 max-w-[1100px] items-stretch gap-8 md:grid-cols-2">
        {/* Without Track Record (Left Side) */}
        <Reveal direction="left" className="w-full min-w-0 flex flex-col rounded-lg border border-slate-200 bg-slate-50/60 p-5 sm:p-7 shadow-xs">
          <p className="text-center text-lg font-bold text-slate-600 mb-4">
            Online, you can&apos;t tell who is actually right.
          </p>

          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-pill bg-slate-100 text-xs font-bold text-slate-600 shrink-0">
                  MM
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight">MarketMaverick</p>
                  <p className="text-xs text-slate-600">@mavmarkets</p>
                </div>
              </div>
              <span className="text-xs text-slate-600 shrink-0">2h</span>
            </div>

            <p className="mt-3 text-sm text-slate-700 leading-snug">
              NVDA is going to rip before earnings. Loaded up calls this morning, I am up 312% on the year.
            </p>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
              <span>1,204 likes</span>
              <span>212 reposts</span>
              <span>89 replies</span>
              <span>84.2K views</span>
            </div>

            <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-3.5">
              <span className="grid h-7 w-7 place-items-center rounded-pill bg-slate-100 text-micro font-bold text-slate-600">
                DR
              </span>
              <p className="text-xs">
                <span className="font-semibold text-slate-900">@d_reyes: </span>
                <span className="text-slate-600">hey did this one ever actually work out?</span>
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white/60 p-4 text-center">
            <p className="text-xs font-bold text-slate-600 tracking-wide">No track record available</p>
            <p className="mt-0.5 text-xs text-slate-600">No target, no date, no way to check what happened next.</p>
          </div>
        </Reveal>

        {/* With Track Record (Right Side - UnBound X) */}
        <Reveal direction="right" className="gb-interactive-card relative w-full min-w-0 flex flex-col rounded-lg border-2 border-blue-600 bg-white p-5 sm:p-7 shadow-xl shadow-blue-500/5">
          <span className="absolute -top-3.5 right-6 rounded-pill bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-xs">
            UnBound X
          </span>

          <p className="text-center text-lg font-bold text-slate-900 mb-4">
            Here, you can check.
          </p>

          <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-9 w-9 rounded-lg bg-cover bg-center shadow-xs shrink-0"
                  style={{ backgroundImage: "url(https://i.pravatar.cc/100?img=12)" }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight">Jacob Martin</p>
                  <p className="text-xs text-slate-600">@jmartin</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-slate-600 font-medium shrink-0">
                90d ago <MoreVertical size={13} />
              </span>
            </div>

            <p className="mt-3 text-sm font-bold text-slate-900 leading-snug">
              NVDA rerates as data center demand outruns supply
            </p>

            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Capacity guidance keeps slipping while supply stays tight into next year. The setup supports the target, not a melt up, and the risk is a single quarter&hellip;
            </p>

            <div className="mt-3 flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-100 shadow-2xs">
              <span>Target <b className="text-slate-900 font-bold">$280</b></span>
              <span className="text-slate-300">|</span>
              <span>Horizon <b className="text-slate-900 font-bold">90d</b></span>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-3 text-slate-600">
                <span className="flex items-center gap-1"><ThumbsUp size={13} /> 100</span>
                <span className="flex items-center gap-1"><MessageCircle size={13} /> 734</span>
              </span>

              <span className="flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-pill bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-100 text-micro">
                  <CheckCircle2 size={12} /> Hit
                </span>
                <span className="rounded-pill bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 text-micro">
                  $NVDA
                </span>
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-xs shrink-0">
                JM
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 leading-tight">Jacob&apos;s record</p>
                <p className="text-xs text-slate-600 truncate sm:whitespace-normal">41 theses closed &middot; 17 missed &middot; public, nothing deleted</p>
              </div>
            </div>

            <div className="shrink-0 text-right pl-2">
              <p className="text-xl font-black text-slate-900 leading-none">58%</p>
              <p className="text-micro font-semibold text-slate-600 mt-0.5">Hit rate</p>
            </div>
          </div>
        </Reveal>

        {/* Floating "vs" Divider */}
        <span className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-black uppercase text-slate-600 shadow-md md:flex z-20">
          vs
        </span>
      </div>
    </section>
  );
}