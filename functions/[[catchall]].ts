// Catch-all HTML handler. For any non-API, non-asset request that reaches
// Pages Functions, take the build-time embedded `index.html` shell, inject
// route-specific SEO/meta/JSON-LD/body content, and return the rewritten
// HTML. This eliminates the empty-shell cloaking risk for ad-platform
// crawlers that don't execute JavaScript.
//
// Routing is configured in `client/public/_routes.json` so that:
//   * `/api/*`    → handled by `functions/api/[[path]].ts`
//   * `/sitemap.xml` → handled by `functions/sitemap.xml.ts`
//   * Static assets (CSS/JS/images/icons/favicons) → bypass functions entirely
//   * Everything else → reaches this catch-all
//
// The HTML shell is embedded at build time by `script/build.ts` into
// `functions/_lib/html-shell.generated.ts` (a TypeScript module). Embedding
// avoids a per-request `env.ASSETS.fetch('/index.html')` round trip and
// guarantees the shell version matches the deployed bundle. If the shell
// constant is empty (e.g. in a fresh checkout before the first build) we
// fall back to ASSETS.fetch so local dev still serves something usable.
import type { Env } from "./_lib/db";
import { getMetaForUrl, injectMeta } from "./_lib/seo";
import { HTML_SHELL } from "./_lib/html-shell.generated";

async function loadShell(env: Env, origin: string): Promise<string> {
  if (HTML_SHELL && HTML_SHELL.length > 0) {
    return HTML_SHELL;
  }
  // Build-time shell wasn't generated (placeholder). Fall back to the
  // static asset binding so we still produce a valid response.
  const res = await env.ASSETS.fetch(`${origin}/index.html`);
  if (!res.ok) {
    throw new Error(`Failed to fetch index.html shell: ${res.status}`);
  }
  return res.text();
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
    // Only emit X-Robots-Tag for explicit noindex routes — leaving it off
    // for public pages keeps default crawler behavior and avoids forcing
    // index semantics we may want to override later.
    if (meta.noindex) {
      headers["X-Robots-Tag"] = "noindex, nofollow";
    }

    return new Response(html, { status: 200, headers });
  } catch (err) {
    console.error("Catch-all SEO inject failed:", err);
    // On failure, fall back to the unmodified static shell so the site
    // still works for end users. Always serve /index.html — the original
    // request path may not map to any static file (e.g. /product/:id).
    return env.ASSETS.fetch(`${url.origin}/index.html`);
  }
};
