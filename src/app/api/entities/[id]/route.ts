import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateEntity, deleteEntity } from "@/lib/db";
import type { EntityType } from "@/types";

export const dynamic = "force-dynamic";

const ENTITY_TYPES: EntityType[] = ["person", "organization", "phone", "vehicle", "location", "account", "event"];

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  const patch: Record<string, unknown> = {};
  if (body.name !== undefined) patch.name = String(body.name);
  if (body.riskIndicator !== undefined) patch.riskIndicator = Math.max(0, Math.min(100, Number(body.riskIndicator)));
  if (body.confidence !== undefined) patch.confidence = Math.max(0, Math.min(1, Number(body.confidence)));
  if (body.cluster !== undefined && ["A", "B", "C"].includes(body.cluster)) patch.cluster = body.cluster;
  if (body.type !== undefined && ENTITY_TYPES.includes(body.type)) patch.type = body.type;
  if (body.metadata !== undefined) patch.metadata = body.metadata;

  const updated = updateEntity(id, patch);
  if (!updated) return NextResponse.json({ error: "Entity not found." }, { status: 404 });
  return NextResponse.json({ ok: true, entity: updated });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;
  deleteEntity(id);
  return NextResponse.json({ ok: true, id });
}