export const caseData = [
  {
    id: "CASE-2026-014",
    title: "Identified drug supply and human-trafficking corridor between Mumbai and Pune",
    priority: "Priority 1",
    status: "Active",
    entityCount: 37,
    relationshipCount: 94,
    clusterCount: 3,
    alertCount: 8,
    bridgeEntityCount: 4,
  },
  {
    id: "CASE-2026-015",
    title: "Cyber-enabled extortion ring operating through encrypted messaging",
    priority: "Priority 2",
    status: "Suspended",
    entityCount: 0,
    relationshipCount: 0,
    clusterCount: 0,
    alertCount: 0,
    bridgeEntityCount: 0,
  },
  {
    id: "CASE-2026-016",
    title: "Vehicle hijacking chain across national highway network",
    priority: "Priority 3",
    status: "Closed",
    entityCount: 0,
    relationshipCount: 0,
    clusterCount: 0,
    alertCount: 0,
    bridgeEntityCount: 0,
  },
];

export const reportFindings = [
  {
    id: "F-01",
    text: "Two structurally separable criminal clusters (Mumbai and Pune) are connected by only four bridge entities, of which PERSON-1088 is the highest-betweenness connector. Investigation should prioritize this node for interception and financial tracing.",
    confidence: 0.93,
  },
  {
    id: "F-02",
    text: "Communications surge detected between PERSON-1042 and PERSON-1088 on 2026-09-05, immediately preceding a flagged bulk asset transfer to LOCATION-105 on 2026-09-06.",
    confidence: 0.89,
  },
  {
    id: "F-03",
    text: "PERSON-1042 has the highest composite risk indicator (91) in the dataset, combining very-high proximity to enabled activities, strong network reach and a recent escalation in call frequency.",
    confidence: 0.91,
  },
  {
    id: "F-04",
    text: "Money movement is structured: incoming low-value deposits accumulate at a rely-funds node (ORGANIZATION-101), with high-value onward transfers to remote destinations, consistent with laundering syndicate behavior.",
    confidence: 0.84,
  },
] as const;