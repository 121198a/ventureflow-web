import { Reveal } from "@/components/motion/Reveal";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

const stats: [string, string][] = [
  ["28", "People across 6 countries"],
  ["100%", "Remote-first since day one"],
  ["48h", "From final round to offer"],
  ["4", "Open roles right now"],
];

export function Stats() {
  return (
    <section className="border-y border-border bg-card">
      <div
        className={`${section} grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4 md:divide-x`}
      >
        {stats.map(([n, label], i) => (
          <Reveal key={label} delay={i * 0.06} className="py-9 md:px-8 md:first:pl-0">
            <p className="display text-4xl text-brand sm:text-5xl">{n}</p>
            <p className="mt-3 text-sm text-text-secondary">{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
