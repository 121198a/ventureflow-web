import type { ReactNode } from "react";
import { FaSignal } from "react-icons/fa";
import { FaBatteryThreeQuarters } from "react-icons/fa6";
import { LuMessageCircle } from "react-icons/lu";
import { Wifi } from "lucide-react";

export type PhoneFrameTheme =
  | "intelligence"
  | "hero"
  | "feed"
  | "invest"
  | "growth"
  | "thesis"
  | "spaces"
  | "custom";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  showWifi?: boolean;
  theme?: PhoneFrameTheme;
  customGradient?: string;
  customGlow?: string;
  time?: string;
  batteryPercentage?: string;
  showStatusBar?: boolean;
  showHomeIndicator?: boolean;
  withWatermark?: boolean;
  watermarkText?: string;
};

// Curated 4-edge corner continuous gradients tailored to content & visual style of Image 2
const THEME_GRADIENTS: Record<string, { gradient: string; glow: string }> = {
  intelligence: {
    gradient:
      "conic-gradient(from 225deg at 50% 50%, #f43f5e 0deg, #ec4899 45deg, #a855f7 90deg, #6366f1 135deg, #3b82f6 180deg, #06b6d4 225deg, #38bdf8 270deg, #ec4899 330deg, #f43f5e 360deg)",
    glow: "rgba(56, 189, 248, 0.22)",
  },
  hero: {
    gradient:
      "conic-gradient(from 215deg at 50% 50%, #3b82f6 0deg, #60a5fa 50deg, #818cf8 110deg, #2563eb 175deg, #06b6d4 230deg, #38bdf8 280deg, #60a5fa 340deg, #3b82f6 360deg)",
    glow: "rgba(37, 99, 235, 0.2)",
  },
  feed: {
    gradient:
      "conic-gradient(from 180deg at 50% 50%, #2563eb 0deg, #38bdf8 60deg, #06b6d4 120deg, #10b981 180deg, #3b82f6 240deg, #6366f1 300deg, #2563eb 360deg)",
    glow: "rgba(37, 99, 235, 0.2)",
  },
  invest: {
    gradient:
      "conic-gradient(from 200deg at 50% 50%, #10b981 0deg, #34d399 60deg, #06b6d4 130deg, #2563eb 190deg, #10b981 260deg, #059669 320deg, #10b981 360deg)",
    glow: "rgba(16, 185, 129, 0.2)",
  },
  growth: {
    gradient:
      "conic-gradient(from 200deg at 50% 50%, #10b981 0deg, #34d399 60deg, #06b6d4 130deg, #2563eb 190deg, #10b981 260deg, #059669 320deg, #10b981 360deg)",
    glow: "rgba(16, 185, 129, 0.2)",
  },
  thesis: {
    gradient:
      "conic-gradient(from 190deg at 50% 50%, #3b82f6 0deg, #6366f1 60deg, #8b5cf6 120deg, #06b6d4 180deg, #38bdf8 250deg, #1d4ed8 310deg, #3b82f6 360deg)",
    glow: "rgba(59, 130, 246, 0.2)",
  },
  spaces: {
    gradient:
      "conic-gradient(from 220deg at 50% 50%, #8b5cf6 0deg, #a855f7 60deg, #ec4899 120deg, #6366f1 180deg, #3b82f6 250deg, #06b6d4 310deg, #8b5cf6 360deg)",
    glow: "rgba(139, 92, 246, 0.2)",
  },
};

export function PhoneFrame({
  children,
  className = "",
  innerClassName = "",
  showWifi = true,
  theme = "hero",
  customGradient,
  customGlow,
  time = "12:26",
  batteryPercentage = "92%",
  showStatusBar = true,
  showHomeIndicator = true,
  withWatermark = false,
  watermarkText = "",
}: PhoneFrameProps) {
  const selectedTheme = THEME_GRADIENTS[theme] || THEME_GRADIENTS.hero;
  const gradientStyle = customGradient || selectedTheme.gradient;
  const glowColor = customGlow || selectedTheme.glow;

  return (
    <div
      className={
        "relative mx-auto aspect-[280/560] w-[min(78vw,240px)] select-none sm:w-[260px] lg:w-[280px] " +
        className
      }
    >
      {/* Optional Backdrop behind standalone PhoneFrame */}
      {withWatermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 -z-20 rounded-[44px] overflow-hidden bg-gradient-to-b from-sky-50/50 via-white/20 to-slate-50/30 border border-slate-200/40"
        />
      )}

      {/* Phone Outer Chassis (Precision Titanium Bezel with Metallic Border) */}
      <div className="relative h-full w-full rounded-[34px] bg-[#0c1322] p-[3px] shadow-[0_24px_60px_-15px_rgba(15,23,42,0.18),0_10px_24px_-6px_rgba(30,64,175,0.08)] ring-1 ring-slate-400/30 transition-[box-shadow,transform] duration-500 hover:shadow-[0_28px_65px_-12px_rgba(15,23,42,0.22),0_0_25px_rgba(37,99,235,0.12)] sm:rounded-[38px] sm:p-[3.5px]">
        {/* Subtle Hardware Side Buttons Hints */}
        <div className="pointer-events-none absolute -left-[5px] top-[72px] h-7 w-[3px] rounded-l-sm bg-slate-600/90" />
        <div className="pointer-events-none absolute -left-[5px] top-[110px] h-10 w-[3px] rounded-l-sm bg-slate-600/90" />
        <div className="pointer-events-none absolute -left-[5px] top-[156px] h-10 w-[3px] rounded-l-sm bg-slate-600/90" />
        <div className="pointer-events-none absolute -right-[5px] top-[96px] h-14 w-[3px] rounded-r-sm bg-slate-600/90" />

        {/* 4-Edge Perimeter Refined Ambient Gradient Ribbon */}
        <div
          className="relative h-full w-full rounded-[31px] p-[2px] sm:rounded-[35px]"
          style={{
            background: gradientStyle,
            boxShadow: `0 0 12px ${glowColor}, inset 0 0 4px ${glowColor}`,
          }}
        >
          {/* Subtle Outer Bloom */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-[31px] opacity-60 blur-[2px] sm:rounded-[35px]"
            style={{
              background: gradientStyle,
            }}
          />

          {/* Phone Screen Container */}
          <div
            className={
              "relative flex h-full w-full flex-col overflow-hidden rounded-[29px] bg-white sm:rounded-[33px] " +
              innerClassName
            }
          >
            {/* Specular Screen Glass Reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-16 bg-gradient-to-b from-white/30 via-white/5 to-transparent" />

            {/* Status Bar */}
            {showStatusBar && (
              <div className="relative z-20 flex h-7 shrink-0 items-center px-4 pt-1 text-micro font-semibold text-slate-900">
                {/* Left: Time & Messages Notification */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold tracking-tight">{time}</span>

                  <div className="relative">
                    <LuMessageCircle
                      size={10}
                      strokeWidth={2.5}
                      className="text-slate-900"
                      aria-label="Messages"
                    />
                    <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-pill bg-blue-600 animate-pulse" />
                  </div>
                </div>

                {/* Center: Dynamic Island Pill with Camera Dot */}
                <div className="absolute left-1/2 top-1 flex h-4 w-24 -translate-x-1/2 items-center justify-end px-2 rounded-pill bg-[#060a12] shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#151e32] ring-[0.5px] ring-white/20" />
                </div>

                {/* Right: Cellular Signal, Wi-Fi & Battery */}
                <div className="ml-auto flex items-center gap-1.5">
                  <FaSignal
                    className="text-micro text-slate-900"
                    aria-label="Cellular signal"
                  />

                  {showWifi && (
                    <Wifi
                      size={11}
                      strokeWidth={2.5}
                      className="text-slate-900"
                      aria-label="WiFi"
                    />
                  )}

                  <div className="flex items-center gap-0.5">
                    <span className="text-micro font-bold">{batteryPercentage}</span>
                    <FaBatteryThreeQuarters
                      className="text-micro text-slate-900"
                      aria-label="Battery 75 percent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Screen Content */}
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

            {/* Bottom Home Indicator Bar */}
            {showHomeIndicator && (
              <div className="pointer-events-none relative z-20 h-4 shrink-0 bg-transparent flex items-center justify-center pb-1">
                <div className="h-1 w-24 rounded-full bg-slate-900/70" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
