"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_URL } from "@/lib/constants";

const variantClasses: Record<"primary" | "secondary" | "ghost" | "text", string> = {
  primary: "btn-pill-primary",
  secondary: "btn-pill-secondary",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
  text: "inline-flex items-center gap-1.5 px-0 py-0 text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-brand transition-colors",
};

export function AuthButton({
  children,
  variant = "primary",
  className = "",
  icon = true,
  flow = "signup",
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "text";
  className?: string;
  icon?: boolean;
  flow?: "signup" | "login";
  ariaLabel?: string;
  /** Runs before navigation — e.g. closing a mobile nav drawer. */
  onClick?: () => void;
}) {
  const classes = cn(
    "group relative select-none",
    variantClasses[variant],
    className
  );

  const href = AUTH_URL.startsWith("/") ? `${AUTH_URL}?flow=${flow}` : AUTH_URL;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={() => {
        onClick?.();
      }}
      className={classes}
    >
      {children}
      {icon && (
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
