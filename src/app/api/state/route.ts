import { NextResponse } from "next/server";
import { getState } from "@/lib/db";
import { ensureDefaultUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  ensureDefaultUser();
  return NextResponse.json(getState());
}