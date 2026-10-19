import { Reveal } from "@/components/motion/Reveal";
import { hiringSteps } from "@/data/careers";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

export function HiringProcess() {
  return (
    <section id="process" aria-labelledby="process-title" className="scroll-mt-24 border-t border-border py-20 sm:py-28">
      <div className={section}>
        <Reveal>
          <p className="eyebrow">Hiring process</p>
          <h2 id="process-title" className="display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Four steps. Two weeks. No ghosting.
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none m-0 p-0">
          {hiringSteps.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 0.06}>
              <article className="h-full border-t-2 border-t-blue-600 border-x border-b border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:bg-slate-50/60">
                <p className="display text-xs font-bold text-blue-600 tracking-wider uppercase">{s.step}</p>
                <h3 className="display mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
