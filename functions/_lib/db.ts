import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export type Env = {
  DATABASE_URL: string;
  SESSION_SECRET?: string;
  COOKIE_DOMAIN?: string;
  GEMINI_API_KEY?: string;
  SESSIONS?: KVNamespace;
  ASSETS: Fetcher;
};

export function getDb(env: Env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  const client = neon(env.DATABASE_URL);
  return drizzle(client);
}

export function getNeonClient(env: Env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(env.DATABASE_URL);
}

function parseGalleryValue(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === "string");
  if (typeof val === "string") {
    if (val.startsWith("[")) {
      try { return JSON.parse(val); } catch { return []; }
    }
    if (val.startsWith("{")) {
      const inner = val.slice(1, -1);
      if (!inner) return [];
      return inner.split(",").map(s => s.replace(/^"|"$/g, ""));
    }
  }
  return [];
}

export function fixGalleryArraysSync(rows: any[]): any[] {
  return rows.map((r) => ({
    ...r,
    galleryImageUrls: parseGalleryValue(r.galleryImageUrls),
  }));
}

export async function fixGalleryArrays(env: Env, rows: any[]): Promise<any[]> {
  return fixGalleryArraysSync(rows);
}
