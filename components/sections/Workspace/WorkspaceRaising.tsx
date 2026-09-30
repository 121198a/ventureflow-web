"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const deals = [
  {
    initials: "NL",
    name: "Northhstar Lab Pvt. Ltd.",
    sub: "Fictional demo profile",
    tag: "Sample",
    focus: "Technology & AI",
    round: "Early Stage",
    location: "Demo Workspace",
    access: "Sample data",
    mark: "bg-gradient-to-br from-blue-500 to-indigo-600",
    logo: "/brand/companies/northhstar-lab-pvt-ltd.webp",
    slug: "northhstar-lab-pvt-ltd",
  },
  {
    initials: "NF",
    name: "Novaforge Pvt. Ltd.",
    sub: "Fictional demo profile",
    tag: "Sample",
    focus: "Innovation & Crafting",
    round: "Growth",
    location: "Demo Workspace",
    access: "Sample data",
    mark: "bg-gradient-to-br from-sky-500 to-blue-700",
    logo: "/brand/companies/novaforge-pvt-ltd.webp",
    slug: "novaforge",
  },
  {
    initials: "VW",
    name: "Vertex Works Pvt. Ltd.",
    sub: "Fictional demo profile",
    tag: "Sample",
    focus: "Advanced Consulting & Integration",
    round: "Early Growth",
    location: "Demo Workspace",
    access: "Sample data",
    mark: "bg-gradient-to-br from-cyan-500 to-blue-600",
    logo: "/brand/companies/vertex-works-pvt-ltd.webp",
    slug: "vertexworks",
  },
];

export function WorkspaceRaising() {
  return (
    <section id="raising" className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 px-5 py-20 text-slate-900 sm:py-28 border-y border-slate-200/80">
      {/* Subtle Light Ambient Wash */}
      <div className="pointer-events-none absolute left-1/3 top-0 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-sky-50/60 blur-3xl" />

      <Reveal className="relative z-10 mx-auto max-w-[820px] text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/95 px-4 py-1.5 text-xs font-semibold text-blue-800 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
          Now on VentureFlow
        </span>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Startup profiles, ready to explore.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-slate-600 leading-relaxed">
          Sample profiles that show how a startup page looks inside a workspace.
        </p>
      </Reveal>

      {/* Raising Deal Cards */}
      <div className="relative z-10 mx-auto mt-16 grid max-w-[1100px] gap-6 md:grid-cols-3">
        {deals.map((d, i) => (
          <Reveal
            key={d.name}
            delay={i * 0.1}
            className="card-fintech-interactive p-4 sm:p-6 w-full max-w-full overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-xs">
                  {d.logo ? (
                    <Image
                      src={d.logo}
                      alt={d.name}
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className={`h-full w-full grid place-items-center text-xs font-bold text-white ${d.mark}`}>
                      {d.initials}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">{d.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{d.sub}</p>
                </div>
              </div>
              <span className="shrink-0 self-start rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-xs font-bold text-blue-700">
                {d.tag}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {d.focus}
              <span className="font-sans text-xs font-medium text-slate-500">category</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <span>
                {d.round} &middot; <b className="text-slate-900">{d.location}</b>
              </span>
              <span className="text-xs font-medium text-slate-500">{d.access}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="relative z-10 mt-14 text-center">
        <Link
          href="/platform"
          className="btn-pill-primary px-7 py-3.5"
        >
          <span>Explore companies</span>
          <ArrowRight size={15} />
        </Link>
      </Reveal>
    </section>
  );
}