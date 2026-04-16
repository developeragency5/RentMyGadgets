# Cloudflare Deployment Guide

## Architecture
- **DNS + SSL + CDN**: Cloudflare (your domain `rentmygadgets.com` lives here)
- **App hosting**: Vercel (or Render as a fallback) — serves the Express + React app
- **Database**: Neon Postgres (already configured)

Traffic flow: `user → Cloudflare → Vercel → Neon`

---

## Step 1 — Confirm the Vercel deploy is green

1. Open https://vercel.com/dashboard → your `RentMyGadgets` project → **Deployments** tab.
2. The latest deployment (commit on `main`) should show **Ready**.
3. Open its preview URL (something like `rent-my-gadgets-xyz.vercel.app`).
4. Test:
   - Homepage loads with products
   - `/api/products` returns JSON
   - Login works

> If the latest deployment is still failing on Vercel after multiple attempts, the fallback is to deploy to Render (Express + Neon work natively on Render's web service tier without code changes). The same Cloudflare DNS steps below apply — just point the records at the Render-provided target instead of the Vercel one.

## Note on CORS

This deployment is **same-origin**: the React frontend and the Express API are both served from `rentmygadgets.com` (the SPA is served as static files; `/api/*` paths are routed to the function via `vercel.json` rewrites). Browsers therefore never trigger a cross-origin preflight, so no `cors` middleware is required. If you later move the API to a separate subdomain (e.g. `api.rentmygadgets.com`), you'll need to add `cors` middleware with an allowlist of `https://rentmygadgets.com` and `https://www.rentmygadgets.com`, plus `credentials: true` so cookies are sent.

## Step 2 — Set environment variables on Vercel

In **Project Settings → Environment Variables**, add these for **Production**:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `SESSION_SECRET` | Any random 32+ char string |
| `NODE_ENV` | `production` |
| `COOKIE_DOMAIN` | `.rentmygadgets.com` |
| `GEMINI_API_KEY` | (if you want AI content generation) |

After adding, click **Redeploy** on the latest deployment.

## Step 3 — Add custom domain on Vercel

1. Vercel project → **Settings → Domains**.
2. Type `rentmygadgets.com` → **Add**. Pick "Add domain".
3. Type `www.rentmygadgets.com` → **Add**. Set it to **redirect to `rentmygadgets.com`**.
4. Vercel will show DNS records to add. **Copy them** — typically:
   - For apex (`rentmygadgets.com`): an `A` record `76.76.21.21`
   - For `www`: a `CNAME` to `cname.vercel-dns.com`

Leave the Vercel page open. You'll come back after step 5.

## Step 4 — Configure Cloudflare DNS

1. Open https://dash.cloudflare.com → click `rentmygadgets.com` → **DNS → Records**.
2. **Delete any existing A/AAAA/CNAME records** for `@` and `www` (don't touch MX, TXT, NS).
3. Add the records Vercel gave you:

| Type | Name | Content | Proxy status |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | **Proxied (orange cloud)** |
| `CNAME` | `www` | `cname.vercel-dns.com` | **Proxied (orange cloud)** |

Click **Save** on each.

## Step 5 — Cloudflare SSL/TLS settings

1. Sidebar → **SSL/TLS → Overview**.
2. Set encryption mode to **Full (strict)**. This makes Cloudflare validate Vercel's certificate (Vercel issues a real cert from Let's Encrypt automatically).

3. Sidebar → **SSL/TLS → Edge Certificates**.
4. Enable:
   - ✅ **Always Use HTTPS**
   - ✅ **Automatic HTTPS Rewrites**
   - ✅ **HSTS** (start with 6 months, no preload until you're sure)

## Step 6 — Verify on Vercel side

Go back to Vercel → **Settings → Domains**. Within 1–5 minutes the status should change from "Invalid Configuration" to **Valid Configuration** with a green check.

If it stays invalid after 10 minutes:
- Check that Cloudflare proxy is **on** (orange cloud).
- Try toggling proxy off (gray cloud), wait 2 minutes for Vercel to issue cert, then turn it back on. Vercel sometimes can't issue a cert through Cloudflare's proxy on first attempt.

## Step 7 — Smoke test production

Open in a fresh browser (Incognito):
- ✅ https://rentmygadgets.com loads with full app
- ✅ https://www.rentmygadgets.com redirects to apex
- ✅ Browse products → click into a product → see images and pricing
- ✅ Sign up / log in → check session persists across page reloads
- ✅ Add to cart → refresh → cart is still there
- ✅ Visit `https://rentmygadgets.com/sitemap.xml` → see XML
- ✅ Visit `https://rentmygadgets.com/robots.txt` → see correct robots
- ✅ Open DevTools → Application → Cookies → `session_id` should have **Domain `.rentmygadgets.com`**

## Step 8 — Cloudflare cache rules (optional but recommended)

Cloudflare Dashboard → **Caching → Cache Rules** → **Create rule**:

**Rule 1 — Cache static assets aggressively:**
- If: URI Path matches `/assets/*` or `/images/*`
- Then: **Eligible for cache**, Edge TTL = **1 month**

**Rule 2 — Bypass cache for API and auth:**
- If: URI Path matches `/api/*` or `/dashboard*` or `/checkout*` or `/cart*`
- Then: **Bypass cache**

This keeps API responses fresh while letting Cloudflare CDN cache product images and JS bundles globally.

---

## Troubleshooting

**"Too many redirects"** → SSL/TLS mode is wrong. Set it to **Full (strict)**, not Flexible.

**Login fails / cookie not set** → Check `COOKIE_DOMAIN=.rentmygadgets.com` is set on Vercel and you redeployed. Check DevTools Network tab for the `Set-Cookie` header on `/api/auth/login`.

**API returns 404 on `/api/*`** → Check `vercel.json` rewrites and that the latest commit deployed. Open `https://rentmygadgets.com/api/products` directly.

**"DNS_PROBE_FINISHED_NXDOMAIN"** → DNS hasn't propagated yet. Wait 5–10 minutes.
