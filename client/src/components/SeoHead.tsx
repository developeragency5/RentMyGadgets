import { useEffect, useRef } from "react";

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  article?: {
    author?: string;
    publishedTime?: string;
    section?: string;
  };
  product?: {
    price?: string;
    currency?: string;
  };
}

const SITE_NAME = "RentMyGadgets";
const DEFAULT_DESCRIPTION = "Rent high-end tech gadgets including laptops, desktops, cameras, printers, headphones, and routers. Flexible rental periods with delivery options available.";
const DEFAULT_IMAGE = "/og-image.png";

const ARTICLE_META_PROPS = ["article:author", "article:published_time", "article:section"];
const PRODUCT_META_PROPS = ["product:price:amount", "product:price:currency"];

export default function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  article,
  product,
}: SeoHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const fullImage = image?.startsWith("http") ? image : `${typeof window !== "undefined" ? window.location.origin : ""}${image || DEFAULT_IMAGE}`;
  
  const createdMetaRef = useRef<string[]>([]);

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? "name" : "property";
      let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
        createdMetaRef.current.push(`${attr}="${property}"`);
      }
      meta.content = content;
    };

    const removeMeta = (property: string, isName = false) => {
      const attr = isName ? "name" : "property";
      const meta = document.querySelector(`meta[${attr}="${property}"]`);
      if (meta) {
        meta.remove();
      }
    };

    updateMeta("description", description, true);
    if (keywords) {
      updateMeta("keywords", keywords, true);
    }
    
    updateMeta("og:title", fullTitle);
    updateMeta("og:description", description);
    updateMeta("og:image", fullImage);
    updateMeta("og:url", canonicalUrl);
    updateMeta("og:type", type);
    updateMeta("og:site_name", SITE_NAME);

    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", fullImage);

    if (article) {
      if (article.author) updateMeta("article:author", article.author);
      if (article.publishedTime) updateMeta("article:published_time", article.publishedTime);
      if (article.section) updateMeta("article:section", article.section);
    } else {
      ARTICLE_META_PROPS.forEach(prop => removeMeta(prop));
    }

    if (product) {
      if (product.price) updateMeta("product:price:amount", product.price);
      if (product.currency) updateMeta("product:price:currency", product.currency);
    } else {
      PRODUCT_META_PROPS.forEach(prop => removeMeta(prop));
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    return () => {
      ARTICLE_META_PROPS.forEach(prop => removeMeta(prop));
      PRODUCT_META_PROPS.forEach(prop => removeMeta(prop));
    };
  }, [fullTitle, description, keywords, fullImage, canonicalUrl, type, article, product]);

  return null;
}
