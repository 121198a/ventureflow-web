import { Mail } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";

const section = "mx-auto max-w-[1240px] px-5 sm:px-6";

export function ClosingCTA() {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className={section}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft sm:px-12">
          <div
            className="gradient-blob absolute -bottom-24 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-brand"
            aria-hidden
          />
          <Reveal>
            <h2 className="display text-[clamp(2rem,5.5vw,3.6rem)]">Nothing fits yet?</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-lg text-text-secondary">
              Tell us what you would build here. Introductions from people who
              have done the work always get read.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Magnetic>
              <a
                href="mailto:careers@unboundxinc.com"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-brand-foreground shadow-[0_16px_40px_rgba(37,99,235,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <Mail size={16} aria-hidden />
                careers@unboundxinc.com
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
