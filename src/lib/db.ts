import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { entities as seedEntities } from "@/data/entities";
import { relationships as seedRelationships } from "@/data/relationships";
import { events as seedEvents } from "@/data/events";
import { alerts as seedAlerts } from "@/data/alerts";
import { cases as seedCases } from "@/data/cases";
import { dataSources as seedSources } from "@/data/sources";
import { nlpDocuments as seedNlpDocs } from "@/data/nlp-docs";
import type {
  AlertSeverity,
  AlertStatus,
  DataSourceStatus,
  Entity,
  EntityType,
  InvestigationCase,
  InvestigationEvent,
  PatternAlert,
  Relationship,
  RelationshipType,
} from "@/types";

const DATA_DIR = process.env.SENTINEL_DATA_DIR || path.join(process.cwd(), "data");
const DB_PATH = process.env.SENTINEL_DB_PATH || path.join(DATA_DIR, "sentinel.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seedIfEmpty(db);
  _db = db;
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'analyst',
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      risk_indicator REAL NOT NULL,
      confidence REAL NOT NULL,
      cluster TEXT NOT NULL,
      bridge INTEGER NOT NULL DEFAULT 0,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
      target TEXT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      confidence REAL NOT NULL,
      source_reference TEXT NOT NULL,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      entities TEXT,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      entities TEXT,
      detected TEXT NOT NULL,
      confidence REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'needs_review',
      pattern TEXT NOT NULL,
      evidence TEXT,
      updated_at TEXT NOT NULL,
      updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      status TEXT NOT NULL,
      entity_count INTEGER NOT NULL DEFAULT 0,
      relationship_count INTEGER NOT NULL DEFAULT 0,
      alert_count INTEGER NOT NULL DEFAULT 0,
      cluster_count INTEGER NOT NULL DEFAULT 0,
      bridge_entity_count INTEGER NOT NULL DEFAULT 0,
      event_count INTEGER NOT NULL DEFAULT 0,
      opened TEXT NOT NULL,
      priority TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS data_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      records INTEGER NOT NULL DEFAULT 0,
      processed INTEGER NOT NULL DEFAULT 0,
      last_ingested TEXT,
      format TEXT NOT NULL,
      description TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS nlp_documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      content TEXT NOT NULL,
      extracted_entities TEXT,
      extracted_relationships TEXT
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) AS n FROM entities").get() as { n: number };
  if (count.n > 0) return;

  const insert = db.transaction(() => {
    const putEntity = db.prepare(`
      INSERT INTO entities (id, type, name, risk_indicator, confidence, cluster, bridge, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const e of seedEntities) {
      putEntity.run(
        e.id,
        e.type,
        e.name,
        e.riskIndicator,
        e.confidence,
        e.cluster,
        e.bridge ? 1 : 0,
        e.metadata ? JSON.stringify(e.metadata) : null,
        new Date().toISOString(),
        new Date().toISOString()
      );
    }

    const putRel = db.prepare(`
      INSERT INTO relationships (id, source, target, type, timestamp, confidence, source_reference, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of seedRelationships) {
      putRel.run(r.id, r.source, r.target, r.type, r.timestamp, r.confidence, r.sourceReference, new Date().toISOString());
    }

    const putEvent = db.prepare(`
      INSERT INTO events (id, type, timestamp, entities, location, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const ev of seedEvents) {
      putEvent.run(ev.id, ev.type, ev.timestamp, JSON.stringify(ev.entities), ev.location, ev.description, new Date().toISOString());
    }

    const putAlert = db.prepare(`
      INSERT INTO alerts (id, severity, title, description, entities, detected, confidence, status, pattern, evidence, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const a of seedAlerts) {
      putAlert.run(a.id, a.severity, a.title, a.description, JSON.stringify(a.entities), a.detected, a.confidence, a.status, a.pattern, JSON.stringify(a.evidence), new Date().toISOString());
    }

    const putCase = db.prepare(`
      INSERT INTO cases (id, title, subtitle, status, entity_count, relationship_count, alert_count, cluster_count, bridge_entity_count, event_count, opened, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of seedCases) {
      putCase.run(c.id, c.title, c.subtitle, c.status, c.entityCount, c.relationshipCount, c.alertCount, c.clusterCount, c.bridgeEntityCount, c.eventCount, c.opened, c.priority);
    }

    const putSource = db.prepare(`
      INSERT INTO data_sources (id, name, icon, records, processed, last_ingested, format, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of seedSources) {
      putSource.run(s.id, s.name, s.icon, s.records, s.processed ? 1 : 0, s.lastIngested, s.format, s.description);
    }

    const putNlp = db.prepare(`
      INSERT INTO nlp_documents (id, title, source, content, extracted_entities, extracted_relationships)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const d of seedNlpDocs) {
      putNlp.run(d.id, d.title, d.source, d.content, JSON.stringify(d.extractedEntities), JSON.stringify(d.extractedRelationships));
    }
  });
  insert();
}

// ─── Row → domain mappers ────────────────────────────────────────────────

const parse = (v: string | null | undefined): unknown =>
  v == null || v === "" ? undefined : JSON.parse(v);

function rowToEntity(row: Record<string, unknown>): Entity {
  return {
    id: row.id as string,
    type: row.type as EntityType,
    name: row.name as string,
    riskIndicator: row.risk_indicator as number,
    confidence: row.confidence as number,
    cluster: row.cluster as Entity["cluster"],
    bridge: Boolean(row.bridge),
    metadata: parse(row.metadata as string) as Entity["metadata"],
  };
}

function rowToRelationship(row: Record<string, unknown>): Relationship {
  return {
    id: row.id as string,
    source: row.source as string,
    target: row.target as string,
    type: row.type as RelationshipType,
    timestamp: row.timestamp as string,
    confidence: row.confidence as number,
    sourceReference: row.source_reference as string,
  };
}

function rowToEvent(row: Record<string, unknown>): InvestigationEvent {
  return {
    id: row.id as string,
    type: row.type as string,
    timestamp: row.timestamp as string,
    entities: (parse(row.entities as string) as string[]) ?? [],
    location: row.location as string,
    description: row.description as string,
  };
}

function rowToAlert(row: Record<string, unknown>): PatternAlert {
  return {
    id: row.id as string,
    severity: row.severity as AlertSeverity,
    title: row.title as string,
    description: row.description as string,
    entities: (parse(row.entities as string) as string[]) ?? [],
    detected: row.detected as string,
    confidence: row.confidence as number,
    status: row.status as AlertStatus,
    pattern: row.pattern as string,
    evidence: (parse(row.evidence as string) as string[]) ?? [],
  };
}

function rowToCase(row: Record<string, unknown>): InvestigationCase {
  return {
    id: row.id as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    status: row.status as InvestigationCase["status"],
    entityCount: row.entity_count as number,
    relationshipCount: row.relationship_count as number,
    alertCount: row.alert_count as number,
    clusterCount: row.cluster_count as number,
    bridgeEntityCount: row.bridge_entity_count as number,
    eventCount: row.event_count as number,
    opened: row.opened as string,
    priority: row.priority as InvestigationCase["priority"],
  };
}

function rowToSource(row: Record<string, unknown>): DataSourceStatus {
  return {
    id: row.id as string,
    name: row.name as string,
    icon: row.icon as string,
    records: row.records as number,
    processed: Boolean(row.processed),
    lastIngested: row.last_ingested as string,
    format: row.format as string,
    description: row.description as string,
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────

export function listEntities(): Entity[] {
  const rows = getDb().prepare("SELECT * FROM entities ORDER BY name").all() as Record<string, unknown>[];
  return rows.map(rowToEntity);
}

export function getEntityById(id: string): Entity | null {
  const row = getDb().prepare("SELECT * FROM entities WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? rowToEntity(row) : null;
}

export function listRelationships(): Relationship[] {
  const rows = getDb().prepare("SELECT * FROM relationships ORDER BY timestamp").all() as Record<string, unknown>[];
  return rows.map(rowToRelationship);
}

export function listEvents(): InvestigationEvent[] {
  const rows = getDb().prepare("SELECT * FROM events ORDER BY timestamp").all() as Record<string, unknown>[];
  return rows.map(rowToEvent);
}

export function listAlerts(): PatternAlert[] {
  const rows = getDb().prepare("SELECT * FROM alerts ORDER BY detected DESC").all() as Record<string, unknown>[];
  return rows.map(rowToAlert);
}

export function listCases(): InvestigationCase[] {
  const rows = getDb().prepare("SELECT * FROM cases ORDER BY opened DESC").all() as Record<string, unknown>[];
  return rows.map(rowToCase);
}

export function listSources(): DataSourceStatus[] {
  const rows = getDb().prepare("SELECT * FROM data_sources ORDER BY id").all() as Record<string, unknown>[];
  return rows.map(rowToSource);
}

export function listNlpDocuments() {
  const rows = getDb().prepare("SELECT * FROM nlp_documents ORDER BY id").all() as Record<string, unknown>[];
  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    source: row.source as string,
    content: row.content as string,
    extractedEntities: (parse(row.extracted_entities as string) as unknown[]) ?? [],
    extractedRelationships: (parse(row.extracted_relationships as string) as unknown[]) ?? [],
  }));
}

export function getState() {
  return {
    entities: listEntities(),
    relationships: listRelationships(),
    events: listEvents(),
    alerts: listAlerts(),
    cases: listCases(),
    dataSources: listSources(),
    nlpDocuments: listNlpDocuments(),
  };
}

// ─── Mutations ───────────────────────────────────────────────────────────

export function updateAlertStatus(id: string, status: AlertStatus, userId?: number) {
  getDb()
    .prepare("UPDATE alerts SET status = ?, updated_at = ?, updated_by = ? WHERE id = ?")
    .run(status, new Date().toISOString(), userId ?? null, id);
}

export function updateEntity(id: string, patch: Partial<Pick<Entity, "riskIndicator" | "confidence" | "name" | "cluster" | "type" | "metadata">>) {
  const current = getEntityById(id);
  if (!current) return null;
  const next: Entity = {
    ...current,
    ...patch,
    metadata: patch.metadata !== undefined ? patch.metadata : current.metadata,
  };
  getDb()
    .prepare(
      "UPDATE entities SET name = ?, type = ?, risk_indicator = ?, confidence = ?, cluster = ?, metadata = ?, updated_at = ? WHERE id = ?"
    )
    .run(
      next.name,
      next.type,
      next.riskIndicator,
      next.confidence,
      next.cluster,
      next.metadata ? JSON.stringify(next.metadata) : null,
      new Date().toISOString(),
      id
    );
  return next;
}

export function createEntity(input: {
  id: string;
  name: string;
  type: EntityType;
  riskIndicator?: number;
  confidence?: number;
  cluster?: "A" | "B" | "C";
  metadata?: Entity["metadata"];
}, userId?: number) {
  const entity: Entity = {
    id: input.id,
    name: input.name,
    type: input.type,
    riskIndicator: input.riskIndicator ?? 50,
    confidence: input.confidence ?? 0.8,
    cluster: input.cluster ?? "A",
    metadata: input.metadata,
  };
  getDb()
    .prepare(
      "INSERT INTO entities (id, type, name, risk_indicator, confidence, cluster, bridge, metadata, created_at, updated_at, created_by) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)"
    )
    .run(
      entity.id,
      entity.type,
      entity.name,
      entity.riskIndicator,
      entity.confidence,
      entity.cluster,
      entity.metadata ? JSON.stringify(entity.metadata) : null,
      new Date().toISOString(),
      new Date().toISOString(),
      userId ?? null
    );
  return entity;
}

export function deleteEntity(id: string) {
  getDb().prepare("DELETE FROM entities WHERE id = ?").run(id);
}

export function createRelationship(input: {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  confidence?: number;
  sourceReference?: string;
}, userId?: number): Relationship {
  const rel: Relationship = {
    id: input.id,
    source: input.source,
    target: input.target,
    type: input.type,
    confidence: input.confidence ?? 0.8,
    timestamp: new Date().toISOString(),
    sourceReference: input.sourceReference ?? "MANUAL-ENTRY",
  };
  getDb()
    .prepare(
      "INSERT INTO relationships (id, source, target, type, timestamp, confidence, source_reference, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(rel.id, rel.source, rel.target, rel.type, rel.timestamp, rel.confidence, rel.sourceReference, new Date().toISOString(), userId ?? null);
  return rel;
}

export function deleteRelationship(id: string) {
  getDb().prepare("DELETE FROM relationships WHERE id = ?").run(id);
}

export function createEvent(input: {
  id: string;
  type: string;
  timestamp: string;
  entities: string[];
  location: string;
  description: string;
}, userId?: number): InvestigationEvent {
  const ev: InvestigationEvent = {
    id: input.id,
    type: input.type,
    timestamp: input.timestamp,
    entities: input.entities,
    location: input.location,
    description: input.description,
  };
  getDb()
    .prepare("INSERT INTO events (id, type, timestamp, entities, location, description, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(ev.id, ev.type, ev.timestamp, JSON.stringify(ev.entities), ev.location, ev.description, new Date().toISOString(), userId ?? null);
  return ev;
}

export function updateCaseStatus(id: string, status: InvestigationCase["status"]) {
  getDb().prepare("UPDATE cases SET status = ? WHERE id = ?").run(status, id);
}

export function updateSourceProcessed(id: string, processed: boolean) {
  getDb()
    .prepare("UPDATE data_sources SET processed = ?, last_ingested = ? WHERE id = ?")
    .run(processed ? 1 : 0, new Date().toISOString(), id);
}

export function resetDatabase() {
  const db = getDb();
  db.exec(`
    DELETE FROM nlp_documents;
    DELETE FROM data_sources;
    DELETE FROM cases;
    DELETE FROM alerts;
    DELETE FROM events;
    DELETE FROM relationships;
    DELETE FROM entities;
  `);
  seedIfEmpty(db);
}

export function nextEntityId(type: EntityType): string {
  const prefix: Record<EntityType, string> = {
    person: "PERSON",
    organization: "ORG",
    phone: "PHONE",
    vehicle: "VEHICLE",
    location: "LOCATION",
    account: "ACCOUNT",
    event: "EVENT",
  };
  const start = getDb().prepare("SELECT COUNT(*) AS n FROM entities").get() as { n: number };
  return `${prefix[type]}-${9000 + Number(start.n) + 1}`;
}