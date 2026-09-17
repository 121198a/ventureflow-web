"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({
  value,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;

    const start = 0;
    const end = value;
    const totalFrames = Math.round(duration * 60);
    let currentFrame = 0;

    const easeOutQuad = (t: number) => t * (2 - t);

    const counter = setInterval(() => {
      currentFrame++;
      const progress = easeOutQuad(currentFrame / totalFrames);
      const current = start + (end - start) * progress;
      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));

      if (currentFrame >= totalFrames) {
        clearInterval(counter);
        setCount(end);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, value, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}