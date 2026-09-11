import { entities } from "@/data/entities";
import { relationships } from "@/data/relationships";
import { alerts } from "@/data/alerts";
import { dataSources } from "@/data/sources";
import { cases } from "@/data/cases";
import type {
  ClusterInfo,
  Entity,
  NetworkMetrics,
  Relationship,
  RiskFactor,
} from "@/types";

export function buildAdjacency(
  rels: Relationship[] = relationships
): Record<string, Set<string>> {
  const adj: Record<string, Set<string>> = {};
  for (const e of entities) adj[e.id] = new Set();
  for (const r of rels) {
    if (!adj[r.source]) adj[r.source] = new Set();
    if (!adj[r.target]) adj[r.target] = new Set();
    adj[r.source].add(r.target);
    adj[r.target].add(r.source);
  }
  return adj;
}

export function degreeCentrality(
  rels: Relationship[] = relationships
): Record<string, number> {
  const adj = buildAdjacency(rels);
  const n = entities.length;
  const out: Record<string, number> = {};
  for (const e of entities) {
    out[e.id] = n > 1 ? (adj[e.id]?.size ?? 0) / (n - 1) : 0;
  }
  return out;
}

/** Brandes' algorithm for unweighted betweenness centrality. */
export function betweennessCentrality(
  rels: Relationship[] = relationships
): Record<string, number> {
  const adj = buildAdjacency(rels);
  const nodes = entities.map((e) => e.id);
  const bc: Record<string, number> = {};
  for (const id of nodes) bc[id] = 0;

  for (const s of nodes) {
    const stack: string[] = [];
    const pred: Record<string, string[]> = {};
    const sigma: Record<string, number> = {};
    const dist: Record<string, number> = {};
    for (const v of nodes) {
      pred[v] = [];
      sigma[v] = 0;
      dist[v] = -1;
    }
    sigma[s] = 1;
    dist[s] = 0;
    const queue: string[] = [s];
    while (queue.length) {
      const v = queue.shift() as string;
      stack.push(v);
      for (const w of adj[v] ?? []) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1;
          queue.push(w);
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v];
          pred[w].push(v);
        }
      }
    }
    const delta: Record<string, number> = {};
    for (const v of nodes) delta[v] = 0;
    while (stack.length) {
      const w = stack.pop() as string;
      for (const v of pred[w]) {
        if (sigma[w] !== 0) {
          delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
        }
      }
      if (w !== s) bc[w] += delta[w];
    }
  }

  const norm = (nodes.length - 1) * (nodes.length - 2);
  const out: Record<string, number> = {};
  for (const id of nodes) out[id] = norm > 0 ? bc[id] / norm : 0;
  return out;
}

export function crossClusterDegree(): Record<string, number> {
  const entityById = new Map(entities.map((e) => [e.id, e]));
  const out: Record<string, number> = {};
  for (const e of entities) out[e.id] = 0;
  for (const r of relationships) {
    const a = entityById.get(r.source);
    const b = entityById.get(r.target);
    if (a && b && a.cluster !== b.cluster) {
      out[r.source] = (out[r.source] ?? 0) + 1;
      out[r.target] = (out[r.target] ?? 0) + 1;
    }
  }
  return out;
}

export function detectBridgeEntities(): string[] {
  const entityById = new Map(entities.map((e) => [e.id, e]));
  const crossed = new Set<string>();
  for (const r of relationships) {
    const a = entityById.get(r.source);
    const b = entityById.get(r.target);
    if (a && b && a.cluster !== b.cluster) {
      crossed.add(a.id);
      crossed.add(b.id);
    }
  }
  const explicit = entities.filter((e) => e.bridge).map((e) => e.id);
  return Array.from(new Set([...explicit, ...crossed]));
}

export function buildClusters(): ClusterInfo[] {
  const definitions: Record<string, { name: string; description: string; color: string }> = {
    A: {
      name: "Communications Cell",
      description: "High-frequency communications and shared vehicle usage.",
      color: "#3b82f6",
    },
    B: {
      name: "Organizational",
      description: "Corporate entities, financial flows and coordinated meetings.",
      color: "#22d3ee",
    },
    C: {
      name: "Operations",
      description: "Field movements, logistics and shared operational locations.",
      color: "#a78bfa",
    },
  };
  const clusterOf = new Map(entities.map((e) => [e.id, e.cluster]));
  const relCount: Record<string, number> = { A: 0, B: 0, C: 0 };
  const internal: Record<string, number> = { A: 0, B: 0, C: 0 };
  for (const r of relationships) {
    const a = clusterOf.get(r.source);
    const b = clusterOf.get(r.target);
    if (a) relCount[a] = (relCount[a] ?? 0) + 1;
    if (b) relCount[b] = (relCount[b] ?? 0) + 1;
    if (a && b && a === b) internal[a] = (internal[a] ?? 0) + 1;
  }
  return (Object.keys(definitions) as Array<"A" | "B" | "C">).map((id) => ({
    id,
    name: definitions[id].name,
    description: definitions[id].description,
    color: definitions[id].color,
    entityCount: entities.filter((e) => e.cluster === id).length,
    relationshipCount: internal[id] ?? 0,
  }));
}

function normalize(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

export function communityPartitions(): Record<string, string[]> {
  const out: Record<string, string[]> = { A: [], B: [], C: [] };
  for (const e of entities) out[e.cluster].push(e.id);
  return out;
}

const metricsCache: { value?: NetworkMetrics } = {};

export function getNetworkMetrics(): NetworkMetrics {
  if (metricsCache.value) return metricsCache.value;

  const degree = degreeCentrality();
  const betweenness = betweennessCentrality();
  const riskScores: Record<string, number> = {};
  for (const e of entities) riskScores[e.id] = e.riskIndicator / 100;

  const value: NetworkMetrics = {
    totalEntities: entities.length,
    totalRelationships: relationships.length,
    totalAlerts: alerts.length,
    highRiskIndicators: entities.filter((e) => e.riskIndicator >= 70).length,
    dataSourcesProcessed: dataSources.filter((s) => s.processed).length,
    activeInvestigations: cases.filter((c) => c.status !== "Closed").length,
    clusters: buildClusters(),
    bridgeEntities: detectBridgeEntities(),
    degreeCentrality: degree,
    betweennessCentrality: betweenness,
    riskScores,
    communityPartitions: communityPartitions(),
  };
  metricsCache.value = value;
  return value;
}

export function getRiskFactors(entity: Entity): RiskFactor[] {
  const metrics = getNetworkMetrics();
  const degree = metrics.degreeCentrality[entity.id] ?? 0;
  const betweenness = metrics.betweennessCentrality[entity.id] ?? 0;
  const centrality = normalize(degree * 0.6 + betweenness * 0.4, 0.35);

  const cross = crossClusterDegree()[entity.id] ?? 0;
  const crossCluster = normalize(cross, 6);

  const adj = buildAdjacency();
  const neighborIds = Array.from(adj[entity.id] ?? []);
  const neighborClusterDistinct = new Set(
    neighborIds
      .map((id) => entities.find((e) => e.id === id)?.cluster)
      .filter(Boolean)
  ).size;
  const density = normalize(neighborClusterDistinct / 3, 1);

  const entityEvents = entity.type === "person" ? 1 : 0;
  const temporal = normalize(
    (betweenness * 100) + entityEvents * 20 + (entity.bridge ? 30 : 0),
    100
  );

  const anomaly =
    entity.type === "person"
      ? Math.round(normalize(entity.riskIndicator, 100) * 0.8)
      : Math.round(normalize(entity.riskIndicator, 100) * 0.6);

  const raw: RiskFactor[] = [
    {
      id: "centrality",
      label: "Network Centrality",
      weight: 0.3,
      score: centrality,
      detail: `Degree ${(degree * 100).toFixed(0)}% · Betweenness ${(
        betweenness * 100
      ).toFixed(0)}%`,
    },
    {
      id: "crossCluster",
      label: "Cross-Cluster Connections",
      weight: 0.2,
      score: crossCluster,
      detail: `${cross} relationship(s) bridging distinct clusters`,
    },
    {
      id: "density",
      label: "Association Density",
      weight: 0.2,
      score: density,
      detail: `Linked to ${neighborClusterDistinct} of 3 clusters`,
    },
    {
      id: "temporal",
      label: "Temporal Pattern",
      weight: 0.15,
      score: temporal,
      detail: entity.bridge
        ? "Persistent activity across observation window"
        : "Activity consistent with cluster baseline",
    },
    {
      id: "anomaly",
      label: "Activity Anomaly",
      weight: 0.15,
      score: anomaly,
      detail: "Deviation from historical activity envelope",
    },
  ];
  return raw;
}

export function computeRiskIndicator(entity: Entity): number {
  const factors = getRiskFactors(entity);
  const weighted = factors.reduce((sum, f) => sum + f.weight * f.score, 0);
  return Math.round(weighted);
}

export function getDirectConnections(id: string): Relationship[] {
  return relationships.filter((r) => r.source === id || r.target === id);
}

export function getNeighbors(id: string): string[] {
  const adj = buildAdjacency();
  return Array.from(adj[id] ?? []);
}

export function getIndirectConnections(id: string): string[] {
  const direct = new Set(getNeighbors(id));
  const indirect = new Set<string>();
  for (const n of direct) {
    for (const nn of buildAdjacency()[n] ?? []) {
      if (nn !== id && !direct.has(nn)) indirect.add(nn);
    }
  }
  return Array.from(indirect);
}

export function getAssociatedByType(
  id: string,
  type: Entity["type"]
): Entity[] {
  const ids = new Set(getNeighbors(id));
  return entities.filter((e) => ids.has(e.id) && e.type === type);
}