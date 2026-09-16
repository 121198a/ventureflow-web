import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerSize = "default" | "narrow" | "wide" | "full";

const sizes: Record<ContainerSize, string> = {
  default: "max-w-[1240px]",
  narrow: "max-w-[760px]",
  wide: "max-w-[1400px]",
  full: "w-full",
};

export function Container({
  size = "default",
  children,
  className = "",
}: {
  size?: ContainerSize;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-5", sizes[size], className)}>
      {children}
    </div>
  );
}
