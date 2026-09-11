import { entities, getEntity, getEntityName } from "@/data/entities";
import { relationships } from "@/data/relationships";
import { alerts } from "@/data/alerts";
import { events } from "@/data/events";
import { cases } from "@/data/cases";
import type { EntityInsight, ChatMessage, PatternAlert } from "@/types";
import {
  getNetworkMetrics,
  getDirectConnections,
  getNeighbors,
  getRiskFactors,
  detectBridgeEntities,
  degreeCentrality,
  betweennessCentrality,
} from "./graph-analytics";

function id(): string {
  return `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function getAIInsights(): EntityInsight[] {
  const bridges = detectBridgeEntities();
  const bridgeNames = bridges.map(getEntityName);
  const highRisk = entities.filter((e) => e.riskIndicator >= 70);
  const crossCluster = alerts.filter((a) =>
    a.entities.some((eid) => {
      const e = getEntity(eid);
      return e?.bridge;
    })
  );

  return [
    {
      id: "INSIGHT-1",
      title: "3 major clusters identified",
      summary: `Cluster A (${getClusterSize("A")}), Cluster B (${getClusterSize(
        "B"
      )}), and Cluster C (${getClusterSize("C")} members) form distinct operational groups.`,
      confidence: 0.91,
      evidenceCount: 5,
      evidence: [
        "Cross-cluster communication confirmed by CDR data.",
        "Shared vehicles and locations detected across clusters.",
        `Bridge entities: ${bridgeNames.slice(0, 4).join(", ")}`,
        "Financial flows map onto these clusters.",
        "Event attendance correlates with cluster structure.",
      ],
    },
    {
      id: "INSIGHT-2",
      title: `${bridges.length} bridge entities connect otherwise separate clusters`,
      summary: `Entities ${bridgeNames
        .slice(0, 3)
        .join(", ")} and one additional entity hold relationships spanning at least two clusters.`,
      confidence: 0.87,
      evidenceCount: 4,
      evidence: [
        `PERSON-1088 holds edges to Cluster A and Cluster B.`,
        `PERSON-1056 bridges Cluster B to Cluster C.`,
        "PHONE-8821 is referenced across CDRs from different clusters.",
        "LOCATION-105 is co-referenced by field notes and traffic cameras.",
      ],
    },
    {
      id: "INSIGHT-3",
      title: `${highRisk.length} entities require investigator review`,
      summary: `The entity risk profile, computed from centrality, density and anomaly features, produces ${highRisk.length} elevated leads.`,
      confidence: 0.82,
      evidenceCount: 4,
      evidence: [
        `PERSON-1042 (risk 82) exhibits strongest centrality.`,
        "Network centrality: 30% · Cross-cluster: 20% · Density: 20%.",
        "AI-generated investigative indicator — not a determination of criminality.",
        "All leads should be verified against operational case files.",
      ],
    },
    {
      id: "INSIGHT-4",
      title: "Repeated communication activity around Cluster B",
      summary:
        "Cluster B shows sustained high-volume communication patterns within a concentrated time window in February–April.",
      confidence: 0.79,
      evidenceCount: 4,
      evidence: [
        "14 calls within 60-day window involving ORG-221 members.",
        "Alerts generated: Unusual Communication Cluster, Temporal Concentration.",
        "Cross-cluster inbound calls detected at PHONE-8856.",
        "Field notes confirm observables from surveillance reports.",
      ],
    },
  ];
}

function getClusterSize(id: "A" | "B" | "C"): number {
  return entities.filter((e) => e.cluster === id).length;
}

export function answerQuery(query: string): ChatMessage {
  const q = query.toLowerCase();
  const bridgeEntities = detectBridgeEntities();

  if (q.includes("bridge") || q.includes("connect") && q.includes("cluster")) {
    const bridgeEnts = bridgeEntities.map(getEntity);
    const lines = bridgeEnts.map((e) => {
      if (!e) return "";
      const dirs = getDirectConnections(e.id).length;
      return `• ${e.name} (${e.id}) — ${dirs} direct connections, links clusters ${e.cluster}.`;
    });
    return {
      id: id(),
      role: "assistant",
      content: `Bridge entities are individuals or objects with relationships crossing cluster boundaries. These are the ${bridgeEntities.length} entities linking otherwise separate networks:\n\n${lines.filter(Boolean).join("\n")}\n\nConfidence: 87%\n\nAI-generated investigative lead — requires independent verification.`,
      timestamp: now(),
      confidence: 0.87,
      evidence: bridgeEntities.map((eid) => `${getEntityName(eid)} crosses cluster boundary.`),
    };
  }

  if (q.includes("strongest") && (q.includes("1042") || q.includes("arjun"))) {
    const rels = getDirectConnections("PERSON-1042");
    const strongest = rels.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    const lines = strongest.map(
      (r) => `• ${r.type} → ${getEntityName(
        r.source === "PERSON-1042" ? r.target : r.source
      )} (confidence ${(r.confidence * 100).toFixed(0)}%)`
    );
    return {
      id: id(),
      role: "assistant",
      content: `PERSON-1042 (Arjun Mehta) has the strongest connections to:\n\n${lines.join("\n")}\n\nTotal direct connections: ${rels.length}\nConfidence: 91%\n\nAI-generated investigative lead — requires independent verification.`,
      timestamp: now(),
      confidence: 0.91,
      evidence: rels.map((r) => `${r.type}: ${r.source} ↔ ${r.target}`),
    };
  }

  if (q.includes("unusual") && (q.includes("pattern") || q.includes("detect"))) {
    const top = alerts.slice(0, 3);
    const lines = top.map(
      (a) => `• [${a.severity}] ${a.title} (${a.confidence * 100}% confidence)\n  ${a.description}`
    );
    return {
      id: id(),
      role: "assistant",
      content: `AI-detected patterns in the investigation:\n\n${lines.join("\n\n")}\n\n${alerts.length} total alerts generated. All require investigator review.\n\nAI-generated investigative lead — requires independent verification.`,
      timestamp: now(),
      confidence: 0.85,
      evidence: alerts.map((a) => `${a.title}: ${a.evidence[0] ?? ""}`),
    };
  }

  if (q.includes("timeline") && (q.includes("1042") || q.includes("arjun"))) {
    const evts = events.filter((e) => e.entities.includes("PERSON-1042"));
    const lines = evts.map(
      (e) => `• ${e.timestamp.split("T")[0]} — ${e.type}: ${e.description}`
    );
    return {
      id: id(),
      role: "assistant",
      content: `Timeline for PERSON-1042 (Arjun Mehta):\n\n${lines.join("\n")}\n\nConfidence: 89%\n\nAI-generated investigative lead — requires independent verification.`,
      timestamp: now(),
      confidence: 0.89,
      evidence: evts.map((e) => `${e.type}: ${e.description}`),
    };
  }

  if (q.includes("centrality") || q.includes("highest") || q.includes("most important")) {
    const dc = degreeCentrality();
    const bc = betweennessCentrality();
    const top = entities
      .filter((e) => e.type === "person")
      .map((e) => ({
        ...e,
        score: (dc[e.id] ?? 0) * 0.6 + (bc[e.id] ?? 0) * 0.4,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    const lines = top.map(
      (e, i) => `${i + 1}. ${e.name} (${e.id}) — score ${(e.score * 100).toFixed(0)}`
    );
    return {
      id: id(),
      role: "assistant",
      content: `Entities ranked by network centrality:\n\n${lines.join("\n")}\n\nConfidence: 90%\n\nAI-generated investigative lead — requires independent verification.`,
      timestamp: now(),
      confidence: 0.90,
      evidence: ["Degree centrality and betweenness centrality computed over 37 entities."],
    };
  }

  if (q.includes("why") && (q.includes("flag") || q.includes("risk") || q.includes("1042") || q.includes("arjun"))) {
    const ent = getEntity("PERSON-1042");
    if (!ent) {
      return { id: id(), role: "assistant", content: "Entity not found.", timestamp: now() };
    }
    const factors = getRiskFactors(ent);
    const lines = factors.map(
      (f) => `• ${f.label}: +${Math.round(f.weight * f.score)} (${f.detail})`
    );
    return {
      id: id(),
      role: "assistant",
      content: `PERSON-1042 (Arjun Mehta) appears as a high-interest entity because:\n\n${lines.join("\n")}\n\nNetwork Risk Indicator: ${ent.riskIndicator}/100\nConfidence: 93%\n\nThis is an AI-generated investigative lead and should be independently verified.`,
      timestamp: now(),
      confidence: 0.93,
      evidence: factors.map((f) => `${f.label}: ${f.detail}`),
    };
  }

  if (q.includes("cluster") && (q.includes("which") || q.includes("show") || q.includes("list"))) {
    const metrics = getNetworkMetrics();
    const lines = metrics.clusters.map(
      (c) => `• ${c.name} (Cluster ${c.id}): ${c.entityCount} entities, ${c.relationshipCount} internal relationships.\n  ${c.description}`
    );
    return {
      id: id(),
      role: "assistant",
      content: `The investigation reveals three distinct network clusters:\n\n${lines.join("\n\n")}\n\nBridge entities connect these clusters.\n\nAI-generated investigative lead — requires independent verification.`,
      timestamp: now(),
      confidence: 0.88,
      evidence: metrics.clusters.map((c) => `${c.name}: ${c.description}`),
    };
  }

  if (q.includes("case") && q.includes("2026-014")) {
    const c = cases.find((c) => c.id === "CASE-2026-014");
    return {
      id: id(),
      role: "assistant",
      content: c
        ? `Case ${c.id} — ${c.title}\nStatus: ${c.status}\nEntities: ${c.entityCount} · Relationships: ${c.relationshipCount}\nAlerts: ${c.alertCount} · Clusters: ${c.clusterCount}\nBridge entities: ${c.bridgeEntityCount}\nOpened: ${c.opened.split("T")[0]}\n\nPriority: ${c.priority}\n\nAI-generated investigative lead — requires independent verification.`
        : "Case not found.",
      timestamp: now(),
      confidence: 0.95,
      evidence: ["Case record from CASE-2026-014 database."],
    };
  }

  return {
    id: id(),
    role: "assistant",
    content:
      `I can answer questions about:\n\n• Why a specific entity is important (e.g., "Why is PERSON-1042 flagged?")\n• The strongest relationships for an entity\n• Detected unusual patterns\n• Entity timeline events\n• Network centrality rankings\n• Bridge entities connecting clusters\n• Cluster structure\n• Case details (CASE-2026-014)\n\nTry one of these queries.\n\nAI-generated investigative lead — requires independent verification.`,
    timestamp: now(),
    confidence: 0.95,
    evidence: [],
  };
}

export const SUGGESTED_QUESTIONS = [
  "Which entities connect the major clusters?",
  "What are the strongest relationships for PERSON-1042?",
  "What unusual patterns were detected?",
  "Show the timeline of PERSON-1042.",
  "Which entities have the highest network centrality?",
  "Why is PERSON-1042 flagged?",
  "Show all clusters.",
  "Show case details for CASE-2026-014.",
];