import React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  eyebrowIcon?: React.ReactNode;
  title: React.ReactNode;
  titleHighlight?: string;
  description?: React.ReactNode;
  align?: "center" | "left";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "none";
  className?: string;
  delay?: number;
}

const widthClasses: Record<NonNullable<SectionHeaderProps["maxWidth"]>, string> = {
  sm: "max-w-[540px]",
  md: "max-w-[680px]",
  lg: "max-w-[820px]",
  xl: "max-w-[960px]",
  none: "max-w-none",
};

export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  title,
  titleHighlight,
  description,
  align = "center",
  maxWidth = "lg",
  className = "",
  delay = 0,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "relative",
        isCenter ? "mx-auto text-center" : "text-left",
        widthClasses[maxWidth],
        className
      )}
    >
      {eyebrow && (
        <Reveal delay={delay}>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs",
              isCenter && "justify-center"
            )}
          >
            {eyebrowIcon}
            <span>{eyebrow}</span>
          </div>
        </Reveal>
      )}

      <Reveal delay={delay + 0.06}>
        <h2 className="heading-section mt-4 text-[1.85rem] sm:text-[2.25rem] lg:text-[2.75rem] text-slate-900 leading-[1.12]">
          {title}
          {titleHighlight && (
            <>
              {" "}
              <span className="text-blue-600">{titleHighlight}</span>
            </>
          )}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={delay + 0.12}>
          <p
            className={cn(
              "mt-4 text-[0.95rem] sm:text-[1.05rem] leading-relaxed text-slate-600 font-normal",
              isCenter && "mx-auto max-w-[620px]"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
