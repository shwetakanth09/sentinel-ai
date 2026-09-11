"use client";

import { ENTITY_TYPE_CONFIG, ENTITY_TYPE_LIST } from "@/lib/entity-config";

export function GraphLegend({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-3">
        {ENTITY_TYPE_LIST.map((type) => {
          const cfg = ENTITY_TYPE_CONFIG[type];
          return (
            <div key={type} className="flex items-center gap-1.5 text-[10px] text-muted">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm border"
                style={{ backgroundColor: `${cfg.fill}33`, borderColor: cfg.stroke }}
              />
              {cfg.label}
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 text-[10px] text-muted">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-amber" />
          Bridge entity
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2.5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Legend</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {ENTITY_TYPE_LIST.map((type) => {
          const cfg = ENTITY_TYPE_CONFIG[type];
          return (
            <div key={type} className="flex items-center gap-1.5 text-[11px] text-foreground">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm border"
                style={{ backgroundColor: `${cfg.fill}33`, borderColor: cfg.stroke }}
              />
              {cfg.label}
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 text-[11px] text-foreground">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-amber" />
          Bridge entity
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-foreground">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3b82f6]/30 border border-[#60a5fa]" />
          Cluster A
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-foreground">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#22d3ee]/30 border border-[#67e8f9]" />
          Cluster B
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-foreground">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#a78bfa]/30 border border-[#c4b5fd]" />
          Cluster C
        </div>
      </div>
    </div>
  );
}