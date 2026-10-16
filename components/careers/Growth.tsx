import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

const items: [string, string][] = [
  [
    "Personal roadmap",
    "A written plan reviewed every quarter — scope, skills, compensation.",
  ],
  [
    "Learning budget",
    "Courses, conferences and tooling covered without a business case.",
  ],
  [
    "Internal mobility",
    "Engineers move into product, analysts move into investing. It happens.",
  ],
];

export function Growth() {
  return (
    <section id="growth" className="scroll-mt-24 border-t border-border py-20 sm:py-28">
      <div className={`${section} grid items-center gap-12 md:grid-cols-2`}>
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/growth-session.jpg"
                alt="A growth planning session at the whiteboard"
                loading="lazy"
                fill
                sizes="(min-width: 768px) 585px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">Growth</p>
            <h2 className="display mt-5 text-3xl sm:text-4xl lg:text-5xl">
              We hire for the next two roles, not just this one.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {items.map(([t, b], i) => (
              <Reveal as="article" key={t} delay={i * 0.06} className="border-l-2 border-l-slate-300 border-y border-r border-slate-200/80 bg-white p-5 transition-all hover:border-l-blue-600 hover:bg-slate-50/50">
                <h3 className="display flex items-center gap-2 text-base font-bold text-slate-900">
                  <ArrowRight size={16} className="text-blue-600" aria-hidden />
                  {t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
