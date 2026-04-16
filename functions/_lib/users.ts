import { eq } from "drizzle-orm";
import { users } from "@shared/schema";
import { getDb, type Env } from "./db";

export type PublicUser = {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
};

export function toPublicUser(row: typeof users.$inferSelect): PublicUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    fullName: row.fullName ?? null,
  };
}

export async function getUserById(env: Env, id: string) {
  const db = getDb(env);
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getUserByUsername(env: Env, username: string) {
  const db = getDb(env);
  const rows = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return rows[0] ?? null;
}

export async function getUserByEmail(env: Env, email: string) {
  const db = getDb(env);
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return rows[0] ?? null;
}

export async function createUser(
  env: Env,
  data: { username: string; email: string; password: string; fullName?: string | null }
) {
  const db = getDb(env);
  const rows = await db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName ?? null,
    })
    .returning();
  return rows[0];
}
