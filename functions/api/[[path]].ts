import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import {
  products,
  categories,
  productContent,
  productVariantOptions,
  blogPosts,
} from "@shared/schema";
import { getDb, fixGalleryArrays, type Env } from "../_lib/db";
import { hashPassword, verifyPassword } from "../_lib/password";
import {
  createSession,
  destroySession,
  readSession,
} from "../_lib/sessions";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  toPublicUser,
} from "../_lib/users";

const app = new Hono<{ Bindings: Env }>().basePath("/api");

// ---------- Health / smoke ----------
app.get("/health", (c) =>
  c.json({
    ok: true,
    runtime: "cloudflare-workers",
    time: new Date().toISOString(),
    sessionsKv: !!c.env.SESSIONS,
  })
);

// ---------- Products ----------
app.get("/products", async (c) => {
  try {
    const db = getDb(c.env);
    const categoryId = c.req.query("categoryId");
    const featured = c.req.query("featured");

    let rows;
    if (categoryId) {
      rows = await db.select().from(products).where(eq(products.categoryId, categoryId));
    } else if (featured === "true") {
      rows = await db.select().from(products).where(eq(products.featured, true));
    } else {
      rows = await db.select().from(products);
    }
    const fixed = await fixGalleryArrays(c.env, rows);
    return c.json(fixed);
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
    const fixed = await fixGalleryArrays(c.env, rows);
    return c.json(fixed[0]);
  } catch (err) {
    console.error("GET /api/products/:id failed:", err);
    return c.json({ message: "Failed to fetch product" }, 500);
  }
});

// Search suggestions (must come before /products/:id/* dynamic routes? Hono is path-specific so order is fine)
app.get("/products/search/suggestions", async (c) => {
  try {
    const q = (c.req.query("q") ?? "").toString().toLowerCase().trim();
    const limitRaw = parseInt((c.req.query("limit") ?? "6").toString(), 10);
    const maxResults = Math.min(Number.isFinite(limitRaw) ? limitRaw : 6, 10);
    if (q.length < 2) return c.json([]);

    const db = getDb(c.env);
    const all = await db.select().from(products);

    const scored = all
      .map((p) => {
        let score = 0;
        const name = (p.name ?? "").toLowerCase();
        const brand = (p.brand ?? "").toLowerCase();
        const description = (p.description ?? "").toLowerCase();
        if (name === q) score += 100;
        else if (name.startsWith(q)) score += 50;
        else if (name.includes(q)) score += 30;
        if (brand === q) score += 40;
        else if (brand.startsWith(q)) score += 25;
        else if (brand.includes(q)) score += 15;
        if (description.includes(q)) score += 10;
        if (Array.isArray(p.specs) && p.specs.some((s: string) => (s ?? "").toLowerCase().includes(q))) score += 5;
        if (p.featured && score > 0) score += 5;
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map((x) => ({
        id: x.p.id,
        name: x.p.name,
        brand: x.p.brand,
        imageUrl: x.p.imageUrl,
        pricePerMonth: x.p.pricePerMonth,
        categoryId: x.p.categoryId,
      }));

    return c.json(scored);
  } catch (err) {
    console.error("GET /api/products/search/suggestions failed:", err);
    return c.json({ message: "Failed to search products" }, 500);
  }
});

// Cached AI-generated product content (How It Works, Key Benefits, Specs, etc.)
// AI generation is intentionally NOT performed in the Workers runtime — all
// content is pre-generated and stored in the product_content table.
app.get("/products/:id/content", async (c) => {
  try {
    const db = getDb(c.env);
    const id = c.req.param("id");
    const rows = await db
      .select()
      .from(productContent)
      .where(eq(productContent.productId, id))
      .limit(1);
    if (!rows[0]) {
      return c.json({ message: "Product content not yet generated" }, 404);
    }
    return c.json(rows[0]);
  } catch (err) {
    console.error("GET /api/products/:id/content failed:", err);
    return c.json({ message: "Failed to fetch product content" }, 500);
  }
});

// Product variant options (storage / memory / chip configurator)
app.get("/products/:id/variants", async (c) => {
  try {
    const db = getDb(c.env);
    const id = c.req.param("id");

    const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, id)).limit(1);
    if (!exists[0]) return c.json({ message: "Product not found" }, 404);

    const opts = await db
      .select()
      .from(productVariantOptions)
      .where(eq(productVariantOptions.productId, id))
      .orderBy(asc(productVariantOptions.displayOrder));

    const grouped: Record<
      string,
      Array<{
        id: string;
        label: string;
        value: string;
        priceAdjustment: number;
        isDefault: boolean;
        available: boolean;
        displayOrder: number;
      }>
    > = {};
    for (const o of opts) {
      if (!grouped[o.variantType]) grouped[o.variantType] = [];
      grouped[o.variantType].push({
        id: o.id,
        label: o.optionLabel,
        value: o.optionValue,
        priceAdjustment: parseFloat(o.priceAdjustmentMonthly ?? "0"),
        isDefault: o.isDefault,
        available: o.available,
        displayOrder: o.displayOrder,
      });
    }
    return c.json(grouped);
  } catch (err) {
    console.error("GET /api/products/:id/variants failed:", err);
    return c.json({ message: "Failed to fetch product variants" }, 500);
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

// ---------- Auth ----------
const registerSchema = z.object({
  username: z.string().min(3).max(64),
  email: z.string().email().max(254),
  password: z.string().min(6).max(256),
  fullName: z.string().max(120).optional().nullable(),
});

const loginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(256),
});

app.post("/auth/register", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid registration data" },
        400
      );
    }
    const data = parsed.data;

    if (await getUserByUsername(c.env, data.username)) {
      return c.json({ error: "Username already taken" }, 400);
    }
    if (await getUserByEmail(c.env, data.email)) {
      return c.json({ error: "Email already registered" }, 400);
    }

    const hashed = await hashPassword(data.password);
    const user = await createUser(c.env, {
      username: data.username,
      email: data.email,
      password: hashed,
      fullName: data.fullName ?? null,
    });

    await createSession(c, user.id);
    return c.json({ user: toPublicUser(user) });
  } catch (err: any) {
    console.error("POST /api/auth/register failed:", err);
    // Detect Postgres unique-constraint violations from the race window
    // between our pre-check and the INSERT, and return a stable 400.
    const msg = String(err?.message ?? "");
    const code = String(err?.code ?? "");
    if (code === "23505" || /duplicate key|unique constraint/i.test(msg)) {
      const onEmail = /email/i.test(msg);
      return c.json(
        { error: onEmail ? "Email already registered" : "Username already taken" },
        400
      );
    }
    return c.json({ error: "Registration failed" }, 500);
  }
});

app.post("/auth/login", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const { username, password } = parsed.data;

    const user = await getUserByUsername(c.env, username);
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const result = await verifyPassword(password, user.password);
    if (!result.ok) {
      if (result.reason === "legacy_bcrypt") {
        return c.json(
          {
            error:
              "Your password needs to be reset for our security upgrade. Please use the password reset link to set a new password.",
            code: "PASSWORD_RESET_REQUIRED",
          },
          401
        );
      }
      return c.json({ error: "Invalid credentials" }, 401);
    }

    await createSession(c, user.id);
    return c.json({ user: toPublicUser(user) });
  } catch (err: any) {
    console.error("POST /api/auth/login failed:", err);
    return c.json({ error: "Login failed" }, 500);
  }
});

app.post("/auth/guest", async (c) => {
  try {
    // Generate a random guest username; retry if collides (extremely unlikely).
    let user: Awaited<ReturnType<typeof createUser>> | null = null;
    for (let attempt = 0; attempt < 3 && !user; attempt++) {
      const guestId = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
      const guestUsername = `guest_${guestId}`;
      const guestEmail = `${guestUsername}@guest.rentmygadgets.com`;
      const randomPassword = crypto.randomUUID();
      const hashed = await hashPassword(randomPassword);
      try {
        user = await createUser(c.env, {
          username: guestUsername,
          email: guestEmail,
          password: hashed,
          fullName: "Guest User",
        });
      } catch (e) {
        // Likely unique-constraint collision — retry once or twice.
        if (attempt === 2) throw e;
      }
    }
    if (!user) throw new Error("Could not create guest user");

    await createSession(c, user.id, { isGuest: true });
    return c.json({ user: { ...toPublicUser(user), isGuest: true } });
  } catch (err: any) {
    console.error("POST /api/auth/guest failed:", err);
    return c.json({ error: "Failed to create guest session" }, 500);
  }
});

app.post("/auth/logout", async (c) => {
  try {
    await destroySession(c);
    return c.json({ success: true });
  } catch (err) {
    console.error("POST /api/auth/logout failed:", err);
    return c.json({ success: true });
  }
});

app.get("/auth/me", async (c) => {
  try {
    const session = await readSession(c);
    if (!session) return c.json({ error: "Not authenticated" }, 401);
    const user = await getUserById(c.env, session.userId);
    if (!user) return c.json({ error: "User not found" }, 401);
    // NOTE: matches Express shape — flat user object (not wrapped in `user`).
    // Frontend `auth-context.tsx` checkAuth() does `setUser(userData)` directly.
    return c.json({
      ...toPublicUser(user),
      ...(session.isGuest ? { isGuest: true } : {}),
    });
  } catch (err) {
    console.error("GET /api/auth/me failed:", err);
    return c.json({ error: "Failed to load session" }, 500);
  }
});

// ---------- Blog ----------
app.get("/blog", async (c) => {
  try {
    const db = getDb(c.env);
    const category = c.req.query("category");
    const rows = category
      ? await db.select().from(blogPosts).where(eq(blogPosts.category, category as string))
      : await db.select().from(blogPosts);
    return c.json(rows);
  } catch (err) {
    console.error("GET /api/blog failed:", err);
    return c.json({ message: "Failed to fetch blog posts" }, 500);
  }
});

app.get("/blog/:slug", async (c) => {
  try {
    const db = getDb(c.env);
    const slug = c.req.param("slug");
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (!rows[0]) return c.json({ message: "Blog post not found" }, 404);
    return c.json(rows[0]);
  } catch (err) {
    console.error("GET /api/blog/:slug failed:", err);
    return c.json({ message: "Failed to fetch blog post" }, 500);
  }
});

// ---------- Catch-all for not-yet-ported endpoints ----------
app.all("*", (c) =>
  c.json(
    {
      message:
        "This endpoint is not yet available on the Cloudflare Workers backend. Phase 2 ports read-only product/category routes and auth. Cart, orders, and admin land in Phase 3.",
      path: c.req.path,
    },
    501
  )
);

export const onRequest = handle(app);
