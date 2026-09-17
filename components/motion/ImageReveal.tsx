"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_PREMIUM } from "@/lib/motion";

export interface ImageRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "scale" | "clip-up" | "fade";
  className?: string;
  shimmer?: boolean;
}

export function ImageReveal({
  children,
  delay = 0,
  duration = 0.65,
  direction = "scale",
  className = "",
  shimmer = false,
}: ImageRevealProps) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) {
    return <div className={className}>{children}</div>;
  }

  const getVariants = () => {
    switch (direction) {
      case "clip-up":
        return {
          hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
          visible: {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            transition: { duration, delay, ease: EASE_PREMIUM },
          },
        };
      case "scale":
        return {
          hidden: { scale: 0.94, opacity: 0, y: 14 },
          visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: EASE_PREMIUM },
          },
        };
      case "up":
        return {
          hidden: { opacity: 0, y: 24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: EASE_PREMIUM },
          },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, delay, ease: EASE_PREMIUM },
          },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-6% 0px" }}
      variants={getVariants()}
      className={cn("relative overflow-hidden will-change-transform", className)}
    >
      {children}
      {shimmer && (
        <motion.div
          initial={{ x: "-100%" }}
          whileInView={{ x: "200%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
