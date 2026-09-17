"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BrandWatermarkProps {
  /** Text or phrase. Defaults to "UNBOUND X UBVERSE" */
  text?: string;
  /** Array of brand names to repeat in exact order: ["UNBOUND X", "UBVERSE"] */
  items?: string[];
  /** Layout style: "pattern" (seamless SVG matrix), "rows" (staggered typography lines), "backdrop" (ambient device frame glow + watermark) */
  variant?: "pattern" | "rows" | "backdrop";
  /** Color tone: "light" (soft subtle slate/sky on white/light backgrounds), "brand" (blue/cyan tinted), "dark" (for dark cards/modals), "gradient" */
  tone?: "light" | "brand" | "dark" | "gradient";
  /** Overall opacity multiplier or class */
  opacity?: number | string;
  /** Edge mask: "radial" (soft circular fade out), "linear-y" (top/bottom fade), "linear-b", "none" */
  mask?: "radial" | "linear-y" | "linear-b" | "none";
  /** Number of visible rows (for "rows" variant) */
  rows?: number;
  /** Font size in pixels (for "pattern" / "rows") */
  fontSize?: number;
  /** Letter spacing */
  letterSpacing?: string;
  /** Extra container CSS classes */
  className?: string;
  /** Whether to render subtle circuit line with chevron flow like the reference artwork */
  showCircuitLine?: boolean;
  /** Additional custom children to render on top of the watermark backdrop */
  children?: React.ReactNode;
}

/**
 * BrandWatermark renders nothing (all watermarks removed globally).
 */
export function BrandWatermark({
  children,
}: BrandWatermarkProps) {
  if (!children) return null;
  return <>{children}</>;
}

/**
 * DeviceWatermarkBackdrop
 * A complete backdrop card for laptop/phone frames and hero showcases
 * without watermark text.
 */
export function DeviceWatermarkBackdrop({
  className = "",
  showCircuit = true,
  glowColor = "from-blue-500/12 via-sky-400/8 to-indigo-500/10",
  children,
}: {
  items?: string[];
  className?: string;
  showCircuit?: boolean;
  glowColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-4 sm:p-8 overflow-hidden bg-gradient-to-b from-sky-50/50 via-slate-50/30 to-white/60 border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.06)] backdrop-blur-xs",
        className
      )}
    >
      {/* Background ambient lighting blooms */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-tr blur-3xl opacity-70",
          glowColor
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-sky-300/20 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-indigo-300/15 blur-2xl"
      />

      {/* Circuit line with >>> accent */}
      {showCircuit && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full opacity-70"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 80 0 L 80 40 Q 80 55 95 55 L 90% 55"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-40"
          />
        </svg>
      )}

      {/* Content slot */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default BrandWatermark;
