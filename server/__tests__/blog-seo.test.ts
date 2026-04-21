import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = "http://localhost:5000";

const TEST_POSTS = [
  {
    slug: "5-reasons-renting-laptop-beats-buying",
    title: "5 Reasons Why Renting a Laptop Beats Buying for Short-Term Projects",
    excerpt: "Discover why more professionals and businesses are choosing to rent laptops instead of purchasing them outright for their short-term needs.",
    category: "Tech Tips",
    author: "Sarah Chen",
  },
  {
    slug: "guide-choosing-camera-gear-events",
    title: "The Ultimate Guide to Choosing the Right Camera Gear for Your Event",
    excerpt: "Planning to capture a special event? Learn how to select the perfect camera equipment for weddings, conferences, and corporate functions.",
    category: "How-To Guides",
    author: "Marcus Rodriguez",
  },
  {
    slug: "gaming-pc-rental-lan-party-guide",
    title: "Gaming PC Rental: Everything You Need to Know for Your Next LAN Party",
    excerpt: "Planning a LAN party or gaming event? Discover how to rent high-performance gaming PCs and what specs to look for.",
    category: "How-To Guides",
    author: "Jake Thompson",
  },
];

function extractMetaContent(html: string, nameOrProp: string): string | null {
  const nameMatch = html.match(
    new RegExp(`<meta\\s+name="${nameOrProp}"\\s+content="([^"]*)"`, "i")
  );
  if (nameMatch) return nameMatch[1];

  const propMatch = html.match(
    new RegExp(`<meta\\s+property="${nameOrProp}"\\s+content="([^"]*)"`, "i")
  );
  if (propMatch) return propMatch[1];

  const revNameMatch = html.match(
    new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${nameOrProp}"`, "i")
  );
  if (revNameMatch) return revNameMatch[1];

  const revPropMatch = html.match(
    new RegExp(`<meta\\s+content="([^"]*)"\\s+property="${nameOrProp}"`, "i")
  );
  if (revPropMatch) return revPropMatch[1];

  return null;
}

function extractJsonLd(html: string): any[] {
  const matches = html.match(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi
  );
  if (!matches) return [];
  return matches.map((m) => {
    const content = m.replace(
      /<script\s+type="application\/ld\+json">/i,
      ""
    ).replace(/<\/script>/, "");
    return JSON.parse(content);
  });
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]*)<\/title>/);
  return match ? match[1] : null;
}

describe("Blog Post SEO Tags", () => {
  const htmlCache: Record<string, string> = {};

  beforeAll(async () => {
    for (const post of TEST_POSTS) {
      const res = await fetch(`${BASE_URL}/blog/${post.slug}`);
      expect(res.status).toBe(200);
      htmlCache[post.slug] = await res.text();
    }
  }, 30000);

  for (const post of TEST_POSTS) {
    describe(`/blog/${post.slug}`, () => {
      it("has the correct <title> tag", () => {
        const html = htmlCache[post.slug];
        const title = extractTitle(html);
        expect(title).toContain(post.title);
        expect(title).toContain("RentMyGadgets");
      });

      it("has correct og:title meta tag", () => {
        const html = htmlCache[post.slug];
        const ogTitle = extractMetaContent(html, "og:title");
        expect(ogTitle).toBeTruthy();
        expect(ogTitle).toContain(post.title);
      });

      it("has correct og:description meta tag", () => {
        const html = htmlCache[post.slug];
        const ogDesc = extractMetaContent(html, "og:description");
        expect(ogDesc).toBeTruthy();
        expect(ogDesc!.length).toBeGreaterThan(0);
        expect(ogDesc!.length).toBeLessThanOrEqual(300);
      });

      it("has correct meta description tag", () => {
        const html = htmlCache[post.slug];
        const desc = extractMetaContent(html, "description");
        expect(desc).toBeTruthy();
        expect(desc!.length).toBeGreaterThan(0);
        expect(desc!.length).toBeLessThanOrEqual(300);
      });

      it("has keywords meta tag with post title and category", () => {
        const html = htmlCache[post.slug];
        const keywords = extractMetaContent(html, "keywords");
        expect(keywords).toBeTruthy();
        expect(keywords).toContain(post.title);
        expect(keywords).toContain(post.category);
        expect(keywords).toContain("RentMyGadgets blog");
      });

      it("has canonical URL pointing to the blog post", () => {
        const html = htmlCache[post.slug];
        const canonicalMatch = html.match(
          /<link\s+rel="canonical"\s+href="([^"]*)"/
        );
        expect(canonicalMatch).toBeTruthy();
        const canonical = canonicalMatch![1];
        expect(canonical).toContain(`/blog/${post.slug}`);
        expect(canonical).toMatch(/^https?:\/\//);
      });

      it("contains valid BlogPosting JSON-LD", () => {
        const html = htmlCache[post.slug];
        const jsonLdList = extractJsonLd(html);
        const blogPosting = jsonLdList.find(
          (ld) => ld["@type"] === "BlogPosting"
        );
        expect(blogPosting).toBeDefined();
        expect(blogPosting["@context"]).toBe("https://schema.org");
        expect(blogPosting.headline).toBe(post.title);
        expect(blogPosting.description).toBeTruthy();
        expect(blogPosting.author).toBeDefined();
        expect(blogPosting.author["@type"]).toBe("Person");
        expect(blogPosting.author.name).toBe(post.author);
        expect(blogPosting.publisher).toBeDefined();
        expect(blogPosting.publisher["@type"]).toBe("Organization");
        expect(blogPosting.publisher.name).toBe("RentMyGadgets");
        expect(blogPosting.datePublished).toBeTruthy();
        expect(blogPosting.url).toContain(`/blog/${post.slug}`);
        expect(blogPosting.mainEntityOfPage).toBeDefined();
        expect(blogPosting.articleSection).toBe(post.category);
      });

      it("contains valid BreadcrumbList JSON-LD", () => {
        const html = htmlCache[post.slug];
        const jsonLdList = extractJsonLd(html);
        const breadcrumb = jsonLdList.find(
          (ld) => ld["@type"] === "BreadcrumbList"
        );
        expect(breadcrumb).toBeDefined();
        expect(breadcrumb["@context"]).toBe("https://schema.org");
        expect(breadcrumb.itemListElement).toBeInstanceOf(Array);
        expect(breadcrumb.itemListElement.length).toBe(3);

        const items = breadcrumb.itemListElement;
        expect(items[0].position).toBe(1);
        expect(items[0].name).toBe("Home");
        expect(items[1].position).toBe(2);
        expect(items[1].name).toBe("Blog");
        expect(items[2].position).toBe(3);
        expect(items[2].name).toBe(post.title);
      });

      it("has og:type set appropriately", () => {
        const html = htmlCache[post.slug];
        const ogType = extractMetaContent(html, "og:type");
        expect(ogType).toBeTruthy();
      });

      it("has twitter card meta tags", () => {
        const html = htmlCache[post.slug];
        const twitterCard = extractMetaContent(html, "twitter:card");
        expect(twitterCard).toBe("summary_large_image");
        const twitterTitle = extractMetaContent(html, "twitter:title");
        expect(twitterTitle).toContain(post.title);
      });

      it("has SSR content with blog post details for crawlers", () => {
        const html = htmlCache[post.slug];
        expect(html).toContain('id="ssr-content"');
        expect(html).toContain(post.title);
      });
    });
  }
});
