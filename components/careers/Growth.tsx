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
            <h2 className="display mt-5 text-[clamp(1.9rem,4.5vw,3rem)]">
              We hire for the next two roles, not just this one.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {items.map(([t, b], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand/40">
                  <h3 className="display flex items-center gap-2 text-base">
                    <ArrowRight size={16} className="text-brand" aria-hidden />
                    {t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
