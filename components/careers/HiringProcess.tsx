import { Reveal } from "@/components/motion/Reveal";
import { hiringSteps } from "@/data/careers";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

export function HiringProcess() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-border py-20 sm:py-28">
      <div className={section}>
        <Reveal>
          <p className="eyebrow">Hiring process</p>
          <h2 className="display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Four steps. Two weeks. No ghosting.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hiringSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.06}>
              <div className="lift h-full rounded-2xl border border-border bg-card p-6">
                <p className="display text-sm text-brand">{s.step}</p>
                <h3 className="display mt-5 text-lg">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
