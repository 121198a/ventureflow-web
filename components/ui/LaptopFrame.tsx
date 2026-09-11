"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface LaptopFrameProps {
  children: React.ReactNode;
  open?: boolean;
}

export function LaptopFrame({ children, open = false }: LaptopFrameProps) {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="relative mx-auto w-full max-w-[880px] [perspective:1400px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Screen + lid, hinges at the bottom edge */}
      <motion.div
        initial={false}
        animate={
          !mounted || reduce
            ? { rotateX: 0 }
            : { rotateX: open ? 0 : 80 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transformOrigin: "bottom center",
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 mx-auto w-full rounded-t-xl border-[5px] border-slate-800 bg-slate-900 p-2 shadow-2xl sm:rounded-t-xl sm:border-[8px] sm:p-2.5"
      >
        {/* Camera notch */}
        <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-pill bg-slate-700 sm:top-2 sm:h-2 sm:w-2" />

        {/* Display Screen */}
        <div className="relative min-h-[220px] min-[400px]:min-h-[250px] sm:min-h-0 sm:aspect-[16/10] w-full overflow-hidden rounded-lg bg-white sm:rounded-xl">
          {children}
        </div>
      </motion.div>

      {/* Laptop Base / Keyboard Chassis */}
      <div className="relative -mt-0.5 h-3.5 w-full rounded-b-xl border-t border-slate-700 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 shadow-md sm:h-5 sm:rounded-b-xl">
        {/* Trackpad notch */}
        <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-md bg-slate-600 sm:h-1.5 sm:w-24" />
      </div>
    </div>
  );
}

export default LaptopFrame;