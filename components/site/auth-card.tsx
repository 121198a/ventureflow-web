import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * White authentication card shared by every Founder / Investor login and
 * Get Started page. It intentionally carries NO logo — the brand lives in the
 * page header only ("VentureFlow by Veyron X").
 */
export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full rounded-[24px] sm:rounded-[28px] border border-white/80 bg-white/95 backdrop-blur-sm text-left",
        "p-6 sm:p-9",
        "max-h-[calc(100dvh-70px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        "shadow-[0_20px_50px_-10px_rgba(70,95,190,0.13)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** "Or continue with" divider used above the Google / Apple buttons. */
export function AuthDivider({ label = "Or continue with" }: { label?: string }) {
  return (
    <div className="flex items-center gap-[clamp(0.6rem,1.2vw,1.1rem)] text-[length:clamp(0.75rem,0.88vw,0.92rem)] font-medium text-slate-500">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="shrink-0">{label}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

/** Hairline that separates the card footer row. */
export function AuthRule({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-slate-200", className)} />;
}
