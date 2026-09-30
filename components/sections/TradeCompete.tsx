"use client";

import { Fragment } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Bookmark, FileText } from "lucide-react";

const savedList = [
  { rank: 1, name: "Northhstar Lab Pvt. Ltd.", stage: "Early Stage", active: false },
  { rank: 2, name: "Novaforge Pvt. Ltd.", stage: "Growth", active: true },
  { rank: 3, name: "Vertex Works Pvt. Ltd.", stage: "Early Growth", active: false },
];

export function TradeCompete() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/70 px-5 py-20 sm:py-28 border-t border-slate-200/80">
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-72 w-72 rounded-full bg-blue-100/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 bottom-1/4 h-72 w-72 rounded-full bg-sky-100/30 blur-3xl" />

      {/* Notes block */}
      <div className="relative z-10 mx-auto grid max-w-[1100px] items-start gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="order-2 lg:order-1 lg:pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs">
            <FileText size={14} className="text-blue-600" />
            <span>Notes &amp; Documents</span>
          </span>

          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Keep notes next to the conversation
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Add notes to any profile or document, so the reasoning behind a follow-up is never lost between tools.
          </p>
        </Reveal>

        <Reveal direction="right" delay={0.1} className="card-fintech order-1 p-6 sm:p-8 lg:order-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <p className="font-bold text-slate-900 text-base">Note on Novaforge Pvt. Ltd.</p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80">
              Sample
            </span>
          </div>

          <dl className="mt-5 space-y-3.5 border-t border-slate-100 pt-5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Linked to</dt>
              <dd className="font-bold text-slate-900">Product overview</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 font-medium">Next step</dt>
              <dd className="font-bold text-slate-900">Request introduction</dd>
            </div>
            <div className="flex justify-between gap-3 sm:gap-6">
              <dt className="shrink-0 text-slate-500 font-medium">Note</dt>
              <dd className="text-right font-medium text-slate-800 text-xs">
                Ask for the latest product update before the next call
              </dd>
            </div>
          </dl>

          <button type="button" className="btn-pill-primary mt-6 w-full py-3">
            Save note
          </button>

          <p className="mt-3.5 text-center text-xs text-slate-500 font-normal">
            Sample data for demonstration only.
          </p>
        </Reveal>
      </div>

      {/* Saved lists block */}
      <div className="relative z-10 mx-auto mt-24 grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="card-fintech p-6 sm:p-8">
          <p className="mb-5 flex items-center gap-2 font-bold text-slate-900 text-base">
            <Bookmark size={18} className="text-blue-600" /> Saved startups
          </p>

          <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 sm:gap-x-6 gap-y-4 text-xs sm:text-sm border-t border-slate-100 pt-4">
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600">#</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600">STARTUP</span>
            <span className="text-micro font-bold uppercase tracking-wider text-slate-600 text-right">STAGE</span>

            {savedList.map((row) => (
              <Fragment key={row.rank}>
                <span className={"font-bold tabular-numbers " + (row.active ? "text-blue-600 font-extrabold" : "text-slate-500")}>
                  {row.rank}
                </span>
                <span className={"font-semibold " + (row.active ? "text-blue-600" : "text-slate-800")}>
                  {row.name}
                </span>
                <span className={"text-right font-semibold " + (row.active ? "text-blue-600" : "text-slate-900")}>
                  {row.stage}
                </span>
              </Fragment>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-white/95 px-3.5 py-1 text-xs font-semibold text-blue-800 shadow-2xs">
            <Bookmark size={13} className="text-blue-600" />
            <span>Discovery</span>
          </span>
          <h3 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Save the startups you want to follow
          </h3>
          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Build saved lists, track where each conversation stands, and come back to a profile with the full context.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
