import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createEntity, nextEntityId } from "@/lib/db";
import type { EntityType } from "@/types";

export const dynamic = "force-dynamic";

const ENTITY_TYPES: EntityType[] = ["person", "organization", "phone", "vehicle", "location", "account", "event"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json();
  const type = body.type as EntityType;
  const name = String(body.name ?? "").trim();
  const cluster = ["A", "B", "C"].includes(body.cluster) ? (body.cluster as "A" | "B" | "C") : "A";

  if (!ENTITY_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid entity type." }, { status: 400 });
  }
  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Entity name is required." }, { status: 400 });
  }
  const riskIndicator = Math.max(0, Math.min(100, Number(body.riskIndicator ?? 50) || 50));

  const id = body.id && typeof body.id === "string" ? body.id : nextEntityId(type);
  const entity = createEntity(
    { id, name, type, riskIndicator, confidence: Number(body.confidence ?? 0.8) || 0.8, cluster, metadata: body.metadata ?? undefined },
    user.id
  );
  return NextResponse.json({ ok: true, entity }, { status: 201 });
}