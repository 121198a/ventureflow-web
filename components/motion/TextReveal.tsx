"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_PREMIUM } from "@/lib/motion";

export interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  mode?: "word" | "line" | "character";
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  wordClassName?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  once?: boolean;
}

export function TextReveal({
  text,
  as: Component = "div",
  delay = 0,
  duration = 0.45,
  stagger = 0.045,
  className = "",
  wordClassName = "",
  highlightWords = [],
  highlightClassName = "text-blue-600",
  once = true,
}: TextRevealProps) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) {
    return <Component className={className}>{text}</Component>;
  }

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: EASE_PREMIUM,
      },
    },
  };

  return (
    <Component className={cn("overflow-hidden", className)}>
      <motion.span
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.08em]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-8% 0px" }}
      >
        {words.map((word, i) => {
          const isHighlighted = highlightWords.some(
            (hw) => word.toLowerCase().includes(hw.toLowerCase())
          );

          return (
            <span key={i} className="inline-block overflow-hidden py-[0.05em]">
              <motion.span
                variants={wordVariants}
                className={cn(
                  "inline-block will-change-transform",
                  isHighlighted ? highlightClassName : "",
                  wordClassName
                )}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Component>
  );
}
