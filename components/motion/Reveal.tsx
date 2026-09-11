"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

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
}: RevealProps) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) {
    return <div className={className}>{children}</div>;
  }

  const effectiveDistance = y !== undefined ? y : distance;

  let initialX = 0;
  let initialY = 0;

  if (direction === "up") initialY = effectiveDistance;
  else if (direction === "down") initialY = -effectiveDistance;
  else if (direction === "left") initialX = -effectiveDistance;
  else if (direction === "right") initialX = effectiveDistance;

  return (
    <motion.div
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
    </motion.div>
  );
}

