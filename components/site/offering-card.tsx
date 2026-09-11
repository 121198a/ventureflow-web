import Link from "next/link";
import { StatRow } from "./stat-row";
import type { Offering } from "@/lib/offerings-data";

export function OfferingCard({ o }: { o: Offering }) {
  const stats = [
    { value: o.goal, label: "Funding goal" },
    { value: o.min, label: "Min. Invest..." },
    { value: o.filing, label: "Security Filing" },
  ];

  return (
    <Link
      href={`/offerings/${o.slug}`}
      className="group block cursor-pointer rounded-lg transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(16,24,40,0.09)]"
    >
      <div
        className="grid aspect-[16/9] place-items-center overflow-hidden rounded-md border border-hairline"
        style={{ background: o.art }}
      >
        <span
          className="text-4xl text-white/90 transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ fontWeight: 800, letterSpacing: "-0.04em" }}
        >
          {o.initials}
        </span>
      </div>
      <h3
        className="mt-5 text-[1.35rem] transition-colors duration-200 group-hover:text-brand"
        style={{ fontWeight: 800 }}
      >
        {o.name}
      </h3>
      <p className="mt-1 text-[0.92rem] text-ink/70">Funding Round: {o.round}</p>
      <div className="mt-5">
        <StatRow items={stats} />
      </div>
    </Link>
  );
}
