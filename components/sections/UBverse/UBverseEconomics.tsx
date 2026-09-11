import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { UBVERSE_SERVICES_URL } from "@/lib/constants";

const costs = [
  { label: "Conference badge", value: "$1,850" },
  { label: "Startup booth", value: "$4,500" },
  { label: "Diligence retainer", value: "$45,000" },
];

export function UBverseEconomics() {
  return (
    <section className="bg-slate-50 px-5 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-[820px] text-center">
        <span className="inline-flex items-center rounded-pill border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600">
          The economics
        </span>
        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          You should not have to pay
          <br />
          <span className="text-blue-600">to be discovered.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-slate-600">
          Founders spend thousands just trying to get in the room. Discovery on UBverse starts
          differently.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="gb-interactive-card mx-auto mt-12 max-w-[900px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
            HD
          </span>
          <div>
            <p className="font-bold text-slate-900">Halden Diagnostics</p>
            <p className="text-xs text-slate-600">Point of care testing &middot; Series A</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-[1.3fr_1fr]">
          <div className="border-b border-slate-100 p-7 sm:border-b-0 sm:border-r">
            <p className="text-left text-xs font-bold text-slate-600">
              Typical path to being seen
            </p>
            {costs.map((c) => (
              <div key={c.label} className="mt-3 flex items-baseline justify-between border-b border-dashed border-slate-200 pb-3">
                <span className="text-slate-700">{c.label}</span>
                <span className="font-mono text-sm text-slate-600">{c.value}</span>
              </div>
            ))}
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-900">Upfront costs shown</span>
              <span className="text-xl font-extrabold text-slate-900">
                $51,350
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600">
              + 8% warrant coverage &middot; + 7% success fee
            </p>
          </div>

          <div className="flex flex-col justify-center p-7">
            <p className="text-left text-xs font-bold text-slate-600">
              Discovery on UBverse
            </p>
            <p className="mt-1 flex items-start font-display text-5xl font-extrabold leading-none text-blue-600">
              <span className="mt-1 text-2xl leading-none">$</span>
              <CountUp value={0} />
            </p>
            <p className="mt-2 text-sm text-slate-600">to list your Company Space</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-8 max-w-[700px] text-center">
        <p className="text-slate-600 pb-3">
          Share your company, progress, team, and raise without paying to be listed.
        </p>
        <a
          href={UBVERSE_SERVICES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-blue-600"
        >
          Need help running your raise? Explore fundraising services →
        </a>
      </Reveal>
    </section>
  );
}
