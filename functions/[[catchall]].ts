// Catch-all HTML handler. For any non-API, non-asset request that reaches
// Pages Functions, fetch the Vite-built `index.html` shell from the static
// asset bundle (`env.ASSETS`), inject route-specific SEO/meta/JSON-LD/body
// content, and return the rewritten HTML. This eliminates the empty-shell
// cloaking risk for ad-platform crawlers that don't execute JavaScript.
//
// Routing is configured in `client/public/_routes.json` so that:
//   * `/api/*`    → handled by `functions/api/[[path]].ts`
//   * `/sitemap.xml` → handled by `functions/sitemap.xml.ts`
//   * Static assets (CSS/JS/images/icons/favicons) → bypass functions entirely
//   * Everything else → reaches this catch-all
import type { Env } from "./_lib/db";
import { getMetaForUrl, injectMeta } from "./_lib/seo";

// Module-level cache of the index.html shell. It's invariant per deploy, so
// caching it for the lifetime of the isolate avoids ASSETS round-trips on
// every page request.
let cachedShell: string | null = null;
let cachedShellTime = 0;
const SHELL_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function loadShell(env: Env, origin: string): Promise<string> {
  const now = Date.now();
  if (cachedShell && now - cachedShellTime < SHELL_TTL_MS) {
    return cachedShell;
  }
  const res = await env.ASSETS.fetch(`${origin}/index.html`);
  if (!res.ok) {
    throw new Error(`Failed to fetch index.html shell: ${res.status}`);
  }
  cachedShell = await res.text();
  cachedShellTime = now;
  return cachedShell;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Only intercept GET/HEAD page navigations. POST/PUT/etc. shouldn't hit a
  // catch-all in the SPA, but be defensive.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return env.ASSETS.fetch(request);
  }

  try {
    const shell = await loadShell(env, url.origin);
    const meta = await getMetaForUrl(env, url.pathname);
    const html = await injectMeta(env, shell, meta, url.pathname);

    const headers: Record<string, string> = {
      "Content-Type": "text/html; charset=utf-8",
      // Short edge cache; long browser cache disabled so per-route meta
      // updates take effect quickly.
      "Cache-Control": "public, max-age=0, s-maxage=300, must-revalidate",
    };
    // Only emit X-Robots-Tag for explicit noindex routes — leaving it off for
    // public pages keeps default crawler behavior and avoids forcing index
    // semantics we may want to override later.
    if (meta.noindex) {
      headers["X-Robots-Tag"] = "noindex, nofollow";
    }

    return new Response(html, { status: 200, headers });
  } catch (err) {
    console.error("Catch-all SEO inject failed:", err);
    // On failure, fall back to the unmodified static shell so the site still
    // works for end users. Always serve /index.html — the original request
    // path may not map to any static file (e.g. /product/:id).
    return env.ASSETS.fetch(`${url.origin}/index.html`);
  }
};
