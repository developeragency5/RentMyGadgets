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

export async function fixGalleryArrays(env: Env, rows: any[]): Promise<any[]> {
  if (!rows.length) return rows;
  try {
    const ids = rows.map((r) => r.id);
    const client = getNeonClient(env);
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
    const result = await client(
      `SELECT id, array_to_json(gallery_image_urls) as gallery FROM products WHERE id IN (${placeholders})`,
      ids
    );
    const galleryMap = new Map<string, string[]>();
    for (const row of result) {
      const parsed = typeof row.gallery === "string" ? JSON.parse(row.gallery) : row.gallery;
      galleryMap.set(row.id as string, parsed || []);
    }
    return rows.map((r) => ({
      ...r,
      galleryImageUrls: galleryMap.get(r.id) || r.galleryImageUrls || [],
    }));
  } catch (err) {
    console.error("fixGalleryArrays failed, using Drizzle-returned values:", err);
    return rows.map((r) => {
      let gallery = r.galleryImageUrls;
      if (typeof gallery === "string") {
        try { gallery = JSON.parse(gallery); } catch { gallery = []; }
      }
      if (!Array.isArray(gallery)) gallery = [];
      return { ...r, galleryImageUrls: gallery };
    });
  }
}
