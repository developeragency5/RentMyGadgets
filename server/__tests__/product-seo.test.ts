import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:5000";

const TEST_PRODUCTS = [
  {
    slug: "dell-xps-15",
    name: "Dell XPS 15",
    brand: "Dell",
    expectedPricePattern: /\$\d+\.\d{2}\/mo/,
  },
  {
    slug: "canon-eos-r5",
    name: "Canon EOS R5",
    brand: "Canon",
    expectedPricePattern: /\$\d+\.\d{2}\/mo/,
  },
  {
    slug: "ubiquiti-unifi-u6-pro",
    name: "Ubiquiti UniFi U6 Pro",
    brand: "Ubiquiti",
    expectedPricePattern: /\$\d+\.\d{2}\/mo/,
  },
];

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

describe("Product Page SEO Tags", () => {
  const htmlCache: Record<string, string> = {};

  beforeAll(async () => {
    for (const product of TEST_PRODUCTS) {
      const res = await fetch(`${BASE_URL}/product/${product.slug}`);
      expect(res.status).toBe(200);
      htmlCache[product.slug] = await res.text();
    }
  }, 30000);

  for (const product of TEST_PRODUCTS) {
    describe(`/product/${product.slug}`, () => {
      it("has the correct <title> tag with product name and price", () => {
        const html = htmlCache[product.slug];
        const title = extractTitle(html);
        expect(title).toBeTruthy();
        expect(title).toContain(product.name);
        expect(title).toMatch(product.expectedPricePattern);
      });

      it("has correct og:title meta tag", () => {
        const html = htmlCache[product.slug];
        const ogTitle = extractMetaContent(html, "og:title");
        expect(ogTitle).toBeTruthy();
        expect(ogTitle).toContain(product.name);
        expect(ogTitle).toContain("RentMyGadgets");
      });

      it("has correct og:description meta tag", () => {
        const html = htmlCache[product.slug];
        const ogDesc = extractMetaContent(html, "og:description");
        expect(ogDesc).toBeTruthy();
        expect(ogDesc!.length).toBeGreaterThan(0);
        expect(ogDesc!.length).toBeLessThanOrEqual(350);
      });

      it("has og:type set to product", () => {
        const html = htmlCache[product.slug];
        const ogType = extractMetaContent(html, "og:type");
        expect(ogType).toBe("product");
      });

      it("has correct meta description tag", () => {
        const html = htmlCache[product.slug];
        const desc = extractMetaContent(html, "description");
        expect(desc).toBeTruthy();
        expect(desc!.length).toBeGreaterThan(0);
        expect(desc!.length).toBeLessThanOrEqual(350);
        expect(desc).toContain("RentMyGadgets");
        expect(desc).toContain(product.name);
      });

      it("has keywords meta tag with product name and brand", () => {
        const html = htmlCache[product.slug];
        const keywords = extractMetaContent(html, "keywords");
        expect(keywords).toBeTruthy();
        expect(keywords).toContain(product.name);
        expect(keywords).toContain("RentMyGadgets");
        if (product.brand) {
          expect(keywords).toContain(product.brand);
        }
      });

      it("has canonical URL pointing to the product page", () => {
        const html = htmlCache[product.slug];
        const canonicalMatch = html.match(
          /<link\s+rel="canonical"\s+href="([^"]*)"/,
        );
        expect(canonicalMatch).toBeTruthy();
        const canonical = canonicalMatch![1];
        expect(canonical).toContain(`/product/${product.slug}`);
        expect(canonical).toMatch(/^https?:\/\//);
      });

      it("contains valid Product JSON-LD", () => {
        const html = htmlCache[product.slug];
        const jsonLdList = extractJsonLd(html);
        const productLd = jsonLdList.find((ld) => ld["@type"] === "Product");
        expect(productLd).toBeDefined();
        expect(productLd["@context"]).toBe("https://schema.org");
        expect(productLd.name).toBe(product.name);
        expect(productLd.description).toBeTruthy();
        if (product.brand) {
          expect(productLd.brand).toBeDefined();
          expect(productLd.brand["@type"]).toBe("Brand");
          expect(productLd.brand.name).toBe(product.brand);
        }
        expect(productLd.offers).toBeDefined();
        expect(productLd.offers["@type"]).toBe("Offer");
        expect(productLd.offers.priceCurrency).toBe("USD");
        expect(parseFloat(productLd.offers.price)).toBeGreaterThan(0);
        expect(productLd.offers.priceValidUntil).toBeTruthy();
        expect(productLd.offers.availability).toMatch(
          /schema\.org\/(InStock|OutOfStock)/,
        );
        expect(productLd.offers.itemCondition).toBe(
          "https://schema.org/UsedCondition",
        );
        expect(productLd.offers.seller).toBeDefined();
        expect(productLd.offers.seller["@type"]).toBe("Organization");
        expect(productLd.offers.seller.name).toBe("RentMyGadgets");
      });

      it("contains valid BreadcrumbList JSON-LD", () => {
        const html = htmlCache[product.slug];
        const jsonLdList = extractJsonLd(html);
        const breadcrumb = jsonLdList.find(
          (ld) => ld["@type"] === "BreadcrumbList",
        );
        expect(breadcrumb).toBeDefined();
        expect(breadcrumb["@context"]).toBe("https://schema.org");
        expect(breadcrumb.itemListElement).toBeInstanceOf(Array);
        expect(breadcrumb.itemListElement.length).toBeGreaterThanOrEqual(3);

        const items = breadcrumb.itemListElement;
        expect(items[0].position).toBe(1);
        expect(items[0].name).toBe("Home");
        expect(items[1].position).toBe(2);
        expect(items[1].name).toBe("Categories");

        const lastItem = items[items.length - 1];
        expect(lastItem.name).toBe(product.name);
      });

      it("has pricing meta tags", () => {
        const html = htmlCache[product.slug];
        const priceAmount = extractMetaContent(html, "product:price:amount");
        expect(priceAmount).toBeTruthy();
        expect(parseFloat(priceAmount!)).toBeGreaterThan(0);

        const priceCurrency = extractMetaContent(
          html,
          "product:price:currency",
        );
        expect(priceCurrency).toBe("USD");

        const ogPriceAmount = extractMetaContent(html, "og:price:amount");
        expect(ogPriceAmount).toBeTruthy();
        expect(parseFloat(ogPriceAmount!)).toBeGreaterThan(0);
        expect(ogPriceAmount).toBe(priceAmount);

        const ogPriceCurrency = extractMetaContent(html, "og:price:currency");
        expect(ogPriceCurrency).toBe("USD");
      });

      it("has twitter card meta tags", () => {
        const html = htmlCache[product.slug];
        const twitterCard = extractMetaContent(html, "twitter:card");
        expect(twitterCard).toBe("summary_large_image");
        const twitterTitle = extractMetaContent(html, "twitter:title");
        expect(twitterTitle).toContain(product.name);
      });

      it("has SSR content with product details for crawlers", () => {
        const html = htmlCache[product.slug];
        expect(html).toContain('id="ssr-content"');
        expect(html).toContain(product.name);
      });
    });
  }
});
