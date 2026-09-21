"use client";

import * as React from "react";
import { Share2, ZoomIn, ZoomOut, RotateCcw, Crosshair } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { NetworkGraph } from "@/components/network/network-graph";
import { GraphControls } from "@/components/network/graph-controls";
import { EntityDetailPanel } from "@/components/network/entity-detail-panel";
import { GraphLegend } from "@/components/network/graph-legend";
import { Button } from "@/components/ui/button";
import { getById } from "@/lib/entity-helpers";

function useFocusEntity() {
  const { setSelectedEntityId } = useApp();
  React.useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      setSelectedEntityId(id);
    };
    window.addEventListener("focus-entity", handler);
    return () => window.removeEventListener("focus-entity", handler);
  }, [setSelectedEntityId]);
}

export default function NetworkExplorerPage() {
  const { selectedEntityId, entities } = useApp();
  useFocusEntity();
  const graphStats = useGraphStats();
  const selectedEntity = selectedEntityId ? getById(entities, selectedEntityId) : null;

  const focusSelected = () => {
    if (selectedEntityId) {
      window.dispatchEvent(new CustomEvent("focus-entity", { detail: selectedEntityId }));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Network Explorer</h1>
          <p className="text-xs text-muted">
            Interactive relationship graph for CASE-2026-014 · drag, pan and zoom to explore
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new CustomEvent("zoom-in"))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new CustomEvent("zoom-out"))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new CustomEvent("reset-graph"))}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={focusSelected} disabled={!selectedEntityId}>
            <Crosshair className="h-3.5 w-3.5" />
            Focus
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-3">
          <GraphControls />
          <div className="mt-3 hidden lg:block">
            <GraphLegend />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex h-[calc(100vh-240px)] min-h-[480px]">
              <div className="relative flex-1">
                <NetworkGraph />
                <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-border bg-card/90 px-2.5 py-1.5 text-[11px] text-muted">
                  <Share2 className="h-3.5 w-3.5 text-accent" />
                  {graphStats.nodes} nodes · {graphStats.edges} relationships
                  <span className="text-muted-light">· scroll to zoom · drag to pan</span>
                </div>
              </div>
              {selectedEntity && <EntityDetailPanel entity={selectedEntity} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useGraphStats() {
  const { entities, relationships, filterEntityTypes, filterCluster, filterMinRisk } = useApp();
  const nodes = React.useMemo(() => {
    let n = entities;
    if (filterEntityTypes.length) n = n.filter((e) => filterEntityTypes.includes(e.type));
    if (filterCluster) n = n.filter((e) => e.cluster === filterCluster);
    if (filterMinRisk) n = n.filter((e) => e.riskIndicator >= filterMinRisk);
    return n.length;
  }, [entities, filterEntityTypes, filterCluster, filterMinRisk]);

  const edges = React.useMemo(() => relationships.length, [relationships]);
  return { nodes, edges };
}