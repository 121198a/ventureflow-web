import { Reveal } from "@/components/motion/Reveal";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

const reasons: [string, string][] = [
  [
    "Ownership, not tickets",
    "You take a problem from first sketch to production and stay with it after launch.",
  ],
  [
    "Senior by default",
    "No layers between you and the decision. Context is shared, not gatekept.",
  ],
  [
    "Craft has budget",
    "Time for the second pass, the details, the performance work that users feel.",
  ],
  [
    "Compounding growth",
    "A learning budget, real mentorship and room to change what you are good at.",
  ],
];

export function WhyJoin() {
  return (
    <section id="why" className="scroll-mt-24 py-20 sm:py-28">
      <div className={`${section} grid gap-12 md:grid-cols-[0.85fr_1.15fr]`}>
        <Reveal>
          <p className="eyebrow">Why join</p>
          <h2 className="display animated-rule mt-5 inline-block pb-3 text-3xl sm:text-4xl lg:text-5xl">
            A place where the work is actually yours.
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="lift h-full rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                  0{i + 1}
                </span>
                <h3 className="display mt-5 text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
