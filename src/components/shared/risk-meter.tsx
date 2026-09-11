import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { RISK_COLORS } from "@/lib/entity-config";

export function RiskMeter({
  value,
  showLabel = true,
  size = "md",
  className,
}: {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const tone = value >= 70 ? "high" : value >= 40 ? "medium" : "low";
  const color = RISK_COLORS[tone];
  const label = value >= 70 ? "Elevated" : value >= 40 ? "Moderate" : "Low";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs">
          <Activity className="h-3.5 w-3.5" style={{ color }} />
          {showLabel && <span className="font-medium text-foreground">{label}</span>}
        </span>
        <span className={cn("tabular-nums font-bold", size === "lg" ? "text-2xl" : "text-sm")} style={{ color }}>
          {value}
          {size === "lg" && <span className="text-xs font-normal text-muted">/100</span>}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function RiskBadge({ value }: { value: number }) {
  const tone = value >= 70 ? "high" : value >= 40 ? "medium" : "low";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
      style={{
        color: RISK_COLORS[tone],
        borderColor: `${RISK_COLORS[tone]}44`,
        backgroundColor: `${RISK_COLORS[tone]}11`,
      }}
    >
      <Activity className="h-3 w-3" />
      {value} · {value >= 70 ? "Elevated" : value >= 40 ? "Moderate" : "Low"}
    </span>
  );
}