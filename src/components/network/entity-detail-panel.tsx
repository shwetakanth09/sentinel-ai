"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Car,
  Network,
  Share2,
  ArrowLeftRight,
  MapPinned,
  Building,
  FileText,
  CalendarClock,
  ExternalLink,
  Focus,
  BarChart3,
} from "lucide-react";
import type { Entity } from "@/types";
import { useApp } from "@/components/providers/app-provider";
import { EntityIcon } from "@/components/shared/entity-icon";
import { RiskMeter } from "@/components/shared/risk-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ENTITY_TYPE_CONFIG } from "@/lib/entity-config";
import {
  getDirectConnections,
  getIndirectConnections,
  getAssociatedByType,
  getNetworkMetrics,
} from "@/lib/graph-analytics";
import { formatDateTime } from "@/lib/utils";

export function EntityDetailPanel({ entity }: { entity: Entity }) {
  const { setSelectedEntityId } = useApp();
  const direct = getDirectConnections(entity.id);
  const indirect = getIndirectConnections(entity.id);
  const orgs = getAssociatedByType(entity.id, "organization");
  const locations = getAssociatedByType(entity.id, "location");
  const vehicles = getAssociatedByType(entity.id, "vehicle");
  const events = getAssociatedByType(entity.id, "event");
  const metrics = getNetworkMetrics();
  const betweenness = metrics.betweennessCentrality[entity.id] ?? 0;

  return (
    <div className="flex h-auto w-[340px] shrink-0 animate-slide-in flex-col rounded-lg border border-border bg-surface">
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <EntityIcon type={entity.type} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{entity.name}</h3>
              {entity.bridge && <Badge variant="warning">Bridge</Badge>}
            </div>
            <p className="mt-0.5 text-[11px] text-muted">
              {entity.id} · {ENTITY_TYPE_CONFIG[entity.type].label} · Cluster {entity.cluster}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedEntityId(null)}
          className="rounded p-1 text-muted hover:bg-card hover:text-foreground cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 rounded-md border border-border bg-card p-3">
          <RiskMeter value={entity.riskIndicator} showLabel size="lg" />
          <p className="mt-2 text-[11px] text-muted leading-snug">
            Prototype analytical indicator based on observed relationships and
            activity patterns. Does not establish criminal activity and requires
            human verification.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <Stat label="Direct Connections" value={direct.length} icon={ArrowLeftRight} />
          <Stat label="Indirect Connections" value={indirect.length} icon={Network} />
          <Stat
            label="Betweenness"
            value={`${Math.round(betweenness * 100)}%`}
            icon={Share2}
          />
          <Stat label="Confidence" value={`${Math.round(entity.confidence * 100)}%`} icon={BarChart3} />
        </div>

        <Separator className="mb-4" />

        <PanelList
          title="Associated Locations"
          icon={MapPinned}
          items={locations.map((e) => e.name)}
        />
        <PanelList
          title="Associated Organizations"
          icon={Building}
          items={orgs.map((e) => e.name)}
        />
        {vehicles.length > 0 && (
          <PanelList title="Associated Vehicles" icon={Car} items={vehicles.map((e) => e.name)} />
        )}
        {events.length > 0 && (
          <PanelList
            title="Recent Events"
            icon={CalendarClock}
            items={events.map((e) => e.name)}
          />
        )}

        <p className="mt-2 text-[10px] text-muted-light">
          {formatDateTime(direct[direct.length - 1]?.timestamp ?? new Date().toISOString())} · last
          activity
        </p>
      </div>

      <div className="border-t border-border p-4">
        <div className="grid grid-cols-2 gap-2">
          <Link href={`/entities/${entity.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-3.5 w-3.5" />
              View Profile
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              const evt = new CustomEvent("focus-entity", { detail: entity.id });
              window.dispatchEvent(evt);
            }}
          >
            <Focus className="h-3.5 w-3.5" />
            Focus Network
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link href={`/timeline?entity=${entity.id}`}>
            <Button variant="secondary" size="sm" className="w-full">
              <FileText className="h-3.5 w-3.5" />
              View Timeline
            </Button>
          </Link>
          <Link href={`/entities/${entity.id}#evidence`}>
            <Button variant="secondary" size="sm" className="w-full">
              <FileText className="h-3.5 w-3.5" />
              View Evidence
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: typeof ArrowLeftRight;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-2.5">
      <div className="flex items-center gap-1 text-[10px] text-muted">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function PanelList({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof MapPinned;
  items: string[];
}) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
        <Icon className="h-3 w-3" />
        {title}
      </p>
      {items.length === 0 ? (
        <p className="text-[11px] text-muted-light">None found in this graph</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((name) => (
            <span key={name} className="rounded border border-border bg-card px-2 py-0.5 text-[11px] text-foreground">
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}