# Cloudflare Pages Deployment — RentMyGadgets

> **Status: Phase 1 of 5 complete** — read-only product/category API ported.
> Auth, cart, orders, and SEO injector still served by the old Express
> backend; do not switch DNS to Cloudflare Pages until all phases are done.
> See `.local/session_plan.md` for phase plan.

This is the in-progress migration from Express on Vercel → Cloudflare Pages
+ Pages Functions (Workers runtime).

## Architecture

```
rentmygadgets.com
        │
        ▼
Cloudflare DNS + CDN
        │
        ▼
Cloudflare Pages           ←  static SPA from dist/public/
        │
        ▼
/api/* → Pages Functions    ←  functions/api/[[path]].ts (Hono)
        │
        ▼
Neon Postgres (HTTP)
```

## Local development

```bash
# 1. Build the SPA
npx vite build

# 2. Run Wrangler dev server (serves SPA + invokes functions for /api/*)
npx wrangler pages dev dist/public \
  --compatibility-date=2025-01-01 \
  --compatibility-flag=nodejs_compat
```

Then visit:
- `http://localhost:8788/` — SPA
- `http://localhost:8788/api/health` — should return `{"ok":true,...}`
- `http://localhost:8788/api/products` — list of products from Neon

`DATABASE_URL` must be set in your shell or in `.dev.vars` (gitignored) for
the dev server to talk to Neon.

## Production deploy (one-time setup)

### 1. Create the Pages project
- Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
- Repo: `developeragency5/RentMyGadgets`, branch: `main`
- Framework preset: **None**
- Build command: `vite build`
- Build output directory: `dist/public`
- Root directory: `/` (default)

### 2. Environment variables (Settings → Variables and Secrets → Production)
| Name | Value |
|---|---|
| `DATABASE_URL` | Your Neon HTTP connection string |
| `SESSION_SECRET` | Random 32+ char string (Phase 2) |
| `COOKIE_DOMAIN` | `.rentmygadgets.com` (Phase 2) |
| `GEMINI_API_KEY` | Optional, for AI content (Phase 4) |

### 3. KV namespace for sessions (Phase 2)
- Cloudflare dashboard → **Storage & Databases** → **KV** → **Create namespace** → name `rentmygadgets-sessions`
- Pages project → **Settings** → **Functions** → **KV namespace bindings**
  - Variable name: `SESSIONS`
  - KV namespace: `rentmygadgets-sessions`

### 4. Custom domain
- Pages project → **Custom domains** → **Set up a custom domain**
- Add `rentmygadgets.com` and `www.rentmygadgets.com`
- Cloudflare auto-provisions the DNS records (CNAME) since the zone is
  already on Cloudflare — just click confirm

### 5. Smoke test
```bash
curl https://rentmygadgets.com/api/health
curl https://rentmygadgets.com/api/products | head -c 200
```

## What's ported in Phase 1

| Endpoint | Status |
|---|---|
| `GET /api/health` | ✅ Works |
| `GET /api/products` | ✅ Works |
| `GET /api/products/:id` | ✅ Works |
| `GET /api/categories` | ✅ Works |
| `GET /api/categories/:id` | ✅ Works |
| Everything else | ❌ Returns `501 Not Implemented` until ported |

## Files

- `functions/api/[[path]].ts` — Hono router, all `/api/*` requests land here
- `functions/_lib/db.ts` — Neon HTTP + Drizzle helper
- `functions/_middleware.ts` — security headers + error envelope
- `client/public/_routes.json` — tells Pages: only invoke functions for `/api/*`
- `wrangler.toml` — local dev config + binding documentation

## Why we're not deploying yet

Phase 1 ships only read endpoints. **Login, cart, checkout, and admin still
return 501** on the Pages backend. The current production traffic should
continue going to the existing Vercel/Replit backend until Phase 4 finishes
and we've smoke-tested the full purchase flow on the Pages preview URL.
