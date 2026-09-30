"use client";

import React, { useEffect, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthArtwork } from "./auth-artwork";
import { AuthCard } from "./auth-card";

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

/** Soft pastel wash + thin iridescent ribbons that run behind the card + left-hand light-blue atmospheric tint. */
function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Right base pastel gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#eef2ff_0%,#f5f8fe_34%,#f4f8fe_64%,#ecf3fe_100%)]" />

      {/* Left-hand light blue atmospheric tint matching reference */}
      <div className="hidden lg:block absolute inset-y-0 left-0 w-[48.8%] bg-[linear-gradient(180deg,#d8e7fe_0%,#e4effe_45%,#edf4fe_100%)]" />

      {/* Center vertical dividing rule matching reference */}
      <div className="hidden lg:block absolute left-[48.8%] inset-y-0 w-px bg-slate-200/80" />

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

/** "VentureFlow by Veyron X" lock-up pill — matching reference design */
export function AuthBrandPill() {
  return (
    <Link
      href="/"
      aria-label="VentureFlow by Veyron X home"
      className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/95 px-3.5 py-1.5 sm:px-4 sm:py-2 text-slate-900 shadow-[0_2px_12px_rgba(0,0,0,0.05)] backdrop-blur-xs transition-all hover:bg-white hover:shadow-sm"
    >
      <span className="relative block size-7 sm:size-8 shrink-0 overflow-hidden rounded-full shadow-2xs transition-transform group-hover:scale-105">
        <Image
          src="/logo/vf-mark.png"
          alt="VentureFlow"
          width={32}
          height={32}
          priority
          className="size-full rounded-full object-cover"
        />
      </span>
      <span className="flex select-none items-baseline gap-1.5 text-slate-900" aria-hidden="true">
        <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">VentureFlow</span>
        <span className="text-xs sm:text-sm font-normal text-slate-400">by</span>
        <span className="inline-flex items-baseline gap-0.5 text-base sm:text-lg font-bold tracking-tight text-slate-900">
          <span>Veyron</span>
          <svg viewBox="0 0 24 24" className="h-[0.75em] w-[0.75em] inline-block fill-current translate-y-[0.05em]" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </span>
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
    <div className="relative isolate flex min-h-[100dvh] lg:h-dvh lg:max-h-dvh w-full flex-col overflow-x-hidden overflow-y-auto lg:overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#f4f7fb] font-sans text-slate-900">
      <AuthBackground />

      {/* Brand lock-up (only place the logo appears — never inside the card) */}
      <header className="relative z-20 shrink-0 px-6 pt-5 sm:px-10 lg:pl-[min(5vw,90px)] lg:pt-6">
        <AuthBrandPill />
      </header>

      <main className="relative z-10 grid flex-1 grid-cols-1 gap-8 px-4 pb-8 pt-4 sm:px-8 lg:grid-cols-[48.8fr_51.2fr] lg:items-center lg:gap-0 lg:px-0 lg:py-2 lg:overflow-hidden">
        {/* LEFT — role-specific heading & glowing network wave */}
        <section className="relative flex flex-col text-left lg:pl-[min(6vw,100px)] lg:pr-10 z-10">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">{eyebrow}</p>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold leading-[1.15] tracking-tight text-slate-900">
            {title}
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
            {subtitle}
          </p>

          {description && (
            <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-md">
              {description}
            </p>
          )}

          {belowSubtitle ? (
            <div className="mt-4 text-sm sm:text-base font-normal text-slate-700">
              {belowSubtitle}
            </div>
          ) : switchPrompt && switchLinkText && switchLinkHref ? (
            <p className="mt-4 text-sm sm:text-base font-normal text-slate-700">
              {switchPrompt}{" "}
              <Link
                href={switchLinkHref}
                className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
              >
                {switchLinkText}
              </Link>
            </p>
          ) : null}

          {features && features.length > 0 && (
            <div className="mt-5 max-w-md">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="flex items-center gap-2 rounded-[14px] border border-slate-200/80 bg-white/70 p-2 shadow-2xs backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white/95"
                    >
                      <div className={`grid size-6 shrink-0 place-items-center rounded-full border sm:size-7 ${f.bgClass}`}>
                        <Icon size={13} className={f.colorClass} />
                      </div>
                      <span className="text-[10px] font-semibold leading-tight text-slate-800 sm:text-[11px]">{f.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT — white authentication card */}
        <section className="lg:self-center lg:pr-[min(6vw,100px)] lg:pl-10 flex justify-center lg:justify-end z-10">
          <div className="relative w-full max-w-[550px]">
            <AuthCard>{children}</AuthCard>
          </div>
        </section>
      </main>

      {/* VentureFlow glowing wave artwork: anchored to bottom-left */}
      <AuthArtwork className="hidden sm:block absolute bottom-0 left-0 w-full max-w-[48.8vw] pointer-events-none z-0" />
    </div>
  );
}
