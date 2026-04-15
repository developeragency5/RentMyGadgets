import { storage } from "./storage";

interface PageMeta {
  title: string;
  description: string;
  type?: string;
  image?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SITE_NAME = "RentMyGadgets";
const DEFAULT_IMAGE = "/opengraph.jpg";
const BASE_URL = "https://rentmygadgets.com";

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

const STATIC_ROUTES: Record<string, PageMeta> = {
  "/": {
    title: "Rent Premium Tech Equipment | Laptops, Cameras & More",
    description: "Rent high-end laptops, desktops, cameras, and tech accessories. Flexible monthly plans, same-day delivery, and optional damage protection.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.png`,
        description: "Premium technology equipment rental service with flexible plans and same-day delivery.",
        contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: "support@rentmygadgets.com" },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: BASE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },
  "/categories": {
    title: "Browse All Categories",
    description: "Browse our full selection of rental categories including laptops, desktops, cameras, audio equipment, and accessories. Find the perfect tech for your needs.",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "All Rental Categories", description: "Browse technology rental categories including laptops, desktops, cameras, audio equipment, networking gear, and accessories.", url: `${BASE_URL}/categories`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/products": {
    title: "Browse All Products",
    description: "Browse our full catalog of rental tech equipment. Laptops, cameras, desktops, routers, and accessories available for flexible monthly rental.",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "All Rental Products", description: "Browse over 140 technology products available for flexible monthly rental.", url: `${BASE_URL}/products`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/cart": {
    title: "Your Rental Cart",
    description: "Review your selected rental items, adjust quantities and rental periods, and proceed to secure checkout. Free shipping on 3-month orders.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Shopping Cart", description: "Review and manage your rental equipment selections.", url: `${BASE_URL}/cart`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/checkout": {
    title: "Secure Checkout",
    description: "Complete your rental order securely. Review your items, enter delivery details, and confirm your tech equipment rental booking today.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Secure Checkout", description: "Complete your technology equipment rental order securely.", url: `${BASE_URL}/checkout`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/dashboard": {
    title: "Your Account Dashboard",
    description: "Manage your RentMyGadgets account. View active rentals, track deliveries, review order history, and update your account settings.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Account Dashboard", description: "Manage your technology rentals, track deliveries, and update account settings.", url: `${BASE_URL}/dashboard`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/about": {
    title: "About Us",
    description: "Learn about RentMyGadgets, our mission to make premium technology accessible through flexible rentals, and our commitment to quality service.",
    jsonLd: { "@context": "https://schema.org", "@type": "AboutPage", name: "About RentMyGadgets", description: "Learn about our mission to make premium technology accessible through flexible rental plans.", url: `${BASE_URL}/about`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/contact": {
    title: "Contact Us",
    description: "Get in touch with RentMyGadgets. Reach our customer support team for questions about rentals, returns, shipping, or account issues.",
    jsonLd: { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact RentMyGadgets", description: "Reach our customer support team for help with rentals, returns, and account questions.", url: `${BASE_URL}/contact`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/login": {
    title: "Sign In to Your Account",
    description: "Sign in to your RentMyGadgets account to manage rentals, track deliveries, view order history, and access your personal dashboard.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Sign In", description: "Sign in to manage your technology equipment rentals.", url: `${BASE_URL}/login`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/compare": {
    title: "Compare Products",
    description: "Compare rental products side-by-side on RentMyGadgets. Evaluate specifications, monthly pricing, and features to find the right tech for your needs.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Compare Rental Products", description: "Compare technology rental products side by side to find the best fit for your needs.", url: `${BASE_URL}/compare`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/blog": {
    title: "Tech Rental Blog & Guides",
    description: "Read our latest articles on technology trends, rental tips, product guides, and industry insights from the RentMyGadgets team.",
    jsonLd: { "@context": "https://schema.org", "@type": "Blog", name: "RentMyGadgets Blog", description: "Technology rental tips, product guides, and industry insights.", url: `${BASE_URL}/blog`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/search": {
    title: "Search Products",
    description: "Search our full catalog of over 140 rental tech products. Find laptops, cameras, desktops, and accessories available for flexible monthly rent.",
    jsonLd: { "@context": "https://schema.org", "@type": "SearchResultsPage", name: "Search Rental Products", description: "Search over 140 technology products available for flexible monthly rental.", url: `${BASE_URL}/search`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/how-it-works": {
    title: "How It Works - Rent Tech in 3 Easy Steps",
    description: "Learn how to rent technology equipment from RentMyGadgets. Browse, select your rental period, and get same-day delivery. Simple returns included.",
    jsonLd: { "@context": "https://schema.org", "@type": "HowTo", name: "How to Rent Technology Equipment", description: "A step-by-step guide to renting premium tech equipment from RentMyGadgets.", url: `${BASE_URL}/how-it-works`, step: [{ "@type": "HowToStep", name: "Browse Products", text: "Browse our catalog of over 140 products or explore by category to find the equipment you need." }, { "@type": "HowToStep", name: "Choose Rental Period", text: "Select your rental period from 1, 3, 6, or 12 months with progressive discounts for longer terms." }, { "@type": "HowToStep", name: "Receive and Use", text: "We ship your equipment with same-day delivery available. Use it for your rental period and return with our prepaid label." }] },
  },
  "/gadgetcare": {
    title: "GadgetCare+ Protection Plan",
    description: "Protect your rental with GadgetCare+. Coverage for accidental damage, liquid spills, hardware malfunctions, and priority repairs at 15% of your rental total.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "GadgetCare+ Protection Plan", description: "Comprehensive rental protection covering accidental damage, liquid spills, and hardware malfunctions.", url: `${BASE_URL}/gadgetcare`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/rent-to-own": {
    title: "Rent-to-Own Program",
    description: "Own the tech you love. After 6 months of renting, purchase your equipment at a 30% discount off retail price. Flexible path to ownership.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Rent-to-Own Program", description: "Purchase your rented technology equipment at a reduced price after 6 months of renting.", url: `${BASE_URL}/rent-to-own`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/terms": {
    title: "Terms and Conditions",
    description: "Read our terms and conditions for renting technology equipment. Understand your rights and responsibilities when using RentMyGadgets services.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Terms and Conditions", description: "Terms and conditions for renting technology equipment from RentMyGadgets.", url: `${BASE_URL}/terms`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/rental-policy": {
    title: "Rental Agreement Policy",
    description: "Understand our rental terms including rental periods, extensions, early returns, late fees, and equipment care requirements.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Rental Agreement Policy", description: "Rental terms covering periods, extensions, early returns, and equipment care.", url: `${BASE_URL}/rental-policy`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/return-policy": {
    title: "Return & Refund Policy",
    description: "Our clear return and refund policy. 14-day free returns, hassle-free refund process, and equipment condition guidelines for all rentals.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Return and Refund Policy", description: "14-day free returns and hassle-free refund process for all technology rentals.", url: `${BASE_URL}/return-policy`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/shipping-policy": {
    title: "Delivery & Shipping Policy",
    description: "Free shipping on orders over $150. Same-day delivery available. Learn about shipping methods, costs, delivery timeframes, and return shipping.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Delivery and Shipping Policy", description: "Shipping methods, delivery timeframes, and free shipping on qualifying orders.", url: `${BASE_URL}/shipping-policy`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/security-deposit": {
    title: "Security Deposit Policy",
    description: "Understand our security deposit requirements, how deposits are held, conditions for full refund, and deposit amounts by product category.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Security Deposit Policy", description: "Security deposit requirements, refund conditions, and deposit amounts by product category.", url: `${BASE_URL}/security-deposit`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/damage-policy": {
    title: "Damage & Loss Policy",
    description: "Learn about normal wear vs. chargeable damage, replacement costs, and our optional GadgetCare+ protection plan for peace of mind.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Damage and Loss Policy", description: "Equipment damage assessment guidelines and optional GadgetCare+ protection.", url: `${BASE_URL}/damage-policy`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "Our privacy policy explains how we collect, use, and protect your personal information. CCPA/CPRA compliant with Global Privacy Control support.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Privacy Policy", description: "How we collect, use, and protect your personal information. CCPA/CPRA compliant.", url: `${BASE_URL}/privacy`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/cookies": {
    title: "Cookie Policy",
    description: "Learn about the cookies we use, how to manage your preferences, and our commitment to respecting your privacy choices including GPC signals.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Cookie Policy", description: "Cookie usage, preference management, and privacy commitment including GPC support.", url: `${BASE_URL}/cookies`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure & Merchant Standards",
    description: "Our commitment to transparency in advertising. Learn about our merchant standards, pricing practices, and compliance with advertising platform requirements.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Advertising Disclosure", description: "Transparency in advertising practices, merchant standards, and pricing accuracy.", url: `${BASE_URL}/advertising-disclosure`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/accessibility": {
    title: "Accessibility Statement",
    description: "RentMyGadgets is committed to digital accessibility. Learn about our WCAG 2.1 AA compliance efforts and how to request accommodations.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Accessibility Statement", description: "Digital accessibility commitment and WCAG 2.1 AA compliance information.", url: `${BASE_URL}/accessibility`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/do-not-sell": {
    title: "Do Not Sell or Share My Personal Information",
    description: "Exercise your California privacy rights under CCPA and CPRA. Opt out of the sale or sharing of your personal information on RentMyGadgets.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Do Not Sell or Share My Personal Information", description: "Opt out of the sale or sharing of personal information under CCPA/CPRA.", url: `${BASE_URL}/do-not-sell`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
};

async function getProductMeta(productId: string): Promise<PageMeta | null> {
  try {
    const product = await storage.getProduct(productId);
    if (!product) return null;

    const category = product.categoryId ? await storage.getCategory(product.categoryId) : null;
    const price = product.pricePerMonth ? parseFloat(product.pricePerMonth.toString()) : 0;
    const desc = product.descriptionShort || product.description || `Rent the ${product.name} starting at $${price.toFixed(2)}/month.`;

    const priceStr = `$${price.toFixed(2)}/mo`;
    const suffix = ` | ${SITE_NAME}`;
    const overhead = `Rent  | `.length + priceStr.length + suffix.length;
    const maxNameLen = 70 - overhead;
    let productTitle = product.name;
    if (productTitle.length > maxNameLen) {
      productTitle = productTitle.slice(0, maxNameLen).replace(/\s+\S*$/, '');
    }
    const titleWithPrice = `Rent ${productTitle} | ${priceStr}`;

    const breadcrumbItems: any[] = [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${BASE_URL}/categories` },
    ];
    if (category) {
      breadcrumbItems.push({ "@type": "ListItem", position: 3, name: category.name, item: `${BASE_URL}/categories/${category.id}` });
      breadcrumbItems.push({ "@type": "ListItem", position: 4, name: product.name });
    } else {
      breadcrumbItems.push({ "@type": "ListItem", position: 3, name: product.name });
    }

    return {
      title: titleWithPrice,
      description: desc.slice(0, 300),
      type: "product",
      image: product.imageUrl || DEFAULT_IMAGE,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: desc,
          brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
          image: product.imageUrl ? toAbsoluteUrl(product.imageUrl) : undefined,
          category: category?.name || undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: price.toFixed(2),
            priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/UsedCondition",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems,
        },
      ],
    };
  } catch {
    return null;
  }
}

async function getCategoryMeta(categoryId: string): Promise<PageMeta | null> {
  try {
    const category = await storage.getCategory(categoryId);
    if (!category) return null;

    const catDesc = category.description || `Browse and rent ${category.name.toLowerCase()} equipment. Flexible rental periods, competitive pricing, and same-day delivery available.`;

    return {
      title: `Rent ${category.name} | Browse Equipment`,
      description: catDesc,
      image: category.imageUrl || DEFAULT_IMAGE,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category.name} Rentals`,
          description: catDesc,
          url: `${BASE_URL}/categories/${category.id}`,
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Categories", item: `${BASE_URL}/categories` },
            { "@type": "ListItem", position: 3, name: category.name },
          ],
        },
      ],
    };
  } catch {
    return null;
  }
}

const BLOG_META: Record<string, PageMeta> = {
  "best-laptops-remote-work-2025": {
    title: "Best Laptops for Remote Work in 2025",
    description: "Discover the top laptops for remote work in 2025. Compare features, performance, and rental pricing for the best work-from-home setups.",
    jsonLd: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: "Best Laptops for Remote Work in 2025", description: "Discover the top laptops for remote work in 2025. Compare features, performance, and rental pricing.", author: { "@type": "Organization", name: SITE_NAME }, publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png` } }, url: `${BASE_URL}/blog/best-laptops-remote-work-2025`, mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/best-laptops-remote-work-2025` } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` }, { "@type": "ListItem", position: 3, name: "Best Laptops for Remote Work in 2025" }] },
    ],
  },
  "camera-rental-guide-beginners": {
    title: "Camera Rental Guide for Beginners",
    description: "A complete guide to renting cameras for beginners. Learn what to look for, which cameras to rent for different needs, and how to get started.",
    jsonLd: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: "Camera Rental Guide for Beginners", description: "A complete guide to renting cameras for beginners.", author: { "@type": "Organization", name: SITE_NAME }, publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png` } }, url: `${BASE_URL}/blog/camera-rental-guide-beginners`, mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/camera-rental-guide-beginners` } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` }, { "@type": "ListItem", position: 3, name: "Camera Rental Guide for Beginners" }] },
    ],
  },
  "save-money-renting-vs-buying-tech": {
    title: "Save Money: Renting vs. Buying Tech",
    description: "Compare the costs of renting vs buying technology equipment. See how much you can save with flexible tech rentals.",
    jsonLd: [
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: "Save Money: Renting vs. Buying Tech", description: "Compare the costs of renting vs buying technology equipment.", author: { "@type": "Organization", name: SITE_NAME }, publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png` } }, url: `${BASE_URL}/blog/save-money-renting-vs-buying-tech`, mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/save-money-renting-vs-buying-tech` } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }, { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` }, { "@type": "ListItem", position: 3, name: "Save Money: Renting vs. Buying Tech" }] },
    ],
  },
};

export async function getMetaForUrl(url: string): Promise<PageMeta> {
  const cleanUrl = url.split("?")[0].split("#")[0];

  if (STATIC_ROUTES[cleanUrl]) {
    return STATIC_ROUTES[cleanUrl];
  }

  const productMatch = cleanUrl.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const meta = await getProductMeta(productMatch[1]);
    if (meta) return meta;
  }

  const categoryMatch = cleanUrl.match(/^\/categories\/([^/]+)$/);
  if (categoryMatch) {
    const meta = await getCategoryMeta(categoryMatch[1]);
    if (meta) return meta;
  }

  const blogMatch = cleanUrl.match(/^\/blog\/([^/]+)$/);
  if (blogMatch && BLOG_META[blogMatch[1]]) {
    return BLOG_META[blogMatch[1]];
  }

  return {
    title: "Premium Tech Rentals",
    description: "Rent high-end laptops, desktops, cameras, and tech accessories with flexible monthly plans and same-day delivery.",
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeJsonLd(obj: Record<string, any>): string {
  return JSON.stringify(obj).replace(/<\//g, "<\\/");
}

function upsertMeta(html: string, name: string, content: string, isProperty = false): string {
  const attr = isProperty ? "property" : "name";
  const regex = new RegExp(`<meta ${attr}="${name}"[^>]*\\/?>`, "i");
  const tag = `<meta ${attr}="${name}" content="${content}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertLink(html: string, rel: string, href: string): string {
  const regex = new RegExp(`<link rel="${rel}"[^>]*\\/?>`, "i");
  const tag = `<link rel="${rel}" href="${href}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

const CRAWLER_PAGE_CONTENT: Record<string, string> = {
  "/": `<p>RentMyGadgets is your destination for renting premium technology equipment including laptops, desktops, cameras, audio gear, and accessories. Whether you need a powerful MacBook Pro for a creative project, a Canon EOS camera for professional photography, or a high-performance gaming desktop, we offer flexible monthly rental plans that fit your budget and timeline. Our catalog features over 140 products from trusted brands like Apple, Dell, HP, Lenovo, Canon, Sony, Nikon, and more.</p>
<h2>How Renting Works</h2>
<p>Renting technology from RentMyGadgets is straightforward. First, <a href="/products">browse our full product catalog</a> or <a href="/categories">explore by category</a> to find the equipment you need. Next, choose your rental period from 1, 3, 6, or 12 months. Longer rental terms come with progressive discounts — save 10% on 3-month rentals, 20% on 6-month rentals, and 30% on 12-month rentals. We ship your equipment with same-day delivery available in select areas. When your rental period ends, return it using our prepaid shipping label. Learn more on our <a href="/how-it-works">How It Works</a> page.</p>
<h2>Why Rent Premium Tech Equipment</h2>
<p>Renting technology saves you money compared to buying, especially for short-term projects or when you want to try equipment before committing. Every item is inspected and tested before shipping to ensure quality. We offer 14-day free returns on all rentals, free shipping on orders of 3 or more months, and no long-term contracts required. You can add optional <a href="/gadgetcare">GadgetCare+ protection</a> covering accidental damage, liquid spills, and hardware malfunctions for 15% of your rental total.</p>
<h2>Popular Rental Categories</h2>
<p><a href="/categories">Laptops</a> — Rent MacBooks, Windows laptops, and Chromebooks for work, school, or creative projects. Choose from ultrabooks, workstations, and gaming laptops. <a href="/categories">Desktops</a> — High-performance desktop computers for gaming, video editing, 3D rendering, and professional work. <a href="/categories">Cameras</a> — DSLR, mirrorless, and video cameras from Canon, Sony, and Nikon for photography and videography projects. <a href="/categories">Audio Equipment</a> — Professional microphones, studio monitors, speakers, and headphones for podcasting, music production, and events. <a href="/categories">Accessories</a> — Monitors, keyboards, mice, docking stations, and other peripherals to complete your setup. <a href="/categories">Networking</a> — Routers, mesh systems, switches, and networking equipment for home offices and businesses.</p>
<h2>Flexible Rental Plans and Ownership Options</h2>
<p>All rental plans are month-to-month with no long-term commitment required. If you love the equipment you are renting, our <a href="/rent-to-own">Rent-to-Own program</a> lets you purchase it at a reduced price after 6 months. A portion of your rental payments goes toward the buyout cost. <a href="/search">Search our catalog</a> to find specific products or <a href="/compare">compare products</a> side by side. Read our <a href="/blog">tech rental blog</a> for guides and tips on getting the most from your rentals. Have questions? <a href="/contact">Contact our support team</a> for help with rentals, returns, or account issues.</p>`,

  "/categories": `<p>Find the perfect technology rental by browsing our organized categories. RentMyGadgets carries laptops, desktops, cameras, audio equipment, networking gear, and accessories from trusted brands like Apple, Dell, HP, Canon, Sony, Nikon, Lenovo, and more. Each category features a curated selection of premium equipment available for flexible monthly rental.</p>
<h2>Laptop Rentals</h2>
<p>Rent MacBook Pro, MacBook Air, Dell XPS, HP Spectre, Lenovo ThinkPad, and other premium laptops. Whether you need a lightweight ultrabook for travel, a powerful workstation for video editing, or a gaming laptop for entertainment, our laptop rental category has options for every use case. All laptops are inspected and tested before shipping.</p>
<h2>Desktop and Camera Rentals</h2>
<p>Our desktop category includes high-performance workstations, gaming PCs, and all-in-one computers from Apple, Dell, and HP. For photography and videography, rent professional DSLR and mirrorless cameras from Canon, Sony, and Nikon, along with lenses and accessories. We also carry audio equipment including studio microphones, speakers, and headphones for podcasting and music production.</p>
<h2>Accessories and Networking</h2>
<p>Complete your rental setup with monitors, keyboards, mice, docking stations, and other peripherals. Our networking category includes routers, mesh WiFi systems, and switches for home and office connectivity. All rentals come with flexible monthly terms — choose 1, 3, 6, or 12 month plans with progressive discounts for longer commitments. <a href="/products">Browse all products</a>, <a href="/how-it-works">learn how renting works</a>, or <a href="/gadgetcare">add GadgetCare+ protection</a> to any rental. <a href="/compare">Compare products</a> side by side or <a href="/search">search our catalog</a> to find exactly what you need. Visit our <a href="/rent-to-own">Rent-to-Own page</a> to learn about purchasing your rental equipment after 6 months.</p>`,

  "/products": `<p>Browse our complete catalog of over 140 technology products available for rent at RentMyGadgets. Every item is inspected before shipping and comes with flexible monthly rental terms. Choose from 1, 3, 6, or 12 month rental periods with progressive discounts — save 10% on 3-month terms, 20% on 6-month terms, and 30% on 12-month terms.</p>
<h2>Laptops and Desktops for Rent</h2>
<p>Our inventory includes premium laptops from Apple, Dell, HP, and Lenovo. Rent a MacBook Pro for creative work, a Dell XPS for business productivity, or a gaming laptop for entertainment. Desktop computers are available for gaming, video editing, 3D rendering, and professional workstation needs. All computers are tested and ready to use upon delivery.</p>
<h2>Cameras, Audio, and Accessories</h2>
<p>Professional cameras from Canon, Sony, and Nikon are available for photography and videography projects. Rent DSLR bodies, mirrorless cameras, lenses, and video equipment. Our audio category includes studio microphones, monitors, and headphones for podcasting, recording, and events. Accessories include monitors, keyboards, mice, docking stations, and networking equipment like routers and mesh WiFi systems.</p>
<p>All products can be protected with our optional <a href="/gadgetcare">GadgetCare+ plan</a> covering accidental damage and hardware issues. <a href="/categories">Browse by category</a> for organized browsing, <a href="/compare">compare products</a> side by side, or <a href="/search">search</a> for specific items. Learn about our <a href="/rent-to-own">Rent-to-Own program</a> for equipment you want to keep. Visit <a href="/how-it-works">How It Works</a> for a step-by-step guide to renting, or <a href="/contact">contact us</a> with any questions.</p>`,

  "/about": `<p>RentMyGadgets is a technology equipment rental service offering flexible monthly plans for premium laptops, cameras, desktops, and accessories. Our mission is to make high-end technology accessible through affordable rental options, whether you need equipment for a short-term project, want to try before you buy, or prefer the flexibility of renting over purchasing.</p>
<h2>Our Commitment to Quality</h2>
<p>We inspect and test every piece of equipment before shipping to ensure it meets our quality standards. Our rental terms are flexible with no long-term commitments required — rent for as little as one month or save with longer 3, 6, or 12 month terms. We offer same-day delivery in select areas and free returns with prepaid shipping labels on all rentals.</p>
<h2>What We Offer</h2>
<p>Our <a href="/products">product catalog</a> features over 140 items across multiple <a href="/categories">categories</a> including laptops, desktops, cameras, audio equipment, accessories, and networking gear. Brands include Apple, Dell, HP, Lenovo, Canon, Sony, Nikon, and more. Every rental can be enhanced with optional <a href="/gadgetcare">GadgetCare+ protection</a> for coverage against accidental damage, spills, and hardware malfunctions. Our <a href="/rent-to-own">Rent-to-Own program</a> lets you purchase equipment after 6 months at a reduced buyout price. Learn more about how the process works on our <a href="/how-it-works">How It Works</a> page, read our <a href="/blog">blog</a> for rental tips and guides, or <a href="/contact">contact our team</a> with questions about your rental needs.</p>`,

  "/how-it-works": `<p>Renting technology from RentMyGadgets is simple and flexible. Our streamlined process makes it easy to get the equipment you need without the commitment of buying. Here is a step-by-step guide to renting premium tech equipment.</p>
<h2>Step-by-Step Rental Process</h2>
<p>Step 1: <a href="/products">Browse our catalog</a> of over 140 products or <a href="/categories">explore by category</a>. Find laptops, desktops, cameras, audio equipment, and accessories from brands like Apple, Dell, Canon, and Sony. Use our <a href="/search">search tool</a> or <a href="/compare">comparison feature</a> to find exactly what you need.</p>
<p>Step 2: Choose your rental period from 1, 3, 6, or 12 months. Longer terms include progressive discounts — 10% off monthly rate for 3 months, 20% off for 6 months, and 30% off for 12 months. Add optional <a href="/gadgetcare">GadgetCare+ protection</a> for coverage against accidental damage and hardware issues.</p>
<p>Step 3: Complete checkout and we ship your equipment fast. Same-day delivery is available in select areas. Free shipping is included on all orders of 3 months or longer.</p>
<p>Step 4: Use your equipment for as long as your rental period lasts. Need to extend? You can adjust your rental term at any time through your dashboard.</p>
<p>Step 5: When your rental period ends, return the equipment using our prepaid shipping label. Returns are free and we include 14-day free returns on all rentals for your peace of mind.</p>
<h2>Additional Options</h2>
<p>Love the tech you are renting? Our <a href="/rent-to-own">Rent-to-Own program</a> lets you purchase equipment after 6 months at a reduced price. A portion of your rental payments goes toward the buyout cost. Have questions about the rental process? <a href="/contact">Contact our support team</a> or read our <a href="/rental-policy">rental policy</a> for complete terms. Check our <a href="/return-policy">return policy</a> and <a href="/shipping-policy">shipping policy</a> for delivery and return details.</p>`,

  "/contact": `<p>Have questions about renting technology equipment? The RentMyGadgets customer support team is here to help with questions about rentals, returns, shipping, billing, account issues, and anything else related to our services. You can reach us by email at support@rentmygadgets.com and we aim to respond within one business day.</p>
<h2>Common Questions We Can Help With</h2>
<p>Our team can assist with choosing the right equipment for your project, extending or modifying an existing rental, understanding our <a href="/gadgetcare">GadgetCare+ protection plan</a>, processing returns and refunds, billing inquiries, and account management. If you are new to renting technology, check out our <a href="/how-it-works">How It Works</a> page for a step-by-step guide to the rental process.</p>
<h2>Helpful Resources</h2>
<p>Before contacting us, you may find answers in our policy pages: <a href="/rental-policy">Rental Agreement Policy</a> covers rental terms and extensions. <a href="/return-policy">Return and Refund Policy</a> explains our 14-day free return process. <a href="/shipping-policy">Shipping Policy</a> details delivery timeframes and costs. <a href="/damage-policy">Damage Policy</a> covers equipment care and responsibility. <a href="/security-deposit">Security Deposit Policy</a> explains deposit requirements and refunds. Browse our <a href="/products">product catalog</a> to see all available rental equipment, or visit our <a href="/blog">blog</a> for rental tips and technology guides. <a href="/categories">Browse by category</a> or <a href="/search">search</a> for specific items.</p>`,

  "/gadgetcare": `<p>GadgetCare+ is our optional protection plan that provides comprehensive coverage for your rental equipment. For 15% of your rental total, GadgetCare+ covers accidental damage, liquid spills, hardware malfunctions, and provides priority repair and replacement service. Coverage starts from day one of your rental period and lasts for the entire duration of your rental.</p>
<h2>What GadgetCare+ Covers</h2>
<p>Accidental Damage — Coverage for drops, impacts, cracked screens, and other unintentional physical damage to your rental equipment. Liquid Spill Protection — If you accidentally spill liquid on your rented laptop, camera, or other equipment, GadgetCare+ covers the repair or replacement cost. Hardware Malfunction — Coverage for unexpected hardware failures that occur during normal use, including battery issues, screen defects, and component failures. Priority Repair Service — GadgetCare+ members receive priority handling for repair requests with expedited turnaround times.</p>
<h2>How to Add GadgetCare+</h2>
<p>You can add GadgetCare+ when selecting your rental on any <a href="/products">product page</a>, or at any time during your active rental period through your account dashboard. The cost is calculated as 15% of your total rental amount, making it an affordable way to protect your equipment. GadgetCare+ is completely optional and available on all rental products across every <a href="/categories">category</a> including laptops, desktops, cameras, audio equipment, and accessories. Learn about our <a href="/damage-policy">standard damage policy</a> to understand what is covered without GadgetCare+. Visit <a href="/how-it-works">How It Works</a> for details on the rental process, or <a href="/contact">contact us</a> with questions about protection coverage. Check our <a href="/rental-policy">rental policy</a> for full terms.</p>`,

  "/rent-to-own": `<p>Love the technology you are renting? The RentMyGadgets Rent-to-Own program gives you a flexible path to ownership. After renting any eligible product for at least 6 months, you can purchase it at a reduced buyout price. A portion of your rental payments is credited toward the purchase cost, making ownership more affordable.</p>
<h2>How the Rent-to-Own Program Works</h2>
<p>Step 1: Rent any eligible product from our <a href="/products">catalog</a> using a standard rental plan. Step 2: After 6 months of continuous rental, you become eligible for the buyout option. Step 3: Contact our team or use your dashboard to initiate the purchase process. Step 4: Pay the reduced buyout price, which accounts for the rental payments you have already made. Step 5: The equipment is yours to keep, and any applicable warranty transfers to you upon purchase.</p>
<h2>Rent-to-Own Benefits</h2>
<p>The rent-to-own program is ideal for renters who want to try equipment before committing to a purchase, or who prefer spreading the cost over time rather than paying the full retail price upfront. Eligible products include laptops, desktops, cameras, and other equipment across all <a href="/categories">rental categories</a>. During your rental period, you can add <a href="/gadgetcare">GadgetCare+ protection</a> for coverage against accidental damage and hardware issues. Check our <a href="/how-it-works">How It Works page</a> for the complete rental process, review our <a href="/rental-policy">rental policy</a> for terms, or <a href="/contact">contact us</a> to learn more about buyout pricing and eligibility for specific products.</p>`,

  "/blog": `<p>Welcome to the RentMyGadgets blog, your resource for technology rental tips, product guides, industry insights, and practical advice on getting the most from your tech rentals. Whether you are a first-time renter or an experienced tech enthusiast, our articles cover everything from choosing the right laptop for remote work to camera rental tips for beginners.</p>
<h2>Featured Articles</h2>
<p>Best Laptops for Remote Work — A comprehensive guide comparing the top laptops available for rent, including MacBook Pro, Dell XPS, and HP Spectre models. Learn which specs matter most for video conferencing, document editing, and creative work. Camera Rental Guide for Beginners — Everything you need to know about renting your first camera, from understanding DSLR vs mirrorless to choosing the right lens for your project. Save Money Renting vs Buying Tech — A detailed cost comparison showing how renting technology equipment can save you money compared to purchasing, especially for short-term projects and specialized needs.</p>
<h2>More Resources</h2>
<p>Ready to get started? <a href="/products">Browse our full product catalog</a> of over 140 rental items, or <a href="/categories">explore by category</a> to find laptops, cameras, desktops, and more. Learn about our <a href="/how-it-works">rental process</a>, <a href="/gadgetcare">GadgetCare+ protection</a>, or <a href="/rent-to-own">Rent-to-Own program</a>. <a href="/search">Search for specific products</a> or <a href="/compare">compare items</a> side by side. <a href="/contact">Contact our team</a> with questions.</p>`,

  "/search": `<p>Search the complete RentMyGadgets catalog to find the perfect technology equipment for your rental needs. Our catalog includes over 140 products across all major categories including laptops, desktops, cameras, audio equipment, networking gear, and accessories from brands like Apple, Dell, HP, Lenovo, Canon, Sony, and Nikon.</p>
<h2>Find the Right Rental Equipment</h2>
<p>Use the search bar above to find specific products by name, brand, or type. Looking for a MacBook Pro? Type the model name to see all available configurations and rental pricing. Need a camera for a weekend shoot? Search for Canon, Sony, or Nikon to see our full camera selection. You can also filter search results by category, price range, and availability to narrow down your options quickly.</p>
<h2>Other Ways to Browse</h2>
<p>If you prefer to browse rather than search, visit our <a href="/categories">category pages</a> for organized product listings or <a href="/products">view all products</a> in our catalog. Use our <a href="/compare">product comparison tool</a> to evaluate specs, features, and pricing side by side. All products are available for flexible 1, 3, 6, or 12 month rental terms with progressive discounts for longer commitments. Add optional <a href="/gadgetcare">GadgetCare+ protection</a> to any rental. Learn about our <a href="/how-it-works">rental process</a>, check our <a href="/rent-to-own">Rent-to-Own program</a>, or <a href="/contact">contact us</a> for personalized recommendations. Read our <a href="/blog">blog</a> for product guides and rental tips.</p>`,

  "/compare": `<p>Compare rental products side by side at RentMyGadgets. Our comparison tool lets you evaluate specifications, monthly rental pricing, features, and availability for any products in our catalog. Whether you are deciding between two laptops, comparing camera models, or evaluating desktop configurations, the comparison tool helps you make an informed rental decision.</p>
<h2>How to Compare Products</h2>
<p>To compare products, browse our <a href="/products">product catalog</a> or <a href="/categories">categories</a> and add items to your comparison list from any product page. You can compare up to four products at once, viewing their specifications, rental pricing across different term lengths, available configurations, and customer information side by side. This makes it easy to see which product best fits your needs and budget.</p>
<h2>Things to Consider When Comparing</h2>
<p>When comparing rental products, consider the monthly rental price across different term lengths — remember that longer terms come with bigger discounts (10% off for 3 months, 20% for 6 months, 30% for 12 months). Check whether the product is eligible for our <a href="/rent-to-own">Rent-to-Own program</a> if you might want to keep it after your rental. Consider adding <a href="/gadgetcare">GadgetCare+ protection</a> for valuable equipment. Not sure what you need? <a href="/search">Search our catalog</a>, read our <a href="/blog">product guides</a>, visit <a href="/how-it-works">How It Works</a>, or <a href="/contact">contact our team</a> for personalized recommendations.</p>`,

  "/terms": `<p>These Terms and Conditions govern your use of the RentMyGadgets website and rental services. By creating an account or placing a rental order, you agree to these terms. Please read them carefully before using our services. Our rental services are available to individuals and businesses who meet our approval requirements.</p>
<h2>Rental Agreement Terms</h2>
<p>When you rent equipment through RentMyGadgets, you enter into a rental agreement for the specified term length. Rental periods are available in 1, 3, 6, and 12 month increments. You are responsible for the care and safe use of rented equipment during your rental period. Equipment must be returned in the same condition as received, accounting for normal wear and use. For detailed rental terms, see our <a href="/rental-policy">Rental Agreement Policy</a>.</p>
<h2>Pricing, Payments, and Returns</h2>
<p>Rental pricing is displayed on each product page and may include discounts for longer rental terms. A <a href="/security-deposit">security deposit</a> may be required depending on the product category. Payments are processed at the start of each rental period. Early returns are accepted under our <a href="/return-policy">Return and Refund Policy</a> with a 14-day free return window. Shipping costs and delivery timeframes are detailed in our <a href="/shipping-policy">Shipping Policy</a>. Equipment damage is assessed according to our <a href="/damage-policy">Damage Policy</a>. Optional <a href="/gadgetcare">GadgetCare+ protection</a> is available for additional coverage. For privacy information, see our <a href="/privacy">Privacy Policy</a> and <a href="/cookies">Cookie Policy</a>. <a href="/contact">Contact us</a> with any questions about these terms.</p>`,

  "/rental-policy": `<p>This Rental Agreement Policy outlines the terms and conditions for renting technology equipment from RentMyGadgets. Understanding these terms helps ensure a smooth rental experience for all parties. This policy covers rental periods, extensions, early returns, equipment care responsibilities, and late return procedures.</p>
<h2>Rental Periods and Extensions</h2>
<p>Rental periods are available in 1, 3, 6, and 12 month terms. Longer terms include progressive discounts on the monthly rate — 10% discount for 3-month rentals, 20% for 6-month rentals, and 30% for 12-month rentals. You may extend your rental at any time through your account dashboard. Extensions are billed at the rate corresponding to your new total rental duration. If you wish to end your rental early, our <a href="/return-policy">Return and Refund Policy</a> applies.</p>
<h2>Equipment Care and Responsibilities</h2>
<p>Renters are responsible for the reasonable care and safe use of rented equipment. This includes protecting equipment from extreme conditions, using equipment as intended by the manufacturer, and keeping equipment secure from theft or unauthorized access. Normal wear from regular use is expected and acceptable. For details on damage assessment and liability, see our <a href="/damage-policy">Damage and Loss Policy</a>. Consider adding <a href="/gadgetcare">GadgetCare+ protection</a> for coverage against accidental damage and liquid spills. Equipment must be returned using our prepaid shipping label as described in our <a href="/shipping-policy">Shipping Policy</a>. A <a href="/security-deposit">security deposit</a> may be required for some products. <a href="/contact">Contact us</a> for help with your rental, or browse <a href="/products">available products</a> to start renting.</p>`,

  "/return-policy": `<p>RentMyGadgets offers a clear and fair return and refund policy for all rental equipment. We include a 14-day free return window on all rentals, giving you time to ensure the equipment meets your needs. This policy covers our return process, refund eligibility, equipment condition guidelines, and how to initiate a return.</p>
<h2>14-Day Free Return Process</h2>
<p>All rentals include a 14-day free return period starting from the date you receive your equipment. If you are not satisfied with your rental for any reason within the first 14 days, you may return it for a full refund of your rental payment. To initiate a return, log into your account dashboard and request a return, or <a href="/contact">contact our support team</a>. We provide a prepaid shipping label for all returns at no additional cost.</p>
<h2>Equipment Condition and Refund Details</h2>
<p>Returned equipment must be in the same condition as received, accounting for normal wear from regular use. Items with damage beyond normal wear may be subject to charges as outlined in our <a href="/damage-policy">Damage and Loss Policy</a>. Consider <a href="/gadgetcare">GadgetCare+ protection</a> for coverage against accidental damage. Refunds are processed within 5 to 10 business days after we receive and inspect the returned equipment. <a href="/security-deposit">Security deposits</a> are refunded separately after equipment inspection. For shipping timelines and procedures, see our <a href="/shipping-policy">Shipping Policy</a>. Review our <a href="/rental-policy">Rental Agreement Policy</a> for complete rental terms. <a href="/products">Browse products</a> or visit <a href="/how-it-works">How It Works</a> to learn about our rental process.</p>`,

  "/shipping-policy": `<p>RentMyGadgets offers fast and reliable shipping for all rental equipment. Free shipping is included on all orders with rental terms of 3 months or longer. Same-day delivery is available in select areas for orders placed before noon. This policy covers shipping methods, delivery timeframes, costs, and return shipping procedures.</p>
<h2>Delivery Options and Timeframes</h2>
<p>Standard shipping delivers equipment within 3 to 5 business days from the date your order is processed. Expedited shipping is available for faster delivery at an additional cost. Same-day delivery is available in select metropolitan areas for orders placed before 12pm local time. All shipments include tracking information sent to your email and available in your account dashboard. Equipment is packaged securely to prevent damage during transit.</p>
<h2>Return Shipping and Costs</h2>
<p>Return shipping is free for all rentals. We include a prepaid shipping label with every rental order for easy returns. Simply package the equipment securely in the original packaging and drop it off at any authorized shipping location. For return eligibility and refund details, see our <a href="/return-policy">Return and Refund Policy</a>. Shipping costs for orders under 3 months vary by product weight and destination — specific costs are displayed at checkout. For equipment care during shipping and use, review our <a href="/damage-policy">Damage Policy</a> and consider <a href="/gadgetcare">GadgetCare+ protection</a>. View our <a href="/rental-policy">rental terms</a>, <a href="/products">browse products</a>, or <a href="/contact">contact us</a> with shipping questions. Learn about our <a href="/how-it-works">rental process</a>.</p>`,

  "/security-deposit": `<p>RentMyGadgets may require a refundable security deposit on certain rental products. Security deposits protect against potential equipment damage or loss and are fully refunded when equipment is returned in acceptable condition. This policy explains deposit amounts, how deposits are held, refund conditions, and the deposit process.</p>
<h2>Deposit Amounts and Payment</h2>
<p>Security deposit amounts vary by product category and the value of the equipment being rented. Deposit requirements are clearly displayed on each product page before you complete your rental order. Deposits are collected at the time of checkout along with your first rental payment. Deposit amounts are typically a percentage of the equipment replacement value, ensuring they remain proportional to the risk involved.</p>
<h2>Deposit Refund Process</h2>
<p>Your security deposit is fully refunded when you return the rental equipment in acceptable condition, accounting for normal wear from regular use. Refunds are processed within 5 to 10 business days after we receive and inspect the returned equipment. If damage beyond normal wear is identified during inspection, repair or replacement costs may be deducted from your deposit as outlined in our <a href="/damage-policy">Damage and Loss Policy</a>. Consider adding <a href="/gadgetcare">GadgetCare+ protection</a> to minimize your liability for accidental damage. For return procedures, see our <a href="/return-policy">Return Policy</a> and <a href="/shipping-policy">Shipping Policy</a>. Review our <a href="/rental-policy">rental terms</a>, <a href="/products">browse products</a>, or <a href="/contact">contact us</a> with deposit questions.</p>`,

  "/damage-policy": `<p>This Damage and Loss Policy explains what constitutes normal wear versus chargeable damage for rental equipment at RentMyGadgets, as well as procedures for reporting damage, replacement costs, and our optional GadgetCare+ protection plan. Understanding this policy helps you maintain your equipment properly during your rental period.</p>
<h2>Normal Wear vs Chargeable Damage</h2>
<p>Normal wear from regular use is expected and acceptable. This includes minor surface scratches, slight battery capacity reduction over time, and light keyboard or trackpad wear on laptops. Chargeable damage includes cracked or broken screens, liquid damage, significant dents or structural damage, missing components or accessories, damage from misuse or negligence, and cosmetic damage that affects functionality or future rentability. If chargeable damage is found upon return, repair or replacement costs will be deducted from your <a href="/security-deposit">security deposit</a> or billed separately.</p>
<h2>Protection Options and Reporting</h2>
<p>Our optional <a href="/gadgetcare">GadgetCare+ protection plan</a> covers accidental damage, liquid spills, and hardware malfunctions for 15% of your rental total. GadgetCare+ provides peace of mind and reduces your financial liability for unexpected damage. If your equipment is damaged during your rental period, report it immediately through your account dashboard or by <a href="/contact">contacting our support team</a>. Equipment loss or theft must also be reported immediately. Review our <a href="/return-policy">return process</a> and <a href="/rental-policy">rental terms</a> for complete details. <a href="/products">Browse products</a> or visit <a href="/how-it-works">How It Works</a> to start renting.</p>`,

  "/privacy": `<p>RentMyGadgets is committed to protecting your personal information and privacy. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and rental services. This policy is compliant with the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), and we support Global Privacy Control (GPC) signals.</p>
<h2>Information We Collect and How We Use It</h2>
<p>We collect information necessary to provide our rental services, including your name, email address, shipping address, payment information, and account preferences. This information is used to process rental orders, manage your account, communicate about your rentals, and improve our services. We do not sell your personal information to third parties. We use cookies and similar technologies as described in our <a href="/cookies">Cookie Policy</a> to improve your browsing experience and analyze site usage.</p>
<h2>Your Privacy Rights</h2>
<p>Under CCPA and CPRA, California residents have the right to know what personal information we collect, request deletion of their data, opt out of the sale or sharing of personal information, and exercise these rights without discrimination. We detect and honor Global Privacy Control (GPC) browser signals automatically. To opt out of data sharing, visit our <a href="/do-not-sell">Do Not Sell or Share</a> page. For accessibility accommodations, see our <a href="/accessibility">Accessibility Statement</a>. Review our <a href="/terms">Terms and Conditions</a> for service terms. <a href="/contact">Contact us</a> with privacy questions, <a href="/products">browse products</a>, or learn <a href="/how-it-works">how renting works</a>.</p>`,

  "/cookies": `<p>This Cookie Policy explains how RentMyGadgets uses cookies and similar technologies on our website. Cookies are small text files stored on your device that help us improve your browsing experience, remember your preferences, and analyze how our site is used. We respect your privacy choices and provide granular controls over cookie usage.</p>
<h2>Types of Cookies We Use</h2>
<p>Essential Cookies are required for the website to function properly, including session management, shopping cart functionality, and security features. These cannot be disabled. Functional Cookies remember your preferences such as language settings and recently viewed products to provide a personalized experience. Analytics Cookies help us understand how visitors interact with our website, which pages are most popular, and how we can improve the user experience. Marketing Cookies are used to deliver relevant advertising and track the effectiveness of our marketing campaigns across platforms.</p>
<h2>Managing Your Cookie Preferences</h2>
<p>You can manage your cookie preferences at any time through our cookie consent banner or preference center. We support Global Privacy Control (GPC) browser signals — if your browser sends a GPC signal, we automatically opt you out of analytics and marketing cookies. When you revoke consent for a cookie category, we remove the associated tracking cookies from your browser. For more information about your privacy rights, see our <a href="/privacy">Privacy Policy</a> and <a href="/do-not-sell">Do Not Sell or Share</a> page. Review our <a href="/terms">Terms and Conditions</a> and <a href="/accessibility">Accessibility Statement</a>. <a href="/contact">Contact us</a> with questions about cookies. <a href="/products">Browse products</a> or learn <a href="/how-it-works">how renting works</a>.</p>`,

  "/do-not-sell": `<p>Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California residents have the right to opt out of the sale or sharing of their personal information. RentMyGadgets respects this right and provides a simple way for you to exercise your privacy choices. This page allows you to opt out of any data sharing practices that may qualify as a sale or share under California law.</p>
<h2>How to Opt Out</h2>
<p>Use the toggle below to opt out of the sale or sharing of your personal information. When opted out, we will not share your personal data with third parties for advertising or marketing purposes. Your opt-out preference is saved and applies to all future visits to our website. If you use Global Privacy Control (GPC) in your browser, we automatically detect and honor that signal as a valid opt-out request without requiring any additional action from you.</p>
<h2>What This Means for Your Experience</h2>
<p>Opting out of data sharing does not affect your ability to use our rental services, browse products, or access your account. Essential website functions and your rental experience remain unchanged. You may still see general advertisements, but they will not be based on your personal browsing or rental activity. For complete details about our data practices, read our <a href="/privacy">Privacy Policy</a> and <a href="/cookies">Cookie Policy</a>. Review our <a href="/terms">Terms and Conditions</a> and <a href="/accessibility">Accessibility Statement</a> for additional information. <a href="/contact">Contact us</a> with privacy questions. <a href="/products">Browse products</a> or visit <a href="/how-it-works">How It Works</a> to learn about renting.</p>`,

  "/accessibility": `<p>RentMyGadgets is committed to ensuring digital accessibility for all users, including people with disabilities. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards throughout our website and rental platform. Our goal is to provide an inclusive experience where everyone can browse products, manage rentals, and access all features of our service.</p>
<h2>Our Accessibility Efforts</h2>
<p>We design and develop our website with accessibility in mind, implementing semantic HTML structure with proper heading hierarchy, keyboard navigation support for all interactive elements, sufficient color contrast ratios for text and UI components, descriptive alternative text for product images and informational graphics, clear and consistent navigation across all pages, form labels and error messages that are accessible to screen readers, and responsive design that works across devices and screen sizes. We regularly review and test our website for accessibility compliance.</p>
<h2>Requesting Accommodations</h2>
<p>If you encounter any accessibility barriers while using our website or need assistance with the rental process, please <a href="/contact">contact our support team</a>. We welcome your feedback and are committed to addressing accessibility issues promptly. You can also report accessibility concerns through email at support@rentmygadgets.com. For information about how we handle your personal data, see our <a href="/privacy">Privacy Policy</a>. Review our <a href="/cookies">Cookie Policy</a>, <a href="/terms">Terms and Conditions</a>, and <a href="/do-not-sell">Do Not Sell or Share</a> page. <a href="/products">Browse our products</a> or learn <a href="/how-it-works">how renting works</a>.</p>`,

  "/advertising-disclosure": `<p>RentMyGadgets is committed to transparency in all of our advertising and marketing practices. This disclosure explains our approach to advertising, the standards we follow, and how we ensure our marketing accurately represents our products and services. We believe honest and clear advertising builds trust with our customers.</p>
<h2>Our Advertising Standards</h2>
<p>All product descriptions, pricing, and promotional claims on our website accurately reflect our current offerings. Monthly rental prices displayed on product pages are the actual prices you will be charged. Discount percentages for longer rental terms (10% for 3 months, 20% for 6 months, 30% for 12 months) are calculated transparently and applied at checkout. Product images represent the actual equipment available for rent. We do not use misleading claims, fake reviews, or deceptive pricing practices in any of our advertising or website content.</p>
<h2>Third-Party Advertising and Privacy</h2>
<p>We may use third-party advertising platforms to promote our services. These advertisements are clearly marked and comply with each platform's advertising policies. We use consent-gated advertising scripts — tracking and marketing cookies are only loaded after you provide explicit consent through our cookie banner. You can manage your advertising preferences through our <a href="/cookies">Cookie Policy</a> page or opt out entirely on our <a href="/do-not-sell">Do Not Sell or Share</a> page. For full privacy details, see our <a href="/privacy">Privacy Policy</a>. Review our <a href="/terms">Terms and Conditions</a> and <a href="/accessibility">Accessibility Statement</a>. <a href="/contact">Contact us</a> with questions. <a href="/products">Browse products</a> or learn <a href="/how-it-works">how renting works</a>.</p>`,

  "/login": `<p>Sign in to your RentMyGadgets account to manage your technology rentals, track orders, view your rental history, and access your account settings. Your account provides a central dashboard for everything related to your rental experience, from browsing available equipment to managing active rentals and protection plans.</p>
<h2>Account Features</h2>
<p>With a RentMyGadgets account, you can track the status of your current rentals and deliveries, view your complete rental history and past orders, manage your shipping addresses and payment methods, extend or modify active rental periods, add or remove GadgetCare+ protection on your rentals, initiate returns and track refund status, and save products to your wishlist for future rental. Your account information is protected with secure authentication and encrypted connections.</p>
<h2>New to RentMyGadgets</h2>
<p>If you do not have an account yet, you can create one during the checkout process or by visiting our registration page. Creating an account is free and only takes a minute. Once registered, you can start <a href="/products">browsing our catalog</a> of over 140 products across all <a href="/categories">categories</a> including laptops, desktops, cameras, and accessories. Learn <a href="/how-it-works">how renting works</a>, explore our <a href="/gadgetcare">GadgetCare+ protection plan</a>, or check out our <a href="/rent-to-own">Rent-to-Own program</a>. <a href="/contact">Contact us</a> if you need help with your account. Read our <a href="/blog">blog</a> for rental tips.</p>`,

  "/cart": `<p>Review the technology rental equipment in your shopping cart. Here you can adjust quantities, change rental periods, add or remove GadgetCare+ protection, and proceed to checkout when you are ready. Your cart shows the monthly rental price for each item, any applicable discounts for longer rental terms, and your estimated order total.</p>
<h2>Rental Pricing and Discounts</h2>
<p>RentMyGadgets offers progressive discounts for longer rental commitments. Rent for 1 month at the standard rate, or save 10% per month on 3-month terms, 20% per month on 6-month terms, and 30% per month on 12-month terms. Discounts are applied automatically when you select a longer rental period for any item in your cart. Free shipping is included on all orders with rental terms of 3 months or longer.</p>
<h2>Protection and Next Steps</h2>
<p>Consider adding <a href="/gadgetcare">GadgetCare+ protection</a> to your rental items for coverage against accidental damage, liquid spills, and hardware malfunctions at 15% of your rental total. When you are ready, proceed to checkout to enter your delivery details and confirm your order. Need more products? <a href="/products">Browse our catalog</a>, <a href="/categories">explore categories</a>, <a href="/search">search for specific items</a>, or <a href="/compare">compare products</a> side by side. Review our <a href="/shipping-policy">shipping policy</a>, <a href="/return-policy">return policy</a>, and <a href="/rental-policy">rental terms</a> before completing your order. <a href="/contact">Contact us</a> with questions.</p>`,

  "/checkout": `<p>Complete your RentMyGadgets rental order securely. Review your selected items, enter your delivery address, and confirm your rental booking. All transactions are processed through secure encrypted connections to protect your payment information. Your rental begins when your equipment ships.</p>
<h2>Order Review and Delivery</h2>
<p>Before completing your order, review each item in your cart including the rental period, monthly price, any applicable discounts, and GadgetCare+ protection status. Verify your delivery address and select your preferred shipping method. Standard shipping delivers within 3 to 5 business days, and same-day delivery is available in select areas for orders placed before noon. Free shipping is included on orders with rental terms of 3 months or longer. See our <a href="/shipping-policy">shipping policy</a> for complete delivery details.</p>
<h2>Payment and Policies</h2>
<p>Rental payments are processed at the start of each billing period. A refundable <a href="/security-deposit">security deposit</a> may be required depending on the equipment category. All rentals include a 14-day free return period as described in our <a href="/return-policy">return policy</a>. Optional <a href="/gadgetcare">GadgetCare+ protection</a> covers accidental damage and hardware malfunctions. Review our <a href="/rental-policy">rental agreement</a>, <a href="/damage-policy">damage policy</a>, <a href="/terms">terms and conditions</a>, and <a href="/privacy">privacy policy</a> before completing your order. <a href="/contact">Contact us</a> with questions. <a href="/products">Continue shopping</a> for more products.</p>`,

  "/dashboard": `<p>Welcome to your RentMyGadgets account dashboard. Here you can manage all aspects of your technology rental experience, including viewing active rentals, tracking deliveries, reviewing order history, managing account settings, and handling returns and extensions.</p>
<h2>Managing Your Rentals</h2>
<p>Your dashboard provides a complete overview of your current and past rental activity. View the status of active rentals including equipment details, rental period, monthly cost, and delivery tracking information. Extend your rental period at any time to take advantage of progressive discounts for longer terms. Initiate returns through your dashboard when your rental period ends — we provide prepaid shipping labels for all returns. Add or modify <a href="/gadgetcare">GadgetCare+ protection</a> on active rentals for coverage against accidental damage.</p>
<h2>Account Settings and Support</h2>
<p>Update your personal information, shipping addresses, and payment methods in your account settings. View your complete rental history and download receipts for any past orders. Check the status of pending refunds and <a href="/security-deposit">security deposit</a> returns. If you have rented an item for 6 months or longer, explore our <a href="/rent-to-own">Rent-to-Own program</a> to purchase your equipment at a reduced price. <a href="/products">Browse products</a> to start a new rental, visit <a href="/categories">categories</a> for organized browsing, or <a href="/search">search our catalog</a>. Review our <a href="/rental-policy">rental policy</a>, <a href="/return-policy">return policy</a>, and <a href="/shipping-policy">shipping policy</a>. <a href="/contact">Contact us</a> for support.</p>`,
};

function getCrawlerPageContent(url: string): string {
  const cleanUrl = url.split("?")[0].replace(/\/$/, "") || "/";
  return CRAWLER_PAGE_CONTENT[cleanUrl] || "";
}

const CRAWLABLE_LINKS = [
  { href: "/", text: "Home" },
  { href: "/categories", text: "Browse Categories" },
  { href: "/products", text: "All Products" },
  { href: "/about", text: "About Us" },
  { href: "/contact", text: "Contact" },
  { href: "/how-it-works", text: "How It Works" },
  { href: "/rent-to-own", text: "Rent-to-Own Program" },
  { href: "/gadgetcare", text: "GadgetCare+ Protection" },
  { href: "/blog", text: "Blog" },
  { href: "/search", text: "Search Products" },
  { href: "/compare", text: "Compare Products" },
  { href: "/terms", text: "Terms of Service" },
  { href: "/privacy", text: "Privacy Policy" },
  { href: "/rental-policy", text: "Rental Policy" },
  { href: "/return-policy", text: "Return Policy" },
  { href: "/shipping-policy", text: "Shipping Policy" },
  { href: "/damage-policy", text: "Damage Policy" },
  { href: "/security-deposit", text: "Security Deposit" },
  { href: "/cookies", text: "Cookie Policy" },
  { href: "/do-not-sell", text: "Do Not Sell" },
  { href: "/accessibility", text: "Accessibility" },
  { href: "/advertising-disclosure", text: "Advertising Disclosure" },
  { href: "/login", text: "Sign In" },
];

interface CrawlerNavParts {
  header: string;
  bodyLinks: string;
  footer: string;
}

function buildCrawlerNav(currentUrl: string, categoryLinks: string[], productLinks: string[]): CrawlerNavParts {
  const mainLinks = CRAWLABLE_LINKS.slice(0, 12).map(
    l => `<a href="${l.href}">${l.text}</a>`
  ).join(" | ");
  const policyLinks = CRAWLABLE_LINKS.slice(12).map(
    l => `<a href="${l.href}">${l.text}</a>`
  ).join(" | ");
  const catSection = categoryLinks.length > 0 ? `<p>${categoryLinks.join(" | ")}</p>` : "";
  const prodSection = productLinks.length > 0 ? `<p>${productLinks.join(" | ")}</p>` : "";

  return {
    header: `<header><nav aria-label="Site Navigation"><p><a href="/"><strong>RentMyGadgets</strong></a> | ${mainLinks}</p></nav></header>`,
    bodyLinks: `${catSection}${prodSection}`,
    footer: `<footer><nav aria-label="Policies and Legal"><p>${policyLinks}</p></nav></footer>`,
  };
}

let cachedCrawlerNav: CrawlerNavParts | null = null;
let cachedCrawlerNavTime = 0;
const CRAWLER_NAV_TTL = 3600000;

async function getCrawlerNav(url: string): Promise<CrawlerNavParts> {
  const now = Date.now();
  if (cachedCrawlerNav && now - cachedCrawlerNavTime < CRAWLER_NAV_TTL) {
    return cachedCrawlerNav;
  }
  try {
    const categories = await storage.getAllCategories();
    const products = await storage.getAllProducts();

    const categoryLinks = categories.map(
      c => `<a href="/categories/${c.id}">${escapeHtml(c.name)}</a>`
    );
    const productLinks = products.map(
      p => `<a href="/product/${p.id}">${escapeHtml(p.name)}</a>`
    );

    cachedCrawlerNav = buildCrawlerNav(url, categoryLinks, productLinks);
    cachedCrawlerNavTime = now;
    return cachedCrawlerNav;
  } catch {
    return buildCrawlerNav(url, [], []);
  }
}

export async function injectMeta(html: string, meta: PageMeta, url: string): Promise<string> {
  const fullTitle = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} | ${SITE_NAME}`;
  const safeTitle = escapeHtml(fullTitle);
  const safeDesc = escapeHtml(meta.description);
  const image = toAbsoluteUrl(meta.image || DEFAULT_IMAGE);
  const fullUrl = `${BASE_URL}${url.split("?")[0]}`;
  const ogType = meta.type === "product" ? "product" : "website";

  let result = html;

  const titleTag = `<title>${safeTitle}</title>`;
  if (result.includes("<title>")) {
    result = result.replace(/<title>[^<]*<\/title>/, titleTag);
  } else {
    result = result.replace("</head>", `  ${titleTag}\n  </head>`);
  }

  result = upsertMeta(result, "description", safeDesc);
  result = upsertLink(result, "canonical", escapeHtml(fullUrl));
  result = upsertMeta(result, "og:title", safeTitle, true);
  result = upsertMeta(result, "og:description", safeDesc, true);
  result = upsertMeta(result, "og:type", ogType, true);
  result = upsertMeta(result, "og:url", escapeHtml(fullUrl), true);
  result = upsertMeta(result, "og:image", escapeHtml(image), true);
  result = upsertMeta(result, "og:site_name", SITE_NAME, true);
  result = upsertMeta(result, "twitter:card", "summary_large_image");
  result = upsertMeta(result, "twitter:title", safeTitle);
  result = upsertMeta(result, "twitter:description", safeDesc);
  result = upsertMeta(result, "twitter:image", escapeHtml(image));

  if (meta.jsonLd) {
    const schemas = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    const ldScripts = schemas.map(s => `<script type="application/ld+json">${safeJsonLd(s)}</script>`).join("\n    ");
    result = result.replace("</head>", `    ${ldScripts}\n  </head>`);
  }

  const nav = await getCrawlerNav(url);
  const safeH1 = escapeHtml(meta.title.includes(SITE_NAME) ? meta.title.replace(` | ${SITE_NAME}`, '') : meta.title);
  const pageContent = getCrawlerPageContent(url);
  const crawlerContent = `${nav.header}<main><h1>${safeH1}</h1><p>${safeDesc}</p>${pageContent}</main>${nav.bodyLinks}${nav.footer}`;
  result = result.replace('<div id="root"></div>', `<div id="root">${crawlerContent}</div>`);

  return result;
}
