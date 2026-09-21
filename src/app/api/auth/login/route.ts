import { NextResponse } from "next/server";
import { ensureDefaultUser, findUserByEmail, verifyPassword, createSession, sessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    ensureDefaultUser();
    const user = findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const session = createSession(user.id);
    const response = NextResponse.json({ user: session.user });
    response.headers.set("Set-Cookie", sessionCookie(session.token));
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed." },
      { status: 500 }
    );
  }
}