import React from "react";

export function UnboundXBrand({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-display font-extrabold tracking-tight select-none text-slate-900 ${className}`}
    >
      UnBound <span className="text-blue-600">X</span>
    </span>
  );
}
