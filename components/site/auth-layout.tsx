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
          <h1
            className="text-[1.85rem] min-[400px]:text-[2.2rem] sm:text-[2.6rem] lg:text-[2.8rem] leading-[1.12] bg-clip-text text-transparent font-extrabold tracking-tight inline-block"
            style={{
              fontWeight: 800,
              backgroundImage:
                "linear-gradient(90deg, #ff5a00 0%, #d946ef 35%, #7c3aed 65%, #00a2ff 100%)",
            }}
          >
            {title}
          </h1>
          <p className="mt-5 max-w-[440px] text-[1rem] leading-[1.6] text-ink/75">{subtitle}</p>
          {belowSubtitle && <div className="mt-8">{belowSubtitle}</div>}
        </div>

        <div className="border-t border-hairline pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          {children}
        </div>
      </div>

      {/* Decorative gradient — recreates the blurred purple/pink/orange blobs seen
          bottom-left of the auth pages in the reference video. No source asset
          existed for this artwork, so it's approximated with layered radial
          gradients rather than left blank. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.72 0.16 330 / 0.55), transparent 60%), radial-gradient(circle at 60% 70%, oklch(0.75 0.15 250 / 0.5), transparent 60%), radial-gradient(circle at 70% 20%, oklch(0.8 0.15 70 / 0.45), transparent 55%)",
        }}
      />
    </div>
  );
}
