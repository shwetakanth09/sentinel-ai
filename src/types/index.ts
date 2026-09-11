export type EntityType =
  | "person"
  | "organization"
  | "phone"
  | "vehicle"
  | "location"
  | "account"
  | "event";

export type RelationshipType =
  | "CALLED"
  | "MET"
  | "ASSOCIATED_WITH"
  | "WORKS_FOR"
  | "LOCATED_AT"
  | "USED"
  | "TRANSFERRED_TO"
  | "ATTENDED"
  | "CONNECTED_TO"
  | "CONTACTED"
  | "OBSERVED_AT"
  | "REGISTERED_TO";

export type AlertSeverity = "HIGH" | "MEDIUM" | "LOW";
export type AlertStatus = "needs_review" | "reviewed" | "dismissed";

export type RiskFactorId =
  | "centrality"
  | "crossCluster"
  | "density"
  | "temporal"
  | "anomaly";

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  riskIndicator: number;
  confidence: number;
  cluster: "A" | "B" | "C";
  bridge?: boolean;
  metadata?: {
    role?: string;
    age?: number;
    city?: string;
    phoneNumber?: string;
    email?: string;
    sector?: string;
    make?: string;
    model?: string;
    plate?: string;
    color?: string;
    area?: string;
    bank?: string;
    accountNumber?: string;
    kind?: string;
    date?: string;
    description?: string;
    details?: string;
    alias?: string;
    department?: string;
  };
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  timestamp: string;
  confidence: number;
  sourceReference: string;
}

export interface InvestigationEvent {
  id: string;
  type: string;
  timestamp: string;
  entities: string[];
  location: string;
  description: string;
}

export interface PatternAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  entities: string[];
  detected: string;
  confidence: number;
  status: AlertStatus;
  pattern: string;
  evidence: string[];
}

export interface InvestigationCase {
  id: string;
  title: string;
  subtitle: string;
  status: "Active" | "Under Review" | "Closed";
  entityCount: number;
  relationshipCount: number;
  alertCount: number;
  clusterCount: number;
  bridgeEntityCount: number;
  eventCount: number;
  opened: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface DataSourceStatus {
  id: string;
  name: string;
  icon: string;
  records: number;
  processed: boolean;
  lastIngested: string;
  format: string;
  description: string;
}

export interface RiskFactor {
  id: RiskFactorId;
  label: string;
  weight: number;
  score: number;
  detail: string;
}

export interface EntityInsight {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  evidenceCount: number;
  evidence: string[];
}

export interface ClusterInfo {
  id: "A" | "B" | "C";
  name: string;
  entityCount: number;
  relationshipCount: number;
  description: string;
  color: string;
}

export interface NetworkMetrics {
  totalEntities: number;
  totalRelationships: number;
  totalAlerts: number;
  highRiskIndicators: number;
  dataSourcesProcessed: number;
  activeInvestigations: number;
  clusters: ClusterInfo[];
  bridgeEntities: string[];
  degreeCentrality: Record<string, number>;
  betweennessCentrality: Record<string, number>;
  riskScores: Record<string, number>;
  communityPartitions: Record<string, string[]>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  evidence?: string[];
  confidence?: number;
  sources?: string[];
}

export interface TimelineFilter {
  id: string;
  label: string;
  groups: string[];
}

export interface GraphEdgeData {
  source: string;
  target: string;
  id: string;
  label: string;
  type: RelationshipType;
  timestamp: string;
  confidence: number;
}

export interface GraphNodeData {
  id: string;
  label: string;
  type: EntityType;
  cluster: string;
  bridge: boolean;
  risk: number;
  confidence: number;
  degree: number;
  betweenness: number;
}