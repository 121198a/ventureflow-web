"use client";

import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const rails = [
  {
    num: "01",
    tag: "Profiles",
    title: "Startup profile",
    body: "Story, product and team in one place",
  },
  {
    num: "02",
    tag: "Collaboration",
    title: "Messages and notes",
    body: "Keep every conversation next to the profile",
  },
  {
    num: "03",
    tag: "Documents",
    title: "Shared on request",
    body: "Owners choose who can open each document",
  },
];

export function WorkspaceRails() {
  return (
    <section className="border-t border-slate-100 bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* Left List Card */}
        <Reveal
          direction="left"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-7"
        >
          <p className="text-xs font-bold tracking-wider text-slate-600 pb-3">
            How a workspace works
          </p>

          <hr className="faded-line" />

          <div className="mt-3 divide-y divide-slate-100">
            {rails.map((r) => (
              <div
                key={r.num}
                className="flex items-center gap-4 py-4"
              >
                <div className="flex-1">
                  <p className="font-mono text-xs font-bold tracking-wider text-blue-600">
                    {r.num} &nbsp; {r.tag}
                  </p>

                  <p className="mt-1 text-sm font-bold leading-tight text-slate-900 sm:text-base">
                    {r.title}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
                    {r.body}
                  </p>
                </div>

                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-pill bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={16} />
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-slate-600">
                Workspace
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                VentureFlow
              </p>
            </div>

            <span className="rounded-pill bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
              Workspace
            </span>
          </div>

          <p className="mt-4 text-xs italic leading-relaxed text-slate-600">
            VentureFlow is a collaboration workspace. It does not broker,
            arrange or execute financial transactions.
          </p>
        </Reveal>

        {/* Right Compliance Copy */}
        <Reveal direction="right" delay={0.1}>
          <h3 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            One workspace for the whole relationship.
          </h3>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Founders and investors keep profiles, introductions, messages, notes and documents together. Anyone can explore sample profiles freely, while each workspace owner decides who can see shared documents.
          </p>
        </Reveal>

      </div>
    </section>
  );
}