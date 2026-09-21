import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * White authentication card shared by every Founder / Investor login and
 * Get Started page. It intentionally carries NO logo — the brand lives in the
 * page header only ("UBverse by UnBound X").
 */
export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full rounded-[clamp(14px,1.05vw,18px)] border border-[#bccdfb] bg-white text-left",
        "px-[clamp(1.25rem,2.6vw,2.75rem)] pb-[clamp(1.1rem,3vh,1.75rem)] pt-[clamp(1.25rem,3.6vh,2.25rem)]",
        "shadow-[0_0_0_4px_rgba(180,200,250,0.10),0_28px_80px_-24px_rgba(90,110,230,0.28),0_0_60px_rgba(150,175,250,0.26)]",
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
    <div className="flex items-center gap-[clamp(0.75rem,1.4vw,1.4rem)] text-[length:clamp(0.8rem,0.95vw,1rem)] font-medium text-[#6b7488]">
      <span className="h-px flex-1 bg-[#dfe7f3]" />
      <span className="shrink-0">{label}</span>
      <span className="h-px flex-1 bg-[#dfe7f3]" />
    </div>
  );
}

/** Hairline that separates the card footer row. */
export function AuthRule({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-[#e3ebf4]", className)} />;
}
