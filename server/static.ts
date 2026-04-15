import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getMetaForUrl, injectMeta } from "./seo-injector";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexHtml = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  app.use(express.static(distPath, { index: false }));

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const meta = await getMetaForUrl(url);
      const page = await injectMeta(indexHtml, meta, url);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      console.error("[seo-injector] Error injecting meta for", url, e);
      res.status(200).set({ "Content-Type": "text/html" }).end(indexHtml);
    }
  });
}
