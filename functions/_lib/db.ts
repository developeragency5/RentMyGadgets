import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export type Env = {
  DATABASE_URL: string;
  SESSION_SECRET?: string;
  COOKIE_DOMAIN?: string;
  GEMINI_API_KEY?: string;
  SESSIONS?: KVNamespace;
  // Bound automatically by Cloudflare Pages — used to fetch built static assets
  // (e.g. the Vite-built `index.html` shell) at request time.
  ASSETS: Fetcher;
};

export function getDb(env: Env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  const client = neon(env.DATABASE_URL);
  return drizzle(client);
}
