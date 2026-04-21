import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import fs from "fs";
import path from "path";

neonConfig.webSocketConstructor = ws;

const IMAGES_DIR = path.join(process.cwd(), "public/images/products");

const VIEW_SUFFIXES = [
  "-product-photo", "-front-view", "-back-view", "-side-view",
  "-angle-view", "-top-view", "-open-view", "-color-options",
  "-complete-kit", "-carrying-case", "-ports-detail", "-lifestyle",
  "-app-companion", "-display-view", "-keyboard", "-screen",
];

function extractProductSlug(fileName: string): string {
  const baseName = fileName.replace(/\.(webp|jpg|png)$/i, "");
  for (const vs of VIEW_SUFFIXES) {
    if (baseName.endsWith(vs)) return baseName.slice(0, -vs.length);
  }
  const galleryMatch = baseName.match(/^(.+)-gallery-view-\d+$/);
  if (galleryMatch) return galleryMatch[1];
  const underscoreMatch = baseName.match(/^(.+)_(detail|white|black|front|side|back|angle)$/);
  if (underscoreMatch) return underscoreMatch[1];
  return baseName;
}

function sortGalleryUrls(urls: string[]): string[] {
  const order = [
    "-product-photo", "-front-view", "-angle-view", "-side-view",
    "-back-view", "-top-view", "-open-view", "-display-view",
    "-keyboard", "-ports-detail", "-color-options", "-lifestyle",
    "-app-companion", "-complete-kit", "-carrying-case",
  ];
  return urls.sort((a, b) => {
    const getOrder = (url: string) => {
      for (let i = 0; i < order.length; i++) {
        if (url.includes(order[i])) return i;
      }
      const gm = url.match(/gallery-view-(\d+)/);
      if (gm) return 100 + parseInt(gm[1]);
      return 50;
    };
    return getOrder(a) - getOrder(b);
  });
}

async function populateGalleryImages() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const client = await pool.connect();

  try {
    const { rows: allProducts } = await client.query(
      "SELECT id, name, brand, image_url, gallery_image_urls FROM products"
    );
    console.log(`Found ${allProducts.length} products`);

    let updated = 0;
    let skipped = 0;

    const BRAND_DIR_MAP: Record<string, string> = {
      apple: "apple", hp: "hp", dell: "dell", canon: "canon", samsung: "samsung",
      brother: "brother", epson: "epson", sony: "sony", microsoft: "microsoft",
      lenovo: "lenovo", asus: "asus", dji: "dji", bose: "bose", beats: "beats",
      google: "google", sennheiser: "sennheiser", nikon: "nikon", oneplus: "oneplus",
      "tp-link": "tp-link", ubiquiti: "ubiquiti", netgear: "netgear", aputure: "aputure",
      amazon: "amazon",
    };

    function nameToSlug(name: string): string {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").substring(0, 80);
    }

    for (const product of allProducts) {
      const mainUrl: string | null = product.image_url;
      if (!mainUrl) { skipped++; continue; }

      let galleryUrls: string[] = [];

      if (mainUrl.startsWith("/")) {
        const parts = mainUrl.split("/");
        const brandDir = parts[parts.length - 2];
        const fileName = parts[parts.length - 1];
        const productSlug = extractProductSlug(fileName);

        const dir = path.join(IMAGES_DIR, brandDir);
        try {
          const allFiles = fs.readdirSync(dir);
          const matches = allFiles.filter((f) => {
            if (!/\.(webp|jpg|png)$/i.test(f)) return false;
            return (
              f.startsWith(productSlug + "-") ||
              f.startsWith(productSlug + "_") ||
              f === productSlug + ".webp"
            );
          });
          galleryUrls = sortGalleryUrls(
            matches
              .map((f) => `/images/products/${brandDir}/${f}`)
              .filter((u) => u !== mainUrl)
          );
        } catch {
          // dir doesn't exist
        }
      } else {
        const brand = (product.brand || "").toLowerCase();
        const brandDir = BRAND_DIR_MAP[brand] || brand.replace(/\s+/g, "-");
        const slug = nameToSlug(product.name);

        const dir = path.join(IMAGES_DIR, brandDir);
        try {
          const allFiles = fs.readdirSync(dir);
          const matches = allFiles.filter((f) => {
            if (!/\.(webp|jpg|png)$/i.test(f)) return false;
            return f.startsWith(slug + "-") || f.startsWith(slug + "_");
          });
          galleryUrls = sortGalleryUrls(
            matches.map((f) => `/images/products/${brandDir}/${f}`)
          );
        } catch {
          // dir doesn't exist
        }
      }

      if (galleryUrls.length === 0) {
        skipped++;
        continue;
      }

      await client.query(
        "UPDATE products SET gallery_image_urls = $1 WHERE id = $2",
        [galleryUrls, product.id]
      );
      updated++;
      const totalImgs = galleryUrls.length + 1;
      console.log(`  [${totalImgs} imgs] ${product.name}`);
    }

    console.log(
      `\nDone! Updated: ${updated}, Skipped (no local/extra images): ${skipped}`
    );
  } finally {
    client.release();
    await pool.end();
  }
}

populateGalleryImages()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
