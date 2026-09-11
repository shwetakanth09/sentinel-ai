"use client";

import type { Entity } from "@/types";
import { Progress } from "@/components/ui/progress";
import { getRiskFactors } from "@/lib/graph-analytics";
import { cn } from "@/lib/utils";

export function RiskBreakdown({ entity }: { entity: Entity }) {
  const factors = getRiskFactors(entity);
  const total = entity.riskIndicator;
  const tone = total >= 70 ? "text-red" : total >= 40 ? "text-amber" : "text-green";

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
            Network Risk Indicator
          </p>
          <p className={cn("mt-1 text-3xl font-bold tabular-nums", tone)}>
            {total}
            <span className="text-sm font-normal text-muted">/100</span>
          </p>
        </div>
        <p className="max-w-[200px] text-right text-[10px] leading-snug text-muted-light">
          AI-generated investigative indicator based on observed relationships and activity
          patterns. This does not establish criminal activity and requires human verification.
        </p>
      </div>

      <div className="space-y-2.5">
        {factors.map((f) => {
          const contribution = Math.round(f.weight * f.score);
          return (
            <div key={f.id} className="rounded-md border border-border bg-card-alt p-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">{f.label}</p>
                  <p className="text-[10px] text-muted">{f.detail}</p>
                </div>
                <span className="ml-2 shrink-0 text-sm font-semibold tabular-nums text-accent">
                  +{contribution}
                </span>
              </div>
              <div className="mt-1.5">
                <Progress value={f.score} className="h-1" />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[10px] text-muted-light">
        Formula: 30% network centrality · 20% cross-cluster connections · 20% association
        density · 15% temporal pattern · 15% activity anomaly.
      </p>
    </div>
  );
}