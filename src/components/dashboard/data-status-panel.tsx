"use client";

import { Database, FileCheck2, FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/components/providers/app-provider";
import { formatDateTime } from "@/lib/utils";

export function DataStatusPanel() {
  const { dataSources, metrics } = useApp();
  const processed = dataSources.filter((s) => s.processed);
  const latest = processed[processed.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan" />
          Data Sources Processed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between rounded-md border border-border bg-card-alt px-3 py-2">
          <span className="text-xs text-foreground">
            {metrics.dataSourcesProcessed} / {dataSources.length} sources ingested
          </span>
          <span className="text-sm font-bold text-cyan">{processed.length}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {processed.slice(0, 9).map((s) => (
            <div
              key={s.id}
              title={`${s.name} · ${s.records} records`}
              className="flex flex-col items-center rounded-md border border-border bg-card px-2 py-2 text-center"
            >
              <FileCheck2 className="mb-1 h-3.5 w-3.5 text-green" />
              <span className="w-full truncate text-[10px] text-muted">{s.name}</span>
            </div>
          ))}
        </div>
        {latest && (
          <p className="text-[10px] text-muted-light">
            Last ingested {formatDateTime(latest.lastIngested)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ActiveCasesPanel() {
  const { cases } = useApp();
  const active = cases.filter((c) => c.status !== "Closed");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-accent" />
          Active Investigations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {active.map((c) => (
          <div key={c.id} className="rounded-md border border-border bg-card-alt px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{c.id}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  c.status === "Active"
                    ? "bg-green/10 text-green border border-green/20"
                    : "bg-amber/10 text-amber border border-amber/20"
                }`}
              >
                {c.status}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-muted">{c.title}</p>
            <p className="mt-1 text-[10px] text-muted-light">
              {c.entityCount} entities · {c.relationshipCount} relationships · {c.alertCount} alerts
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}