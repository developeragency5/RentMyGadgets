import type { Context } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import type { Env } from "./db";

export const SESSION_COOKIE = "session_id";
export const USER_TTL_SECONDS = 7 * 24 * 60 * 60;
export const GUEST_TTL_SECONDS = 24 * 60 * 60;

export type SessionPayload = {
  userId: string;
  isGuest?: boolean;
  createdAt: number;
};

function generateSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function isProd(c: Context<{ Bindings: Env }>): boolean {
  // Cloudflare Pages deployments run over HTTPS; secure-cookie when not on localhost.
  const url = new URL(c.req.url);
  return url.protocol === "https:";
}

function cookieDomain(c: Context<{ Bindings: Env }>): string | undefined {
  const url = new URL(c.req.url);
  // Only set Domain in production. Never set on .pages.dev (browsers reject)
  // or on localhost. Only set on the configured COOKIE_DOMAIN if the current
  // host actually matches it.
  const configured = c.env.COOKIE_DOMAIN;
  if (!configured) return undefined;
  const bare = configured.startsWith(".") ? configured.slice(1) : configured;
  if (url.hostname === bare || url.hostname.endsWith("." + bare)) {
    return configured;
  }
  return undefined;
}

function getSessionsKv(c: Context<{ Bindings: Env }>): KVNamespace | null {
  if (!c.env.SESSIONS) {
    console.warn(
      "SESSIONS KV namespace is not bound. Sessions will use cookie-only mode. Add it in Cloudflare Pages → Settings → Functions → KV namespace bindings (variable name: SESSIONS)."
    );
    return null;
  }
  return c.env.SESSIONS;
}

/** Create a new session, store it in KV, and set the session cookie. */
export async function createSession(
  c: Context<{ Bindings: Env }>,
  userId: string,
  opts: { isGuest?: boolean } = {}
): Promise<string> {
  const kv = getSessionsKv(c);
  const sessionId = generateSessionId();
  const ttl = opts.isGuest ? GUEST_TTL_SECONDS : USER_TTL_SECONDS;
  const payload: SessionPayload = {
    userId,
    isGuest: opts.isGuest === true,
    createdAt: Date.now(),
  };
  if (kv) {
    await kv.put(`session:${sessionId}`, JSON.stringify(payload), {
      expirationTtl: ttl,
    });
  }

  const domain = cookieDomain(c);
  setCookie(c, SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: isProd(c),
    sameSite: "Lax",
    path: "/",
    maxAge: ttl,
    ...(domain ? { domain } : {}),
  });

  return sessionId;
}

/** Read the current session from the cookie + KV, or null. */
export async function readSession(
  c: Context<{ Bindings: Env }>
): Promise<SessionPayload | null> {
  const sid = getCookie(c, SESSION_COOKIE);
  if (!sid) return null;
  const kv = c.env.SESSIONS;
  if (!kv) return null;
  const raw = await kv.get(`session:${sid}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }
}

/** Destroy the current session: remove from KV, clear the cookie. */
export async function destroySession(
  c: Context<{ Bindings: Env }>
): Promise<void> {
  const sid = getCookie(c, SESSION_COOKIE);
  if (sid && c.env.SESSIONS) {
    await c.env.SESSIONS.delete(`session:${sid}`);
  }
  const domain = cookieDomain(c);
  deleteCookie(c, SESSION_COOKIE, {
    path: "/",
    ...(domain ? { domain } : {}),
  });
}
