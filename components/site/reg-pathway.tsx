import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "./reveal";

export type RegPathwayPoint = { text?: string; highlight?: string; rest?: string };
export type RegPathway = { title: string; cta: string; points: RegPathwayPoint[] };

function RegPathwayCard({ deal, delay }: { deal: RegPathway; delay: number }) {
  return (
    <Reveal delay={delay} className="flex flex-col">
      <h3 className="text-[19px] font-semibold text-ink">{deal.title}</h3>
      <ul className="mt-5 flex-1 space-y-4">
        {deal.points.map((p, i) => (
          <li key={i} className="flex gap-2.5">
            <Check className="mt-0.5 size-3.5 shrink-0 text-brand" strokeWidth={3} />
            <span className="text-[13.5px] leading-[1.5] text-ink/85">
              {p.text}
              {p.highlight && <span className="font-medium text-brand">{p.highlight}</span>}
              {p.rest}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className="mt-8 rounded-md border border-brand/60 px-5 py-2.5 text-center text-[13.5px] font-medium text-brand transition-colors hover:bg-brand/5"
      >
        {deal.cta}
      </Link>
    </Reveal>
  );
}

export function RegPathwayGrid({ deals }: { deals: RegPathway[] }) {
  return (
    <div className="mt-10 grid gap-10 md:grid-cols-3">
      {deals.map((deal, i) => (
        <RegPathwayCard key={deal.title} deal={deal} delay={i * 90} />
      ))}
    </div>
  );
}
