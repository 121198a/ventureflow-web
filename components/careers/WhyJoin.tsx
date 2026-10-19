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
    <section id="why" aria-labelledby="why-title" className="scroll-mt-24 py-20 sm:py-28">
      <div className={`${section} grid gap-12 md:grid-cols-[0.85fr_1.15fr]`}>
        <Reveal>
          <p className="eyebrow">Why join</p>
          <h2 id="why-title" className="display animated-rule mt-5 inline-block pb-3 text-3xl sm:text-4xl lg:text-5xl">
            A place where the work is actually yours.
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map(([title, body], i) => (
            <Reveal as="article" key={title} delay={i * 0.06} className="h-full border-l-2 border-l-blue-600 border-y border-r border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:bg-slate-50/70">
              <span className="inline-flex h-7 w-7 items-center justify-center bg-blue-50 text-xs font-bold text-blue-700 border border-blue-100">
                0{i + 1}
              </span>
              <h3 className="display mt-4 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
