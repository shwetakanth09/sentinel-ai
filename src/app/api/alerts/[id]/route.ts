import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateAlertStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status ?? "");
  if (!["needs_review", "reviewed", "dismissed"].includes(status)) {
    return NextResponse.json({ error: "Invalid alert status." }, { status: 400 });
  }

  updateAlertStatus(id, status as never, user.id);
  return NextResponse.json({ ok: true, id, status });
}