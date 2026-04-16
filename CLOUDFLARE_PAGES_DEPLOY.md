# Cloudflare Pages Deployment — RentMyGadgets

> **Status: Phase 2 of 5 complete** — read-only product/category API + full
> auth flow (register/login/logout/guest/me) ported.
> Cart, orders, checkout, SEO injector, and admin still served by the old
> Express backend; do not switch DNS to Cloudflare Pages until all phases
> are done. See `.local/session_plan.md` for phase plan.

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
        ├──────────► Neon Postgres (HTTP driver)
        │
        └──────────► Cloudflare KV (SESSIONS namespace)
```

## Local development

```bash
# 1. Build the SPA
npx vite build

# 2. Run Wrangler dev server (serves SPA + invokes functions for /api/*)
npx wrangler pages dev dist/public \
  --compatibility-date=2025-01-01 \
  --compatibility-flag=nodejs_compat \
  --kv SESSIONS
```

Then visit:
- `http://localhost:8788/` — SPA
- `http://localhost:8788/api/health` — should return `{"ok":true,"sessionsKv":true,...}`
- `http://localhost:8788/api/products` — list of products from Neon

`DATABASE_URL` must be set in `.dev.vars` (gitignored — copy from
`.dev.vars.example`) for the dev server to talk to Neon.

## Production deploy (one-time setup)

### 1. Create the Pages project
- Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
- Repo: `developeragency5/RentMyGadgets`, branch: `main`
- Framework preset: **None**
- Build command: `vite build`
- Build output directory: `dist/public`
- Root directory: `/` (default)

### 2. Environment variables (Settings → Variables and Secrets)
Add as **Secrets** (not plain env vars) so values are encrypted:

| Name | Required for | Value |
|---|---|---|
| `DATABASE_URL` | Phase 1+ | Your Neon HTTP connection string (use the **pooled** endpoint, with `?sslmode=require`) |
| `COOKIE_DOMAIN` | After custom domain | `.rentmygadgets.com` — leave **unset** while testing on `.pages.dev` |
| `GEMINI_API_KEY` | Phase 4+ | Optional, for AI content generation |

> ⚠️ Adding/changing secrets only takes effect on the next build.
> Trigger a redeploy: **Deployments → ⋯ → Retry deployment**.

### 3. KV namespace for sessions (Phase 2 — required for auth)
1. Cloudflare dashboard → **Storage & Databases** → **KV** → **Create namespace**
   - Name: `rentmygadgets-sessions`
2. Pages project → **Settings** → **Functions** → **KV namespace bindings** → **Add binding**
   - Variable name: `SESSIONS` *(must be exactly this — case-sensitive)*
   - KV namespace: `rentmygadgets-sessions`
   - Apply to: **Production** (and Preview if you want preview deploys to work)
3. **Trigger a new deployment** so the binding takes effect.

Verify with: `curl https://rentmygadgets.pages.dev/api/health` — response
should include `"sessionsKv": true`. If it shows `false`, the binding isn't
attached to the deployment.

### 4. Custom domain
- Pages project → **Custom domains** → **Set up a custom domain**
- Add `rentmygadgets.com` and `www.rentmygadgets.com`
- Cloudflare auto-provisions the DNS records (CNAME) since the zone is
  already on Cloudflare — just click confirm
- After the domain is live, set `COOKIE_DOMAIN=.rentmygadgets.com` and
  redeploy so sessions work across the apex + www subdomain.

### 5. Smoke test
```bash
curl https://rentmygadgets.com/api/health
curl https://rentmygadgets.com/api/products | head -c 200
```

## What's ported

| Endpoint | Phase | Status |
|---|---|---|
| `GET /api/health` | 1 | ✅ |
| `GET /api/products` | 1 | ✅ |
| `GET /api/products/:id` | 1 | ✅ |
| `GET /api/categories` | 1 | ✅ |
| `GET /api/categories/:id` | 1 | ✅ |
| `POST /api/auth/register` | 2 | ✅ |
| `POST /api/auth/login` | 2 | ✅ |
| `POST /api/auth/logout` | 2 | ✅ |
| `POST /api/auth/guest` | 2 | ✅ |
| `GET /api/auth/me` | 2 | ✅ |
| `/api/cart/*`, `/api/orders/*`, `/api/pricing/cart` | 3 | ⏳ Returns 501 |
| SEO meta tag injection, sitemap.xml, robots.txt | 4 | ⏳ Returns 501 |
| `/api/admin/*` | 4 | ⏳ Returns 501 |
| Image sync, AI image gen, scheduler | — | ❌ Won't run on Workers |

## Existing user passwords (one-time migration)

Production Neon stores passwords hashed with **bcrypt**, which cannot run on
Cloudflare Workers. The new auth uses **PBKDF2** (Web Crypto). When an
existing user attempts to log in:

```json
{
  "error": "Your password needs to be reset for our security upgrade. ...",
  "code": "PASSWORD_RESET_REQUIRED"
}
```

The frontend should detect `code: "PASSWORD_RESET_REQUIRED"` and route the
user into a password reset flow. New registrations and any password reset
will write a PBKDF2 hash going forward.

## Files

- `functions/api/[[path]].ts` — Hono router, all `/api/*` requests land here
- `functions/_lib/db.ts` — Neon HTTP + Drizzle helper
- `functions/_lib/password.ts` — PBKDF2 hash/verify (bcrypt detected & rejected)
- `functions/_lib/sessions.ts` — KV-backed session store + cookie helpers
- `functions/_lib/users.ts` — User table queries
- `functions/_middleware.ts` — security headers + error envelope
- `client/public/_routes.json` — tells Pages: only invoke functions for `/api/*`
- `wrangler.toml` — local dev config + binding documentation
- `.dev.vars.example` — template for local secrets

## Why we're not switching DNS yet

Phase 2 ships read endpoints + auth. **Cart, checkout, and admin still
return 501** on the Pages backend. Production traffic should continue
going to the existing Vercel/Replit backend until Phase 4 finishes and
we've smoke-tested the full purchase flow on the Pages preview URL.
