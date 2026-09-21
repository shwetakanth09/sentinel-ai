"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { entities as defaultEntities } from "@/data/entities";
import { nlpDocuments as defaultNlpDocuments } from "@/data/nlp-docs";
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

interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface ApiState {
  entities: Entity[];
  relationships: Relationship[];
  events: InvestigationEvent[];
  alerts: PatternAlert[];
  cases: InvestigationCase[];
  dataSources: DataSourceStatus[];
  nlpDocuments: typeof defaultNlpDocuments;
}

interface AppState extends ApiState {
  metrics: NetworkMetrics;
  loading: boolean;
  ready: boolean;
  user: SessionUser | null;
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
  markAlertReviewed: (id: string) => Promise<void>;
  addToNetwork: (rels: Array<Pick<Relationship, "source" | "target" | "type">>) => Promise<void>;
  addEntity: (input: { name: string; type: EntityType; riskIndicator?: number; cluster?: "A" | "B" | "C" }) => Promise<Entity | null>;
  updateEntity: (id: string, patch: Partial<Pick<Entity, "name" | "type" | "riskIndicator" | "confidence" | "cluster">>) => Promise<void>;
  deleteRelationship: (id: string) => Promise<void>;
  updateCaseStatus: (id: string, status: InvestigationCase["status"]) => Promise<void>;
  refreshState: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppCtx = React.createContext<AppState | null>(null);

export function useApp() {
  const ctx = React.useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

const AUTH_PATHS = ["/login", "/register"];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [activeCaseId, setActiveCaseId] = React.useState("CASE-2026-014");
  const [selectedEntityId, setSelectedEntityId] = React.useState<string | null>(null);
  const [entities, setEntities] = React.useState<Entity[]>(defaultEntities);
  const [relationships, setRelationships] = React.useState<Relationship[]>([]);
  const [events, setEvents] = React.useState<InvestigationEvent[]>([]);
  const [alertsState, setAlertsState] = React.useState<PatternAlert[]>([]);
  const [cases, setCases] = React.useState<InvestigationCase[]>([]);
  const [dataSources, setDataSources] = React.useState<DataSourceStatus[]>([]);
  const [nlpDocuments, setNlpDocuments] = React.useState(defaultNlpDocuments);
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [ready, setReady] = React.useState(false);

  const [filterEntityTypes, setFilterEntityTypes] = React.useState<EntityType[]>([]);
  const [filterRelationshipTypes, setFilterRelationshipTypes] = React.useState<RelationshipType[]>([]);
  const [filterCluster, setFilterCluster] = React.useState<string | null>(null);
  const [filterMinRisk, setFilterMinRisk] = React.useState(0);
  const [filterDateRange, setFilterDateRange] = React.useState<string | null>(null);

  const isAuthPage = AUTH_PATHS.includes(pathname);

  const refreshState = React.useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as ApiState;
      setEntities(data.entities);
      setRelationships(data.relationships);
      setEvents(data.events);
      setAlertsState(data.alerts);
      setCases(data.cases);
      setDataSources(data.dataSources);
      setNlpDocuments(data.nlpDocuments);
      setReady(true);
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
        if (active && sessionRes.ok) {
          const session = await sessionRes.json();
          setUser(session.user ?? null);
        }
      } catch {
        // ignore
      }
      if (active) await refreshState();
    })();
    return () => {
      active = false;
    };
  }, [isAuthPage, refreshState]);

  const metrics = React.useMemo(
    () => getNetworkMetrics({ entities, relationships, alerts: alertsState, cases, dataSources }),
    [entities, relationships, alertsState, cases, dataSources]
  );

  const markAlertReviewed = React.useCallback(
    async (id: string) => {
      const status = alertsState.find((a) => a.id === id)?.status === "dismissed" ? "dismissed" : "reviewed";
      try {
        await fetch(`/api/alerts/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        // ignore
      }
      setAlertsState((prev) => prev.map((a) => (a.id === id ? { ...a, status: status as PatternAlert["status"] } : a)));
    },
    [alertsState]
  );

  const addToNetwork = React.useCallback(
    async (rels: Array<Pick<Relationship, "source" | "target" | "type">>) => {
      const created: Relationship[] = [];
      for (const r of rels) {
        try {
          const res = await fetch("/api/relationships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source: r.source, target: r.target, type: r.type }),
          });
          if (res.ok) {
            const data = await res.json();
            created.push(data.relationship as Relationship);
          }
        } catch {
          // ignore
        }
      }
      if (created.length) {
        setRelationships((prev) => {
          const existing = new Set(prev.map((x) => `${x.source}|${x.target}|${x.type}`));
          const fresh = created.filter((n) => !existing.has(`${n.source}|${n.target}|${n.type}`));
          return [...prev, ...fresh];
        });
      }
    },
    []
  );

  const addEntity = React.useCallback(async (input: { name: string; type: EntityType; riskIndicator?: number; cluster?: "A" | "B" | "C" }) => {
    try {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const entity = data.entity as Entity;
      setEntities((prev) => [...prev, entity]);
      return entity;
    } catch {
      return null;
    }
  }, []);

  const updateEntity = React.useCallback(
    async (id: string, patch: Partial<Pick<Entity, "name" | "type" | "riskIndicator" | "confidence" | "cluster">>) => {
      try {
        const res = await fetch(`/api/entities/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const data = await res.json();
          setEntities((prev) => prev.map((e) => (e.id === id ? (data.entity as Entity) : e)));
        }
      } catch {
        // ignore
      }
    },
    []
  );

  const deleteRelationship = React.useCallback(async (id: string) => {
    try {
      await fetch(`/api/relationships/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      // ignore
    }
    setRelationships((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateCaseStatus = React.useCallback(
    async (id: string, status: InvestigationCase["status"]) => {
      try {
        await fetch(`/api/cases/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        // ignore
      }
      setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    },
    []
  );

  const logout = React.useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  const value: AppState = {
    entities,
    relationships,
    events,
    alerts: alertsState,
    cases,
    dataSources,
    nlpDocuments,
    metrics,
    loading,
    ready,
    user,
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
    addEntity,
    updateEntity,
    deleteRelationship,
    updateCaseStatus,
    refreshState,
    logout,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export { defaultEntities };