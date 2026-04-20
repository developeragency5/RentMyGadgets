import type { Plugin } from "vite";
import { cp, stat } from "fs/promises";
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
 */
export function copyAssetsPlugin(): Plugin {
  const root = path.resolve(import.meta.dirname);

  async function copyIfExists(src: string, dest: string) {
    try {
      await stat(src);
    } catch (e: any) {
      if (e?.code === "ENOENT") return;
      throw e;
    }
    await cp(src, dest, { recursive: true, force: false, errorOnExist: false });
    console.log(`[copy-assets] ${path.relative(root, src)} -> ${path.relative(root, dest)}`);
  }

  return {
    name: "rmg-copy-assets",
    apply: "build",
    async closeBundle() {
      const outDir = path.resolve(root, "dist/public");
      await copyIfExists(path.resolve(root, "public"), outDir);
      await copyIfExists(path.resolve(root, "attached_assets"), path.join(outDir, "attached_assets"));
      await copyIfExists(path.resolve(root, "attached_assets/stock_images"), path.join(outDir, "stock_images"));
    },
  };
}
