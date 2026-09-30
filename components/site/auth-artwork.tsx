"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Authentic VentureFlow neural mesh / particle wave artwork as shown in the reference design.
 * Positioned across the bottom-left of the viewport with a soft fade into the background.
 */
export function AuthArtwork({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none relative select-none overflow-hidden", className)}
      style={{ aspectRatio: "1348 / 880" }}
    >
      <Image
        src="/images/auth-wave.webp"
        alt=""
        width={1348}
        height={880}
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-full w-full object-cover object-left-bottom"
        aria-hidden="true"
      />
    </div>
  );
}
