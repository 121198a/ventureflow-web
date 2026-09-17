import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "brand"
    | "verified"
    | "warning"
    | "destructive"
    | "outline"
    | "secondary"
    | "neutral"
    | "subtle";
  size?: "xs" | "sm" | "md";
  shape?: "pill" | "rounded";
  dot?: boolean;
  dotPulse?: boolean;
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-slate-100 text-slate-800 border border-slate-200",
  brand: "bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold",
  verified: "bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-semibold",
  warning: "bg-amber-50 text-amber-900 border border-amber-200/90 font-semibold",
  destructive: "bg-rose-50 text-rose-800 border border-rose-200/90 font-semibold",
  outline: "border border-slate-200 text-slate-700 bg-white/90 shadow-2xs",
  secondary: "bg-slate-100/80 text-slate-700 border border-slate-200",
  neutral: "bg-slate-50 text-slate-600 border border-slate-200/70",
  subtle: "bg-blue-50/50 text-blue-800 border border-blue-100",
};

const dotColors: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-slate-400",
  brand: "bg-blue-600",
  verified: "bg-emerald-600",
  warning: "bg-amber-500",
  destructive: "bg-rose-500",
  outline: "bg-slate-400",
  secondary: "bg-slate-500",
  neutral: "bg-slate-400",
  subtle: "bg-blue-500",
};

const sizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  xs: "px-2 py-0.5 text-[0.68rem]",
  sm: "px-2.5 py-0.5 text-[0.72rem]",
  md: "px-3 py-1 text-[0.78rem]",
};

const shapes: Record<NonNullable<BadgeProps["shape"]>, string> = {
  pill: "rounded-full",
  rounded: "rounded-md",
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  shape = "pill",
  dot = false,
  dotPulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium tracking-wide uppercase leading-none select-none",
        variants[variant],
        sizes[size],
        shapes[shape],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            dotColors[variant],
            dotPulse && "animate-pulse"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
