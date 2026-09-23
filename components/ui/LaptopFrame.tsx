"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LaptopFrameProps {
  children?: React.ReactNode;
  className?: string;
  priority?: boolean;
  alt?: string;
  src?: string;
  videoSrc?: string;
  autoPlay?: boolean;
  withWatermark?: boolean;
  watermarkText?: string;
  showCircuitLine?: boolean;
}

/**
 * High-performance, responsive laptop showcase component playing the authentic
 * UBverse 3D laptop animation (/UBverse-Laptop.mp4) with seamless looping,
 * robust autoplay handling, and zero clutter (pure auto-playing animation).
 */
export function LaptopFrame({
  children,
  className = "",
  priority = false,
  alt = "UBverse platform showcased on a high-resolution laptop screen with open capital raises and featured start-ups",
  src = "/images/ubverse-laptop-poster.webp",
  videoSrc = "/UBverse-Laptop.mp4",
  autoPlay = true,
  withWatermark = false,
}: LaptopFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const isAttemptingPlayRef = useRef(false);

  // Initialize and attempt autoplay with proper browser compatibility
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || isAttemptingPlayRef.current) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Start within the active open-laptop sequence (1.8s - 5.5s) to avoid initial black frames
    if (video.readyState >= 1 && (video.currentTime < 1.8 || video.currentTime >= 5.5)) {
      video.currentTime = 1.8;
    }

    if (!video.paused) {
      setIsPlaying(true);
      return;
    }

    isAttemptingPlayRef.current = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAttemptingPlayRef.current = false;
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked by mobile browser or low-power mode - high-res poster remains cleanly visible
          isAttemptingPlayRef.current = false;
          setIsPlaying(false);
        });
    } else {
      isAttemptingPlayRef.current = false;
    }
  }, []);

  // Handle intersection observer to pause when off-screen and resume when in view
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (autoPlay) {
            attemptPlay();
          }
        } else {
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay, attemptPlay]);

  // Direct video event listeners for robust cross-browser and mobile playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const handleLoadedMetadata = () => {
      // Seek past the initial dark/closed lid animation
      if (video.duration > 1.8 && video.currentTime < 1.8) {
        video.currentTime = 1.8;
      }
      if (autoPlay) attemptPlay();
    };

    const handlePlaying = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Keep looping seamlessly inside the active 3D open laptop sequence (1.8s - 5.5s)
    // so the laptop NEVER fades into black frames during animation loops
    const handleTimeUpdate = () => {
      if (video.readyState >= 1 && video.currentTime >= 5.5) {
        video.currentTime = 1.8;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlaying);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Initial mount attempt
    if (video.readyState >= 1) {
      if (video.duration > 1.8 && video.currentTime < 1.8) {
        video.currentTime = 1.8;
      }
      if (autoPlay) attemptPlay();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlaying);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [autoPlay, attemptPlay]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    // Prevent toggle if clicking on interactive children (like links or buttons)
    if ((e.target as HTMLElement).closest("a, button, input, select")) {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (video.readyState >= 1 && (video.currentTime < 1.8 || video.currentTime >= 5.5)) {
        video.currentTime = 1.8;
      }
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto w-full max-w-[640px] flex flex-col items-center select-none overflow-hidden sm:overflow-visible cursor-pointer",
        className
      )}
      onClick={handleTogglePlay}
      role="region"
      aria-label={alt}
    >
      {/* Subtle ambient lighting behind laptop - clamped on mobile to prevent horizontal viewport overflow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 sm:-inset-4 lg:-inset-8 rounded-2xl sm:rounded-[32px] bg-gradient-to-tr from-blue-600/15 via-sky-400/10 to-blue-500/15 blur-xl sm:blur-2xl transition-opacity duration-700 opacity-80"
      />

      {/* Watermark Backdrop */}
      {withWatermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 sm:-inset-6 lg:-inset-10 -z-10 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-sky-50/60 via-slate-50/30 to-white/40 border border-slate-200/50 shadow-md"
        >
          {/* Subtle light glow pods */}
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-sky-400/15 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-blue-500/15 blur-2xl" />
        </div>
      )}

      {/* Main Laptop Media Display with subtle bezel frame */}
      <div className="relative z-10 w-full overflow-hidden rounded-xl sm:rounded-2xl drop-shadow-[0_20px_50px_rgba(15,23,42,0.14)] border border-slate-800/40 bg-slate-950">
        {/* Subtle top camera indicator */}
        <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-slate-700/60 z-30 pointer-events-none" />

        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-slate-950 flex items-center justify-center">
          {/* Persistent high-res poster layer: ALWAYS visible as baseline so laptop is NEVER black or hidden on any device */}
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, 620px"
            className="object-contain scale-[1.18] sm:scale-100 origin-center transition-transform duration-300"
          />

          {!videoError && (
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay={autoPlay}
              loop
              muted
              playsInline
              preload="auto"
              poster={src}
              onError={() => {
                setVideoError(true);
              }}
              className={cn(
                "absolute inset-0 size-full object-contain scale-[1.18] sm:scale-100 origin-center transition-opacity duration-700",
                isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              aria-label={alt}
            />
          )}

          {/* Optional children overlay inside screen */}
          {children && (
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Laptop Base / Keyboard Chassis Accent */}
      <div className="relative -mt-px h-2 sm:h-3 w-full max-w-[94%] sm:max-w-[92%] rounded-b-lg sm:rounded-b-xl border-t border-slate-700/60 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 shadow-md">
        {/* Trackpad notch */}
        <div className="absolute left-1/2 top-0 h-0.5 sm:h-1 w-12 sm:w-16 -translate-x-1/2 rounded-b-md bg-slate-600/70" />
      </div>
    </div>
  );
}

export default LaptopFrame;
