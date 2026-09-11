"use client";

import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, type MouseEvent } from "react";

type TransitionLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> & {
    children: React.ReactNode;
  };

/**
 * Drop-in replacement for next/link that plays a View Transition on
 * navigation. Still a real <a href> under the hood (via next/link), so
 * right-click/open-in-new-tab, prefetching, and SEO crawling all keep
 * working exactly as before — this only intercepts genuine same-tab left
 * clicks to add the transition.
 */
export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
