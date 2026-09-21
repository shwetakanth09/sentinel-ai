"use client";

import * as React from "react";
import { EntityIcon } from "@/components/shared/entity-icon";
import { RiskMeter } from "@/components/shared/risk-meter";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBreakdown } from "@/components/entities/risk-breakdown";
import { ConnectionList } from "@/components/entities/connection-list";
import { NetworkGraph } from "@/components/network/network-graph";
import { ENTITY_TYPE_CONFIG } from "@/lib/entity-config";
import {
  getDirectConnections,
  getIndirectConnections,
  getAssociatedByType,
  getNetworkMetrics,
} from "@/lib/graph-analytics";
import { useApp } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Sparkles, Share2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { getById } from "@/lib/entity-helpers";

export function EntityDetailClient({ entityId }: { entityId: string }) {
  const {
    entities,
    relationships,
    alerts,
    events,
    cases,
    dataSources,
    setSelectedEntityId,
  } = useApp();
  const [tab, setTab] = React.useState("overview");

  const entity = getById(entities, entityId);

  if (!entity) return null;

  const analyticsData = {
    entities,
    relationships,
    alerts,
    cases,
    dataSources,
  };

  const direct = getDirectConnections(entity.id, relationships);
  const indirect = getIndirectConnections(entity.id, relationships);
  const orgs = getAssociatedByType(entity.id, "organization", analyticsData);
  const locations = getAssociatedByType(entity.id, "location", analyticsData);
  const vehicles = getAssociatedByType(entity.id, "vehicle", analyticsData);
  const entityEvents = events.filter((e) => e.entities.includes(entity.id));
  const relatedAlerts = alerts.filter((a) => a.entities.includes(entity.id));
  const metrics = getNetworkMetrics(analyticsData);
  const degree = metrics.degreeCentrality[entity.id] ?? 0;
  const betweenness = metrics.betweennessCentrality[entity.id] ?? 0;

  const stats = [
    { label: "Direct Connections", value: direct.length },
    { label: "Indirect Connections", value: indirect.length },
    { label: "Organizations", value: orgs.length },
    { label: "Locations", value: locations.length },
    { label: "Vehicles", value: vehicles.length },
    { label: "Events", value: entityEvents.length },
    { label: "Degree Centrality", value: `${Math.round(degree * 100)}%` },
    { label: "Betweenness", value: `${Math.round(betweenness * 100)}%` },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-4 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <EntityIcon type={entity.type} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">{entity.name}</h1>
                {entity.bridge && <Badge variant="warning">Bridge Entity</Badge>}
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {entity.id} · {ENTITY_TYPE_CONFIG[entity.type].label} · Cluster {entity.cluster}
                {" · "}Confidence {Math.round(entity.confidence * 100)}%
              </p>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted">
                <span className="font-medium text-accent">Recorded entity.</span>{" "}
                {entity.metadata?.details ??
                  "Entity resolved from linked FIR records, CDRs and surveillance reports."}
              </p>
            </div>
          </div>
          <div className="w-48 shrink-0">
            <RiskMeter value={entity.riskIndicator} size="lg" />
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted">{s.label}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} defaultValue="overview" onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RiskBreakdown entity={entity} />
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Entity Profile
                </p>
                <div className="space-y-2 text-xs">
                  {Object.entries(entity.metadata ?? {})
                    .filter(([k]) => k !== "details")
                    .map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between rounded-md border border-border bg-card-alt px-3 py-2"
                      >
                        <span className="capitalize text-muted">{k.replace(/([A-Z])/g, " $1")}</span>
                        <span className="font-medium text-foreground">{String(v)}</span>
                      </div>
                    ))}
                </div>
                <p className="mt-3 text-[10px] text-muted-light">
                  Profile metadata from linked source records.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-lg border border-border bg-surface">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Share2 className="h-4 w-4 text-accent" />
                    Local Network {entity.name}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEntityId(entity.id);
                      window.dispatchEvent(new CustomEvent("focus-entity", { detail: entity.id }));
                    }}
                  >
                    Focus in Explorer
                  </Button>
                </div>
                <div className="h-[420px]">
                  <NetworkGraph focusEntityId={entity.id} />
                </div>
              </div>
            </div>
            <ConnectionList entityId={entity.id} />
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Entity Timeline · {entityEvents.length} events
              </p>
              {entityEvents.length === 0 && (
                <p className="text-xs text-muted-light">No recorded events for this entity.</p>
              )}
              <div className="space-y-0 relative border-l border-border pl-5">
                {entityEvents.map((e) => (
                  <div key={e.id} className="relative pb-4">
                    <span className="absolute -left-[23px] top-1 h-2 w-2 rounded-full bg-accent" />
                    <p className="text-xs font-medium text-foreground">
                      {e.type} · {formatDateTime(e.timestamp)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">{e.description}</p>
                    <p className="text-[10px] text-muted-light">
                      {e.location} · {e.entities.length} entities
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <FileText className="h-3.5 w-3.5" /> Source Evidence ({direct.length})
                </p>
                <div className="space-y-2">
                  {direct.slice(0, 10).map((r) => (
                    <div
                      key={r.id}
                      className="rounded-md border border-border bg-card-alt px-3 py-2 text-xs"
                    >
                      <p className="text-foreground">
                        {r.type.toLowerCase().replaceAll("_", " ")} ·{" "}
                        <span className="text-accent">{r.sourceReference}</span>
                      </p>
                      <p className="text-[10px] text-muted">{formatDateTime(r.timestamp)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber" /> Related Alerts (
                  {relatedAlerts.length})
                </p>
                <div className="space-y-2">
                  {relatedAlerts.length === 0 && (
                    <p className="text-xs text-muted-light">No alerts reference this entity.</p>
                  )}
                  {relatedAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-md border border-border bg-card-alt px-3 py-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{a.title}</p>
                        <Badge variant={a.severity === "HIGH" ? "destructive" : a.severity === "MEDIUM" ? "warning" : "secondary"}>
                          {a.severity}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted">{a.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardContent className="p-4">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> AI Explanation
              </p>
              <div className="rounded-md border border-border bg-card-alt p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  {entity.name} ({entity.id}) {entity.bridge ? "functions as a bridge entity" : "is positioned"} within
                  Cluster {entity.cluster} with {direct.length} direct and {indirect.length} indirect
                  connections. Its betweenness centrality of {Math.round(betweenness * 100)}% indicates{" "}
                  {betweenness > 0.05 ? "significant" : "moderate"} influence over information flow between
                  network segments.
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-muted">
                  <li>• {direct.length} relationship events recorded across {metrics.clusters.filter((c) => c.id === entity.cluster).length} local cluster(s)</li>
                  <li>• Degree centrality {Math.round(degree * 100)}% · ranked through all-pairs shortest-path analysis</li>
                  <li>• Confidence {Math.round(entity.confidence * 100)}% · based on source corroboration</li>
                  <li>• Network Risk Indicator {entity.riskIndicator}/100 computed from weighted explainable factors</li>
                </ul>
              </div>
              <p className="mt-3 text-[10px] text-muted-light">
                AI-generated investigative lead · requires independent verification by an
                investigator. This is a decision-support indicator and does not determine
                criminality.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}