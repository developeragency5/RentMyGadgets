// Catch-all HTML handler for Cloudflare Pages.
// Injects per-route SEO/meta/JSON-LD/body content into the build-time
// embedded index.html shell. /api/*, /sitemap.xml, and static assets bypass
// this via client/public/_routes.json.
import type { Env } from "./_lib/db";
import { getMetaForUrl, injectMeta } from "./_lib/seo";
import { HTML_SHELL } from "./_lib/html-shell.generated";

async function loadShell(env: Env, origin: string): Promise<string> {
  if (HTML_SHELL && HTML_SHELL.length > 0) return HTML_SHELL;
  // Placeholder shell (fresh checkout, build hasn't run yet).
  const res = await env.ASSETS.fetch(`${origin}/index.html`);
  if (!res.ok) throw new Error(`Failed to fetch index.html shell: ${res.status}`);
  return res.text();
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return env.ASSETS.fetch(request);
  }

  try {
    const shell = await loadShell(env, url.origin);
    const meta = await getMetaForUrl(env, url.pathname);
    const html = await injectMeta(env, shell, meta, url.pathname);

    const headers: Record<string, string> = {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, must-revalidate",
    };
    if (meta.noindex) headers["X-Robots-Tag"] = "noindex, nofollow";

    return new Response(html, { status: 200, headers });
  } catch (err) {
    console.error("Catch-all SEO inject failed:", err);
    // Fall back to /index.html (not request.url — dynamic SPA routes
    // don't map to a static file).
    return env.ASSETS.fetch(`${url.origin}/index.html`);
  }
};
