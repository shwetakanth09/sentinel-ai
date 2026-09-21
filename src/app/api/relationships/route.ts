import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createRelationship, getEntityById } from "@/lib/db";
import type { RelationshipType } from "@/types";

export const dynamic = "force-dynamic";

const REL_TYPES: RelationshipType[] = [
  "CALLED", "MET", "ASSOCIATED_WITH", "WORKS_FOR", "LOCATED_AT", "USED",
  "TRANSFERRED_TO", "ATTENDED", "CONNECTED_TO", "CONTACTED", "OBSERVED_AT", "REGISTERED_TO",
];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const body = await request.json();
  const source = String(body.source ?? "");
  const target = String(body.target ?? "");
  const type = body.type as RelationshipType;

  if (!REL_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid relationship type." }, { status: 400 });
  }
  if (!source || !target || source === target) {
    return NextResponse.json({ error: "Both endpoints are required and must differ." }, { status: 400 });
  }
  if (!getEntityById(source) || !getEntityById(target)) {
    return NextResponse.json({ error: "Both endpoints must reference existing entities." }, { status: 400 });
  }

  const id = `REL-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const rel = createRelationship(
    { id, source, target, type, confidence: Number(body.confidence ?? 0.8) || 0.8, sourceReference: body.sourceReference ?? "MANUAL-ENTRY" },
    user.id
  );
  return NextResponse.json({ ok: true, relationship: rel }, { status: 201 });
}