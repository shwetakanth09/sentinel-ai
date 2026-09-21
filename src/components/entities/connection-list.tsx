"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { getDirectConnections } from "@/lib/graph-analytics";
import { entityName } from "@/lib/entity-helpers";
import { useApp } from "@/components/providers/app-provider";
import { RELATIONSHIP_COLORS } from "@/lib/entity-config";
import { formatDateTime } from "@/lib/utils";

export function ConnectionList({ entityId }: { entityId: string }) {
  const { relationships, entities } = useApp();
  const rels = getDirectConnections(entityId, relationships).sort(
    (a, b) => b.confidence - a.confidence
  );

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        Direct Connections · {rels.length}
      </p>
      {rels.length === 0 && (
        <p className="text-xs text-muted-light">No direct connections found.</p>
      )}
      {rels.map((r) => {
        const outbound = r.source === entityId;
        const other = outbound ? r.target : r.source;
        const color = RELATIONSHIP_COLORS[r.type] ?? "#94a3b8";
        return (
          <Link
            key={r.id}
            href={`/entities/${other}`}
            className="flex items-center justify-between gap-2 rounded-md border border-border bg-card-alt px-3 py-2 transition-colors hover:border-border-light"
          >
            <div className="flex min-w-0 items-center gap-2">
              {outbound ? (
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" style={{ color }} />
              ) : (
                <ArrowDownLeft className="h-3.5 w-3.5 shrink-0" style={{ color }} />
              )}
              <span className="truncate text-xs text-foreground">
                {entityName(entities, other)}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className="rounded border px-1.5 py-0.5 text-[9px] font-semibold"
                style={{ color, borderColor: `${color}44`, background: `${color}11` }}
              >
                {r.type.toLowerCase().replaceAll("_", " ")}
              </span>
              <span className="text-[10px] tabular-nums text-muted">
                {Math.round(r.confidence * 100)}%
              </span>
            </div>
          </Link>
        );
      })}
      {rels.length > 0 && (
        <p className="pt-1 text-[10px] text-muted-light">
          Last activity {formatDateTime(rels[0]?.timestamp ?? new Date().toISOString())}
        </p>
      )}
    </div>
  );
}