import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { resetDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Administrator role required." }, { status: 403 });
  }
  resetDatabase();
  return NextResponse.json({ ok: true });
}