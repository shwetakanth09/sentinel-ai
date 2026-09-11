import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  className,
  color = "bg-accent",
}: {
  value?: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-border overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}