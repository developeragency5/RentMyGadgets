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
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed.filter((v: unknown): v is string => typeof v === "string") : [];
      } catch { return []; }
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
    availableColors: parseGalleryValue(r.availableColors),
    specs: parseGalleryValue(r.specs),
  }));
}

export async function fixGalleryArrays(env: Env, rows: any[]): Promise<any[]> {
  return fixGalleryArraysSync(rows);
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());
}

function camelCaseRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[snakeToCamel(k)] = v;
  return out;
}

export async function queryProducts(env: Env, opts?: { categoryId?: string; featured?: boolean; id?: string; slug?: string; limit?: number; columns?: string[] }): Promise<any[]> {
  const sql = getNeonClient(env);
  let rows;
  if (opts?.id) {
    rows = await sql`SELECT * FROM products WHERE id = ${opts.id} LIMIT 1`;
  } else if (opts?.slug) {
    try {
      rows = await sql`SELECT * FROM products WHERE slug = ${opts.slug} LIMIT 1`;
    } catch {
      rows = [];
    }
    if (!rows.length) {
      const nameGuess = opts.slug.replace(/-/g, " ");
      rows = await sql`SELECT * FROM products WHERE LOWER(name) LIKE ${"%" + nameGuess + "%"} LIMIT 1`;
    }
  } else if (opts?.categoryId) {
    rows = await sql`SELECT * FROM products WHERE category_id = ${opts.categoryId}`;
  } else if (opts?.featured) {
    rows = await sql`SELECT * FROM products WHERE featured = true`;
  } else {
    rows = await sql`SELECT * FROM products`;
  }
  const camelRows = rows.map(camelCaseRow);
  return fixGalleryArraysSync(camelRows as any[]);
}
