"use client";

import * as React from "react";
import { Phone, MapPin, Car, Building2, Banknote, FileText, Sparkles, CalendarDays } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatDate, formatTime } from "@/lib/utils";
import { entityName } from "@/lib/entity-helpers";
import type { InvestigationEvent } from "@/types";
import { useSearchParams } from "next/navigation";

const FILTERS: Array<{ id: string; label: string; types: string[] | null }> = [
  { id: "all", label: "All", types: null },
  { id: "calls", label: "Calls", types: ["Communication"] },
  { id: "locations", label: "Locations", types: ["Location"] },
  { id: "vehicles", label: "Vehicles", types: ["Vehicle"] },
  { id: "organizations", label: "Organizations", types: ["Organization"] },
  { id: "financial", label: "Financial", types: ["Financial"] },
  { id: "reports", label: "Reports", types: ["Reports"] },
  { id: "ai", label: "AI Alerts", types: ["AI Alert"] },
];

const EVENT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Communication: Phone,
  Location: MapPin,
  Vehicle: Car,
  Organization: Building2,
  Financial: Banknote,
  Reports: FileText,
  "AI Alert": Sparkles,
};

export function TimelinePage() {
  const { events, entities } = useApp();
  const searchParams = useSearchParams();
  const entityParam = searchParams.get("entity");
  const [filter, setFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<InvestigationEvent | null>(null);

  const filtered = React.useMemo(() => {
    const active = FILTERS.find((f) => f.id === filter);
    let list = events;
    if (active && active.types) list = list.filter((e) => active.types!.includes(e.type));
    if (entityParam) list = list.filter((e) => e.entities.includes(entityParam));
    return [...list].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [events, filter, entityParam]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, InvestigationEvent[]>();
    for (const e of filtered) {
      const key = e.timestamp.split("T")[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Timeline Analysis</h1>
          <p className="text-xs text-muted">
            Chronological view of events for CASE-2026-014
            {entityParam ? ` — filtered for ${entityName(entities, entityParam)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                filter === f.id
                  ? "border-accent/50 bg-accent text-white"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center text-sm text-muted">
          No events match the current filter{entityParam ? ` for ${entityName(entities, entityParam)}` : ""}.
        </Card>
      )}

      <div className="space-y-6">
        {grouped.map(([date, evts]) => (
          <div key={date}>
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-accent" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {formatDate(date)}
              </h2>
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted">{evts.length} events</span>
            </div>
            <div className="space-y-2">
              {evts.map((e) => {
                const Icon = EVENT_ICON[e.type] ?? CalendarDays;
                return (
                  <button
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-accent/30 hover:bg-card-alt cursor-pointer"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card-alt text-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{e.type}</span>
                        <span className="text-[10px] tabular-nums text-muted">{formatTime(e.timestamp)}</span>
                        <Badge variant="secondary" className="gap-1">
                          {e.entities.length} entities
                        </Badge>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted">{e.description}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted">{e.location}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => (o ? null : setSelected(null))}>
        {selected && (
          <>
            <DialogHeader>
              <div>
                <DialogTitle>{selected.type} Event</DialogTitle>
                <p className="mt-1 text-xs text-muted">
                  {formatDateTime(selected.timestamp)} · {selected.location}
                </p>
              </div>
              <DialogClose onClose={() => setSelected(null)} />
            </DialogHeader>
            <DialogContent>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-foreground">{selected.description}</p>
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Entities Involved
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.entities.map((id) => (
                      <span key={id} className="rounded border border-border bg-card-alt px-2 py-1 text-[11px] text-foreground">
                        {entityName(entities, id)} ({id})
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-muted-light">
                  Source: surveillance observation · recorded event
                </p>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
}