"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_URL } from "@/lib/constants";

export function AuthButton({
  children,
  variant = "primary",
  className = "",
  icon = true,
  flow = "signup",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "text";
  className?: string;
  icon?: boolean;
  flow?: "signup" | "login";
  /** Runs before navigation — e.g. closing a mobile nav drawer. */
  onClick?: () => void;
}) {
  const classes = cn(
    "gb-magnetic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white group relative inline-flex items-center justify-center gap-2 rounded-pill text-sm font-semibold transition-all duration-200 ease-out",
    variant === "primary" &&
      "bg-brand px-6 py-3.5 text-white hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_32px_rgba(37,99,235,0.24)] active:translate-y-0 active:scale-[0.985]",
    variant === "secondary" &&
      "border border-[#cfd8e3] bg-white px-6 py-3.5 text-[#07111f] hover:-translate-y-0.5 hover:border-[#8e9db0] active:translate-y-0",
    variant === "ghost" &&
      "border border-white/15 bg-white/[0.06] px-6 py-3.5 text-white hover:-translate-y-0.5 hover:bg-white/[0.12] active:translate-y-0",
    variant === "text" &&
      "px-0 py-0 text-[#07111f] underline decoration-slate-300 underline-offset-4 hover:text-brand",
    className,
  );

  const href = AUTH_URL.startsWith("/") ? `${AUTH_URL}?flow=${flow}` : AUTH_URL;

  return (
    <Link
      href={href}
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
