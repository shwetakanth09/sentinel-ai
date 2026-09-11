"use client";

import * as React from "react";
import { entities } from "@/data/entities";
import { relationships } from "@/data/relationships";
import { events } from "@/data/events";
import { alerts } from "@/data/alerts";
import { cases } from "@/data/cases";
import { dataSources } from "@/data/sources";
import { nlpDocuments } from "@/data/nlp-docs";
import { getNetworkMetrics } from "@/lib/graph-analytics";
import type {
  Entity,
  Relationship,
  InvestigationEvent,
  PatternAlert,
  InvestigationCase,
  DataSourceStatus,
  NetworkMetrics,
  EntityType,
  RelationshipType,
} from "@/types";

interface AppState {
  entities: Entity[];
  relationships: Relationship[];
  events: InvestigationEvent[];
  alerts: PatternAlert[];
  cases: InvestigationCase[];
  dataSources: DataSourceStatus[];
  nlpDocuments: typeof nlpDocuments;
  metrics: NetworkMetrics;
  activeCaseId: string;
  setActiveCaseId: (id: string) => void;
  selectedEntityId: string | null;
  setSelectedEntityId: (id: string | null) => void;
  filterEntityTypes: EntityType[];
  setFilterEntityTypes: (t: EntityType[]) => void;
  filterRelationshipTypes: RelationshipType[];
  setFilterRelationshipTypes: (t: RelationshipType[]) => void;
  filterCluster: string | null;
  setFilterCluster: (c: string | null) => void;
  filterMinRisk: number;
  setFilterMinRisk: (r: number) => void;
  filterDateRange: string | null;
  setFilterDateRange: (d: string | null) => void;
  markAlertReviewed: (id: string) => void;
  addToNetwork: (rels: Array<Pick<Relationship, "source" | "target" | "type">>) => void;
}

const AppCtx = React.createContext<AppState | null>(null);

export function useApp() {
  const ctx = React.useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

function AlertReducer(state: PatternAlert[], action: { id: string }): PatternAlert[] {
  return state.map((a) =>
    a.id === action.id ? { ...a, status: "reviewed" as const } : a
  );
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeCaseId, setActiveCaseId] = React.useState("CASE-2026-014");
  const [selectedEntityId, setSelectedEntityId] = React.useState<string | null>(null);
  const [alertsState, setAlertsState] = React.useState(alerts);
  const [relState, setRelState] = React.useState(relationships);
  const [filterEntityTypes, setFilterEntityTypes] = React.useState<EntityType[]>([]);
  const [filterRelationshipTypes, setFilterRelationshipTypes] = React.useState<RelationshipType[]>([]);
  const [filterCluster, setFilterCluster] = React.useState<string | null>(null);
  const [filterMinRisk, setFilterMinRisk] = React.useState(0);
  const [filterDateRange, setFilterDateRange] = React.useState<string | null>(null);

  const metrics = React.useMemo(() => getNetworkMetrics(), []);

  const markAlertReviewed = React.useCallback((id: string) => {
    setAlertsState((prev) => AlertReducer(prev, { id }));
  }, []);

  const addToNetwork = React.useCallback(
    (rels: Array<Pick<Relationship, "source" | "target" | "type">>) => {
      setRelState((prev) => {
        const next = [...prev];
        for (const r of rels) {
          const exists = next.some(
            (x) =>
              x.source === r.source &&
              x.target === r.target &&
              x.type === r.type
          );
          if (!exists) {
            next.push({
              ...r,
              id: `REL-NEW-${r.source}-${r.target}-${Date.now()}-${next.length}`,
              timestamp: new Date().toISOString(),
              confidence: 0.8,
              sourceReference: "NLP-DOC-001",
            });
          }
        }
        return next;
      });
    },
    []
  );

  const value: AppState = {
    entities,
    relationships: relState,
    events,
    alerts: alertsState,
    cases,
    dataSources,
    nlpDocuments,
    metrics,
    activeCaseId,
    setActiveCaseId,
    selectedEntityId,
    setSelectedEntityId,
    filterEntityTypes,
    setFilterEntityTypes,
    filterRelationshipTypes,
    setFilterRelationshipTypes,
    filterCluster,
    setFilterCluster,
    filterMinRisk,
    setFilterMinRisk,
    filterDateRange,
    setFilterDateRange,
    markAlertReviewed,
    addToNetwork,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export { entities as defaultEntities };