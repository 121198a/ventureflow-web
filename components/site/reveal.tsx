"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Lightweight scroll-reveal primitive (opacity + translateY on enter).
 *
 * No animation library — this is a single IntersectionObserver per element,
 * GPU-friendly (transform/opacity only), and fully inert until
 * [data-reveal-ready] is set on <html> (see <RevealInit /> in the root
 * layout), so content never gets stuck invisible for no-JS / failed-hydration
 * cases. Respects prefers-reduced-motion via the CSS in globals.css, which
 * collapses the transition to ~0 rather than disabling the reveal outright.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  /** stagger delay in ms */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Component = Tag;

  return (
    <Component
      ref={ref}
      data-reveal
      className={`${visible ? "is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}

/** Sets [data-reveal-ready] on <html> once mounted — see globals.css. */
export function RevealInit() {
  useEffect(() => {
    document.documentElement.setAttribute("data-reveal-ready", "");
  }, []);
  return null;
}
