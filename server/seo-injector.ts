import { storage } from "./storage";

interface PageMeta {
  title: string;
  description: string;
  type?: string;
  image?: string;
  additionalImages?: string[];
  jsonLd?: Record<string, any> | Record<string, any>[];
  noindex?: boolean;
  bodyContent?: string;
  h1?: string;
  keywords?: string;
  product?: {
    priceAmount?: string;
    priceCurrency?: string;
    availability?: string;
    condition?: string;
    brand?: string;
    retailerItemId?: string;
    category?: string;
  };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  imageAlt?: string;
  canonicalUrl?: string;
}

const SITE_NAME = "RentMyGadgets";
const DEFAULT_IMAGE = "/opengraph.jpg";
const BASE_URL = "https://www.rentmygadgets.com";

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

const STATIC_KEYWORDS: Record<string, string> = {
  "/": "rent tech equipment, laptop rental, camera rental, MacBook rental, rent gadgets, tech rental USA, rent electronics, monthly tech rental, rent-to-own electronics",
  "/categories": "tech rental categories, laptop rental, camera rental, desktop rental, headphone rental, printer rental, networking rental, browse rentals",
  "/products": "all tech rentals, browse tech catalog, laptop rental catalog, camera rental catalog, rent electronics, monthly equipment rental",
  "/cart": "rental cart, tech rental checkout, review rental order, gadget rental cart",
  "/checkout": "secure checkout, rent tech equipment, complete rental order, gadget rental payment",
  "/dashboard": "rental account, manage rentals, my orders, RentMyGadgets dashboard, track rentals",
  "/about": "about RentMyGadgets, tech rental company, equipment rental service, premium gadget rental USA",
  "/contact": "contact RentMyGadgets, tech rental support, customer service, gadget rental help",
  "/login": "sign in, RentMyGadgets account login, customer login, manage rentals",
  "/compare": "compare tech rentals, laptop comparison, camera comparison, side by side rental products",
  "/blog": "tech rental blog, gadget rental tips, laptop guides, camera buying guides, rent vs buy",
  "/search": "search tech rentals, find laptop rental, find camera rental, search gadgets",
  "/how-it-works": "how to rent tech, rental process, how rental works, rent in 3 steps, monthly tech rental guide",
  "/gadgetcare": "GadgetCare+, rental damage protection, accidental damage coverage, liquid spill protection, tech protection plan",
  "/rent-to-own": "rent to own electronics, rent to own laptop, rent to own camera, buy after renting, ownership program",
  "/terms": "terms and conditions, rental terms, RentMyGadgets terms of service, user agreement",
  "/rental-policy": "rental agreement, rental policy, rental terms, rental extension, equipment care policy",
  "/return-policy": "return policy, refund policy, 14 day returns, free returns, rental refund",
  "/shipping-policy": "shipping policy, same day delivery, free shipping, rental delivery, expedited shipping",
  "/security-deposit": "security deposit, rental deposit, deposit refund, deposit policy",
  "/damage-policy": "damage policy, equipment damage, damage charges, replacement costs, rental damage",
  "/privacy": "privacy policy, CCPA, CPRA, GDPR, data privacy, GPC, personal information protection",
  "/cookies": "cookie policy, cookie preferences, cookie consent, GPC signal, tracking cookies",
  "/advertising-disclosure": "advertising disclosure, merchant standards, pricing transparency, ad compliance",
  "/accessibility": "accessibility statement, WCAG 2.1, ADA compliance, accessible website, screen reader support",
  "/do-not-sell": "do not sell my information, CCPA opt out, CPRA opt out, California privacy rights, data sharing opt out",
};

const STATIC_ROUTES: Record<string, PageMeta> = {
  "/": {
    title: "Rent Premium Tech Equipment | Laptops, Cameras & More",
    description: "Rent high-end laptops, desktops, cameras, and tech accessories. Flexible monthly plans, same-day delivery, and optional damage protection.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        legalName: "PC Rental, LLC",
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.png`,
        description: "Premium technology equipment rental service with flexible plans and same-day delivery.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "2393 Seabreeze Dr SE",
          addressLocality: "Darien",
          addressRegion: "GA",
          postalCode: "31305-5425",
          addressCountry: "US",
        },
        contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: "support\u0040rentmygadgets.com" },
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
    noindex: true,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Shopping Cart", description: "Review and manage your rental equipment selections.", url: `${BASE_URL}/cart`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/checkout": {
    title: "Secure Checkout",
    description: "Complete your rental order securely. Review your items, enter delivery details, and confirm your tech equipment rental booking today.",
    noindex: true,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Secure Checkout", description: "Complete your technology equipment rental order securely.", url: `${BASE_URL}/checkout`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/dashboard": {
    title: "Your Account Dashboard",
    description: "Manage your RentMyGadgets account. View active rentals, track deliveries, review order history, and update your account settings.",
    noindex: true,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Account Dashboard", description: "Manage your technology rentals, track deliveries, and update account settings.", url: `${BASE_URL}/dashboard`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/ad-variants": {
    title: "Google Ads — Printer Rental A/B Test Variants",
    description: "Internal marketing reference: four headline + description pairs prepared for Google Ads A/B testing on the office printer rental category.",
    noindex: true,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Ad Variants", description: "Internal marketing reference for Google Ads variants.", url: `${BASE_URL}/ad-variants`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/collections/office-printers": {
    title: "Office Printers for Every Desk",
    description: "Office printers that print, scan, copy, and handle all your paperwork in one handy device.",
    keywords: "office printer, office printers, rent office printer, all-in-one office printer, office printer rental",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Office Printers for Every Desk", description: "Office printers that print, scan, copy, and handle all your paperwork in one handy device.", url: `${BASE_URL}/collections/office-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/collections/laser-printers": {
    title: "Laser Printers for Your Office",
    description: "Laser printers deliver sharp text, fast speeds, and low cost per page for any busy office.",
    keywords: "laser printer, laser printers, rent laser printer, laser printer rental, office laser printer",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Laser Printers for Your Office", description: "Laser printers deliver sharp text, fast speeds, and low cost per page for any busy office.", url: `${BASE_URL}/collections/laser-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/collections/color-laser-printers": {
    title: "Color Laser Printers Made Easy",
    description: "Color laser printers produce vibrant prints, detailed output, and accurate color printing.",
    keywords: "color laser printer, color laser printers, rent color laser printer, color laser printer rental",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Color Laser Printers Made Easy", description: "Color laser printers produce vibrant prints, detailed output, and accurate color printing.", url: `${BASE_URL}/collections/color-laser-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/collections/small-office-printers": {
    title: "Small Office Printers in Stock",
    description: "Small office printers fit tight spaces and deliver reliable printing for your daily tasks.",
    keywords: "small office printer, small office printers, rent small office printer, compact office printer rental",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Small Office Printers in Stock", description: "Small office printers fit tight spaces and deliver reliable printing for your daily tasks.", url: `${BASE_URL}/collections/small-office-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
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
    // Always synthesize a UNIQUE meta description from product attributes so two
    // products that happen to share a manufacturer's boilerplate description still
    // get distinct meta descriptions (avoids duplicate-meta SEO warnings).
    const dbDesc = (product.descriptionShort || product.description || "").trim();
    const nameStartsWithBrand = product.brand && product.name.toLowerCase().startsWith(product.brand.toLowerCase());
    const brandPart = (product.brand && !nameStartsWithBrand) ? `${product.brand} ` : "";
    const catPart = category ? ` in our ${category.name.toLowerCase()} category` : "";
    const uniqueLead = `Rent the ${brandPart}${product.name} from RentMyGadgets for $${price.toFixed(2)}/month${catPart}. Flexible 1, 3, 6 or 12-month plans with same-day delivery and optional GadgetCare+ protection.`;
    const desc = dbDesc
      ? `${uniqueLead} ${dbDesc}`.slice(0, 300)
      : uniqueLead;

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

    const productKeywords = [
      `rent ${product.name}`,
      product.brand ? `${product.brand} rental` : "",
      product.brand ? `rent ${product.brand}` : "",
      category ? `${category.name.toLowerCase()} rental` : "",
      category ? `rent ${category.name.toLowerCase()}` : "",
      "monthly tech rental",
      "rent to own electronics",
      "RentMyGadgets",
    ].filter(Boolean).join(", ");

    const galleryUrls: string[] = (product.galleryImageUrls || []) as string[];
    const allImageUrls: string[] = [];
    if (product.imageUrl) allImageUrls.push(toAbsoluteUrl(product.imageUrl));
    for (const url of galleryUrls) {
      const abs = toAbsoluteUrl(url);
      if (!allImageUrls.includes(abs)) allImageUrls.push(abs);
    }

    const price3 = (price * 0.9).toFixed(2);
    const price6 = (price * 0.8).toFixed(2);
    const price12 = (price * 0.7).toFixed(2);
    const longDesc = product.descriptionLong || product.description || "";
    const catName = category ? category.name : "tech equipment";
    const availability = product.available ? "In Stock — Ready to Ship" : "Currently Unavailable";

    const bodyContent =
      `<nav aria-label="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="/categories">Categories</a>` +
      (category ? ` &rsaquo; <a href="/categories/${category.id}">${escapeHtml(category.name)}</a>` : "") +
      ` &rsaquo; ${escapeHtml(product.name)}</nav>` +
      `<article>` +
      `<h2>${escapeHtml(product.name)}</h2>` +
      (product.brand ? `<p><strong>Brand:</strong> ${escapeHtml(product.brand)}</p>` : "") +
      `<p><strong>Category:</strong> <a href="${category ? `/categories/${category.id}` : "/categories"}">${escapeHtml(catName)}</a></p>` +
      `<p><strong>Availability:</strong> ${availability}</p>` +
      `<p><strong>Monthly Rental:</strong> $${price.toFixed(2)}/month</p>` +
      `<section><h3>About This Product</h3>` +
      `<p>${escapeHtml(longDesc)}</p>` +
      `</section>` +
      `<section><h3>Flexible Rental Pricing</h3>` +
      `<p>Choose the rental term that fits your needs. Longer rentals save you more:</p>` +
      `<ul>` +
      `<li><strong>1 Month:</strong> $${price.toFixed(2)}/month — Perfect for short-term projects</li>` +
      `<li><strong>3 Months:</strong> $${price3}/month (save 10%) — Great for seasonal needs</li>` +
      `<li><strong>6 Months:</strong> $${price6}/month (save 20%) — Ideal for extended projects</li>` +
      `<li><strong>12 Months:</strong> $${price12}/month (save 30%) — Best value for ongoing use</li>` +
      `</ul>` +
      `<p>All rentals include free shipping on 3+ month plans, 14-day free returns, and same-day delivery in select areas.</p>` +
      `</section>` +
      `<section><h3>GadgetCare+ Protection</h3>` +
      `<p>Add GadgetCare+ to your rental for complete peace of mind. Coverage includes accidental damage, liquid spills, ` +
      `hardware malfunctions, and priority repair or replacement — all for just 15% of your rental total.</p>` +
      `</section>` +
      `<section><h3>How Renting Works</h3>` +
      `<ol>` +
      `<li><strong>Choose Your Gear:</strong> Browse our catalog of 140+ premium products from trusted brands like ${escapeHtml(product.brand || "Apple, Dell, HP, and more")}.</li>` +
      `<li><strong>Select Your Term:</strong> Pick a 1, 3, 6, or 12-month rental period. Longer terms unlock bigger discounts.</li>` +
      `<li><strong>Receive &amp; Enjoy:</strong> We ship your equipment fast — same-day delivery available. Every item is quality-checked and ready to use.</li>` +
      `<li><strong>Return or Extend:</strong> Send it back when you're done, extend your rental, or choose our Rent-to-Own option to keep it.</li>` +
      `</ol>` +
      `</section>` +
      `<section><h3>Why Rent From RentMyGadgets?</h3>` +
      `<ul>` +
      `<li>No long-term commitments — rent month-to-month or choose a longer term for savings</li>` +
      `<li>Quality-checked equipment from top brands</li>` +
      `<li>Same-day delivery available in select areas</li>` +
      `<li>14-day free return window on all rentals</li>` +
      `<li>Optional GadgetCare+ damage protection</li>` +
      `<li>Rent-to-Own pathway if you decide to keep the gear</li>` +
      `<li>Dedicated customer support via email and phone</li>` +
      `</ul>` +
      `</section>` +
      `<section><h3>Related Categories</h3>` +
      `<p>Browse more rental options: <a href="/categories">All Categories</a> | <a href="/products">All Products</a> | ` +
      `<a href="/compare">Compare Products</a> | <a href="/search">Search</a></p>` +
      `</section>` +
      `</article>`;

    return {
      title: titleWithPrice,
      description: desc.slice(0, 300),
      type: "product",
      image: product.imageUrl || DEFAULT_IMAGE,
      additionalImages: allImageUrls.length > 1 ? allImageUrls.slice(1) : undefined,
      imageAlt: `${brandPart}${product.name} available to rent from ${SITE_NAME}`,
      h1: `Rent ${product.name}`,
      bodyContent,
      product: {
        priceAmount: price.toFixed(2),
        priceCurrency: "USD",
        availability: product.available ? "in stock" : "out of stock",
        condition: "refurbished",
        brand: product.brand || undefined,
        retailerItemId: product.id,
        category: category?.name || undefined,
      },
      keywords: productKeywords,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: desc,
          brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
          image: allImageUrls.length > 0 ? allImageUrls : (product.imageUrl ? toAbsoluteUrl(product.imageUrl) : undefined),
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

    const products = await storage.getProductsByCategory(categoryId);
    const catDesc = category.description || `Browse and rent ${category.name.toLowerCase()} equipment. Flexible rental periods, competitive pricing, and same-day delivery available.`;

    const catLower = category.name.toLowerCase();
    const categoryKeywords = `rent ${catLower}, ${catLower} rental, monthly ${catLower} rental, ${catLower} for rent, rent ${catLower} online, RentMyGadgets ${catLower}, browse ${catLower}`;

    const productListHtml = products.slice(0, 30).map(p => {
      const pPrice = p.pricePerMonth ? parseFloat(p.pricePerMonth.toString()).toFixed(2) : "0.00";
      return `<li><a href="/product/${p.id}">${escapeHtml(p.name)}</a> — $${pPrice}/month${p.brand ? ` by ${escapeHtml(p.brand)}` : ""}</li>`;
    }).join("");

    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[];
    const brandList = brands.length > 0 ? brands.map(b => escapeHtml(b)).join(", ") : "leading manufacturers";
    const priceRange = products.length > 0
      ? `$${Math.min(...products.map(p => parseFloat((p.pricePerMonth || "0").toString()))).toFixed(2)} — $${Math.max(...products.map(p => parseFloat((p.pricePerMonth || "0").toString()))).toFixed(2)}/month`
      : "";

    const bodyContent =
      `<nav aria-label="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="/categories">Categories</a> &rsaquo; ${escapeHtml(category.name)}</nav>` +
      `<article>` +
      `<h2>${escapeHtml(category.name)} Rentals</h2>` +
      `<p>${escapeHtml(catDesc)}</p>` +
      `<p><strong>${products.length} products available</strong> from brands including ${brandList}.` +
      (priceRange ? ` Prices range from ${priceRange}.` : "") +
      ` All rentals include flexible 1, 3, 6, or 12-month terms with progressive discounts up to 30% off.</p>` +
      `<section><h3>Available ${escapeHtml(category.name)}</h3>` +
      `<ul>${productListHtml}</ul>` +
      `</section>` +
      `<section><h3>Why Rent ${escapeHtml(category.name)} From RentMyGadgets?</h3>` +
      `<ul>` +
      `<li>Quality-checked equipment from trusted brands like ${brandList}</li>` +
      `<li>Flexible monthly rental terms — no long-term commitments required</li>` +
      `<li>Save 10-30% with longer rental periods (3, 6, or 12 months)</li>` +
      `<li>Free shipping on rentals of 3 months or longer</li>` +
      `<li>Same-day delivery available in select areas</li>` +
      `<li>Optional GadgetCare+ protection against accidental damage and spills</li>` +
      `<li>14-day free return window on all rentals</li>` +
      `<li>Rent-to-Own option if you decide to keep the equipment</li>` +
      `</ul>` +
      `</section>` +
      `<section><h3>How to Rent ${escapeHtml(category.name)}</h3>` +
      `<ol>` +
      `<li>Browse our selection of ${products.length} ${escapeHtml(catLower)} above</li>` +
      `<li>Select your preferred model and rental term</li>` +
      `<li>Add optional GadgetCare+ protection at checkout</li>` +
      `<li>Receive your equipment — quality-checked and ready to use</li>` +
      `</ol>` +
      `<p>Need help choosing? <a href="/compare">Compare products side by side</a> or <a href="/contact">contact our team</a> for personalized recommendations.</p>` +
      `</section>` +
      `</article>`;

    return {
      title: `Rent ${category.name} | Browse Equipment`,
      description: catDesc,
      image: category.imageUrl || DEFAULT_IMAGE,
      keywords: categoryKeywords,
      h1: `${category.name} Rentals`,
      bodyContent,
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

async function getBlogMeta(slug: string): Promise<PageMeta | null> {
  try {
    const post = await storage.getBlogPostBySlug(slug);
    if (!post || !post.published) return null;

    const url = `${BASE_URL}/blog/${post.slug}`;
    const excerpt = post.excerpt;
    const contentExcerpt = post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1500);
    const bodyContent =
      `<nav aria-label="breadcrumb"><a href="/">Home</a> &rsaquo; <a href="/blog">Blog</a> &rsaquo; ${escapeHtml(post.title)}</nav>` +
      `<article><h2>${escapeHtml(post.title)}</h2>` +
      `<p><em>${escapeHtml(excerpt)}</em></p>` +
      `<p>By ${escapeHtml(post.author)} &middot; Category: ${escapeHtml(post.category)}</p>` +
      `<p>${escapeHtml(contentExcerpt)}</p>` +
      `<p>Read more on the <a href="/blog">RentMyGadgets blog</a> or <a href="/contact">contact our support team</a> with questions.</p></article>`;

    const blogKeywords = `${post.title}, ${post.category}, tech rental blog, RentMyGadgets blog, ${post.category} guide, rental tips`;

    return {
      title: post.title,
      description: excerpt.slice(0, 300),
      image: post.imageUrl || DEFAULT_IMAGE,
      h1: post.title,
      bodyContent,
      keywords: blogKeywords,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: excerpt,
          image: post.imageUrl ? toAbsoluteUrl(post.imageUrl) : undefined,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png` } },
          datePublished: post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString(),
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          articleSection: post.category,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: post.title },
          ],
        },
      ],
    };
  } catch {
    return null;
  }
}

const NOINDEX_ROUTES = new Set<string>([
  "/cart",
  "/checkout",
  "/login",
  "/dashboard",
]);

export async function getMetaForUrl(url: string): Promise<PageMeta> {
  const [pathPart, queryPart] = url.split("?");
  const cleanUrl = pathPart.split("#")[0];

  const applyNoindex = (m: PageMeta): PageMeta =>
    NOINDEX_ROUTES.has(cleanUrl) ? { ...m, noindex: true } : m;

  if (cleanUrl === "/blog" && queryPart) {
    const params = new URLSearchParams(queryPart.split("#")[0]);
    const category = params.get("category");
    if (category) {
      const posts = await storage.getBlogPostsByCategory(category);
      const categoryUrl = `${BASE_URL}/blog?category=${encodeURIComponent(category)}`;
      return {
        canonicalUrl: categoryUrl,
        title: `${category} Articles | ${SITE_NAME} Blog`,
        description: `Browse ${posts.length > 0 ? posts.length : "our"} ${category} articles on the ${SITE_NAME} blog. Tips, guides, and insights about ${category.toLowerCase()}.`,
        keywords: `${category.toLowerCase()}, ${category.toLowerCase()} blog, ${category.toLowerCase()} tips, tech rental blog, gadget rental guides`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} – ${SITE_NAME} Blog`,
          description: `All blog posts in the ${category} category.`,
          url: categoryUrl,
          isPartOf: { "@type": "Blog", name: `${SITE_NAME} Blog`, url: `${BASE_URL}/blog` },
          ...(posts.length > 0 && {
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: posts.length,
              itemListElement: posts.slice(0, 10).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${BASE_URL}/blog/${p.slug}`,
                name: p.title,
              })),
            },
          }),
        },
      };
    }
  }

  if (STATIC_ROUTES[cleanUrl]) {
    return applyNoindex(STATIC_ROUTES[cleanUrl]);
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
  if (blogMatch) {
    const meta = await getBlogMeta(blogMatch[1]);
    if (meta) return meta;
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

const HOMEPAGE_CRAWLER_CONTENT = `<p>RentMyGadgets is the trusted destination for renting premium technology equipment in the United States. Whether you need a powerful MacBook Pro or Windows laptop for a creative project, a Canon or Sony mirrorless camera for professional photography, or a color laser printer for your small office, our flexible monthly rental plans fit any budget and timeline. We carry over 140 inspected, ready-to-ship products from trusted brands including Apple, Dell, HP, Lenovo, Canon, Sony, Nikon, Bose, DJI, Brother, Epson, and Netgear — with same-day delivery available in select areas, free shipping on rentals of 3 months or longer, optional GadgetCare+ damage protection, and a Rent-to-Own pathway if you decide to keep the gear.</p>

<h2>Browse Tech Rentals by Category</h2>
<p>Explore our six rental categories to find the right equipment for your project, business, classroom, or studio. Every category is curated with current-generation models, multiple brand options, and transparent monthly pricing.</p>
<ul>
  <li><strong>Desktops &amp; Laptops</strong> — MacBook Pro, MacBook Air, Dell XPS, HP Spectre, Lenovo ThinkPad ultrabooks, mobile workstations, gaming laptops, and high-performance desktop towers for video editing, 3D rendering, software development, and remote work.</li>
  <li><strong>Cameras &amp; Gear</strong> — Professional DSLR and mirrorless cameras from Canon, Sony, Nikon, Fujifilm, and Panasonic. Rent the Canon EOS R5, Sony A7 IV, Nikon Z9, plus cinema lenses, gimbals, and the DJI Ronin 4D for film and photo shoots.</li>
  <li><strong>Printers &amp; Scanners</strong> — HP, Brother, Canon, and Epson laser printers, color laser printers, all-in-one office printers, and high-volume scanners for small businesses, home offices, real-estate firms, schools, and pop-up events.</li>
  <li><strong>Phones</strong> — iPhone 16 Pro and Pro Max, Samsung Galaxy S24 Ultra, Google Pixel, OnePlus, and Sony Xperia smartphones for app testing, content creation, business travel, or short-term loaners.</li>
  <li><strong>Headphones</strong> — Bose QuietComfort Ultra, Sony WH-1000XM5, Apple AirPods Max, Sennheiser, and Beats premium headphones and earbuds for studio work, podcasting, and travel.</li>
  <li><strong>Routers &amp; Networking</strong> — Eero, Netgear Orbi, Asus ROG, TP-Link, and Google Nest mesh WiFi 6E and WiFi 7 systems, gaming routers, and small business networking gear.</li>
</ul>

<h2>How Renting Tech Works</h2>
<p>Renting is simple, transparent, and designed around real project timelines:</p>
<ol>
  <li><strong>Choose your gear.</strong> Browse the <a href="/products">catalog</a> or pick a <a href="/categories">category</a>, then open any product page to see specs, configurations, and rental pricing.</li>
  <li><strong>Pick your rental term.</strong> Select a 1, 3, 6, or 12-month plan. Longer terms unlock automatic savings — 10% off for 3 months, 20% off for 6 months, and 30% off for 12 months.</li>
  <li><strong>Add optional protection.</strong> Toggle on <a href="/gadgetcare">GadgetCare+</a> for 15% of your rental total to cover accidental drops, liquid spills, and hardware malfunctions.</li>
  <li><strong>Check out securely.</strong> Same-day delivery is available in select metro areas, and standard shipping arrives in 3 to 5 business days.</li>
  <li><strong>Return it free — or keep it.</strong> Send everything back with the prepaid shipping label, or buy your gear through our <a href="/rent-to-own">Rent-to-Own program</a> after 6 months.</li>
</ol>

<h2>Why Rent Instead of Buying</h2>
<p>For most short-term needs, renting is cheaper than buying outright and more flexible than a multi-year lease. Renting works well for short-term project gear, try-before-you-buy testing, always-current technology, cash-flow friendly budgets, and travel or event coverage. Every order ships from our inspection facility with a 14-day free return window and no long-term contracts.</p>

<h2>Flexible Monthly Plans with Real Savings</h2>
<table>
  <thead><tr><th>Rental term</th><th>Discount</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td>1 month</td><td>Standard rate</td><td>Single shoots, short trips, weekend events</td></tr>
    <tr><td>3 months</td><td>10% off / month</td><td>Quarterly projects, seasonal contractors</td></tr>
    <tr><td>6 months</td><td>20% off / month</td><td>Semester-long classes, freelance engagements</td></tr>
    <tr><td>12 months</td><td>30% off / month</td><td>Long-term remote workers, annual studio kits</td></tr>
  </tbody>
</table>

<h2>Real-World Use Cases</h2>
<ul>
  <li><strong>Photographers and videographers</strong> rent cameras, lenses, gimbals, and editing laptops for specific shoots.</li>
  <li><strong>Small businesses</strong> rent color laser printers during peak filing seasons or while evaluating equipment.</li>
  <li><strong>Software developers</strong> rent MacBook Pro and Windows workstations for client projects and contract work.</li>
  <li><strong>Event producers</strong> rent monitors, laptops, printers, and WiFi systems for short-term venue setups.</li>
  <li><strong>Students and educators</strong> rent laptops and creative software stations for semester-long courses.</li>
</ul>

<p>Need help? Visit our <a href="/how-it-works">How It Works</a> guide, browse the <a href="/blog">blog</a> for gear roundups and tips, or <a href="/contact">contact our team</a>. Review our <a href="/rental-policy">Rental Agreement</a> and <a href="/privacy">Privacy Policy</a> for full details.</p>`;

const CRAWLER_PAGE_CONTENT: Record<string, string> = {
  "/": HOMEPAGE_CRAWLER_CONTENT,

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

  "/contact": `<p>Have questions about renting technology equipment? The RentMyGadgets customer support team is here to help with questions about rentals, returns, shipping, billing, account issues, and anything else related to our services. You can reach us by email at support&#64;rentmygadgets.com and we aim to respond within one business day.</p>
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
<p>If you encounter any accessibility barriers while using our website or need assistance with the rental process, please <a href="/contact">contact our support team</a>. We welcome your feedback and are committed to addressing accessibility issues promptly. You can also report accessibility concerns through email at support&#64;rentmygadgets.com. For information about how we handle your personal data, see our <a href="/privacy">Privacy Policy</a>. Review our <a href="/cookies">Cookie Policy</a>, <a href="/terms">Terms and Conditions</a>, and <a href="/do-not-sell">Do Not Sell or Share</a> page. <a href="/products">Browse our products</a> or learn <a href="/how-it-works">how renting works</a>.</p>`,

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

const NAV_LINKS = [
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
];

const COLLECTION_LINKS = [
  { href: "/collections/office-printers", text: "Office Printers" },
  { href: "/collections/laser-printers", text: "Laser Printers" },
  { href: "/collections/color-laser-printers", text: "Color Laser Printers" },
  { href: "/collections/small-office-printers", text: "Small Office Printers" },
];

const POLICY_LINKS = [
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
];

interface CrawlerNavParts {
  header: string;
  bodyLinks: string;
  footer: string;
}

function buildCrawlerNav(
  currentUrl: string,
  categoryLinks: string[],
  _productLinks: string[],
  blogLinks: string[] = [],
): CrawlerNavParts {
  const navHtml = NAV_LINKS.map(l => `<a href="${l.href}">${l.text}</a>`).join(" | ");
  const collectionHtml = COLLECTION_LINKS.map(l => `<a href="${l.href}">${l.text}</a>`).join(" | ");
  const policyHtml = POLICY_LINKS.map(l => `<a href="${l.href}">${l.text}</a>`).join(" | ");
  const catSection = categoryLinks.length > 0 ? `<p>${categoryLinks.join(" | ")}</p>` : "";
  const blogSection = blogLinks.length > 0 ? `<p>${blogLinks.join(" | ")}</p>` : "";

  return {
    header: `<header><nav aria-label="Site Navigation"><p><a href="/"><strong>RentMyGadgets</strong></a> | ${navHtml}</p><p>${collectionHtml}</p></nav></header>`,
    bodyLinks: `${catSection}${blogSection}`,
    footer: `<footer><p>${policyHtml}</p></footer>`,
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
    const allCategories = await storage.getAllCategories();
    const allProducts = await storage.getAllProducts();
    const allBlogPosts = await storage.getAllBlogPosts();

    const categoryLinks = allCategories.map(
      c => `<a href="/categories/${c.id}">${escapeHtml(c.name)}</a>`
    );
    const productLinks = allProducts.map(
      p => `<a href="/product/${p.id}">${escapeHtml(p.name)}</a>`
    );
    const blogLinks = (allBlogPosts || [])
      .map((p: any) => `<a href="/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a>`);

    cachedCrawlerNav = buildCrawlerNav(url, categoryLinks, productLinks, blogLinks);
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
  const fullUrl = meta.canonicalUrl || `${BASE_URL}${url.split("?")[0]}`;
  const ogType =
    meta.type === "product" ? "product"
    : meta.type === "article" ? "article"
    : "website";
  const imageAlt = escapeHtml(meta.imageAlt || `${meta.title} — ${SITE_NAME}`);

  let result = html;

  const titleTag = `<title>${safeTitle}</title>`;
  if (result.includes("<title>")) {
    result = result.replace(/<title>[^<]*<\/title>/, titleTag);
  } else {
    result = result.replace("</head>", `  ${titleTag}\n  </head>`);
  }

  result = upsertMeta(result, "description", safeDesc);
  result = upsertMeta(
    result,
    "robots",
    meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
  );
  // Per-page keywords: prefer explicit meta.keywords, fall back to STATIC_KEYWORDS map.
  const pathOnly = url.split("?")[0];
  const keywords = meta.keywords ?? STATIC_KEYWORDS[pathOnly];
  if (keywords) {
    result = upsertMeta(result, "keywords", escapeHtml(keywords));
  }
  // Site-wide identity, locale, mobile, and local-SEO meta tags.
  result = upsertMeta(result, "author", SITE_NAME);
  result = upsertMeta(result, "publisher", SITE_NAME);
  result = upsertMeta(result, "theme-color", "#f97316");
  result = upsertMeta(result, "format-detection", "telephone=no");
  result = upsertMeta(result, "geo.region", "US-GA");
  result = upsertMeta(result, "geo.placename", "Darien, Georgia");
  result = upsertMeta(result, "geo.position", "31.3697;-81.4337");
  result = upsertMeta(result, "ICBM", "31.3697, -81.4337");
  result = upsertLink(result, "canonical", escapeHtml(fullUrl));
  result = upsertMeta(result, "og:title", safeTitle, true);
  result = upsertMeta(result, "og:description", safeDesc, true);
  result = upsertMeta(result, "og:type", ogType, true);
  result = upsertMeta(result, "og:url", escapeHtml(fullUrl), true);
  result = upsertMeta(result, "og:image", escapeHtml(image), true);
  result = upsertMeta(result, "og:site_name", SITE_NAME, true);
  result = upsertMeta(result, "og:locale", "en_US", true);
  result = upsertMeta(result, "twitter:card", "summary_large_image");
  result = upsertMeta(result, "twitter:site", "@rentmygadgets");
  result = upsertMeta(result, "twitter:creator", "@rentmygadgets");
  result = upsertMeta(result, "twitter:title", safeTitle);
  result = upsertMeta(result, "twitter:description", safeDesc);
  result = upsertMeta(result, "twitter:image", escapeHtml(image));
  result = upsertMeta(result, "twitter:image:alt", imageAlt);
  result = upsertMeta(result, "twitter:url", escapeHtml(fullUrl));
  result = upsertMeta(result, "twitter:domain", "rentmygadgets.com");

  result = upsertMeta(result, "og:image:secure_url", escapeHtml(image), true);
  result = upsertMeta(result, "og:image:type", "image/jpeg", true);
  result = upsertMeta(result, "og:image:width", "1200", true);
  result = upsertMeta(result, "og:image:height", "630", true);
  result = upsertMeta(result, "og:image:alt", imageAlt, true);

  if (meta.additionalImages && meta.additionalImages.length > 0) {
    const additionalOgTags = meta.additionalImages
      .map((imgUrl) => {
        const absUrl = escapeHtml(imgUrl.startsWith("http") ? imgUrl : `${BASE_URL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`);
        return `<meta property="og:image" content="${absUrl}" />`;
      })
      .join("\n  ");
    result = result.replace("</head>", `  ${additionalOgTags}\n</head>`);
  }

  // Product-specific OpenGraph + Facebook product tags.
  if (meta.product) {
    if (meta.product.priceAmount) {
      result = upsertMeta(result, "product:price:amount", escapeHtml(meta.product.priceAmount), true);
      result = upsertMeta(result, "og:price:amount", escapeHtml(meta.product.priceAmount), true);
    }
    if (meta.product.priceCurrency) {
      result = upsertMeta(result, "product:price:currency", escapeHtml(meta.product.priceCurrency), true);
      result = upsertMeta(result, "og:price:currency", escapeHtml(meta.product.priceCurrency), true);
    }
    if (meta.product.availability) {
      result = upsertMeta(result, "product:availability", escapeHtml(meta.product.availability), true);
      result = upsertMeta(result, "og:availability", escapeHtml(meta.product.availability), true);
    }
    if (meta.product.condition) {
      result = upsertMeta(result, "product:condition", escapeHtml(meta.product.condition), true);
    }
    if (meta.product.brand) {
      result = upsertMeta(result, "product:brand", escapeHtml(meta.product.brand), true);
    }
    if (meta.product.retailerItemId) {
      result = upsertMeta(result, "product:retailer_item_id", escapeHtml(meta.product.retailerItemId), true);
    }
    if (meta.product.category) {
      result = upsertMeta(result, "product:category", escapeHtml(meta.product.category), true);
    }
  }

  // Article-specific OpenGraph tags for blog posts.
  if (meta.article) {
    if (meta.article.publishedTime) {
      result = upsertMeta(result, "article:published_time", escapeHtml(meta.article.publishedTime), true);
    }
    if (meta.article.modifiedTime) {
      result = upsertMeta(result, "article:modified_time", escapeHtml(meta.article.modifiedTime), true);
    }
    if (meta.article.author) {
      result = upsertMeta(result, "article:author", escapeHtml(meta.article.author), true);
    }
    if (meta.article.section) {
      result = upsertMeta(result, "article:section", escapeHtml(meta.article.section), true);
    }
    if (meta.article.tags && meta.article.tags.length > 0) {
      const tagMetas = meta.article.tags
        .map(t => `<meta property="article:tag" content="${escapeHtml(t)}" />`)
        .join("\n    ");
      result = result.replace("</head>", `    ${tagMetas}\n  </head>`);
    }
  }

  // Language, hreflang, and crawler directives.
  result = upsertMeta(result, "content-language", "en-US");
  result = upsertMeta(result, "language", "English");
  result = upsertMeta(result, "referrer", "strict-origin-when-cross-origin");
  result = upsertMeta(result, "rating", "general");
  result = upsertMeta(result, "distribution", "global");
  result = upsertMeta(result, "revisit-after", "1 days");
  result = upsertMeta(result, "googlebot", meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  result = upsertMeta(result, "bingbot", meta.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1");

  // Mobile / app-icon hints (Apple, Microsoft, generic).
  result = upsertMeta(result, "application-name", SITE_NAME);
  result = upsertMeta(result, "apple-mobile-web-app-title", SITE_NAME);
  result = upsertMeta(result, "apple-mobile-web-app-capable", "yes");
  result = upsertMeta(result, "apple-mobile-web-app-status-bar-style", "default");
  result = upsertMeta(result, "mobile-web-app-capable", "yes");
  result = upsertMeta(result, "msapplication-TileColor", "#f97316");
  result = upsertMeta(result, "msapplication-TileImage", `${BASE_URL}/favicon.png`);
  result = upsertMeta(result, "HandheldFriendly", "true");
  result = upsertMeta(result, "MobileOptimized", "width");

  // Dublin Core metadata.
  result = upsertMeta(result, "DC.title", safeTitle);
  result = upsertMeta(result, "DC.description", safeDesc);
  result = upsertMeta(result, "DC.publisher", SITE_NAME);
  result = upsertMeta(result, "DC.language", "en-US");
  result = upsertMeta(result, "DC.identifier", escapeHtml(fullUrl));
  result = upsertMeta(result, "DC.rights", `Copyright ${new Date().getUTCFullYear()} ${SITE_NAME}. All rights reserved.`);

  if (meta.jsonLd) {
    const schemas = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    const ldScripts = schemas.map(s => `<script type="application/ld+json">${safeJsonLd(s)}</script>`).join("\n    ");
    result = result.replace("</head>", `    ${ldScripts}\n  </head>`);
  }

  const nav = await getCrawlerNav(url);
  const safeH1 = escapeHtml(meta.h1 || (meta.title.includes(SITE_NAME) ? meta.title.replace(` | ${SITE_NAME}`, '') : meta.title));
  const pageContent = meta.bodyContent || getCrawlerPageContent(url);
  const crawlerContent = `<div hidden aria-hidden="true" style="display:none!important">${nav.header}<main><h1>${safeH1}</h1><p>${safeDesc}</p>${pageContent}</main>${nav.bodyLinks}${nav.footer}</div>`;
  result = result.replace('<div id="root"></div>', `<div id="root">${crawlerContent}</div>`);

  return result;
}
