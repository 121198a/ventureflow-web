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
  src = "/images/hero-laptop.jpg",
  videoSrc = "/UBverse-Laptop.mp4",
  autoPlay = true,
  withWatermark = false,
}: LaptopFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Initialize and attempt autoplay with proper browser compatibility
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay muted retry
        video.muted = true;
        video.play().catch(() => {});
      });
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
        } else if (entry.intersectionRatio === 0) {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: [0, 0.1, 0.25] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay, attemptPlay]);

  // Direct video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const onLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) attemptPlay();
    };

    video.addEventListener("loadeddata", onLoadedData);

    // Initial mount attempt
    if (video.readyState >= 2) {
      setIsLoaded(true);
      if (autoPlay) attemptPlay();
    }

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
    };
  }, [autoPlay, attemptPlay]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto w-full max-w-[640px] flex flex-col items-center select-none",
        className
      )}
    >
      {/* Subtle ambient lighting behind laptop to enhance 3D depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-[32px] bg-gradient-to-tr from-blue-600/15 via-sky-400/10 to-blue-500/15 blur-2xl transition-opacity duration-700 opacity-80"
      />

      {/* Repeated Watermark Backdrop removed */}
      {withWatermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 sm:-inset-12 -z-10 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-50/60 via-slate-50/30 to-white/40 border border-slate-200/50 shadow-md"
        >
          {/* Subtle light glow pods */}
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-sky-400/15 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-blue-500/15 blur-2xl" />
        </div>
      )}

      {/* Main Laptop Media Display */}
      <div className="relative z-10 w-full overflow-hidden rounded-xl sm:rounded-2xl drop-shadow-[0_20px_50px_rgba(15,23,42,0.14)] border border-slate-800/20 bg-slate-950">
        {!videoError ? (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-950 flex items-center justify-center">
            {/* Poster fallback while video loads */}
            {!isLoaded && (
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, 620px"
                className="object-contain"
              />
            )}

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
                console.warn("[LaptopFrame] Video source load failed, falling back to static poster.");
                setVideoError(true);
              }}
              className={cn(
                "absolute inset-0 size-full object-contain transition-opacity duration-500",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              aria-label={alt}
            />

            {/* Optional children overlay inside screen */}
            {children && (
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {children}
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-[16/9]">
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
    </div>
  );
}

export default LaptopFrame;
