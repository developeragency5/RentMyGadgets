import { eq } from "drizzle-orm";
import { products, categories, blogPosts } from "@shared/schema";
import { getDb, fixGalleryArrays, type Env } from "./_lib/db";

const BASE_URL = "https://www.rentmygadgets.com";

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
  { loc: "/office-printer-rentals", priority: "0.8", changefreq: "monthly" },
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
  { loc: "/collections/office-printers", priority: "0.8", changefreq: "weekly" },
  { loc: "/collections/laser-printers", priority: "0.8", changefreq: "weekly" },
  { loc: "/collections/color-laser-printers", priority: "0.8", changefreq: "weekly" },
  { loc: "/collections/small-office-printers", priority: "0.8", changefreq: "weekly" },
];

function escXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildProductImageTags(prod: any): string {
  const images: string[] = [];
  if (prod.imageUrl) {
    const abs = prod.imageUrl.startsWith("http") ? prod.imageUrl : `${BASE_URL}${prod.imageUrl}`;
    images.push(abs);
  }
  const gallery = (prod.galleryImageUrls || []) as string[];
  for (const url of gallery) {
    const abs = url.startsWith("http") ? url : `${BASE_URL}${url}`;
    if (!images.includes(abs)) images.push(abs);
  }
  if (images.length === 0) return "";
  const nameStartsWithBrand = prod.brand && prod.name.toLowerCase().startsWith(prod.brand.toLowerCase());
  const brandPart = (prod.brand && !nameStartsWithBrand) ? `${prod.brand} ` : "";
  return images
    .map((imgUrl) => {
      const title = escXml(`${brandPart}${prod.name} - Rent from RentMyGadgets`);
      return `    <image:image>
      <image:loc>${escXml(imgUrl)}</image:loc>
      <image:title>${title}</image:title>
    </image:image>`;
    })
    .join("\n");
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const db = getDb(context.env);
    const today = new Date().toISOString().split("T")[0];

    const [allCategories, allProductRows, posts] = await Promise.all([
      db.select({ id: categories.id }).from(categories),
      db
        .select({
          id: products.id,
          name: products.name,
          brand: products.brand,
          imageUrl: products.imageUrl,
          galleryImageUrls: products.galleryImageUrls,
        })
        .from(products),
      db
        .select({ slug: blogPosts.slug })
        .from(blogPosts)
        .where(eq(blogPosts.published, true)),
    ]);

    const allProducts = await fixGalleryArrays(context.env, allProductRows);

    const productImageMap = new Map<string, any>();
    for (const prod of allProducts) {
      productImageMap.set(`/product/${prod.slug || prod.id}`, prod);
    }

    const allPages = [
      ...STATIC_PAGES,
      ...allCategories.map((c) => ({ loc: `/categories/${c.id}`, priority: "0.8", changefreq: "daily" })),
      ...allProducts.map((p) => ({ loc: `/product/${p.slug || p.id}`, priority: "0.7", changefreq: "weekly" })),
      ...posts.map((p) => ({ loc: `/blog/${p.slug}`, priority: "0.6", changefreq: "monthly" })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages
  .map((page) => {
    const prod = productImageMap.get(page.loc);
    const imageTags = prod ? buildProductImageTags(prod) : "";
    return `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${imageTags}  </url>`;
  })
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
