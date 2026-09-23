"use client";

import React, { useEffect, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthArtwork } from "./auth-artwork";
import { AuthCard } from "./auth-card";
import { UnboundXBrand } from "@/components/ui/UnboundXBrand";

export interface AuthFeature {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  colorClass: string;
  bgClass: string;
}

export interface AuthLayoutProps {
  eyebrow?: string;
  role?: "founder" | "investor";
  mode?: "signup" | "login";
  title: string;
  subtitle: string;
  description?: string;
  switchPrompt?: string;
  switchLinkText?: string;
  switchLinkHref?: string;
  belowSubtitle?: ReactNode;
  features?: AuthFeature[];
  withWatermark?: boolean;
  children: ReactNode;
}

/** Soft pastel wash + thin iridescent ribbons that run behind the card. */
function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#eef2ff_0%,#f5f8fe_34%,#f4f8fe_64%,#ecf3fe_100%)]" />
      {/* cool halo behind the card */}
      <div className="absolute right-[-6%] top-[8%] h-[80%] w-[58%] rounded-full bg-[radial-gradient(closest-side,rgba(160,184,255,0.30),rgba(196,210,255,0.14)_55%,transparent_100%)]" />
      {/* faint blush bottom-right */}
      <div className="absolute -bottom-[12%] right-[-8%] h-[55%] w-[46%] rounded-full bg-[radial-gradient(closest-side,rgba(236,190,240,0.22),transparent_100%)]" />

      <svg
        className="absolute inset-0 hidden size-full lg:block"
        viewBox="0 0 1672 941"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="authArcBlue" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#8fb0f7" stopOpacity="0.85" />
            <stop offset="1" stopColor="#b9cdfb" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="authArcPink" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#e3a2e2" stopOpacity="0.85" />
            <stop offset="1" stopColor="#f0c4ec" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="authRibbon" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#f0a4e6" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#8f8cf2" stopOpacity="0.9" />
            <stop offset="1" stopColor="#5f8df0" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path
          d="M1380 500 C1470 445 1520 385 1552 340 C1590 290 1630 240 1672 195 C1700 165 1725 142 1760 118"
          stroke="url(#authArcBlue)"
          strokeWidth="1.3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M1380 660 C1470 600 1520 550 1552 500 C1590 448 1632 396 1672 350 C1700 320 1725 300 1760 275"
          stroke="url(#authArcPink)"
          strokeWidth="1.3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M1180 870 C1360 850 1480 800 1552 755 C1600 725 1640 690 1672 652 C1700 620 1725 596 1760 570"
          stroke="url(#authRibbon)"
          strokeWidth="14"
          strokeOpacity="0.16"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M1180 870 C1360 850 1480 800 1552 755 C1600 725 1640 690 1672 652 C1700 620 1725 596 1760 570"
          stroke="url(#authRibbon)"
          strokeWidth="2.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M1010 941 C1190 928 1400 866 1552 758"
          stroke="url(#authArcPink)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

/** "UBverse by UnBound X" lock-up — real UBverse mark from /public/images. */
function AuthBrandPill() {
  return (
    <Link
      href="/platform"
      aria-label="UBverse by UnBound X home"
      className="group inline-flex items-center gap-[clamp(0.6rem,0.95vw,0.9rem)] rounded-[16px] bg-white py-[9px] pl-4 pr-4 shadow-[0_6px_28px_-10px_rgba(90,110,220,0.28)] transition-shadow hover:shadow-[0_8px_30px_-8px_rgba(90,110,220,0.36)]"
    >
      <span className="relative block size-[clamp(2rem,2.4vw,2.6rem)] shrink-0 transition-transform group-hover:scale-105">
        <Image
          src="/images/ubverse-logo.png"
          alt=""
          width={80}
          height={80}
          priority
          className="h-full w-full rounded-full object-contain"
        />
      </span>
      <span className="flex select-none items-baseline gap-[0.45rem] text-slate-900" aria-hidden="true">
        <span className="text-[length:clamp(1.15rem,1.45vw,1.55rem)] font-extrabold tracking-tight">UBverse</span>
        <span className="text-[length:clamp(0.8rem,0.9vw,0.95rem)] font-medium text-slate-400">by</span>
        <UnboundXBrand className="text-[length:clamp(1.15rem,1.45vw,1.55rem)] !text-slate-900" />
      </span>
    </Link>
  );
}

export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  description,
  switchPrompt,
  switchLinkText,
  switchLinkHref,
  belowSubtitle,
  features,
  children,
}: AuthLayoutProps) {
  // Lift the floating support launcher to the position used in the design while an auth page is mounted.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--chat-bottom", "clamp(1.25rem, 5.4vh, 3.25rem)");
    return () => {
      root.style.removeProperty("--chat-bottom");
    };
  }, []);

  return (
    <div className="relative isolate flex min-h-[100dvh] w-full flex-col overflow-x-clip bg-slate-50 font-sans text-slate-900">
      <AuthBackground />

      {/* Brand lock-up (only place the logo appears — never inside the card) */}
      <header className="relative z-20 px-4 pt-5 sm:px-8 lg:pl-[min(4.3vw,82px)] lg:pr-8 lg:pt-[clamp(1.25rem,3.3vh,2rem)]">
        <AuthBrandPill />
      </header>

      <main className="relative z-10 grid flex-1 grid-cols-1 gap-8 px-4 pb-6 pt-8 sm:px-8 lg:grid-cols-[49fr_51fr] lg:items-start lg:gap-0 lg:px-0 lg:pb-[clamp(1.5rem,9.4vh,5rem)] lg:pt-[clamp(1rem,2.4vh,1.5rem)] lg:[@media(max-height:820px)]:pb-4">
        {/* LEFT — role-specific heading */}
        <section className="flex flex-col text-left lg:pl-[min(8.3vw,160px)] lg:pr-6 lg:pt-[clamp(0.75rem,5.2vh,3.25rem)]">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>
          )}

          <h1 className="text-[2.25rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900 sm:text-[2.75rem] lg:text-[length:clamp(2.4rem,3.7vw,4.25rem)]">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-[1.05rem] font-medium leading-[1.6] text-slate-800 sm:text-[1.15rem] lg:mt-[clamp(0.9rem,2.6vh,1.6rem)] lg:max-w-[min(34vw,600px)] lg:text-[length:clamp(1rem,1.26vw,1.4rem)]">
            {subtitle}
          </p>

          {description && (
            <p className="mt-2 max-w-xl text-[0.95rem] font-medium leading-relaxed text-slate-600 sm:text-base lg:max-w-[min(34vw,600px)] lg:text-[length:clamp(0.9rem,1.05vw,1.15rem)]">
              {description}
            </p>
          )}

          {belowSubtitle ? (
            <div className="mt-5 text-[0.95rem] font-medium text-slate-800 lg:mt-[clamp(1rem,2.8vh,1.8rem)] lg:text-[length:clamp(0.9rem,1.14vw,1.2rem)]">
              {belowSubtitle}
            </div>
          ) : switchPrompt && switchLinkText && switchLinkHref ? (
            <p className="mt-5 text-[0.95rem] font-medium text-slate-800 lg:mt-[clamp(1rem,2.8vh,1.8rem)] lg:text-[length:clamp(0.9rem,1.14vw,1.2rem)]">
              {switchPrompt}{" "}
              <Link
                href={switchLinkHref}
                className="text-blue-700 underline underline-offset-2 transition-colors hover:text-blue-800"
              >
                {switchLinkText}
              </Link>
            </p>
          ) : null}

          {features && features.length > 0 && (
            <div className="mt-6 max-w-xl sm:mt-7">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="flex items-center gap-2.5 rounded-[16px] border border-slate-200/80 bg-white/70 p-2 shadow-2xs backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white/95 sm:p-2.5"
                    >
                      <div className={`grid size-7 shrink-0 place-items-center rounded-full border sm:size-8 ${f.bgClass}`}>
                        <Icon size={14} className={f.colorClass} />
                      </div>
                      <span className="text-[11px] font-semibold leading-tight text-slate-800 sm:text-xs">{f.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT — white authentication card */}
        <section className="lg:self-center lg:pl-[2.7vw] lg:pr-[min(7.2vw,140px)]">
          <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-0 lg:w-[min(41.1vw,720px)] lg:max-w-none">
            {/* hairline divider between the two columns */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-[2.7vw] bottom-0 top-0 hidden w-px bg-gradient-to-b from-[#c7d6f8] via-[#cfdcf9] to-[#c7d6f8] lg:block"
            />
            <AuthCard>{children}</AuthCard>
          </div>
        </section>
      </main>

      {/* UBverse artwork: bleeds off the bottom-left on desktop, stacks below the card on smaller screens */}
      <AuthArtwork className="relative z-0 -mt-2 mr-auto w-full max-w-[640px] lg:absolute lg:bottom-0 lg:left-0 lg:mx-0 lg:mt-0 lg:w-[min(48.2vw,calc(59.6vh*1.4367))] lg:max-w-none" />
    </div>
  );
}
