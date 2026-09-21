import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteRelationship } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await context.params;
  deleteRelationship(id);
  return NextResponse.json({ ok: true, id });
}