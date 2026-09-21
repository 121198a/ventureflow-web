import type { ReactNode } from "react";
import { BrandLogoLink } from "./brand-logo";

export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  belowSubtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  belowSubtitle?: ReactNode;
  withWatermark?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="relative z-10 px-5 pt-8 sm:px-10">
        <BrandLogoLink />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-10 px-5 pb-24 pt-10 sm:px-10 lg:grid-cols-2 lg:gap-0">
        <div className="flex flex-col justify-center pr-0 lg:pr-16">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-[1.85rem] min-[400px]:text-[2.2rem] sm:text-[2.6rem] lg:text-[2.8rem] leading-[1.12] text-slate-900 font-extrabold tracking-tight inline-block">
            {title}
          </h1>
          <p className="mt-5 max-w-[440px] text-[1rem] leading-[1.6] text-ink/75">{subtitle}</p>
          {belowSubtitle && <div className="mt-8">{belowSubtitle}</div>}
        </div>

        <div className="border-t border-hairline pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          {children}
        </div>
      </div>

      {/* Decorative subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.08), transparent 65%), radial-gradient(circle at 60% 70%, rgba(56, 189, 248, 0.06), transparent 60%)",
        }}
      />
    </div>
  );
}
