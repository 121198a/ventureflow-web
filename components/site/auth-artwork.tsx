"use client";

import React from "react";
import Image from "next/image";

export function AuthArtwork({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full max-w-[520px] aspect-[16/9] sm:aspect-[2/1] my-2 select-none overflow-hidden rounded-2xl pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Background Soft Pastel Horizon & City Silhouette */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 520 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky & Horizon Gradient */}
          <linearGradient id="skyGrad" x1="260" y1="0" x2="260" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f4f8ff" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#ebf3fe" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#e3effd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#dcebfe" stopOpacity="0.1" />
          </linearGradient>

          {/* Futuristic City Tower Silhouette Gradient */}
          <linearGradient id="cityGrad" x1="260" y1="70" x2="260" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#bfdbfe" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.05" />
          </linearGradient>

          {/* Glowing Iridescent Neon Highway Ribbons */}
          <linearGradient id="neonRoad1" x1="0" y1="240" x2="380" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#0284c7" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="neonRoad2" x1="40" y1="260" x2="320" y2="175" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#6366f1" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="neonRoad3" x1="80" y1="260" x2="280" y2="178" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#f43f5e" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c026d3" stopOpacity="0.75" />
          </linearGradient>

          {/* Platform Glow */}
          <radialGradient id="podiumGlow" cx="215" cy="170" r="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Fill */}
        <rect width="520" height="260" fill="url(#skyGrad)" />

        {/* Futuristic City Tower Silhouettes - Left */}
        <path d="M40 220 V125 H52 V220 M56 220 V105 H70 V220 M74 220 V140 H84 V220 M90 220 V90 H106 V220 M110 220 V115 H122 V220 M126 220 V75 H144 V220 M148 220 V130 H160 V220" fill="url(#cityGrad)" />
        {/* Futuristic City Tower Silhouettes - Right */}
        <path d="M290 220 V135 H302 V220 M306 220 V95 H320 V220 M324 220 V110 H336 V220 M340 220 V80 H358 V220 M362 220 V130 H374 V220 M380 220 V115 H394 V220 M400 220 V145 H412 V220" fill="url(#cityGrad)" />

        {/* Soft atmospheric radial pod */}
        <circle cx="215" cy="170" r="90" fill="url(#podiumGlow)" />

        {/* Curved Glowing Perspective Highway Ribbon - Blue Base Layer */}
        <path
          d="M-20 250 C60 230 110 215 170 195 C200 185 240 180 290 188 C340 196 400 215 470 238 L450 255 C380 230 330 214 285 206 C240 198 200 202 165 212 C100 230 50 250 -10 265 Z"
          fill="url(#neonRoad1)"
        />

        {/* Curved Glowing Perspective Highway Ribbon - Magenta/Purple Upper Tier */}
        <path
          d="M0 242 C70 218 120 198 175 182 C205 174 235 172 265 178 C305 186 360 206 430 232 L415 244 C350 218 300 200 260 192 C232 186 206 188 172 196 C115 212 65 232 -5 255 Z"
          fill="url(#neonRoad2)"
        />

        {/* Curved Glowing Perspective Highway Ribbon - Vibrant Amber/Pink Wave Accent */}
        <path
          d="M20 238 C80 210 130 188 185 176 C210 170 235 169 255 174 C285 182 330 200 395 225 L385 233 C322 210 280 192 250 186 C232 181 210 182 182 188 C126 202 75 222 15 248 Z"
          fill="url(#neonRoad3)"
        />

        {/* Pedestal Base Platform Rings */}
        <ellipse cx="215" cy="188" rx="72" ry="16" fill="#ffffff" fillOpacity="0.85" stroke="#93c5fd" strokeWidth="1.5" />
        <ellipse cx="215" cy="184" rx="58" ry="13" fill="#eff6ff" fillOpacity="0.9" stroke="#60a5fa" strokeWidth="1.5" />
        <ellipse cx="215" cy="180" rx="44" ry="10" fill="#ffffff" fillOpacity="0.95" stroke="#3b82f6" strokeWidth="2" />
      </svg>

      {/* Center 3D UBverse Glowing Emblem on Pedestal */}
      <div className="absolute left-[215px] top-[148px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* Soft Multi-color Ambient Glow behind Logo */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-sky-400/40 via-purple-400/35 to-pink-400/35 blur-xl pointer-events-none" />
        
        {/* The Authentic 3D "U" Mark */}
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 drop-shadow-[0_12px_24px_rgba(37,99,235,0.35)] transition-transform duration-500 hover:scale-105">
          <Image
            src="/images/ubverse-logo.png"
            alt="UBverse 3D Emblem"
            width={96}
            height={96}
            className="h-full w-full object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
