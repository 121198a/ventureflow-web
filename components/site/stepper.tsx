"use client";

import { useEffect, useRef, useState } from "react";

export type Step = { n: number; label: string };

/**
 * Horizontal stepper (desktop) / 2-col grid (mobile, no connector — avoids
 * horizontal overflow below ~450px). The connecting line fills left-to-right
 * once the stepper scrolls into view, per the reference video's restrained
 * "connector line fills on scroll" motion. Rendered as a real <ol> for
 * screen readers rather than purely visual number glyphs.
 */
export function Stepper({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {/* Mobile: 2-column grid, no connector lines */}
      <ol className="grid grid-cols-2 gap-x-6 gap-y-8 sm:hidden">
        {steps.map((step) => (
          <li key={step.n} className="flex flex-col items-center text-center">
            <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full border-2 border-brand/70 text-[20px] font-semibold text-brand">
              {step.n}
            </div>
            <p className="mt-3 whitespace-pre-line text-[12px] font-medium leading-[1.4] text-ink/85">
              {step.label}
            </p>
          </li>
        ))}
      </ol>

      {/* Desktop: single connected row with a fill-on-scroll connector */}
      <ol className="hidden items-start justify-between sm:flex">
        {steps.map((step, i) => (
          <li key={step.n} className="flex flex-1 items-start">
            <div className="flex w-full flex-col items-center text-center">
              <div className="flex size-[58px] shrink-0 items-center justify-center rounded-full border-2 border-brand/70 text-[22px] font-semibold text-brand">
                {step.n}
              </div>
              <p className="mt-3 whitespace-pre-line text-[12px] font-medium leading-[1.4] text-ink/85">
                {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className="relative mt-[29px] h-px w-8 shrink-0 overflow-hidden bg-brand/20 lg:w-10">
                <div
                  className="h-full bg-brand/60 transition-transform duration-700 ease-out"
                  style={{
                    transform: filled ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transitionDelay: `${i * 120}ms`,
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
