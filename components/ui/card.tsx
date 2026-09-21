import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "feature" | "interactive" | "highlighted" | "dashboard" | "stat" | "compact" | "elevated";
  hoverable?: boolean;
}

const cardVariants: Record<NonNullable<CardProps["variant"]>, string> = {
  default:
    "rounded-xl border border-slate-200/90 bg-white text-ink shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.02)]",
  feature:
    "rounded-2xl border border-slate-200/90 bg-white text-ink shadow-[0_4px_20px_rgba(15,23,42,0.05)]",
  interactive:
    "rounded-xl border border-slate-200/90 bg-white text-ink shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)] active:scale-[0.995] cursor-pointer",
  highlighted:
    "rounded-xl border-2 border-blue-600/90 bg-blue-50/20 text-ink shadow-[0_8px_24px_rgba(30,64,175,0.08)]",
  dashboard:
    "rounded-xl border border-slate-200/80 bg-white text-ink shadow-xs",
  stat:
    "rounded-xl border border-slate-200/90 bg-white p-5 text-ink shadow-2xs hover:border-slate-300",
  compact:
    "rounded-lg border border-slate-200/80 bg-white p-3.5 text-ink shadow-2xs",
  elevated:
    "card-fintech shadow-md",
};

export function Card({
  className,
  variant = "default",
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "transition-all duration-200",
        cardVariants[variant],
        hoverable &&
          variant !== "interactive" &&
          "hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-[1.15rem] sm:text-[1.25rem] font-bold leading-tight tracking-tight text-slate-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[0.875rem] text-slate-600 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center p-5 pt-0 sm:p-6 sm:pt-0 border-t border-slate-100 mt-4", className)} {...props}>
      {children}
    </div>
  );
}
