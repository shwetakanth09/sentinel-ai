import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateSourceProcessed } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  if (typeof body.processed !== "boolean") {
    return NextResponse.json({ error: "`processed` boolean is required." }, { status: 400 });
  }
  updateSourceProcessed(id, body.processed);
  return NextResponse.json({ ok: true, id, processed: body.processed });
}