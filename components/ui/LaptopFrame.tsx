"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LaptopFrameProps {
  children?: React.ReactNode;
  className?: string;
  priority?: boolean;
  alt?: string;
  src?: string;
  videoSrc?: string;
  autoPlay?: boolean;
}

/**
 * Reusable, responsive laptop device component playing the authentic UBverse
 * high-definition video with autoPlay, seamless looping, viewport pause/resume,
 * high-res poster fallback, and accessible playback controls.
 */
export function LaptopFrame({
  children,
  className = "",
  priority = false,
  alt = "UBverse platform displayed on a high-resolution laptop screen with open capital raises and featured start-ups",
  src = "/images/hero-laptop.jpg",
  videoSrc = "/UBverse-Laptop.mp4",
  autoPlay = true,
}: LaptopFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Play/pause control based on viewport visibility to save CPU and battery
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (autoPlay && video.paused) {
            video.play().catch(() => {});
            setIsPlaying(true);
          }
        } else {
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto w-full max-w-[620px] flex flex-col items-center select-none",
        className
      )}
    >
      {/* Subtle ambient lighting behind laptop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 sm:-inset-8 rounded-3xl bg-gradient-to-tr from-blue-600/15 via-sky-400/10 to-indigo-500/15 blur-2xl"
      />

      {/* Main Laptop Media Display */}
      <div className="relative z-10 w-full overflow-hidden rounded-xl sm:rounded-2xl drop-shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        {!videoError ? (
          <div className="relative w-full aspect-[3/2] rounded-xl sm:rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay={autoPlay}
              loop
              muted
              playsInline
              preload="auto"
              poster={src}
              onError={() => setVideoError(true)}
              className="absolute inset-0 size-full object-contain"
              aria-label={alt}
            >
              <source src={videoSrc} type="video/mp4" />
              <source src="/UBverse-Laptop-8K.mp4" type="video/mp4" />
            </video>

            {/* Optional children overlay */}
            {children && (
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {children}
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-[3/2]">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, 620px"
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Control & Status Bar */}
      <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-3 py-1 shadow-2xs backdrop-blur-md">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className={cn("size-1.5 rounded-full", isPlaying ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
            <span>{isPlaying ? " Playing" : "Paused"}</span>
          </span>

          <span className="h-3 w-px bg-slate-200" />

          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? "Pause video" : "Play video"}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <span className="h-3 w-px bg-slate-200" />

          <button
            type="button"
            onClick={restartVideo}
            title="Replay video from beginning"
            aria-label="Replay video from beginning"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LaptopFrame;
