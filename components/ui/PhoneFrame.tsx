import type { ReactNode } from "react";
import { FaSignal } from "react-icons/fa";
import { FaBatteryThreeQuarters } from "react-icons/fa6";
import { LuMessageCircle } from "react-icons/lu";
import { Wifi } from "lucide-react";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={
        "relative mx-auto aspect-[280/560] w-[min(78vw,240px)] overflow-hidden rounded-xl border-[5px] border-[#0a1226] bg-white shadow-2xl transition-[box-shadow,transform] duration-500 hover:shadow-[0_24px_60px_rgba(10,18,38,0.20),0_0_30px_rgba(37,99,235,0.08)] sm:w-[260px] sm:rounded-xl sm:border-[6px] lg:w-[280px] " +
        className
      }
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 z-30 h-12 bg-gradient-to-b from-white/20 to-transparent" />

      <div className="relative z-20 flex h-7 shrink-0 items-center px-4 pt-1 text-micro font-semibold text-slate-900">
        <div className="flex items-center gap-1.5">
          <span className="tracking-tight">12:26</span>

          <div className="relative">
            <LuMessageCircle
              size={10}
              strokeWidth={2.5}
              className="text-slate-900"
              aria-label="Messages"
            />

            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-pill bg-blue-600" />
          </div>
        </div>

        <div className="absolute left-1/2 top-1 h-4 w-24 -translate-x-1/2 rounded-pill bg-[#0a1226]" />

        <div className="ml-auto flex items-center gap-1.5">
          <FaSignal
            className="text-micro text-slate-900"
            aria-label="Cellular signal"
          />

          <Wifi
            size={11}
            strokeWidth={2.5}
            className="text-slate-900"
            aria-label="WiFi"
          />

          <div className="flex items-center gap-0.5">
            <span className="text-micro font-bold">92%</span>

            <FaBatteryThreeQuarters
              className="text-micro text-slate-900"
              aria-label="Battery 75 percent"
            />
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-28px)] overflow-hidden">{children}</div>
    </div>
  );
}
