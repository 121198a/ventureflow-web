"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AmbientLightProps {
  className?: string;
  size?: number;
  color?: string;
  intensity?: number;
  interactive?: boolean;
}

export function AmbientLight({
  className = "",
  size = 500,
  color = "rgba(37, 99, 235, 0.07)",
  intensity = 1,
  interactive = true,
}: AmbientLightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isTouchDevice || reduce || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - size / 2);
    mouseY.set(e.clientY - rect.top - size / 2);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Central Ambient Pulse Orb (Always active, gentle breathing) */}
      <motion.div
        animate={
          mounted && !reduce
            ? {
                scale: [1, 1.08, 1],
                opacity: [0.65 * intensity, 0.9 * intensity, 0.65 * intensity],
              }
            : undefined
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          width: size,
          height: size,
          background: color,
          opacity: 0.65 * intensity,
        }}
      />

      {/* Secondary Dynamic Mouse Follower (Desktop only, subtle, active after mount) */}
      {mounted && !isTouchDevice && interactive && !reduce && (
        <motion.div
          className="absolute rounded-full blur-[90px] transition-opacity duration-500"
          style={{
            x: smoothX,
            y: smoothY,
            width: size * 0.75,
            height: size * 0.75,
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0) 70%)",
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
