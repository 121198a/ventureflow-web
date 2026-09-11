"use client";

import React, { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_PREMIUM } from "@/lib/motion";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 16,
  className = "",
  staggerChildren,
  delayChildren = 0,
}: FadeInProps) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) {
    return <div className={className}>{children}</div>;
  }

  let initialX = 0;
  let initialY = 0;

  if (direction === "up") initialY = distance;
  else if (direction === "down") initialY = -distance;
  else if (direction === "left") initialX = -distance;
  else if (direction === "right") initialX = distance;

  if (staggerChildren !== undefined) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-8% 0px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren,
              delayChildren: delay + delayChildren,
            },
          },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: initialX, y: initialY }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
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

export function FadeInItem({
  children,
  className = "",
  distance = 16,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE_PREMIUM },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
