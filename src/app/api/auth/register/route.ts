import { NextResponse } from "next/server";
import { registerUser, createSession, sessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");

    if (!email.includes("@") || email.length > 200) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ error: "Name must be between 2 and 80 characters." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const user = registerUser(email, name, password);
    const session = createSession(user.id);
    const response = NextResponse.json({ user: session.user });
    response.headers.set("Set-Cookie", sessionCookie(session.token));
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed.";
    const status = message.toLowerCase().includes("already exists") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}