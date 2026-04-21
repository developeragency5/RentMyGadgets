import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:5000";

async function discoverCategories(): Promise<
  { id: string; name: string }[]
> {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  const xml = await res.text();
  const categoryPaths = xml.match(/\/categories\/[a-f0-9-]+/g) || [];
  const uniqueIds = [...new Set(categoryPaths.map((p) => p.replace("/categories/", "")))];

  const results: { id: string; name: string }[] = [];
  for (const id of uniqueIds.slice(0, 2)) {
    const pageRes = await fetch(`${BASE_URL}/categories/${id}`);
    if (pageRes.status !== 200) continue;
    const html = await pageRes.text();
    const titleMatch = html.match(/<title>Rent ([^|]*)\s*\|/);
    if (titleMatch) {
      const name = titleMatch[1]
        .trim()
        .replace(/&amp;/g, "&");
      results.push({ id, name });
    }
  }
  return results;
}

function extractMetaContent(html: string, nameOrProp: string): string | null {
  const nameMatch = html.match(
    new RegExp(`<meta\\s+name="${nameOrProp}"\\s+content="([^"]*)"`, "i"),
  );
  if (nameMatch) return nameMatch[1];

  const propMatch = html.match(
    new RegExp(`<meta\\s+property="${nameOrProp}"\\s+content="([^"]*)"`, "i"),
  );
  if (propMatch) return propMatch[1];

  const revNameMatch = html.match(
    new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${nameOrProp}"`, "i"),
  );
  if (revNameMatch) return revNameMatch[1];

  const revPropMatch = html.match(
    new RegExp(`<meta\\s+content="([^"]*)"\\s+property="${nameOrProp}"`, "i"),
  );
  if (revPropMatch) return revPropMatch[1];

  return null;
}

function extractJsonLd(html: string): any[] {
  const matches = html.match(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
  );
  if (!matches) return [];
  return matches.map((m) => {
    const content = m
      .replace(/<script\s+type="application\/ld\+json">/i, "")
      .replace(/<\/script>/, "");
    return JSON.parse(content);
  });
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]*)<\/title>/);
  return match ? match[1] : null;
}

describe("Category Page SEO Tags", () => {
  let testCategories: { id: string; name: string }[] = [];
  const htmlCache: Record<string, string> = {};

  beforeAll(async () => {
    testCategories = await discoverCategories();
    expect(testCategories.length).toBeGreaterThanOrEqual(2);

    for (const cat of testCategories) {
      const res = await fetch(`${BASE_URL}/categories/${cat.id}`);
      expect(res.status).toBe(200);
      htmlCache[cat.id] = await res.text();
    }
  }, 30000);

  it("discovered at least 2 categories to test", () => {
    expect(testCategories.length).toBeGreaterThanOrEqual(2);
  });

  describe("per-category assertions", () => {
    beforeAll(() => {
      expect(testCategories.length).toBeGreaterThanOrEqual(2);
    });

    it("each category has the correct <title> tag", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const title = extractTitle(html);
        expect(title).toBeTruthy();
        expect(title).toContain("RentMyGadgets");
        expect(title).toContain("Browse Equipment");
      }
    });

    it("each category has correct og:title meta tag", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const ogTitle = extractMetaContent(html, "og:title");
        expect(ogTitle).toBeTruthy();
        expect(ogTitle).toContain("RentMyGadgets");
      }
    });

    it("each category has correct og:description meta tag", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const ogDesc = extractMetaContent(html, "og:description");
        expect(ogDesc).toBeTruthy();
        expect(ogDesc!.length).toBeGreaterThan(0);
      }
    });

    it("each category has correct meta description tag", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const desc = extractMetaContent(html, "description");
        expect(desc).toBeTruthy();
        expect(desc!.length).toBeGreaterThan(0);
      }
    });

    it("each category has keywords meta tag", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const keywords = extractMetaContent(html, "keywords");
        expect(keywords).toBeTruthy();
        expect(keywords).toContain("rent");
        expect(keywords).toContain("RentMyGadgets");
      }
    });

    it("each category has canonical URL", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const canonicalMatch = html.match(
          /<link\s+rel="canonical"\s+href="([^"]*)"/,
        );
        expect(canonicalMatch).toBeTruthy();
        const canonical = canonicalMatch![1];
        expect(canonical).toContain(`/categories/${cat.id}`);
        expect(canonical).toMatch(/^https?:\/\//);
      }
    });

    it("each category contains valid CollectionPage JSON-LD", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const jsonLdList = extractJsonLd(html);
        const collectionPage = jsonLdList.find(
          (ld) => ld["@type"] === "CollectionPage",
        );
        expect(collectionPage).toBeDefined();
        expect(collectionPage["@context"]).toBe("https://schema.org");
        expect(collectionPage.name).toContain("Rentals");
        expect(collectionPage.description).toBeTruthy();
        expect(collectionPage.url).toContain(`/categories/${cat.id}`);
        expect(collectionPage.isPartOf).toBeDefined();
        expect(collectionPage.isPartOf["@type"]).toBe("WebSite");
        expect(collectionPage.isPartOf.name).toBe("RentMyGadgets");
      }
    });

    it("each category contains valid BreadcrumbList JSON-LD", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const jsonLdList = extractJsonLd(html);
        const breadcrumb = jsonLdList.find(
          (ld) => ld["@type"] === "BreadcrumbList",
        );
        expect(breadcrumb).toBeDefined();
        expect(breadcrumb["@context"]).toBe("https://schema.org");
        expect(breadcrumb.itemListElement).toBeInstanceOf(Array);
        expect(breadcrumb.itemListElement.length).toBe(3);

        const items = breadcrumb.itemListElement;
        expect(items[0].position).toBe(1);
        expect(items[0].name).toBe("Home");
        expect(items[1].position).toBe(2);
        expect(items[1].name).toBe("Categories");
        expect(items[2].position).toBe(3);
      }
    });

    it("each category has twitter card meta tags", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        const twitterCard = extractMetaContent(html, "twitter:card");
        expect(twitterCard).toBe("summary_large_image");
      }
    });

    it("each category has SSR content for crawlers", () => {
      for (const cat of testCategories) {
        const html = htmlCache[cat.id];
        expect(html).toContain('id="ssr-content"');
        expect(html).toContain("Rentals");
      }
    });
  });
});
