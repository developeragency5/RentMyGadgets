import { useEffect } from "react";
import type { Product, BlogPost } from "@shared/schema";

const SITE_NAME = "RentMyGadgets";
const SITE_URL = "https://rentmygadgets.com";

interface ProductSchemaProps {
  type: "product";
  product: Product;
  categoryName?: string;
  categoryId?: string;
}

interface BlogSchemaProps {
  type: "blog";
  post: BlogPost;
}

interface OrganizationSchemaProps {
  type: "organization";
}

interface WebsiteSchemaProps {
  type: "website";
}

interface BreadcrumbSchemaProps {
  type: "breadcrumb";
  items: { name: string; url?: string }[];
}

interface CollectionPageSchemaProps {
  type: "collectionPage";
  name: string;
  description: string;
  url: string;
}

interface WebPageSchemaProps {
  type: "webPage";
  name: string;
  description: string;
  url: string;
  pageType?: string;
}

type StructuredDataProps =
  | ProductSchemaProps
  | BlogSchemaProps
  | OrganizationSchemaProps
  | WebsiteSchemaProps
  | BreadcrumbSchemaProps
  | CollectionPageSchemaProps
  | WebPageSchemaProps;

export default function StructuredData(props: StructuredDataProps) {
  useEffect(() => {
    let jsonLd: object;
    
    switch (props.type) {
      case "product":
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: props.product.name,
          description: props.product.description,
          image: props.product.imageUrl?.startsWith("http") 
            ? props.product.imageUrl 
            : `${SITE_URL}${props.product.imageUrl}`,
          brand: {
            "@type": "Brand",
            name: props.product.brand || SITE_NAME
          },
          category: props.categoryName,
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: props.product.pricePerMonth,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availability: props.product.available 
              ? "https://schema.org/InStock" 
              : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: SITE_NAME
            }
          }
        };
        break;
        
      case "blog":
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: props.post.title,
          description: props.post.excerpt,
          image: props.post.imageUrl?.startsWith("http") 
            ? props.post.imageUrl 
            : `${SITE_URL}${props.post.imageUrl}`,
          author: {
            "@type": "Person",
            name: props.post.author
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/favicon.png`
            }
          },
          datePublished: props.post.createdAt,
          dateModified: props.post.createdAt,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${props.post.slug}`
          },
          articleSection: props.post.category
        };
        break;
        
      case "organization":
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.png`,
          description: "Premium technology equipment rental service with flexible plans and same-day delivery.",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: `support${"\u0040"}rentmygadgets.com`
          }
        };
        break;
        
      case "website":
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
            "query-input": "required name=search_term_string"
          }
        };
        break;

      case "breadcrumb":
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: props.items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            ...(item.url ? { item: item.url } : {}),
          })),
        };
        break;

      case "collectionPage":
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: props.name,
          description: props.description,
          url: props.url,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        };
        break;

      case "webPage":
        jsonLd = {
          "@context": "https://schema.org",
          "@type": props.pageType || "WebPage",
          name: props.name,
          description: props.description,
          url: props.url,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        };
        break;

      default:
        return;
    }
    
    const scriptId = `structured-data-${props.type}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(jsonLd);
    
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [props]);
  
  return null;
}
