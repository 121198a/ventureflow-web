import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "verified" | "warning" | "outline" | "secondary";
  size?: "sm" | "md";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-surface-alt text-ink border border-hairline",
  brand: "bg-brand/10 text-brand border border-brand/20 font-semibold",
  verified: "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold",
  warning: "bg-amber-50 text-amber-800 border border-amber-200 font-semibold",
  outline: "border border-hairline text-ink/80 bg-transparent",
  secondary: "bg-slate-100 text-slate-700 border border-slate-200",
};

const sizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2.5 py-0.5 text-[0.7rem]",
  md: "px-3 py-1 text-[0.78rem]",
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide uppercase leading-none select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
