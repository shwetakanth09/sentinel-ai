import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateCaseStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status ?? "");
  if (!["Active", "Under Review", "Closed"].includes(status)) {
    return NextResponse.json({ error: "Invalid case status." }, { status: 400 });
  }
  updateCaseStatus(id, status as never);
  return NextResponse.json({ ok: true, id, status });
}