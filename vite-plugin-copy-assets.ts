import type { Plugin } from "vite";
import { mkdir, readdir, copyFile, stat } from "fs/promises";
import path from "path";

/**
 * Copies workspace asset folders into Vite's outDir at the end of `vite build`.
 *
 * Vite's `root` is `client/`, so its default `publicDir` only picks up
 * `client/public/`. The deployed app also references files under:
 *   - `public/`               → static product images (`/images/...`)
 *   - `attached_assets/`      → uploaded media (`/attached_assets/...`)
 *   - `attached_assets/stock_images/` → category cards (`/stock_images/...`)
 *
 * Without this plugin those folders never reach the deploy bundle on
 * Cloudflare Pages and the catch-all SPA function returns the HTML shell
 * for those URLs instead of the file (broken images on the live site).
 *
 * IMPORTANT: only image-type files are copied. Zips/parts/dumps in
 * attached_assets exceed Cloudflare Pages' 25 MB per-file limit and would
 * cause the entire deploy to fail.
 */
const ALLOWED_EXT = new Set([
  ".webp", ".jpg", ".jpeg", ".png", ".avif", ".gif", ".svg", ".ico",
  ".json", ".xml", ".txt", ".webmanifest", ".js", ".css", ".woff", ".woff2",
  ".ttf", ".otf", ".mp4", ".webm",
]);
const MAX_FILE_BYTES = 24 * 1024 * 1024; // stay under Cloudflare's 25 MB limit

export function copyAssetsPlugin(): Plugin {
  const root = path.resolve(import.meta.dirname);

  async function copyTree(src: string, dest: string, stats: { copied: number; skipped: number; tooBig: string[] }) {
    let entries;
    try {
      entries = await readdir(src, { withFileTypes: true });
    } catch (e: any) {
      if (e?.code === "ENOENT") return;
      throw e;
    }
    await mkdir(dest, { recursive: true });
    for (const entry of entries) {
      const s = path.join(src, entry.name);
      const d = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyTree(s, d, stats);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        stats.skipped++;
        continue;
      }
      const st = await stat(s);
      if (st.size > MAX_FILE_BYTES) {
        stats.tooBig.push(`${path.relative(root, s)} (${(st.size / 1024 / 1024).toFixed(1)} MB)`);
        continue;
      }
      await copyFile(s, d);
      stats.copied++;
    }
  }

  return {
    name: "rmg-copy-assets",
    apply: "build",
    async closeBundle() {
      const outDir = path.resolve(root, "dist/public");
      const sources: Array<[string, string]> = [
        [path.resolve(root, "public"), outDir],
        [path.resolve(root, "attached_assets"), path.join(outDir, "attached_assets")],
        [path.resolve(root, "attached_assets/stock_images"), path.join(outDir, "stock_images")],
      ];
      for (const [src, dest] of sources) {
        const stats = { copied: 0, skipped: 0, tooBig: [] as string[] };
        await copyTree(src, dest, stats);
        console.log(
          `[copy-assets] ${path.relative(root, src)} -> ${path.relative(root, dest)}: ` +
            `${stats.copied} files copied, ${stats.skipped} non-asset skipped, ${stats.tooBig.length} oversized`,
        );
        if (stats.tooBig.length > 0) {
          console.log(`[copy-assets] oversized (>${MAX_FILE_BYTES / 1024 / 1024}MB) skipped:`);
          for (const f of stats.tooBig) console.log(`[copy-assets]   - ${f}`);
        }
      }
    },
  };
}
