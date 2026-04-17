// Dynamic sitemap.xml — generated from the live database on each request.
// Mirrors the structure of the Express implementation in `server/routes.ts`.
import { eq } from "drizzle-orm";
import { products, categories, blogPosts } from "@shared/schema";
import { getDb, type Env } from "./_lib/db";

const BASE_URL = "https://rentmygadgets.com";

const STATIC_PAGES: { loc: string; priority: string; changefreq: string }[] = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/categories", priority: "0.9", changefreq: "daily" },
  { loc: "/products", priority: "0.9", changefreq: "daily" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/how-it-works", priority: "0.8", changefreq: "monthly" },
  { loc: "/rent-to-own", priority: "0.8", changefreq: "monthly" },
  { loc: "/gadgetcare", priority: "0.8", changefreq: "monthly" },
  { loc: "/search", priority: "0.7", changefreq: "daily" },
  { loc: "/compare", priority: "0.6", changefreq: "monthly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
  { loc: "/rental-policy", priority: "0.5", changefreq: "yearly" },
  { loc: "/return-policy", priority: "0.5", changefreq: "yearly" },
  { loc: "/shipping-policy", priority: "0.5", changefreq: "yearly" },
  { loc: "/damage-policy", priority: "0.5", changefreq: "yearly" },
  { loc: "/security-deposit", priority: "0.4", changefreq: "yearly" },
  { loc: "/cookies", priority: "0.3", changefreq: "yearly" },
  { loc: "/do-not-sell", priority: "0.3", changefreq: "yearly" },
  { loc: "/accessibility", priority: "0.3", changefreq: "yearly" },
  { loc: "/advertising-disclosure", priority: "0.3", changefreq: "yearly" },
];

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const db = getDb(context.env);
    const today = new Date().toISOString().split("T")[0];

    const [allCategories, allProducts, posts] = await Promise.all([
      db.select({ id: categories.id }).from(categories),
      db.select({ id: products.id }).from(products),
      db
        .select({ slug: blogPosts.slug })
        .from(blogPosts)
        .where(eq(blogPosts.published, true)),
    ]);

    const allPages = [
      ...STATIC_PAGES,
      ...allCategories.map(c => ({ loc: `/categories/${c.id}`, priority: "0.8", changefreq: "daily" })),
      ...allProducts.map(p => ({ loc: `/product/${p.id}`, priority: "0.7", changefreq: "weekly" })),
      ...posts.map(p => ({ loc: `/blog/${p.slug}`, priority: "0.6", changefreq: "monthly" })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    return new Response("Error generating sitemap", { status: 500 });
  }
};
