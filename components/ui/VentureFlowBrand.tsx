import React from "react";
import Image from "next/image";
import { PRODUCT_NAME, COMPANY_NAME } from "@/lib/constants";

export function VentureFlowBrand({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block font-display font-extrabold tracking-tight select-none text-slate-900 ${className}`}
    >
      Venture<span className="text-blue-600">Flow</span>
    </span>
  );
}

export function VentureFlowFullBrand({
  className = "",
  byClassName = "",
  companyClassName = "",
}: {
  className?: string;
  byClassName?: string;
  companyClassName?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-display tracking-tight select-none text-slate-900 ${className}`}
    >
      <VentureFlowBrand />
      <span className={`text-xs font-normal text-slate-400 ${byClassName}`}>by</span>
      <span className={`font-bold text-slate-900 ${companyClassName}`}>{COMPANY_NAME}</span>
    </span>
  );
}

export function VentureFlowLogoLockup({
  size = 32,
  className = "",
  showParent = true,
}: {
  size?: number;
  className?: string;
  showParent?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 overflow-hidden rounded-full shadow-2xs border border-slate-200/80 bg-blue-600"
      >
        <Image
          src="/logo/vf-mark.png"
          alt={PRODUCT_NAME}
          width={size}
          height={size}
          className="h-full w-full object-cover rounded-full"
          priority
        />
      </div>
      {showParent ? (
        <VentureFlowFullBrand className="text-[1.05rem] sm:text-[1.15rem]" />
      ) : (
        <VentureFlowBrand className="text-[1.05rem] sm:text-[1.15rem]" />
      )}
    </div>
  );
}

