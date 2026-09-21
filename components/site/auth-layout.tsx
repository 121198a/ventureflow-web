"use client";

import React, { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AuthArtwork } from "./auth-artwork";
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

export function AuthLayout({
  eyebrow,
  role = "founder",
  mode = "signup",
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
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#f8faff] via-[#f3f6fe] to-[#faf3fb] text-slate-900 max-[767px]:h-auto max-[767px]:min-h-screen max-[767px]:overflow-y-auto">
      {/* Soft Ambient Pastel Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-left sky blue bloom */}
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-blue-400/12 via-sky-300/10 to-transparent blur-3xl" />
        {/* Bottom-right lilac/magenta wash */}
        <div className="absolute -bottom-32 -right-32 h-[580px] w-[580px] rounded-full bg-gradient-to-tl from-purple-400/12 via-pink-300/10 to-transparent blur-3xl" />
        {/* Center ambient glow */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-blue-200/15 blur-3xl" />

        {/* Flowing curved ribbon light waves */}
        <svg
          className="absolute inset-0 size-full opacity-35"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 820 C300 760 700 880 1100 720 C1300 640 1480 680 1560 620"
            stroke="url(#ambientRibbon1)"
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />
          <path
            d="M-50 780 C400 700 850 830 1200 680 C1380 600 1500 580 1600 520"
            stroke="url(#ambientRibbon2)"
            strokeWidth="1.2"
          />
          <defs>
            <linearGradient id="ambientRibbon1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="ambientRibbon2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#f472b6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] flex-col justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 max-[767px]:h-auto max-[767px]:min-h-screen">
        
        {/* Top Header: Floating Brand Pill Badge (UBverse by UnBound X) */}
        <header className="flex w-full shrink-0 items-center justify-between pb-3 sm:pb-4">
          <Link
            href="/platform"
            aria-label="UBverse by UnBound X home"
            className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/95 px-4 sm:px-5 py-2 sm:py-2.5 shadow-xs backdrop-blur-md transition-all hover:border-slate-300 hover:shadow-sm"
          >
            <div className="relative h-6 w-6 sm:h-7 sm:w-7 shrink-0 overflow-hidden rounded-full flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105">
              <Image
                src="/images/ubverse-logo.png"
                alt="UBverse by UnBound X"
                width={28}
                height={28}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5 text-slate-900 select-none">
              <span className="text-[0.95rem] sm:text-[1.05rem] font-extrabold tracking-tight">UBverse</span>
              <span className="text-slate-400 text-xs font-medium">by</span>
              <UnboundXBrand className="text-[0.95rem] sm:text-[1.05rem]" />
            </div>
          </Link>
        </header>

        {/* Central Two-Column Grid */}
        <main className="grid min-h-0 flex-1 grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-8 max-[767px]:gap-6 max-[767px]:py-2">
          
          {/* LEFT COLUMN: Headings & 3D Artwork */}
          <div className="flex h-full flex-col justify-center text-left lg:pr-3">
            {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">{eyebrow}</p>}

            {/* Title */}
            <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[42px]">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="mt-2 max-w-xl text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
              {subtitle}
            </p>

            {/* Optional Description (e.g. for Let's Get Started) */}
            {description && (
              <p className="mt-2 max-w-xl text-xs font-normal leading-relaxed text-slate-600 sm:text-sm">
                {description}
              </p>
            )}

            {/* Switch Link / Below Subtitle */}
            {belowSubtitle ? (
              <div className="mt-3 text-xs text-slate-600 sm:text-sm">{belowSubtitle}</div>
            ) : switchPrompt && switchLinkText && switchLinkHref ? (
              <p className="mt-3 text-xs text-slate-600 sm:text-sm">
                {switchPrompt}{" "}
                <Link
                  href={switchLinkHref}
                  className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
                >
                  {switchLinkText}
                </Link>
              </p>
            ) : null}

            {/* Optional Features (if explicitly passed) */}
            {features && features.length > 0 && (
              <div className="mt-6 sm:mt-7 max-w-xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.label}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xs p-2 sm:p-2.5 shadow-2xs transition-all hover:border-slate-300 hover:bg-white/95"
                      >
                        <div className={`grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full border ${f.bgClass}`}>
                          <Icon size={14} className={f.colorClass} />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                          {f.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3D Atmospheric Futuristic UBverse Artwork */}
            <div className="mt-4 hidden min-[540px]:block max-[700px]:hidden">
              <AuthArtwork />
            </div>

            {/* Bottom Trust Tag */}
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:text-[11px]">
              <ShieldCheck size={14} className="text-blue-600 shrink-0" />
              <span>SECURE &bull; PRIVATE &bull; BUILT FOR THE FUTURE</span>
            </div>
          </div>

          {/* RIGHT COLUMN: White Authentication Card */}
          <div className="flex h-full items-center justify-center lg:justify-end">
            <div className="w-full max-w-[460px] min-[1200px]:max-w-[480px]">
              <div className="relative rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-5 sm:rounded-3xl min-[1200px]:p-7">
                {children}
              </div>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
