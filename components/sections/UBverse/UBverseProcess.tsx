"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { title: "Review the page", body: "The story, the numbers, the team." },
  { title: "Follow the updates", body: "Milestones post as they happen." },
  {
    title: "Complete the investment",
    body: "Documents open after verification.",
    mark: "Through MARV Capital",
  },
];

export function UBverseProcess() {
  const [active, setActive] = useState(0);
  const ref0 = useRef<HTMLButtonElement>(null);
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const refs = [ref0, ref1, ref2];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = refs.findIndex((r) => r.current === entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0.1 }
    );
    refs.forEach((r) => r.current && observer.observe(r.current));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="how" className="bg-blue-50 px-5 py-20 sm:py-28 border-y border-slate-100">
      <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        {/* Left Sticky Column */}
        <div className="lg:col-span-6 min-[1061px]:sticky min-[1061px]:top-28">
          <Reveal>
            <h3 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl tracking-tight">
              Follow the company before making a decision.
            </h3>
            <p className="mt-4 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
              Investors can review the company, follow its updates, and watch how the business develops over time. When they are ready to invest, MARV Capital handles the paperwork.
            </p>
          </Reveal>
        </div>

        {/* Right Stepper Steps */}
        <div className="lg:col-span-6 flex flex-col gap-12 sm:gap-16 py-4">
          {steps.map((s, i) => (
            <button
              key={s.title}
              ref={refs[i]}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Step ${i + 1}: ${s.title}`}
              aria-current={active === i ? "step" : undefined}
              className="flex w-full text-left gap-5 cursor-pointer group rounded-lg p-1 transition-colors focus-ring"
            >
              {/* Stepper Node & Connecting Line */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 font-mono text-xs font-bold",
                    active >= i
                      ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                      : "border-slate-300 bg-white text-slate-600"
                  )}
                >
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "mt-2 w-0.5 flex-1 transition-colors duration-300 min-h-[70px]",
                      active > i ? "bg-blue-600" : "bg-slate-200"
                    )}
                  />
                )}
              </div>

              {/* Step Details */}
              <div className={cn("min-w-0 flex-1 pb-2 transition-all duration-300", active === i ? "opacity-100" : "opacity-80 hover:opacity-100")}>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{s.title}</h4>
                <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">{s.body}</p>
                {s.mark && (
                  <span className="mt-3 inline-flex items-center rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-white">
                    {s.mark}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}