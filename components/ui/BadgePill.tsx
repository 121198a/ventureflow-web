import React from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface BadgePillProps extends BadgeProps {
  icon?: React.ReactNode;
}

export function BadgePill({
  icon,
  children,
  className = "",
  variant = "brand",
  size = "sm",
  ...props
}: BadgePillProps) {
  return (
    <Badge
      variant={variant}
      size={size}
      shape="pill"
      className={cn("px-3 py-1 font-semibold normal-case text-xs shadow-2xs", className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </Badge>
  );
}
