"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type LaptopPhase =
  | "CLOSED"        // Laptop closed flat on base
  | "APPROACH"      // Realistic hand slides in toward the lid notch
  | "OPENING"       // Hand lifts lid upward in 3D perspective
  | "OPEN"          // Lid is upright, hand releases and retreats
  | "POWERING_ON"   // Power button lights up, screen illuminates
  | "BOOTING"       // Boot sequence with glowing logo and progress bar
  | "DISPLAYING"    // Authentic website interface fully displayed
  | "CLOSING";      // Screen dims, lid closes smoothly back to base

export interface LaptopFrameProps {
  children?: React.ReactNode;
  className?: string;
  priority?: boolean;
  alt?: string;
  src?: string;
  autoPlay?: boolean;
}

/**
 * Realistic human hand SVG component styled with anatomical gradients,
 * knuckles, fingernails, and soft depth shadows for lifting the laptop lid.
 */
function RealisticHand({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] select-none pointer-events-none", className)}
      aria-hidden="true"
    >
      <defs>
        {/* Forearm skin gradient */}
        <linearGradient id="handArmGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#E9B998" />
          <stop offset="50%" stopColor="#D59C77" />
          <stop offset="100%" stopColor="#BD7C57" />
        </linearGradient>

        {/* Finger skin gradient */}
        <linearGradient id="handFingerGrad" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#F4CBAD" />
          <stop offset="55%" stopColor="#DE9A75" />
          <stop offset="100%" stopColor="#B97048" />
        </linearGradient>

        {/* Fingernail keratin highlight */}
        <linearGradient id="handNailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE8E2" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#F5BCAA" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E59988" stopOpacity="0.5" />
        </linearGradient>

        {/* Contact shadow filter */}
        <filter id="handSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#1a0d06" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#handSoftShadow)">
        {/* Forearm / Wrist entering from top */}
        <path
          d="M52 0 C54 28 50 48 46 68 C64 74 94 74 110 68 C106 48 102 28 104 0 Z"
          fill="url(#handArmGrad)"
        />

        {/* Thumb extending on left */}
        <path
          d="M46 68 C34 76 22 92 22 108 C22 122 32 130 40 130 C48 130 54 115 56 100 Z"
          fill="url(#handFingerGrad)"
        />

        {/* Palm dorsum */}
        <path
          d="M46 68 C50 86 50 106 52 116 C64 120 94 120 106 114 C108 96 110 78 110 68 Z"
          fill="url(#handArmGrad)"
        />

        {/* Little finger (pinky) */}
        <path
          d="M104 114 C108 122 118 134 118 148 C118 158 110 162 104 160 C98 158 96 142 96 122 Z"
          fill="url(#handFingerGrad)"
        />
        <rect x="100" y="148" width="6" height="8" rx="3" fill="url(#handNailGrad)" />

        {/* Ring finger */}
        <path
          d="M88 117 C92 127 98 144 98 162 C98 172 90 176 84 174 C78 172 78 154 78 126 Z"
          fill="url(#handFingerGrad)"
        />
        <rect x="85" y="162" width="7" height="9" rx="3.5" fill="url(#handNailGrad)" />

        {/* Middle finger (reaches down over screen notch) */}
        <path
          d="M72 119 C74 130 78 150 78 172 C78 184 68 188 62 186 C56 184 56 164 56 132 Z"
          fill="url(#handFingerGrad)"
        />
        <rect x="63" y="172" width="8" height="10" rx="4" fill="url(#handNailGrad)" />

        {/* Index finger (hooks firmly over top edge) */}
        <path
          d="M52 116 C52 128 56 148 56 166 C56 178 46 182 40 180 C34 178 36 158 38 128 Z"
          fill="url(#handFingerGrad)"
        />
        <rect x="42" y="166" width="8" height="10" rx="4" fill="url(#handNailGrad)" />
      </g>
    </svg>
  );
}

/**
 * Reusable, responsive laptop device component with physical lid opening,
 * realistic hand interaction, computer power-on, and boot sequence that unveils
 * the actual UBverse website UI.
 */
export function LaptopFrame({
  children,
  className = "",
  priority = false,
  alt = "UBverse platform displayed on a high-resolution laptop screen with open capital raises and featured start-ups",
  src = "/images/hero-laptop.jpg",
  autoPlay = true,
}: LaptopFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<LaptopPhase>("CLOSED");
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isReduced = mounted && Boolean(reduce);

  useEffect(() => {
    setMounted(true);
    if (reduce) {
      setPhase("DISPLAYING");
    }
  }, [reduce]);

  // Viewport detection to avoid consuming CPU when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Clear any running timer on unmount or phase change
  const clearCurrentTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Main automated presentation sequence state machine
  useEffect(() => {
    if (reduce) {
      setPhase("DISPLAYING");
      return;
    }
    if (!autoPlay || isPaused || !isInView) {
      clearCurrentTimer();
      return;
    }

    clearCurrentTimer();

    switch (phase) {
      case "CLOSED":
        timerRef.current = setTimeout(() => {
          setPhase("APPROACH");
        }, 1100);
        break;

      case "APPROACH":
        timerRef.current = setTimeout(() => {
          setPhase("OPENING");
        }, 1000);
        break;

      case "OPENING":
        timerRef.current = setTimeout(() => {
          setPhase("OPEN");
        }, 1600);
        break;

      case "OPEN":
        timerRef.current = setTimeout(() => {
          setPhase("POWERING_ON");
        }, 800);
        break;

      case "POWERING_ON":
        timerRef.current = setTimeout(() => {
          setPhase("BOOTING");
        }, 700);
        break;

      case "BOOTING":
        timerRef.current = setTimeout(() => {
          setPhase("DISPLAYING");
        }, 2000);
        break;

      case "DISPLAYING":
        timerRef.current = setTimeout(() => {
          setPhase("CLOSING");
        }, 5500);
        break;

      case "CLOSING":
        timerRef.current = setTimeout(() => {
          setPhase("CLOSED");
        }, 1300);
        break;
    }

    return () => clearCurrentTimer();
  }, [phase, autoPlay, isPaused, isInView, reduce, clearCurrentTimer]);

  const restartCycle = () => {
    clearCurrentTimer();
    setIsPaused(false);
    setPhase("CLOSED");
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const isLidClosed = phase === "CLOSED" || phase === "APPROACH";
  const isOpening = phase === "OPENING";
  const isClosing = phase === "CLOSING";
  const showHand = phase === "APPROACH" || phase === "OPENING" || phase === "OPEN";
  const isBooting = phase === "POWERING_ON" || phase === "BOOTING";
  const isDisplaying = phase === "DISPLAYING";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto w-full max-w-[564px] flex flex-col items-center select-none",
        className
      )}
    >
      {/* Subtle ambient lighting behind laptop to enhance depth */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-4 sm:-inset-8 rounded-3xl bg-gradient-to-tr from-blue-600/10 via-sky-400/10 to-indigo-500/10 blur-2xl transition-opacity duration-700",
          isDisplaying ? "opacity-75" : "opacity-30"
        )}
      />

      {/* Main 3D Laptop Perspective Container */}
      <div
        className="relative z-10 w-full [perspective:1400px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Base Chassis Layer (rendered with the authentic hero-laptop layout) */}
        <div className="relative w-full overflow-visible">
          <Image
            src={src}
            alt={alt}
            width={1408}
            height={1008}
            sizes="(max-width: 640px) 100vw, 564px"
            priority={priority}
            className={cn(
              "h-auto w-full object-contain drop-shadow-[0_20px_50px_rgba(15,23,42,0.12)] transition-opacity duration-500",
              isDisplaying ? "opacity-100" : "opacity-95"
            )}
          />

          {/* Optional children overlay inside screen */}
          {children && isDisplaying && (
            <div className="absolute inset-x-[12.64%] top-[8.73%] h-[68.45%] w-[75.57%] overflow-hidden rounded-xs sm:rounded-sm bg-white">
              {children}
            </div>
          )}

          {/* Realistic Power Indicator LED on Keyboard Deck (top right of base) */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute top-[78.2%] right-[19.8%] h-1.5 w-1.5 rounded-full transition-all duration-500",
              isBooting || isDisplaying
                ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                : "bg-slate-600/40"
            )}
          />

          {/* 3D Physical Rotating Lid */}
          {mounted && !isReduced && (
            <motion.div
              style={{
                transformOrigin: "bottom center",
                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateX: isLidClosed ? 78 : isOpening ? 0 : isClosing ? 78 : 0,
              }}
              transition={{
                duration: isOpening ? 1.6 : isClosing ? 1.2 : 0.4,
                ease: isOpening
                  ? [0.16, 1, 0.3, 1]
                  : [0.32, 0, 0.67, 0],
              }}
              className={cn(
                "absolute inset-x-[10.5%] top-[6.0%] h-[71.4%] w-[79.0%] pointer-events-none",
                isDisplaying && !isClosing && "opacity-0"
              )}
            >
              {/* Back of Lid (Visible when laptop is closed/facing down) */}
              <div
                className={cn(
                  "absolute inset-0 rounded-t-xl sm:rounded-t-2xl border border-slate-600/60 bg-gradient-to-b from-[#2d3442] via-[#222733] to-[#181c25] shadow-2xl transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-5",
                  isLidClosed || isClosing ? "opacity-100" : "opacity-0"
                )}
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Top thumb notch */}
                <div className="mx-auto h-1 sm:h-1.5 w-16 sm:w-24 rounded-full bg-slate-500/80 shadow-inner" />

                {/* Centered metallic UnBound X branding mark */}
                <div className="mx-auto flex flex-col items-center justify-center opacity-80">
                  <div className="relative h-10 w-10 sm:h-14 sm:w-14 overflow-hidden rounded-full border border-white/20 shadow-md">
                    <Image
                      src="/logo/unboundx-mark.png"
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full object-cover grayscale contrast-125"
                    />
                  </div>
                  <span className="mt-2 text-[10px] sm:text-xs font-bold tracking-widest text-slate-300 uppercase">
                    UnBound X
                  </span>
                </div>

                {/* Bottom hinge spacer */}
                <div className="h-2" />
              </div>

              {/* Inside Face of Lid (Screen glass + Bezel) */}
              <div
                className={cn(
                  "absolute inset-0 rounded-t-xl sm:rounded-t-2xl border-[4px] sm:border-[7px] border-[#0a0f18] bg-[#05080e] shadow-2xl overflow-hidden transition-opacity duration-300",
                  !isLidClosed && !isClosing ? "opacity-100" : "opacity-0"
                )}
              >
                {/* Top bezel camera sensor */}
                <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  <div className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-slate-800 border border-slate-700" />
                  {(isBooting || isDisplaying) && (
                    <div className="h-0.5 sm:h-1 w-0.5 sm:w-1 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>

                {/* Display Content Area inside Screen Glass */}
                <div className="relative h-full w-full flex items-center justify-center bg-black overflow-hidden">
                  {/* Subtle glossy glass reflection across top left */}
                  <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent rotate-[-6deg] z-30" />

                  {/* Boot Sequence Overlay */}
                  <AnimatePresence>
                    {isBooting && (
                      <motion.div
                        key="boot-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-radial from-slate-900 via-[#070c18] to-black text-center px-4"
                      >
                        {/* Glowing Logo */}
                        <motion.div
                          animate={{ scale: [0.96, 1.04, 0.96] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                          className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-full shadow-[0_0_24px_rgba(59,130,246,0.6)] border border-blue-400/40"
                        >
                          <Image
                            src="/logo/unboundx-mark.png"
                            alt="UBverse"
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </motion.div>

                        <p className="mt-3 text-xs sm:text-sm font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                          UBverse OS
                        </p>

                        {/* Animated Progress Bar */}
                        <div className="mt-4 w-40 sm:w-56 h-1 sm:h-1.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.8, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                          />
                        </div>

                        <p className="mt-2 text-[10px] sm:text-xs text-slate-400 font-medium">
                          {phase === "POWERING_ON"
                            ? "Powering on display engine..."
                            : "Loading verified diligence network..."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Hand Interaction Overlay (anchored to top center of the lid) */}
              <AnimatePresence>
                {showHand && (
                  <motion.div
                    key="hand-interaction"
                    initial={{ opacity: 0, y: -90, scale: 0.95 }}
                    animate={{
                      opacity: phase === "OPEN" ? 0 : 1,
                      y: phase === "OPEN" ? -40 : 0,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, y: -60, scale: 0.96 }}
                    transition={{
                      duration: phase === "OPEN" ? 0.6 : 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute left-1/2 -top-14 sm:-top-20 -translate-x-1/2 z-50 pointer-events-none w-24 sm:w-36 md:w-44 h-auto"
                  >
                    <RealisticHand />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Live Interface Indicator Badge on Display Phase */}
          {isDisplaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[10.5%] right-[14.5%] z-30 inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-emerald-400 border border-emerald-500/30 shadow-md pointer-events-none"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE PROTOCOL</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Interactive Control & Status Bar */}
      {mounted && !isReduced && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-1.5 shadow-2xs backdrop-blur-md">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Sparkles size={13} className="text-blue-600" />
              {phase === "CLOSED" && "Closed · Hand Approaching"}
              {phase === "APPROACH" && "Hand Positioning at Notch"}
              {phase === "OPENING" && "Hand Lifting Display"}
              {phase === "OPEN" && "Lid Open · Releasing"}
              {phase === "POWERING_ON" && "Power Button Activated"}
              {phase === "BOOTING" && "Booting UBverse Engine"}
              {phase === "DISPLAYING" && "Live Platform Presentation"}
              {phase === "CLOSING" && "Closing Display"}
            </span>

            <span className="h-3 w-px bg-slate-200" />

            <button
              type="button"
              onClick={togglePause}
              title={isPaused ? "Resume auto presentation" : "Pause presentation on screen"}
              aria-label={isPaused ? "Resume auto presentation" : "Pause presentation on screen"}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <span className="h-3 w-px bg-slate-200" />

            <button
              type="button"
              onClick={restartCycle}
              title="Replay sequence from beginning"
              aria-label="Replay sequence from beginning"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Replay</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LaptopFrame;