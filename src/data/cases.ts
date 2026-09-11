import type { InvestigationCase } from "@/types";

export const cases: InvestigationCase[] = [
  {
    id: "CASE-2026-014",
    title: "Cross-Cluster Network Investigation",
    subtitle: "AI-assisted analysis of connected entities, events and relationships.",
    status: "Active",
    entityCount: 37,
    relationshipCount: 94,
    alertCount: 8,
    clusterCount: 3,
    bridgeEntityCount: 4,
    eventCount: 26,
    opened: "2026-01-10T09:00:00",
    priority: "HIGH",
  },
  {
    id: "CASE-2026-009",
    title: "Organization Association",
    subtitle: "Business entities and financial flows under review.",
    status: "Under Review",
    entityCount: 22,
    relationshipCount: 51,
    alertCount: 5,
    clusterCount: 2,
    bridgeEntityCount: 2,
    eventCount: 15,
    opened: "2025-11-22T09:00:00",
    priority: "MEDIUM",
  },
  {
    id: "CASE-2026-003",
    title: "Vehicle Network",
    subtitle: "Vehicle usage patterns and movements across regions.",
    status: "Closed",
    entityCount: 18,
    relationshipCount: 43,
    alertCount: 3,
    clusterCount: 2,
    bridgeEntityCount: 1,
    eventCount: 11,
    opened: "2025-09-04T09:00:00",
    priority: "LOW",
  },
];

export function getCase(id: string): InvestigationCase | undefined {
  return cases.find((c) => c.id === id);
}