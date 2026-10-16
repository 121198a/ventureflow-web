"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";
export type RevealTag = "div" | "article" | "section" | "header" | "footer" | "aside" | "li" | "figure" | "p" | "h1" | "h2" | "h3";

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

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
  className?: string;
  once?: boolean;
  scale?: number;
  y?: number;
  as?: RevealTag;
  id?: string;
  "aria-label"?: string;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  distance = 20,
  className = "",
  once = true,
  scale,
  y,
  as = "div",
  id,
  "aria-label": ariaLabel,
}: RevealProps) {
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

  const effectiveDistance = y !== undefined ? y : distance;

  let initialX = 0;
  let initialY = 0;

  if (direction === "up") initialY = effectiveDistance;
  else if (direction === "down") initialY = -effectiveDistance;
  else if (direction === "left") initialX = -effectiveDistance;
  else if (direction === "right") initialX = effectiveDistance;

  return (
    <MotionComponent
      id={id}
      aria-label={ariaLabel}
      className={className}
      initial={{
        opacity: 0,
        x: initialX,
        y: initialY,
        scale: scale ?? 1,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{
        duration,
        delay,
        ease: EASE_PREMIUM,
      }}
    >
      {children}
    </MotionComponent>
  );
}

