import { Reveal } from "@/components/motion/Reveal";
import { roles } from "@/data/careers";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

const stats: [string, string][] = [
  ["Remote", "Distributed collaboration across time zones"],
  ["Direct", "Flat engineering and design ownership"],
  ["Structured", "Transparent multi-stage hiring process"],
  [`${roles.length}`, "Active open positions currently hiring"],
];

export function Stats() {
  return (
    <section className="border-y border-border bg-card">
      <div
        className={`${section} grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4 md:divide-x`}
      >
        {stats.map(([n, label], i) => (
          <Reveal key={label} delay={i * 0.06} className="py-9 md:px-8 md:first:pl-0">
            <p className="display text-3xl text-brand sm:text-4xl">{n}</p>
            <p className="mt-2 text-sm text-text-secondary">{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
