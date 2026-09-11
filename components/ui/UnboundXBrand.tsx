import React from "react";

export function UnboundXBrand({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-display font-extrabold tracking-tight select-none bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #ff5a00 0%, #d946ef 35%, #7c3aed 65%, #00a2ff 100%)",
      }}
    >
      UnBound X
    </span>
  );
}
