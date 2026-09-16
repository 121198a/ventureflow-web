import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared button primitive matching the institutional design system.
 * Supports pill and rounded shapes, high-contrast states, loading states,
 * and accessible focus indicators. Renders a `<Link>` when `href` is passed,
 * otherwise a native `<button>`.
 */
type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "text";

type Size = "xs" | "sm" | "md" | "lg" | "icon";
type Shape = "pill" | "rounded";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-primary-foreground hover:bg-brand-strong disabled:bg-brand-disabled",
  secondary:
    "bg-surface-alt text-ink hover:bg-slate-200 border border-hairline",
  outline:
    "border border-hairline bg-background text-ink hover:bg-surface-alt hover:border-slate-300",
  ghost:
    "text-ink/80 hover:text-brand hover:bg-brand/10 border border-transparent",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-red-700",
  text:
    "text-brand underline underline-offset-2 hover:text-brand-strong p-0 h-auto font-normal",
};

const sizes: Record<Size, string> = {
  xs: "px-3 py-1 text-[0.75rem] min-h-[30px]",
  sm: "px-4 py-1.5 text-[0.82rem] min-h-[36px]",
  md: "px-6 py-2.5 text-[0.9rem] min-h-[42px]",
  lg: "px-8 py-3 text-[1rem] min-h-[48px]",
  icon: "size-10 p-2 min-h-[40px] min-w-[40px]",
};

const shapes: Record<Shape, string> = {
  pill: "rounded-full",
  rounded: "rounded-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export function Button({
  variant = "primary",
  size = "md",
  shape = "pill",
  loading = false,
  className,
  children,
  href,
  disabled,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    base,
    shapes[shape],
    variant !== "text" && sizes[size],
    variants[variant],
    variant === "text" ? "font-normal" : variant === "primary" ? "font-bold" : "font-semibold",
    loading && "cursor-wait opacity-80",
    className
  );

  const content = (
    <>
      {loading && <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled || loading}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
