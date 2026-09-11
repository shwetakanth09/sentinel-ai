import type { EntityType } from "@/types";

export const ENTITY_TYPE_CONFIG: Record<
  EntityType,
  { label: string; color: string; fill: string; stroke: string }
> = {
  person: { label: "Person", color: "#3b82f6", fill: "#3b82f6", stroke: "#60a5fa" },
  organization: { label: "Organization", color: "#a78bfa", fill: "#a78bfa", stroke: "#c4b5fd" },
  phone: { label: "Phone Number", color: "#22d3ee", fill: "#22d3ee", stroke: "#67e8f9" },
  vehicle: { label: "Vehicle", color: "#f59e0b", fill: "#f59e0b", stroke: "#fbbf24" },
  location: { label: "Location", color: "#10b981", fill: "#10b981", stroke: "#34d399" },
  account: { label: "Financial Account", color: "#ec4899", fill: "#ec4899", stroke: "#f472b6" },
  event: { label: "Event", color: "#94a3b8", fill: "#94a3b8", stroke: "#cbd5e1" },
};

export const ENTITY_TYPE_LIST: EntityType[] = [
  "person",
  "organization",
  "phone",
  "vehicle",
  "location",
  "account",
  "event",
];

export const CLUSTER_CONFIG: Record<"A" | "B" | "C", { label: string; color: string }> = {
  A: { label: "Cluster A", color: "#3b82f6" },
  B: { label: "Cluster B", color: "#22d3ee" },
  C: { label: "Cluster C", color: "#a78bfa" },
};

export const RELATIONSHIP_COLORS: Record<string, string> = {
  CALLED: "#22d3ee",
  MET: "#3b82f6",
  ASSOCIATED_WITH: "#a78bfa",
  WORKS_FOR: "#f59e0b",
  LOCATED_AT: "#10b981",
  USED: "#ec4899",
  TRANSFERRED_TO: "#f59e0b",
  ATTENDED: "#94a3b8",
  CONNECTED_TO: "#a78bfa",
  CONTACTED: "#f472b6",
  OBSERVED_AT: "#10b981",
  REGISTERED_TO: "#60a5fa",
};

export const RISK_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};