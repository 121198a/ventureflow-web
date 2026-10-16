"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

const offsets: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 28 },
  left: { x: -28 },
  right: { x: 28 },
  none: {},
};

type RevealTag = "div" | "article" | "section" | "header" | "footer" | "aside" | "li" | "figure" | "p" | "h1" | "h2" | "h3";

const motionComponents = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
  header: motion.header,
  footer: motion.footer,
  aside: motion.aside,
  li: motion.li,
  figure: motion.figure,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = true,
  as = "div",
  id,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
  as?: RevealTag;
  id?: string;
  "aria-label"?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const Tag = as;
  const MotionComponent = motionComponents[as] || motion.div;

  if (!mounted || reduce) {
    return <Tag id={id} aria-label={ariaLabel} className={className}>{children}</Tag>;
  }

  const offset = offsets[direction];

  return (
    <MotionComponent
      id={id}
      aria-label={ariaLabel}
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.2, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.58, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </MotionComponent>
  );
}

export function RevealGroup({
  children,
  className = "",
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};
