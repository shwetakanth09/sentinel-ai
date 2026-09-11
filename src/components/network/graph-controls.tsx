"use client";

import {
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  CircleDot,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ENTITY_TYPE_LIST, ENTITY_TYPE_CONFIG } from "@/lib/entity-config";
import { RELATIONSHIP_TYPES } from "@/data/relationships";
import type { EntityType, RelationshipType } from "@/types";

export function GraphControls() {
  const {
    filterEntityTypes,
    setFilterEntityTypes,
    filterRelationshipTypes,
    setFilterRelationshipTypes,
    filterCluster,
    setFilterCluster,
    filterMinRisk,
    setFilterMinRisk,
    entities,
  } = useApp();

  return (
    <div className="rounded-md border border-border bg-card p-2.5">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
        <Filter className="h-3.5 w-3.5" />
        Graph Filters
      </div>

      <div className="mb-2.5">
        <p className="mb-1 text-[10px] text-muted">Entity type</p>
        <div className="flex flex-wrap gap-1.5">
          {ENTITY_TYPE_LIST.map((type) => {
            const active = filterEntityTypes.includes(type);
            const cfg = ENTITY_TYPE_CONFIG[type];
            return (
              <button
                key={type}
                onClick={() =>
                  setFilterEntityTypes(
                    active
                      ? filterEntityTypes.filter((t) => t !== type)
                      : [...filterEntityTypes, type]
                  )
                }
                className={`rounded border px-2 py-1 text-[11px] transition-colors cursor-pointer ${
                  active ? "border-transparent text-white" : "border-border text-muted hover:text-foreground"
                }`}
                style={active ? { background: cfg.fill } : undefined}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-2.5">
        <p className="mb-1 text-[10px] text-muted">Relationship</p>
        <div className="flex flex-wrap gap-1.5">
          {RELATIONSHIP_TYPES.map((type) => {
            const active = filterRelationshipTypes.includes(type as RelationshipType);
            return (
              <button
                key={type}
                onClick={() =>
                  setFilterRelationshipTypes(
                    active
                      ? filterRelationshipTypes.filter((t) => t !== type)
                      : [...filterRelationshipTypes, type as RelationshipType]
                  )
                }
                className={`rounded border px-2 py-1 text-[10px] transition-colors cursor-pointer ${
                  active
                    ? "border-accent/50 bg-accent text-white"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {type.toLowerCase().replaceAll("_", " ")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-2.5 flex items-center gap-3">
        <div>
          <p className="mb-1 text-[10px] text-muted">Cluster</p>
          <div className="flex gap-1.5">
            {[null, "A", "B", "C"].map((c) => (
              <button
                key={String(c)}
                onClick={() => setFilterCluster(c)}
                className={`rounded border px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                  filterCluster === c
                    ? "border-accent/50 bg-accent text-white"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {c ?? "All"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 text-[10px] text-muted">Min risk</p>
          <div className="flex gap-1.5">
            {[0, 40, 70].map((r) => (
              <button
                key={r}
                onClick={() => setFilterMinRisk(r)}
                className={`rounded border px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                  filterMinRisk === r
                    ? "border-accent/50 bg-accent text-white"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {r === 0 ? "All" : `≥${r}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2">
        <p className="text-[11px] text-muted">
          {entities.length} entities · {filterEntityTypes.length || filterCluster || filterMinRisk ? "filtered" : "full graph"}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFilterEntityTypes([]);
            setFilterRelationshipTypes([]);
            setFilterCluster(null);
            setFilterMinRisk(0);
          }}
          className="text-[11px]"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>
    </div>
  );
}