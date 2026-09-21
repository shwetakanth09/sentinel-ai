import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

export const SESSION_COOKIE = "sentinel_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

function scryptHash(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${scryptHash(password, salt)}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptHash(password, salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function ensureDefaultUser(): { email: string; password: string } {
  const db = getDb();
  const count = db.prepare("SELECT COUNT(*) AS n FROM users").get() as { n: number };
  if (count.n === 0) {
    const email = process.env.SENTINEL_ADMIN_EMAIL || "admin@sentinel.local";
    const password = process.env.SENTINEL_ADMIN_PASSWORD || "admin123";
    db.prepare(
      "INSERT INTO users (email, name, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?)"
    ).run(email, "System Administrator", "admin", hashPassword(password), new Date().toISOString());
    return { email, password };
  }
  return { email: process.env.SENTINEL_ADMIN_EMAIL || "admin@sentinel.local", password: process.env.SENTINEL_ADMIN_PASSWORD || "" };
}

export interface SessionResult {
  token: string;
  user: SessionUser;
}

export function createSession(userId: number): SessionResult {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  getDb()
    .prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .run(sha256(token), userId, new Date(now).toISOString(), new Date(now + SESSION_TTL_MS).toISOString());
  const user = findUserById(userId);
  if (!user) throw new Error("user not found");
  return { token, user };
}

export function destroySession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
}

export function findUserById(id: number): SessionUser | null {
  const row = getDb().prepare("SELECT id, email, name, role FROM users WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? mapUser(row) : null;
}

export function findUserByEmail(email: string): (SessionUser & { passwordHash: string }) | null {
  const row = getDb()
    .prepare("SELECT id, email, name, role, password_hash FROM users WHERE email = ?")
    .get(email) as Record<string, unknown> | undefined;
  if (!row) return null;
  return { ...mapUser(row), passwordHash: row.password_hash as string };
}

export function registerUser(email: string, name: string, password: string): SessionUser {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim()) as
    | { id: number }
    | undefined;
  if (existing) throw new Error("An account with that email already exists.");
  const result = db
    .prepare("INSERT INTO users (email, name, role, password_hash, created_at) VALUES (?, ?, 'analyst', ?, ?)")
    .run(email.toLowerCase().trim(), name, hashPassword(password), new Date().toISOString());
  const user = findUserById(Number(result.lastInsertRowid));
  if (!user) throw new Error("Failed to create user.");
  return user;
}

function mapUser(row: Record<string, unknown>): SessionUser {
  return {
    id: row.id as number,
    email: row.email as string,
    name: row.name as string,
    role: row.role as string,
  };
}

export function getUserByToken(token: string): SessionUser | null {
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.email, u.name, u.role FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`
    )
    .get(sha256(token), new Date().toISOString()) as Record<string, unknown> | undefined;
  return row ? mapUser(row) : null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? getUserByToken(token) : null;
}

export function sessionCookie(token: string): string {
  const expires = new Date(Date.now() + SESSION_TTL_MS).toUTCString();
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; Expires=${expires}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}