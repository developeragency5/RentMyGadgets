import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { eq } from "drizzle-orm";
import { products, categories } from "@shared/schema";
import { getDb, type Env } from "../_lib/db";

const app = new Hono<{ Bindings: Env }>().basePath("/api");

// ---------- Health / smoke ----------
app.get("/health", (c) =>
  c.json({ ok: true, runtime: "cloudflare-workers", time: new Date().toISOString() })
);

// ---------- Products ----------
app.get("/products", async (c) => {
  try {
    const db = getDb(c.env);
    const rows = await db.select().from(products);
    return c.json(rows);
  } catch (err) {
    console.error("GET /api/products failed:", err);
    return c.json({ message: "Failed to fetch products" }, 500);
  }
});

app.get("/products/:id", async (c) => {
  try {
    const db = getDb(c.env);
    const id = c.req.param("id");
    const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!rows[0]) return c.json({ message: "Product not found" }, 404);
    return c.json(rows[0]);
  } catch (err) {
    console.error("GET /api/products/:id failed:", err);
    return c.json({ message: "Failed to fetch product" }, 500);
  }
});

// ---------- Categories ----------
app.get("/categories", async (c) => {
  try {
    const db = getDb(c.env);
    const rows = await db.select().from(categories);
    return c.json(rows);
  } catch (err) {
    console.error("GET /api/categories failed:", err);
    return c.json({ message: "Failed to fetch categories" }, 500);
  }
});

app.get("/categories/:id", async (c) => {
  try {
    const db = getDb(c.env);
    const id = c.req.param("id");
    const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (!rows[0]) return c.json({ message: "Category not found" }, 404);
    return c.json(rows[0]);
  } catch (err) {
    console.error("GET /api/categories/:id failed:", err);
    return c.json({ message: "Failed to fetch category" }, 500);
  }
});

// ---------- Catch-all for not-yet-ported endpoints ----------
app.all("*", (c) =>
  c.json(
    {
      message:
        "This endpoint is not yet available on the Cloudflare Workers backend. Phase 1 only ports read-only product/category routes.",
      path: c.req.path,
    },
    501
  )
);

export const onRequest = handle(app);
