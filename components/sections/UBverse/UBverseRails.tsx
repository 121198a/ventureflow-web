"use client";

import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const rails = [
  {
    num: "01",
    tag: "Execution",
    title: "MARV Capital",
    body: "Registered broker-dealer",
  },
  {
    num: "02",
    tag: "Offering",
    title: "Reg D 506(b) or 506(c)",
    body: "The exemption is shown on each offering",
  },
  {
    num: "03",
    tag: "Investor access",
    title: "Verified when required",
    body: "Restricted materials open after verification",
  },
];

export function UBverseRails() {
  return (
    <section className="border-t border-slate-100 bg-white px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* Left List Card */}
        <Reveal
          direction="left"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-7"
        >
          <p className="text-xs font-bold tracking-wider text-slate-600 pb-3">
            How an offering works
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
                Offering infrastructure
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                MARV Capital
              </p>
            </div>

            <span className="rounded-pill bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
              Registered BD
            </span>
          </div>

          <p className="mt-4 text-xs italic leading-relaxed text-slate-600">
            Private investments are illiquid, long-term, and can lose their
            entire value. Nothing on this page is an offer to sell or a
            solicitation to buy any security.
          </p>
        </Reveal>

        {/* Right Compliance Copy */}
        <Reveal direction="right" delay={0.1}>
          <h3 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            The investment runs on regulated rails.
          </h3>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            MARV Capital, a registered broker-dealer, handles securities
            transactions. Anyone can discover companies openly. Access to
            offering materials and investment is controlled by the rules of
            each raise.
          </p>
        </Reveal>

      </div>
    </section>
  );
}