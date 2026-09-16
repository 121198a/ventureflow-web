"use client";

import { Eye, MessageCircle, ThumbsUp, X, Check } from "lucide-react";
import { PartnershipRingsIcon } from "@/components/ui/CustomIcons";
import { Reveal } from "@/components/ui/Reveal";
import { AuthButton } from "@/components/ui/AuthButton";

const rejected = [
  {
    initials: "MC",
    title: "Deere recovers as the replacement cycle turns",
    author: "Maya Chen",
    target: "$480",
    horizon: "180d",
    pct: "+8.0%",
    status: "On track",
    up: true,
  },
  {
    initials: "AL",
    title: "Nike is repriced before the numbers turn",
    author: "Andre Lewis",
    target: "$95",
    horizon: "150d",
    pct: "-7.5%",
    status: "Off track",
    up: false,
  },
  {
    initials: "PR",
    title: "Waste Management holds pricing through the cycle",
    author: "Priya Raman",
    target: "$245",
    horizon: "200d",
    pct: "+4.0%",
    status: "On track",
    up: true,
  },
];

export function Spaces() {
  return (
    <section id="spaces" className="scroll-mt-24 bg-slate-50/70 border-t border-slate-200/80 px-5 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-[900px] text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
          <PartnershipRingsIcon size={14} className="text-blue-600" />
          <span>Spaces &middot; Collaborative Analyst Hubs</span>
        </span>

        <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
          Formulate, debate, and <br />
          <span className="text-blue-600">decide on theses together.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
          Spaces provide investment clubs, collegiate funds, and analyst teams with a structured environment to debate arguments, record consensus votes, and track collective accuracy over time.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mx-auto mt-16 max-w-[840px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card hover:shadow-elevated transition-shadow">
        {/* Cover Header */}
        <div className="h-16 bg-gradient-to-r from-blue-100/70 via-slate-100 to-emerald-50/70 border-b border-slate-100" />

        {/* Space Profile Detail */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 sm:px-7 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="-mt-8 grid h-14 w-14 shrink-0 place-items-center rounded-lg border-4 border-white bg-blue-100 text-sm font-bold text-blue-700 shadow-md">
              BC
            </span>

            <div>
              <p className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-bold text-slate-900 text-base">
                Bravo Investment Club
                <span className="rounded-pill bg-slate-100 px-2.5 py-0.5 text-micro font-bold tracking-wider text-blue-700">
                  UNIVERSITY FUND
                </span>
              </p>

              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                <span>24 verified analysts</span>
                <span>&middot;</span>
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-pill bg-emerald-500 animate-pulse" /> Active today
                </span>
              </p>
            </div>
          </div>

          <span className="inline-flex self-start sm:self-auto items-center gap-1.5 rounded-pill border border-slate-200/80 bg-slate-50/50 px-3 py-1 text-xs font-medium text-slate-600">
            <Eye size={13} className="text-slate-600" />
            Configurable member visibility
          </span>
        </div>

        {/* Submenu Tabs */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-100 px-4 sm:gap-x-6 sm:px-7 text-xs font-bold uppercase tracking-wider text-slate-600">
          <span className="py-3 hover:text-slate-600 cursor-pointer">Announcements</span>
          <span className="border-b-2 border-blue-600 py-3 text-blue-600">Theses</span>
          <span className="py-3 hover:text-slate-600 cursor-pointer">Portfolio</span>
        </div>

        {/* Approved Thesis Feature */}
        <div className="px-4 sm:px-7 pt-5">
          <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <span className="grid h-4 w-4 place-items-center rounded-pill bg-emerald-50">
              <Check size={13} className="text-emerald-700" />
            </span>
            Space-Approved Position
          </p>

          <div className="gb-interactive-card mt-3 rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-pill bg-indigo-600 text-xs font-bold text-white shadow-xs shrink-0">
                  SK
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight truncate">Sarah Kim</p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">@skim &middot; Lead Consumer Analyst</p>
                </div>
              </div>

              <span className="shrink-0 rounded-pill bg-blue-50 border border-blue-100/80 px-2.5 sm:px-3 py-1 text-micro sm:text-xs font-bold text-blue-700 text-center">
                Allocated to portfolio
              </span>
            </div>

            <h3 className="mt-3.5 text-base font-bold text-slate-900 leading-snug">
              Costco Wholesale: Defensible Compounding Through Trade-Down Cycles
            </h3>

            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Membership renewal rates of 93% and private-label basket share gains maintain gross margin expansion despite broader discretionary spending compression.
            </p>

            <div className="mt-3.5 flex items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 border border-slate-100">
              <span>Target <b className="text-slate-900 font-bold">$1,050</b></span>
              <span>Horizon <b className="text-slate-900 font-bold">120d</b></span>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-3 text-slate-600">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <ThumbsUp size={13} /> 18
                </span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <MessageCircle size={13} /> 9
                </span>
              </span>

              <span className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-semibold">
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-pill bg-emerald-500" /> On track
                </span>
                <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-slate-700 text-micro font-semibold">
                  $COST
                </span>
                <span className="rounded-pill bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-emerald-700 text-micro font-bold">
                  Bullish
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Rejected / Tracked Theses Track */}
        <div className="px-4 sm:px-7 pb-7 pt-6">
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <X size={14} className="text-rose-600" /> Non-Consensus Theses, Permanently Tracked
          </p>

          <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 overflow-hidden">
            {rejected.map((r) => (
              <div
                key={r.title}
                className="gb-interactive-card flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-slate-100 text-xs font-bold text-slate-600">
                    {r.initials}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                      {r.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 truncate">
                      {r.author} &middot; Target {r.target} &middot; Horizon {r.horizon}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right text-xs sm:text-sm font-bold">
                  <p className={r.up ? "text-emerald-700" : "text-rose-600"}>
                    {r.pct}
                  </p>
                  <p className={"text-micro font-medium " + (r.up ? "text-emerald-700" : "text-rose-600")}>
                    {r.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto max-w-[840px] px-6 py-8 text-center">
        <p className="text-sm text-slate-600">
          Host meetings, share announcements, and control who can view your club&apos;s track record.
        </p>

        <AuthButton flow="signup" className="mt-4 rounded-pill bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700">
          Create your club&apos;s Space
        </AuthButton>
      </Reveal>
    </section>
  );
}