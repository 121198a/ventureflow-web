import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Shared button primitive — three variants matching the reference video's
 * button language (solid pill CTA, outline pill, and a plain text/underline
 * link-style action), so pages stop styling buttons ad hoc. Renders a
 * `<Link>` when `href` is passed, otherwise a native `<button>`.
 */
type Variant = "primary" | "outline" | "text";
type Size = "md" | "sm";

const base = "inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap transition-all duration-200 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-primary-foreground hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-brand-disabled",
  outline:
    "border border-brand text-brand hover:bg-brand/5 disabled:cursor-not-allowed disabled:border-brand-disabled disabled:text-brand-disabled",
  text: "text-brand underline underline-offset-2 hover:text-brand-strong",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-2.5 text-[0.9rem]",
  sm: "px-5 py-2 text-[0.82rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
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
  className,
  children,
  href,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    base,
    variant !== "text" && sizes[size],
    variants[variant],
    variant === "primary" || variant === "outline" ? "" : "font-normal",
    className
  );

  const fontWeight = variant === "text" ? undefined : variant === "primary" ? 700 : 600;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        style={{ fontWeight }}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      style={{ fontWeight }}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
