import React from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/CountUp";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface DataMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
  animated?: boolean;
}

export function DataMetricCard({
  label,
  value,
  prefix = "",
  suffix = "",
  change,
  changeLabel,
  trend,
  icon,
  subtitle,
  animated = true,
  className = "",
  ...props
}: DataMetricCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value.replace(/[^0-9.-]+/g, ""));
  const isNumeric = !isNaN(numericValue) && animated;

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/90 bg-white p-5 text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_6px_20px_rgba(15,23,42,0.05)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="tabular-numbers text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {prefix}
          {isNumeric ? (
            <CountUp value={numericValue} />
          ) : (
            <span>{value}</span>
          )}
          {suffix}
        </div>

        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[0.72rem] font-bold",
              trend === "up" || (trend === undefined && change >= 0)
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                : "bg-rose-50 text-rose-700 border border-rose-200/80"
            )}
          >
            {trend === "up" || (trend === undefined && change >= 0) ? (
              <TrendingUp className="size-3" />
            ) : trend === "down" || (trend === undefined && change < 0) ? (
              <TrendingDown className="size-3" />
            ) : (
              <Minus className="size-3" />
            )}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
          </span>
        )}
      </div>

      {(subtitle || changeLabel) && (
        <p className="mt-1.5 text-xs text-slate-500 font-normal">
          {changeLabel ? `${changeLabel} · ` : ""}
          {subtitle}
        </p>
      )}
    </div>
  );
}
