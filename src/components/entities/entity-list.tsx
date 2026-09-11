"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { EntityIcon } from "@/components/shared/entity-icon";
import { RiskBadge } from "@/components/shared/risk-meter";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ENTITY_TYPE_LIST, ENTITY_TYPE_CONFIG } from "@/lib/entity-config";
import { getDirectConnections } from "@/lib/graph-analytics";
import type { EntityType } from "@/types";

export function EntityList() {
  const { entities } = useApp();
  const [query, setQuery] = React.useState("");
  const [types, setTypes] = React.useState<EntityType[]>([]);
  const [cluster, setCluster] = React.useState<string | null>(null);
  const [minRisk, setMinRisk] = React.useState(0);

  const filtered = entities.filter((e) => {
    const q = query.toLowerCase();
    if (q && !e.name.toLowerCase().includes(q) && !e.id.toLowerCase().includes(q)) return false;
    if (types.length && !types.includes(e.type)) return false;
    if (cluster && e.cluster !== cluster) return false;
    if (e.riskIndicator < minRisk) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Entity Intelligence</h1>
          <p className="text-xs text-muted">
            All analyzed entities for CASE-2026-014 · rankings derived from graph analytics
          </p>
        </div>
        <div className="relative w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-light" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entity name or ID..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1 text-xs text-muted">
          <Filter className="h-3.5 w-3.5" />
          Type:
        </span>
        {ENTITY_TYPE_LIST.map((t) => {
          const active = types.includes(t);
          return (
            <button
              key={t}
              onClick={() => setTypes(active ? types.filter((x) => x !== t) : [...types, t])}
              className={`rounded border px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                active ? "border-accent/50 bg-accent text-white" : "border-border text-muted hover:text-foreground"
              }`}
            >
              {ENTITY_TYPE_CONFIG[t].label}
            </button>
          );
        })}
        <span className="ml-2 text-xs text-muted">Cluster:</span>
        {[null, "A", "B", "C"].map((c) => (
          <button
            key={String(c)}
            onClick={() => setCluster(c)}
            className={`rounded border px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
              cluster === c ? "border-accent/50 bg-accent text-white" : "border-border text-muted hover:text-foreground"
            }`}
          >
            {c ?? "All"}
          </button>
        ))}
        <span className="ml-2 text-xs text-muted">Risk:</span>
        {[0, 40, 70].map((r) => (
          <button
            key={r}
            onClick={() => setMinRisk(r)}
            className={`rounded border px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
              minRisk === r ? "border-accent/50 bg-accent text-white" : "border-border text-muted hover:text-foreground"
            }`}
          >
            {r === 0 ? "All" : `≥${r}`}
          </button>
        ))}
      </div>

      <div className="mb-3 text-[11px] text-muted">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
        {entities.length} entities
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => {
          const rels = getDirectConnections(e.id);
          return (
            <Link
              key={e.id}
              href={`/entities/${e.id}`}
              className="group rounded-lg border border-border bg-card p-3 transition-all hover:border-accent/40 hover:bg-card-alt"
            >
              <div className="flex items-start gap-3">
                <EntityIcon type={e.type} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-accent">
                      {e.name}
                    </p>
                    {e.bridge && <Badge variant="warning">Bridge</Badge>}
                  </div>
                  <p className="text-[11px] text-muted">
                    {e.id} · Cluster {e.cluster} · {rels.length} connections
                  </p>
                </div>
              </div>
              <div className="mt-2.5">
                <RiskBadge value={e.riskIndicator} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}