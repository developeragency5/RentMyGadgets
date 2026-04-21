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
  pagination?: {
    currentPage: number;
    totalPages: number;
    prevUrl?: string;
    nextUrl?: string;
  };
}

const SITE_NAME = "RentMyGadgets";
const DEFAULT_IMAGE = "/opengraph.jpg";
const BASE_URL = "https://www.rentmygadgets.com";

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

const TRACKING_PARAMS = new Set([
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "utm_id", "ref", "fbclid", "gclid", "gclsrc", "dclid", "msclkid",
  "twclid", "li_fat_id", "mc_cid", "mc_eid", "s_kwcid", "ef_id",
  "_ga", "_gl", "yclid", "ttclid", "wbraid", "gbraid",
]);

function stripTrackingParams(url: string): string {
  const [path, query] = url.split("?");
  if (!query) return path;
  const params = new URLSearchParams(query.split("#")[0]);
  const kept = new URLSearchParams();
  params.forEach((value, key) => {
    if (!TRACKING_PARAMS.has(key)) {
      kept.append(key, value);
    }
  });
  const qs = kept.toString();
  return qs ? `${path}?${qs}` : path;
}

const STATIC_KEYWORDS: Record<string, string> = {
  "/": "rent tech equipment, laptop rental, camera rental, rent gadgets, tech rental USA, rent electronics, monthly tech rental, rent-to-own electronics",
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
  "/office-printer-rentals": "office equipment rental, laser rental, color laser rental, small office device, rent business equipment, HP rental, Brother rental, document solutions",
  "/laptop-desktop-rentals": "laptop rental, desktop rental, workstation rental, rent laptop, rent desktop, computer rental, gaming laptop rental, business laptop rental",
  "/smartphone-rentals": "smartphone rental, phone rental, rent smartphone, rent phone, mobile phone rental, cell phone rental, iPhone rental, Samsung rental",
  "/headphones-audio-rentals": "headphone rental, keyboard rental, mouse rental, rent headphones, gaming headset rental, mechanical keyboard rental, ergonomic mouse rental",
  "/camera-gear-rentals": "camera rental, professional camera rental, camera lens rental, lighting rental, rent camera, photography equipment rental, studio lighting rental",
  "/router-rentals": "router rental, WiFi router rental, wireless router rental, rent router, internet router rental, mesh WiFi rental, home router rental",
  "/terms": "terms and conditions, rental terms, RentMyGadgets terms of service, user agreement",
  "/rental-policy": "rental agreement, rental policy, rental terms, rental extension, equipment care policy",
  "/return-policy": "return policy, refund policy, 14 day returns, free returns, rental refund",
  "/shipping-policy": "shipping policy, fast delivery, free shipping, rental delivery, expedited shipping",
  "/security-deposit": "security deposit, rental deposit, deposit refund, deposit policy",
  "/damage-policy": "damage policy, equipment damage, damage charges, replacement costs, rental damage",
  "/privacy": "privacy policy, CCPA, CPRA, GDPR, data privacy, GPC, personal information protection",
  "/cookies": "cookie policy, cookie preferences, cookie consent, GPC signal, tracking cookies",
  "/advertising-disclosure": "advertising disclosure, merchant standards, pricing transparency, ad compliance",
  "/accessibility": "accessibility statement, WCAG 2.1, ADA compliance, accessible website, screen reader support",
  "/do-not-sell": "do not sell my information, CCPA opt out, CPRA opt out, California privacy rights, data sharing opt out",
  "/html-sitemap": "site map, all pages, browse products, product directory, rental catalog sitemap",
};

const STATIC_ROUTES: Record<string, PageMeta> = {
  "/": {
    title: "Rent Premium Tech Equipment | Laptops, Cameras & More",
    description: "Rent high-end laptops, desktops, cameras, and tech accessories. Flexible monthly plans, fast delivery in select areas, and optional damage protection.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        legalName: "PC Rental, LLC",
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.png`,
        description: "Premium technology equipment rental service with flexible plans and fast delivery in select areas.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "2393 Seabreeze Dr SE",
          addressLocality: "Darien",
          addressRegion: "GA",
          postalCode: "31305-5425",
          addressCountry: "US",
        },
        telephone: "+1-912-437-8920",
        contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: "+1-912-437-8920", email: "support\u0040rentmygadgets.com", availableLanguage: "English" },
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
    description: "Browse our full catalog of over 130 rental tech products including laptops, cameras, desktops, routers, and accessories. All available for flexible monthly rental with progressive discounts.",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "All Rental Products", description: "Browse over 130 technology products available for flexible monthly rental.", url: `${BASE_URL}/products`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/cart": {
    title: "Your Rental Cart",
    description: "Review your selected rental items, adjust quantities and rental periods, and proceed to secure checkout. Free shipping on 3-month orders.",
    noindex: true,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Shopping Cart", description: "Review and manage your rental equipment selections.", url: `${BASE_URL}/cart`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/checkout": {
    title: "Secure Checkout",
    description: "Complete your rental order securely. Review your items, enter delivery details, select a payment method, and confirm your tech equipment rental booking today.",
    noindex: true,
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Secure Checkout", description: "Complete your technology equipment rental order securely.", url: `${BASE_URL}/checkout`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/dashboard": {
    title: "Your Account Dashboard",
    description: "Manage your RentMyGadgets account. View active rentals, track deliveries, review order history, update your personal settings, and manage payment methods.",
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
    description: "Rent multifunction office printers that print, scan, copy, and fax. Flexible monthly plans from HP, Brother, Canon, and Epson with fast delivery in select areas.",
    keywords: "office equipment, rent office device, all-in-one office unit, office equipment rental",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Office Printers for Every Desk", description: "Office printers that print, scan, copy, and handle all your paperwork in one handy device.", url: `${BASE_URL}/collections/office-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/collections/laser-printers": {
    title: "Laser Printers for Your Office",
    description: "Rent laser printers that deliver sharp text, fast speeds, and low cost per page. Ideal for busy offices, schools, and small businesses with high-volume needs.",
    keywords: "laser device, rent laser unit, laser equipment rental, office laser",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Laser Printers for Your Office", description: "Laser printers deliver sharp text, fast speeds, and low cost per page for any busy office.", url: `${BASE_URL}/collections/laser-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/collections/color-laser-printers": {
    title: "Color Laser Printers Made Easy",
    description: "Rent color laser printers that produce vibrant prints, detailed output, and accurate color for marketing materials, presentations, and creative projects.",
    keywords: "color laser, color laser device, rent color laser, color laser rental",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Color Laser Printers Made Easy", description: "Color laser printers produce vibrant prints, detailed output, and accurate color printing.", url: `${BASE_URL}/collections/color-laser-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/collections/small-office-printers": {
    title: "Small Office Printers in Stock",
    description: "Rent compact small office printers that fit tight spaces and deliver reliable printing for daily tasks. Flexible monthly plans with no long-term commitment required.",
    keywords: "small office device, compact device, rent small office equipment, compact office rental",
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Small Office Printers in Stock", description: "Small office printers fit tight spaces and deliver reliable printing for your daily tasks.", url: `${BASE_URL}/collections/small-office-printers`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/about": {
    title: "About Us",
    description: "Learn about RentMyGadgets, our mission to make premium technology accessible through flexible rentals, and our commitment to quality service.",
    jsonLd: { "@context": "https://schema.org", "@type": "AboutPage", name: "About RentMyGadgets", description: "Learn about our mission to make premium technology accessible through flexible rental plans.", url: `${BASE_URL}/about`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/contact": {
    title: "Contact Us",
    description: "Get in touch with the RentMyGadgets support team. We're here to help with questions about rentals, returns, shipping, equipment issues, or account management.",
    jsonLd: { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact RentMyGadgets", description: "Reach our customer support team for help with rentals, returns, and account questions.", url: `${BASE_URL}/contact`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/login": {
    title: "Sign In to Your Account",
    description: "Sign in to your RentMyGadgets account to manage active rentals, track deliveries, view order history, update payment methods, and access your personal dashboard.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Sign In", description: "Sign in to manage your technology equipment rentals.", url: `${BASE_URL}/login`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/compare": {
    title: "Compare Products",
    description: "Compare rental products side-by-side on RentMyGadgets. Evaluate specifications, monthly pricing, and features to find the right tech for your needs.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Compare Rental Products", description: "Compare technology rental products side by side to find the best fit for your needs.", url: `${BASE_URL}/compare`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/blog": {
    title: "Tech Rental Blog & Guides",
    description: "Read our latest articles on technology trends, rental tips, product guides, cost-saving strategies, and industry insights from the RentMyGadgets editorial team.",
    jsonLd: { "@context": "https://schema.org", "@type": "Blog", name: "RentMyGadgets Blog", description: "Technology rental tips, product guides, and industry insights.", url: `${BASE_URL}/blog`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/search": {
    title: "Search Products",
    description: "Search our full catalog of over 130 rental tech products. Find laptops, cameras, desktops, routers, and accessories available for flexible monthly rental with delivery options.",
    jsonLd: { "@context": "https://schema.org", "@type": "SearchResultsPage", name: "Search Rental Products", description: "Search over 130 technology products available for flexible monthly rental.", url: `${BASE_URL}/search`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/how-it-works": {
    title: "How It Works - Rent Tech in 3 Easy Steps",
    description: "Learn how to rent technology equipment from RentMyGadgets. Browse, select your rental period, and get fast delivery. Simple returns included.",
    jsonLd: { "@context": "https://schema.org", "@type": "HowTo", name: "How to Rent Technology Equipment", description: "A step-by-step guide to renting premium tech equipment from RentMyGadgets.", url: `${BASE_URL}/how-it-works`, step: [{ "@type": "HowToStep", name: "Browse Products", text: "Browse our catalog of over 130 products or explore by category to find the equipment you need." }, { "@type": "HowToStep", name: "Choose Rental Period", text: "Select your rental period from 1, 3, 6, or 12 months with progressive discounts for longer terms." }, { "@type": "HowToStep", name: "Receive and Use", text: "We ship your equipment quickly — delivery available in select areas. Use it for your rental period and return with our prepaid label." }] },
  },
  "/gadgetcare": {
    title: "GadgetCare+ Protection Plan",
    description: "Protect your rental with GadgetCare+. Coverage for accidental damage, liquid spills, hardware malfunctions, and priority repairs at 15% of your rental total.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "GadgetCare+ Protection Plan", description: "Comprehensive rental protection covering accidental damage, liquid spills, and hardware malfunctions.", url: `${BASE_URL}/gadgetcare`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/rent-to-own": {
    title: "Rent-to-Own Program",
    description: "Own the tech you love. After 6 months of renting, purchase your equipment at a significant discount off retail price. A flexible, affordable path from rental to ownership.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Rent-to-Own Program", description: "Purchase your rented technology equipment at a reduced price after 6 months of renting.", url: `${BASE_URL}/rent-to-own`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/office-printer-rentals": {
    title: "Office Printer Rentals | Laser & Color Laser Printers for Small Offices",
    description: "Rent a reliable office printer, laser printer, or color laser printer for your small office. Flexible monthly plans, fast delivery in select areas, no long-term contracts.",
    keywords: "office printer rental, laser printer rental, color laser printer rental, small office printer, rent office printer, business printer rental, monthly printer rental, HP printer rental, Brother printer rental, Canon printer rental",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Office Printer Rentals", description: "Rent business-grade laser printers, color laser printers, and small office printers from HP, Brother, Canon, Xerox, and Epson with flexible monthly plans.", url: `${BASE_URL}/office-printer-rentals`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/laptop-desktop-rentals": {
    title: "Laptop & Desktop Rentals | Laptops, Desktops & Workstations",
    description: "Rent powerful laptops, desktop computers, and workstations for work, gaming, and creative projects. Flexible monthly plans, fast delivery, no long-term contracts.",
    keywords: "laptop rental, desktop rental, workstation rental, rent laptop, rent desktop, computer rental, gaming laptop rental, business laptop rental",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Laptop & Desktop Rentals", description: "Rent powerful laptops, desktops, and workstations for work, gaming, and creative projects.", url: `${BASE_URL}/laptop-desktop-rentals`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/smartphone-rentals": {
    title: "Smartphone Rentals | Latest Phones for Work, Travel & Daily Life",
    description: "Rent premium smartphones with sharp displays, powerful cameras, and long battery life. Flexible monthly plans, no long-term contracts, always the latest models.",
    keywords: "smartphone rental, phone rental, rent smartphone, rent phone, mobile phone rental, cell phone rental, iPhone rental, Samsung rental",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Smartphone Rentals", description: "Rent premium smartphones with sharp displays, powerful cameras, and long battery life.", url: `${BASE_URL}/smartphone-rentals`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/headphones-audio-rentals": {
    title: "Headphones & Accessories Rentals | Audio Gear, Keyboards & Mice",
    description: "Rent premium headphones, mechanical keyboards, and ergonomic mice for work, gaming, and music. Flexible monthly plans, no long-term contracts.",
    keywords: "headphone rental, keyboard rental, mouse rental, rent headphones, gaming headset rental, mechanical keyboard rental, ergonomic mouse rental",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Headphones & Accessories Rentals", description: "Rent premium headphones, keyboards, and mice for work, gaming, and music.", url: `${BASE_URL}/headphones-audio-rentals`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/camera-gear-rentals": {
    title: "Camera & Gear Rentals | Pro Cameras, Lenses & Lighting Equipment",
    description: "Rent professional cameras, sharp lenses, and studio lighting gear for photo shoots, events, and travel. Flexible monthly plans, no contracts.",
    keywords: "camera rental, professional camera rental, camera lens rental, lighting rental, rent camera, photography equipment rental, studio lighting rental",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Camera & Gear Rentals", description: "Rent professional cameras, lenses, and lighting gear for shoots, events, and travel.", url: `${BASE_URL}/camera-gear-rentals`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
  "/router-rentals": {
    title: "Router Rentals | Fast WiFi Routers for Home & Office",
    description: "Rent fast, reliable routers and WiFi systems for home and office. Wide coverage, stable signal, flexible monthly plans, no long-term contracts.",
    keywords: "router rental, WiFi router rental, wireless router rental, rent router, internet router rental, mesh WiFi rental, home router rental",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Router Rentals", description: "Rent fast, reliable routers and WiFi systems for home and office.", url: `${BASE_URL}/router-rentals`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
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
    description: "Free shipping on orders over $150. Fast delivery available in select areas. Learn about shipping methods, costs, delivery timeframes, and return shipping.",
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
  "/html-sitemap": {
    title: "Site Map — Browse All Pages",
    description: "Browse every page on RentMyGadgets. Find every product, rental category, blog post, and policy page in one place.",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "Site Map", description: "Complete site map of RentMyGadgets with links to all products, categories, blog posts, and policies.", url: `${BASE_URL}/html-sitemap`, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL } },
  },
};

async function getProductMeta(idOrSlug: string): Promise<PageMeta | null> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const product = isUuid
      ? await storage.getProduct(idOrSlug)
      : await storage.getProductBySlug(idOrSlug);
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
    const uniqueLead = `Rent the ${brandPart}${product.name} from RentMyGadgets for $${price.toFixed(2)}/month${catPart}. Flexible 1, 3, 6 or 12-month plans with fast delivery in select areas and optional GadgetCare+ protection.`;
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
      `<p>All rentals include free shipping on 3+ month plans, 14-day free returns, and fast delivery in select areas.</p>` +
      `</section>` +
      `<section><h3>GadgetCare+ Protection</h3>` +
      `<p>Add GadgetCare+ to your rental for complete peace of mind. Coverage includes accidental damage, liquid spills, ` +
      `hardware malfunctions, and priority repair or replacement — all for just 15% of your rental total.</p>` +
      `</section>` +
      `<section><h3>How Renting Works</h3>` +
      `<ol>` +
      `<li><strong>Choose Your Gear:</strong> Browse our catalog of 130+ premium products from trusted brands like ${escapeHtml(product.brand || "Dell, HP, Lenovo, and more")}.</li>` +
      `<li><strong>Select Your Term:</strong> Pick a 1, 3, 6, or 12-month rental period. Longer terms unlock bigger discounts.</li>` +
      `<li><strong>Receive &amp; Enjoy:</strong> We ship your equipment promptly — fast delivery available in select areas. Every item is quality-checked and ready to use.</li>` +
      `<li><strong>Return or Extend:</strong> Send it back when you're done, extend your rental, or choose our Rent-to-Own option to keep it.</li>` +
      `</ol>` +
      `</section>` +
      `<section><h3>Why Rent From RentMyGadgets?</h3>` +
      `<ul>` +
      `<li>No long-term commitments — rent month-to-month or choose a longer term for savings</li>` +
      `<li>Quality-checked equipment from top brands</li>` +
      `<li>Fast delivery available in select areas</li>` +
      `<li>14-day free return window on all rentals</li>` +
      `<li>Optional GadgetCare+ damage protection</li>` +
      `<li>Rent-to-Own pathway if you decide to keep the gear</li>` +
      `<li>Dedicated customer support via email and phone</li>` +
      `</ul>` +
      `</section>` +
      `<section><h3>Related Categories</h3>` +
      `<p>Browse more rental options across all categories and products.</p>` +
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
    const catDesc = category.description || `Browse and rent ${category.name.toLowerCase()} equipment. Flexible rental periods, competitive pricing, and fast delivery available in select areas.`;

    const catLower = category.name.toLowerCase();
    const categoryKeywords = `rent ${catLower}, ${catLower} rental, monthly ${catLower} rental, ${catLower} for rent, rent ${catLower} online, RentMyGadgets ${catLower}, browse ${catLower}`;

    const productListHtml = products.slice(0, 30).map(p => {
      const pPrice = p.pricePerMonth ? parseFloat(p.pricePerMonth.toString()).toFixed(2) : "0.00";
      return `<li><a href="/product/${p.slug || p.id}">${escapeHtml(p.name)}</a> — $${pPrice}/month${p.brand ? ` by ${escapeHtml(p.brand)}` : ""}</li>`;
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
      `<li>Fast delivery available in select areas</li>` +
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
      `<p>Need help choosing? Compare products side by side or contact our team for personalized recommendations.</p>` +
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
      `<p>Read more articles on the RentMyGadgets blog for additional tips and guides.</p></article>`;

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
      const POSTS_PER_PAGE = 10;
      const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
      const currentPage = Math.max(1, Math.min(parseInt(params.get("page") || "1", 10) || 1, totalPages));
      const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
      const pagePosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);

      const categoryBase = `${BASE_URL}/blog?category=${encodeURIComponent(category)}`;
      const pageUrl = (p: number) => p === 1 ? categoryBase : `${categoryBase}&page=${p}`;

      const pagination: PageMeta["pagination"] = {
        currentPage,
        totalPages,
        ...(currentPage > 1 && { prevUrl: pageUrl(currentPage - 1) }),
        ...(currentPage < totalPages && { nextUrl: pageUrl(currentPage + 1) }),
      };

      const pageSuffix = currentPage > 1 ? ` (Page ${currentPage})` : "";

      return {
        canonicalUrl: categoryBase,
        title: `${category} Articles${pageSuffix} | ${SITE_NAME} Blog`,
        description: `Browse ${posts.length > 0 ? posts.length : "our"} ${category} articles on the ${SITE_NAME} blog. Tips, guides, and insights about ${category.toLowerCase()}.${pageSuffix ? ` Page ${currentPage} of ${totalPages}.` : ""}`,
        keywords: `${category.toLowerCase()}, ${category.toLowerCase()} blog, ${category.toLowerCase()} tips, tech rental blog, gadget rental guides`,
        pagination,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category} – ${SITE_NAME} Blog${pageSuffix}`,
          description: `All blog posts in the ${category} category.`,
          url: pageUrl(currentPage),
          isPartOf: { "@type": "Blog", name: `${SITE_NAME} Blog`, url: `${BASE_URL}/blog` },
          ...(pagePosts.length > 0 && {
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: posts.length,
              itemListElement: pagePosts.map((p, i) => ({
                "@type": "ListItem",
                position: startIdx + i + 1,
                url: `${BASE_URL}/blog/${p.slug}`,
                name: p.title,
              })),
            },
          }),
        },
      };
    }
  }

  if (cleanUrl === "/search" && queryPart) {
    const params = new URLSearchParams(queryPart.split("#")[0]);
    const q = params.get("q");
    if (q) {
      return {
        ...STATIC_ROUTES["/search"],
        canonicalUrl: `${BASE_URL}/search`,
        noindex: true,
      };
    }
  }

  if (cleanUrl === "/rent-to-own" && queryPart) {
    const params = new URLSearchParams(queryPart.split("#")[0]);
    const productId = params.get("product");
    if (productId) {
      const product = await storage.getProduct(productId);
      if (product) {
        return {
          canonicalUrl: `${BASE_URL}/rent-to-own?product=${encodeURIComponent(productId)}`,
          title: `Rent-to-Own ${product.name} | ${SITE_NAME}`,
          description: `Own the ${product.name} after 6 months of renting. Apply your rental payments toward ownership at a 30% discount off the $${product.retailPrice} retail price.`,
          keywords: `rent to own ${product.name}, ${product.name} rental, buy after renting, ownership program`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Rent-to-Own: ${product.name}`,
            description: `Rent-to-own program for the ${product.name}. Purchase after 6 months at a reduced price.`,
            url: `${BASE_URL}/rent-to-own?product=${encodeURIComponent(productId)}`,
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL },
          },
        };
      }
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
    description: "Rent high-end laptops, desktops, cameras, and tech accessories with flexible monthly plans and fast delivery in select areas.",
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

const HOMEPAGE_CRAWLER_CONTENT = `<p>RentMyGadgets is the trusted destination for renting premium technology equipment in the United States. Whether you need a powerful Dell XPS or Windows laptop for a creative project, a Canon or Sony mirrorless camera for professional photography, or a color laser printer for your small office, our flexible monthly rental plans fit any budget and timeline. We carry over 130 inspected, ready-to-ship products from trusted brands including Dell, HP, Lenovo, Samsung, Canon, Sony, Nikon, Bose, DJI, Brother, Epson, and Netgear — with fast delivery available in select areas, free shipping on rentals of 3 months or longer, optional GadgetCare+ damage protection, and a Rent-to-Own pathway if you decide to keep the gear.</p>

<h2>Browse Tech Rentals by Category</h2>
<p>Explore our six rental categories to find the right equipment for your project, business, classroom, or studio. Every category is curated with current-generation models, multiple brand options, and transparent monthly pricing.</p>
<ul>
  <li><strong>Desktops &amp; Laptops</strong> — Dell XPS, HP Spectre, Lenovo ThinkPad, and Asus ZenBook ultrabooks, mobile workstations, gaming laptops, and desktop towers for video editing, 3D rendering, and software development.</li>
  <li><strong>Cameras &amp; Gear</strong> — Professional mirrorless and interchangeable-lens cameras from Canon, Sony, Nikon, Fujifilm, and Panasonic. Rent the Canon EOS R5, Sony A7 IV, Nikon Z9, plus cinema lenses, gimbals, and stabilizers for film and photo shoots.</li>
  <li><strong>Printers &amp; Scanners</strong> — HP, Brother, Canon, and Epson laser and inkjet models, multifunction office units, and high-volume scanners for small businesses, home offices, and pop-up events.</li>
  <li><strong>Phones</strong> — Samsung Galaxy S24 Ultra, Google Pixel, OnePlus, and Sony Xperia smartphones for app testing, content creation, business travel, or short-term loaners.</li>
  <li><strong>Headphones</strong> — Bose QuietComfort Ultra, Sony WH-1000XM5, Sennheiser, and Beats premium headphones and earbuds for studio work, podcasting, and travel.</li>
  <li><strong>Routers &amp; Networking</strong> — Eero, Netgear Orbi, Asus ROG, TP-Link, and Google Nest mesh WiFi 6E and WiFi 7 systems, gaming routers, and small business networking gear.</li>
</ul>

<h2>How Renting Tech Works</h2>
<p>Renting is simple, transparent, and designed around real project timelines:</p>
<ol>
  <li><strong>Choose your gear.</strong> Browse the catalog or pick a category, then open any product page to see specs, configurations, and rental pricing.</li>
  <li><strong>Pick your rental term.</strong> Select a 1, 3, 6, or 12-month plan. Longer terms unlock automatic savings — 10% off for 3 months, 20% off for 6 months, and 30% off for 12 months.</li>
  <li><strong>Add optional protection.</strong> Toggle on GadgetCare+ for 15% of your rental total to cover accidental drops, liquid spills, and hardware malfunctions.</li>
  <li><strong>Check out securely.</strong> Expedited delivery is available in select metro areas, and standard shipping arrives in 3 to 5 business days.</li>
  <li><strong>Return it free — or keep it.</strong> Send everything back with the prepaid shipping label, or buy your gear through the Rent-to-Own program after 6 months.</li>
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
  <li><strong>Software developers</strong> rent Dell XPS and Windows workstations for client projects and contract work.</li>
  <li><strong>Event producers</strong> rent monitors, laptops, printers, and WiFi systems for short-term venue setups.</li>
  <li><strong>Students and educators</strong> rent laptops and creative software stations for semester-long courses.</li>
</ul>

<p>Need help? Visit our How It Works guide, browse the blog for gear roundups and tips, or contact our team for personalized assistance.</p>`;

const CRAWLER_PAGE_CONTENT: Record<string, string> = {
  "/": HOMEPAGE_CRAWLER_CONTENT,

  "/categories": `<p>Find the perfect technology rental by browsing our organized categories. RentMyGadgets carries laptops, desktops, cameras, audio equipment, networking gear, and accessories from trusted brands like Dell, HP, Canon, Sony, Nikon, Lenovo, and more. Each category features a curated selection of premium equipment available for flexible monthly rental.</p>
<h2>Laptop Rentals</h2>
<p>Rent Dell XPS, HP Spectre, Lenovo ThinkPad, Asus ZenBook, and other premium laptops. Whether you need a lightweight ultrabook for travel, a powerful workstation for video editing, or a gaming laptop for entertainment, our rental catalog has options for every use case. All laptops are inspected and tested before shipping.</p>
<h2>Desktop and Camera Rentals</h2>
<p>Our desktop category includes high-performance workstations, gaming PCs, and all-in-one computers from Dell, HP, and Lenovo. For photography and videography, rent professional cameras from Canon, Sony, and Nikon, along with lenses and accessories. We also carry audio equipment including studio microphones, speakers, and headphones for podcasting and music production.</p>
<h2>Accessories and Networking</h2>
<p>Complete your rental setup with monitors, keyboards, mice, docking stations, and other peripherals. Our networking category includes routers, mesh WiFi systems, and switches for home and office connectivity. All rentals come with flexible monthly terms — choose 1, 3, 6, or 12 month plans with progressive discounts.</p>`,

  "/products": `<p>Browse our complete catalog of over 130 technology products available for rent at RentMyGadgets. Every item is inspected before shipping and comes with flexible monthly rental terms. Choose from 1, 3, 6, or 12 month rental periods with progressive discounts — save 10% on 3-month terms, 20% on 6-month terms, and 30% on 12-month terms.</p>
<h2>Laptops and Desktops for Rent</h2>
<p>Our inventory includes premium laptops from Dell, HP, Lenovo, and Samsung. Rent a Dell XPS for creative work, an HP Spectre for business productivity, or a gaming laptop for entertainment. Desktop computers are available for gaming, video editing, 3D rendering, and professional workstation needs. All computers are tested and ready to use upon delivery.</p>
<h2>Cameras, Audio, and Accessories</h2>
<p>Professional cameras from Canon, Sony, and Nikon are available for photography and videography projects. Rent mirrorless bodies, interchangeable-lens cameras, lenses, and video equipment. Our audio category includes studio microphones, monitors, and headphones for podcasting, recording, and events.</p>
<p>All products can be protected with our optional GadgetCare+ plan covering accidental damage and hardware issues.</p>`,

  "/about": `<p>RentMyGadgets is a technology equipment rental service offering flexible monthly plans for premium laptops, cameras, desktops, and accessories. Our mission is to make high-end technology accessible through affordable rental options, whether you need equipment for a short-term project, want to try before you buy, or prefer the flexibility of renting over purchasing.</p>
<h2>Our Commitment to Quality</h2>
<p>We inspect and test every piece of equipment before shipping to ensure it meets our quality standards. Our rental terms are flexible with no long-term commitments required — rent for as little as one month or save with longer 3, 6, or 12 month terms. We offer fast delivery in select areas and free returns with prepaid shipping labels on all rentals.</p>
<h2>What We Offer</h2>
<p>Our product catalog features over 130 items across multiple categories including laptops, desktops, cameras, audio equipment, accessories, and networking gear. Brands include Dell, HP, Lenovo, Samsung, Canon, Sony, Nikon, and more. Every rental can be enhanced with optional GadgetCare+ protection for coverage against accidental damage, spills, and hardware malfunctions.</p>`,

  "/how-it-works": `<p>Renting technology from RentMyGadgets is simple and flexible. Our streamlined process makes it easy to get the equipment you need without the commitment of buying.</p>
<h2>Step-by-Step Rental Process</h2>
<p>Step 1: Browse our catalog of over 130 products or explore by category. Find laptops, desktops, cameras, audio equipment, and accessories from leading brands.</p>
<p>Step 2: Choose your rental period from 1, 3, 6, or 12 months. Longer terms include progressive discounts — 10% off for 3 months, 20% off for 6 months, and 30% off for 12 months. Add optional GadgetCare+ protection for coverage against accidental damage.</p>
<p>Step 3: Complete checkout and we ship your equipment fast. Expedited delivery is available in select areas. Free shipping is included on all orders of 3 months or longer.</p>
<p>Step 4: Use your equipment for your full rental period. Need to extend? Adjust your term at any time through your dashboard.</p>
<p>Step 5: When your rental period ends, return the equipment using our prepaid shipping label. Returns are free with a 14-day satisfaction guarantee.</p>
<h2>Additional Options</h2>
<p>Love the tech you are renting? Our Rent-to-Own program lets you purchase equipment after 6 months at a reduced price. A portion of your rental payments goes toward the buyout cost.</p>`,

  "/contact": `<p>Have questions about renting technology equipment? The RentMyGadgets customer support team is here to help with questions about rentals, returns, shipping, billing, account issues, and anything else related to our services. You can reach us by email at support&#64;rentmygadgets.com and we aim to respond within one business day.</p>
<h2>Common Questions We Can Help With</h2>
<p>Our team can assist with choosing the right equipment for your project, extending or modifying an existing rental, understanding our GadgetCare+ protection plan, processing returns and refunds, billing inquiries, and account management.</p>`,

  "/gadgetcare": `<p>GadgetCare+ is our optional protection plan that provides comprehensive coverage for your rental equipment. For 15% of your rental total, GadgetCare+ covers accidental damage, liquid spills, hardware malfunctions, and provides priority repair and replacement service. Coverage starts from day one of your rental period.</p>
<h2>What GadgetCare+ Covers</h2>
<p>Accidental Damage — Coverage for drops, impacts, cracked screens, and other unintentional physical damage. Liquid Spill Protection — If you accidentally spill liquid on your rented equipment, GadgetCare+ covers the repair or replacement cost. Hardware Malfunction — Coverage for unexpected hardware failures during normal use. Priority Repair Service — Members receive priority handling with expedited turnaround times.</p>
<h2>How to Add GadgetCare+</h2>
<p>You can add GadgetCare+ when selecting your rental on any product page, or at any time during your active rental period through your account dashboard. The cost is calculated as 15% of your total rental amount. GadgetCare+ is completely optional and available on all rental products.</p>`,

  "/rent-to-own": `<p>Love the technology you are renting? The RentMyGadgets Rent-to-Own program gives you a flexible path to ownership. After renting any eligible product for at least 6 months, you can purchase it at a reduced buyout price. A portion of your rental payments is credited toward the purchase cost.</p>
<h2>How the Rent-to-Own Program Works</h2>
<p>Step 1: Rent any eligible product using a standard rental plan. Step 2: After 6 months of continuous rental, you become eligible for the buyout option. Step 3: Contact our team or use your dashboard to initiate the purchase. Step 4: Pay the reduced buyout price, which accounts for the rental payments you have already made. Step 5: The equipment is yours to keep, and any applicable warranty transfers to you.</p>
<h2>Rent-to-Own Benefits</h2>
<p>The program is ideal for renters who want to try equipment before committing to a purchase, or who prefer spreading the cost over time. Eligible products include laptops, desktops, cameras, and other equipment across all categories.</p>`,

  "/blog": `<p>Welcome to the RentMyGadgets blog, your resource for technology rental tips, product guides, industry insights, and practical advice on getting the most from your tech rentals.</p>
<h2>Featured Articles</h2>
<p>Best Laptops for Remote Work — A comprehensive guide comparing the top laptops available for rent. Camera Rental Guide for Beginners — Everything you need to know about renting your first camera. Save Money Renting vs Buying Tech — A detailed cost comparison showing how renting saves money for short-term projects.</p>`,

  "/search": `<p>Search the complete RentMyGadgets catalog to find technology equipment for your rental needs. Our catalog includes over 130 products across laptops, desktops, cameras, audio equipment, networking gear, and accessories.</p>
<h2>Find the Right Rental Equipment</h2>
<p>Use the search bar above to find specific products by name, brand, or type. You can filter results by category, price range, and availability to narrow down your options.</p>`,

  "/compare": `<p>Compare rental products side by side at RentMyGadgets. Our comparison tool lets you evaluate specifications, monthly rental pricing, features, and availability for any products in our catalog.</p>
<h2>How to Compare Products</h2>
<p>Add items to your comparison list from any product page. You can compare up to four products at once, viewing their specifications, rental pricing across different term lengths, and available configurations side by side.</p>`,

  "/office-printer-rentals": `<p>RentMyGadgets offers flexible monthly rentals on business-grade printing equipment from HP, Brother, Canon, Xerox, and Epson. Whether you're outfitting a new workspace, handling a short-term project, or scaling capacity for tax season, our plans deliver professional output without a large capital purchase or a three-year lease.</p>
<h2>Why Rent Instead of Buying?</h2>
<p>Purchasing hardware outright locks up cash, ties you to one device for years, and leaves you responsible for toner, maintenance, and disposal. Renting flips that equation. You get the exact model you need for as long as you need it, with optional damage protection and no surprise repair bills. If your volume changes or a better model launches, swap devices instead of selling used equipment at a loss. For startups and project-based teams, renting keeps your balance sheet lean.</p>
<h2>Laser Models Built for Speed and Reliability</h2>
<p>Our monochrome laser inventory delivers crisp black-and-white documents at 35 to 55 pages per minute, with duty cycles built for teams that print every day. Every rental ships with a starter toner cartridge, duplex capability, and wireless connectivity. Popular models include the HP LaserJet Pro MFP series, Brother HL-L6210DW, and Canon imageCLASS LBP236dw.</p>
<h2>Color Laser Rentals for Marketing-Ready Output</h2>
<p>A color laser model delivers sharp, professional output for proposals, presentations, and marketing collateral. Unlike inkjets, it handles high-volume color jobs without smearing or drying out. We carry everything from compact desktop units for creative teams to floor-standing workgroup devices rated for 75,000+ pages per month.</p>
<h2>Compact Models That Fit Anywhere</h2>
<p>Our compact lineup is engineered for home offices, co-working desks, and rooms where every square foot counts. Most units fit on a credenza or shelf while delivering laser-quality output, wireless connectivity, and automatic document feeders. Ideal for freelancers, consultants, and small teams. Starting at $29 per month.</p>
<h2>How Our Rental Process Works</h2>
<p>Step 1: Choose from our laser, color, and compact categories. Step 2: Select a term from 1 to 12 months with progressive discounts. Step 3: We deliver fast — delivery available in select metro areas. Step 4: Work with confidence backed by free tech support and optional damage protection. Step 5: Return with a prepaid shipping label or upgrade anytime.</p>
<h2>What's Included with Every Rental</h2>
<p>Every device ships fully configured with Wi-Fi, Ethernet, and USB connectivity, mobile support, a starter toner cartridge, and a setup guide. Technical support is available seven days a week. Replacement units ship within 24 hours if your device ever fails.</p>`,

  "/laptop-desktop-rentals": `<p>RentMyGadgets offers flexible monthly rentals on powerful laptops, desktop computers, and professional workstations. Whether you need a lightweight laptop for travel, a high-performance desktop for your office, or a workstation built for creative projects, our rental plans give you access to premium computing power without the upfront cost.</p>
<h2>Laptop Rentals for Work and Home Life</h2>
<p>Laptops for work, study, gaming, and travel — light builds, strong batteries, and fast speeds. Every laptop ships pre-configured with the latest OS, charger, and connectivity ready to go.</p>
<h2>Desktop Computer Rentals for Any Room</h2>
<p>Desktop computers for home, work, and gaming — wide displays, strong power, and fast speed. Our desktop rentals range from compact mini PCs to full-tower systems.</p>
<h2>Workstation Rentals for Creative Work</h2>
<p>Workstations built for design, editing, and coding — strong chips, big memory, and quick speed. Perfect for video editing, 3D rendering, and software development.</p>`,

  "/smartphone-rentals": `<p>RentMyGadgets offers flexible monthly rentals on the latest smartphones from top brands. Carry the latest tech without the full retail price or carrier lock-in.</p>
<h2>Smartphones for Daily Life Use</h2>
<p>Smartphones with sharp displays, strong cameras, and long battery life for daily home use. Every phone ships SIM-ready, unlocked, and ready to activate.</p>
<h2>Mobile Phones for Home or Work</h2>
<p>Mobile phones with clear screens, smooth performance, and long battery life for daily use.</p>
<h2>Cell Phones for Home or Travel</h2>
<p>Cell phones with sharp cameras, clear calls, and lasting battery life for work and travel.</p>`,

  "/headphones-audio-rentals": `<p>RentMyGadgets offers flexible monthly rentals on premium headphones, mechanical keyboards, and ergonomic mice. Try the best gear without the full retail investment.</p>
<h2>Headphones for Music and Games</h2>
<p>Headphones with clear sound, comfy fit, and long battery life for music, calls, or gaming.</p>
<h2>Keyboards Made for Fast Typing</h2>
<p>Keyboards with quiet keys, strong build, and smooth action for busy office and home desks.</p>
<h2>Computer Mice for Home or Work</h2>
<p>Computer mice with smooth glide, quiet clicks, and comfort grip for daily work and gaming.</p>`,

  "/camera-gear-rentals": `<p>RentMyGadgets offers flexible monthly rentals on professional cameras, sharp lenses, and studio lighting equipment. Access pro-grade gear without the massive investment.</p>
<h2>Professional Cameras for Photo Studios</h2>
<p>Mirrorless and interchangeable-lens cameras for portraits, events, and travel — sharp lenses, strong build, and clear shots.</p>
<h2>Camera Lenses for Clear Photos</h2>
<p>Camera lenses with sharp focus, wide range, and smooth zoom for portrait and travel shots.</p>
<h2>Lighting Gear for Photo Shoots</h2>
<p>Lighting gear for photo and video shoots — softbox, stands, and bright LED lights in stock.</p>`,

  "/router-rentals": `<p>RentMyGadgets offers flexible monthly rentals on fast, reliable routers and WiFi systems for home and office. Strong, stable connectivity without the upfront cost.</p>
<h2>Routers for Fast Home Internet</h2>
<p>Routers with fast speeds, wide range, and stable signal for home, office, or everyday use.</p>
<h2>WiFi Routers for Home and Work</h2>
<p>WiFi routers with strong speeds, wide coverage, and stable signal for any home and office.</p>
<h2>Wireless Routers for Fast WiFi</h2>
<p>Wireless routers with strong speeds, wide coverage, and easy setup for home or office use.</p>`,

  "/terms": `<p>These Terms and Conditions govern your use of the RentMyGadgets website and rental services. By creating an account or placing a rental order, you agree to these terms. Please read them carefully before using our services. Our rental services are available to individuals and businesses who meet our approval requirements.</p>
<h2>Rental Agreement Terms</h2>
<p>When you rent equipment through RentMyGadgets, you enter into a rental agreement for the specified term length. Rental periods are available in 1, 3, 6, and 12 month increments. You are responsible for the care and safe use of rented equipment during your rental period. Equipment must be returned in the same condition as received, accounting for normal wear and use.</p>
<h2>Pricing, Payments, and Returns</h2>
<p>Rental pricing is displayed on each product page and may include discounts for longer rental terms. A security deposit may be required depending on the product category. Payments are processed at the start of each rental period. Early returns are accepted with a 14-day free return window. Optional GadgetCare+ protection is available for additional coverage.</p>`,

  "/rental-policy": `<p>This Rental Agreement Policy outlines the terms and conditions for renting technology equipment from RentMyGadgets. Understanding these terms helps ensure a smooth rental experience for all parties. This policy covers rental periods, extensions, early returns, equipment care responsibilities, and late return procedures.</p>
<h2>Rental Periods and Extensions</h2>
<p>Rental periods are available in 1, 3, 6, and 12 month terms. Longer terms include progressive discounts on the monthly rate — 10% discount for 3-month rentals, 20% for 6-month rentals, and 30% for 12-month rentals. You may extend your rental at any time through your account dashboard.</p>
<h2>Equipment Care and Responsibilities</h2>
<p>Renters are responsible for the reasonable care and safe use of rented equipment. This includes protecting equipment from extreme conditions, using equipment as intended by the manufacturer, and keeping equipment secure. Normal wear from regular use is expected and acceptable.</p>`,

  "/return-policy": `<p>RentMyGadgets offers a clear and fair return and refund policy for all rental equipment. We include a 14-day free return window on all rentals, giving you time to ensure the equipment meets your needs. This policy covers our return process, refund eligibility, equipment condition guidelines, and how to initiate a return.</p>
<h2>14-Day Free Return Process</h2>
<p>All rentals include a 14-day free return period starting from the date you receive your equipment. If you are not satisfied for any reason within the first 14 days, you may return it for a full refund. To initiate a return, log into your account dashboard and request a return. We provide a prepaid shipping label at no additional cost.</p>
<h2>Equipment Condition and Refund Details</h2>
<p>Returned equipment must be in the same condition as received, accounting for normal wear from regular use. Refunds are processed within 5 to 10 business days after we receive and inspect the returned equipment. Security deposits are refunded separately after inspection.</p>`,

  "/shipping-policy": `<p>RentMyGadgets offers fast and reliable shipping for all rental equipment. Free shipping is included on all orders with rental terms of 3 months or longer. Expedited delivery is available in select areas for qualifying orders. This policy covers shipping methods, delivery timeframes, costs, and return shipping procedures.</p>
<h2>Delivery Options and Timeframes</h2>
<p>Standard shipping delivers equipment within 3 to 5 business days from the date your order is processed. Expedited shipping is available for faster delivery at an additional cost. Expedited delivery is available in select metropolitan areas for qualifying orders. All shipments include tracking information sent to your email and available in your account dashboard. Equipment is packaged securely to prevent damage during transit.</p>
<h2>Return Shipping and Costs</h2>
<p>Return shipping is free for all rentals. We include a prepaid shipping label with every order. Simply package the equipment securely in the original packaging and drop it off at any authorized shipping location. Costs for orders under 3 months vary by product weight and destination — displayed at checkout.</p>`,

  "/security-deposit": `<p>RentMyGadgets may require a refundable security deposit on certain rental products. Security deposits protect against potential equipment damage or loss and are fully refunded when equipment is returned in acceptable condition. This policy explains deposit amounts, how deposits are held, refund conditions, and the deposit process.</p>
<h2>Deposit Amounts and Payment</h2>
<p>Security deposit amounts vary by product category and the value of the equipment being rented. Deposit requirements are clearly displayed on each product page before you complete your rental order. Deposits are collected at the time of checkout along with your first rental payment. Deposit amounts are typically a percentage of the equipment replacement value, ensuring they remain proportional to the risk involved.</p>
<h2>Deposit Refund Process</h2>
<p>Your security deposit is fully refunded when you return the rental equipment in acceptable condition. Refunds are processed within 5 to 10 business days after we receive and inspect the returned equipment. If damage beyond normal wear is identified, repair or replacement costs may be deducted from your deposit.</p>`,

  "/damage-policy": `<p>This Damage and Loss Policy explains what constitutes normal wear versus chargeable damage for rental equipment at RentMyGadgets, as well as procedures for reporting damage, replacement costs, and our optional GadgetCare+ protection plan. Understanding this policy helps you maintain your equipment properly during your rental period.</p>
<h2>Normal Wear vs Chargeable Damage</h2>
<p>Normal wear from regular use is expected and acceptable. This includes minor surface scratches, slight battery capacity reduction over time, and light keyboard or trackpad wear on laptops. Chargeable damage includes cracked or broken screens, liquid damage, significant dents or structural damage, missing components, and damage from misuse or negligence.</p>
<h2>Protection Options and Reporting</h2>
<p>Our optional GadgetCare+ protection plan covers accidental damage, liquid spills, and hardware malfunctions for 15% of your rental total. If your equipment is damaged during your rental period, report it immediately through your account dashboard. Equipment loss or theft must also be reported immediately.</p>`,

  "/privacy": `<p>RentMyGadgets is committed to protecting your personal information and privacy. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and rental services. This policy is compliant with the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), and we support Global Privacy Control (GPC) signals.</p>
<h2>Information We Collect and How We Use It</h2>
<p>We collect information necessary to provide our rental services, including your name, email address, shipping address, payment information, and account preferences. This information is used to process rental orders, manage your account, communicate about your rentals, and improve our services. We do not sell your personal information to third parties.</p>
<h2>Advertising and Tracking Technologies</h2>
<p>With your consent, we use Google Analytics (GA4) to analyze website traffic and Microsoft Advertising (Bing Ads) Universal Event Tracking (UET) to measure the effectiveness of our advertising campaigns. You can manage your tracking preferences through our cookie consent banner. We support Google Consent Mode v2 and honor your consent choices before loading any tracking scripts.</p>
<h2>Your Privacy Rights</h2>
<p>Under CCPA and CPRA, California residents have the right to know what personal information we collect, request deletion of their data, opt out of the sale or sharing of personal information, and exercise these rights without discrimination. We detect and honor Global Privacy Control (GPC) browser signals automatically.</p>`,

  "/cookies": `<p>This Cookie Policy explains how RentMyGadgets uses cookies and similar technologies on our website. Cookies are small text files stored on your device that help us improve your browsing experience, remember your preferences, and analyze how our site is used. We respect your privacy choices and provide granular controls over cookie usage.</p>
<h2>Types of Cookies We Use</h2>
<p>Essential Cookies are required for the website to function properly, including session management, shopping cart functionality, and security features. These cannot be disabled. Functional Cookies remember your preferences such as language settings and recently viewed products to provide a personalized experience. Analytics Cookies help us understand how visitors interact with our website, which pages are most popular, and how we can improve the user experience. Marketing Cookies are used to deliver relevant advertising and track the effectiveness of our marketing campaigns across platforms.</p>
<h2>Managing Your Cookie Preferences</h2>
<p>You can manage your cookie preferences at any time through our cookie consent banner or preference center. We support Global Privacy Control (GPC) browser signals — if your browser sends a GPC signal, we automatically opt you out of analytics and marketing cookies.</p>`,

  "/do-not-sell": `<p>Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California residents have the right to opt out of the sale or sharing of their personal information. RentMyGadgets respects this right and provides a simple way for you to exercise your privacy choices. This page allows you to opt out of any data sharing practices that may qualify as a sale or share under California law.</p>
<h2>How to Opt Out</h2>
<p>Use the toggle below to opt out of the sale or sharing of your personal information. When opted out, we will not share your personal data with third parties for advertising or marketing purposes. Your opt-out preference is saved and applies to all future visits to our website. If you use Global Privacy Control (GPC) in your browser, we automatically detect and honor that signal as a valid opt-out request without requiring any additional action from you.</p>
<h2>What This Means for Your Experience</h2>
<p>Opting out of data sharing does not affect your ability to use our rental services, browse products, or access your account. Essential website functions and your rental experience remain unchanged. You may still see general advertisements, but they will not be based on your personal browsing or rental activity.</p>`,

  "/accessibility": `<p>RentMyGadgets is committed to ensuring digital accessibility for all users, including people with disabilities. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards throughout our website and rental platform. Our goal is to provide an inclusive experience where everyone can browse products, manage rentals, and access all features of our service.</p>
<h2>Our Accessibility Efforts</h2>
<p>We design and develop our website with accessibility in mind, implementing semantic HTML structure with proper heading hierarchy, keyboard navigation support for all interactive elements, sufficient color contrast ratios for text and UI components, descriptive alternative text for product images and informational graphics, clear and consistent navigation across all pages, form labels and error messages that are accessible to screen readers, and responsive design that works across devices and screen sizes. We regularly review and test our website for accessibility compliance.</p>
<h2>Requesting Accommodations</h2>
<p>If you encounter any accessibility barriers while using our website or need assistance with the rental process, please contact our support team at support&#64;rentmygadgets.com. We welcome your feedback and are committed to addressing accessibility issues promptly.</p>`,

  "/advertising-disclosure": `<p>RentMyGadgets is committed to transparency in all of our advertising and marketing practices. This disclosure explains our approach to advertising, the standards we follow, and how we ensure our marketing accurately represents our products and services. We believe honest and clear advertising builds trust with our customers.</p>
<h2>Our Advertising Standards</h2>
<p>All product descriptions, pricing, and promotional claims on our website accurately reflect our current offerings. Monthly rental prices displayed on product pages are the actual prices you will be charged. Discount percentages for longer rental terms (10% for 3 months, 20% for 6 months, 30% for 12 months) are calculated transparently and applied at checkout. Product images represent the actual equipment available for rent. We do not use misleading claims, fake reviews, or deceptive pricing practices in any of our advertising or website content.</p>
<h2>Third-Party Advertising and Privacy</h2>
<p>We may use third-party advertising platforms to promote our services. These advertisements are clearly marked and comply with each platform's advertising policies. We use consent-gated advertising scripts — tracking and marketing cookies are only loaded after you provide explicit consent through our cookie banner.</p>`,

  "/login": `<p>Sign in to your RentMyGadgets account to manage your technology rentals, track orders, view your rental history, and access your account settings. Your account provides a central dashboard for everything related to your rental experience, from browsing available equipment to managing active rentals and protection plans.</p>
<h2>Account Features</h2>
<p>With a RentMyGadgets account, you can track the status of your current rentals and deliveries, view your complete rental history and past orders, manage your shipping addresses and payment methods, extend or modify active rental periods, add or remove GadgetCare+ protection on your rentals, initiate returns and track refund status, and save products to your wishlist for future rental. Your account information is protected with secure authentication and encrypted connections.</p>
<h2>New to RentMyGadgets</h2>
<p>If you do not have an account yet, you can create one during the checkout process or by visiting our registration page. Creating an account is free and only takes a minute.</p>`,

  "/cart": `<p>Review the technology rental equipment in your shopping cart. Here you can adjust quantities, change rental periods, add or remove GadgetCare+ protection, and proceed to checkout when you are ready. Your cart shows the monthly rental price for each item, any applicable discounts for longer rental terms, and your estimated order total.</p>
<h2>Rental Pricing and Discounts</h2>
<p>RentMyGadgets offers progressive discounts for longer rental commitments. Rent for 1 month at the standard rate, or save 10% per month on 3-month terms, 20% per month on 6-month terms, and 30% per month on 12-month terms. Discounts are applied automatically when you select a longer rental period for any item in your cart. Free shipping is included on all orders with rental terms of 3 months or longer.</p>
<h2>Protection and Next Steps</h2>
<p>Consider adding GadgetCare+ protection to your rental items for coverage against accidental damage at 15% of your rental total. When you are ready, proceed to checkout to enter your delivery details and confirm your order.</p>`,

  "/checkout": `<p>Complete your RentMyGadgets rental order securely. Review your selected items, enter your delivery address, and confirm your rental booking. All transactions are processed through secure encrypted connections to protect your payment information. Your rental begins when your equipment ships.</p>
<h2>Order Review and Delivery</h2>
<p>Before completing your order, review each item in your cart including the rental period, monthly price, any applicable discounts, and GadgetCare+ protection status. Standard shipping delivers within 3 to 5 business days. Free shipping is included on orders with rental terms of 3 months or longer.</p>
<h2>Payment and Policies</h2>
<p>Rental payments are processed at the start of each billing period. A refundable security deposit may be required depending on the equipment category. All rentals include a 14-day free return period.</p>`,

  "/dashboard": `<p>Welcome to your RentMyGadgets account dashboard. Here you can manage all aspects of your technology rental experience, including viewing active rentals, tracking deliveries, reviewing order history, managing account settings, and handling returns and extensions.</p>
<h2>Managing Your Rentals</h2>
<p>Your dashboard provides a complete overview of your current and past rental activity. View active rentals, extend your rental period, and initiate returns — we provide prepaid shipping labels for all returns.</p>
<h2>Account Settings and Support</h2>
<p>Update your personal information, shipping addresses, and payment methods in your account settings. View your complete rental history and download receipts for any past orders.</p>`,

  "/html-sitemap": `<p>Welcome to the RentMyGadgets site map. This page provides links to every page on our website, including all product pages, rental category landing pages, collection pages, blog posts, and policy documents.</p>
<h2>Rental Category Pages</h2>
<p>Browse our rental categories: <a href="/laptop-desktop-rentals">Laptop & Desktop Rentals</a>, <a href="/smartphone-rentals">Smartphone Rentals</a>, <a href="/camera-gear-rentals">Camera & Gear Rentals</a>, <a href="/headphones-audio-rentals">Headphones & Audio Rentals</a>, <a href="/router-rentals">Router Rentals</a>, and <a href="/office-printer-rentals">Office Printer Rentals</a>.</p>
<h2>Main Pages</h2>
<p><a href="/">Home</a> | <a href="/categories">Browse Categories</a> | <a href="/products">All Products</a> | <a href="/how-it-works">How It Works</a> | <a href="/gadgetcare">GadgetCare+ Protection</a> | <a href="/rent-to-own">Rent-to-Own</a> | <a href="/search">Search</a> | <a href="/compare">Compare Products</a> | <a href="/blog">Blog</a> | <a href="/about">About Us</a> | <a href="/contact">Contact</a></p>
<h2>Policy & Legal Pages</h2>
<p><a href="/terms">Terms & Conditions</a> | <a href="/privacy">Privacy Policy</a> | <a href="/rental-policy">Rental Policy</a> | <a href="/return-policy">Return Policy</a> | <a href="/shipping-policy">Shipping Policy</a> | <a href="/damage-policy">Damage Policy</a> | <a href="/security-deposit">Security Deposit</a> | <a href="/cookies">Cookie Policy</a> | <a href="/do-not-sell">Do Not Sell</a> | <a href="/accessibility">Accessibility</a> | <a href="/advertising-disclosure">Advertising Disclosure</a></p>`,
};

function getCrawlerPageContent(url: string): string {
  const cleanUrl = url.split("?")[0].replace(/\/$/, "") || "/";
  return CRAWLER_PAGE_CONTENT[cleanUrl] || "";
}

const NAV_LINKS = [
  { href: "/", text: "Home" },
  { href: "/categories", text: "Categories" },
  { href: "/products", text: "Products" },
  { href: "/how-it-works", text: "How It Works" },
  { href: "/blog", text: "Blog" },
  { href: "/contact", text: "Contact" },
];

const COLLECTION_LINKS: { href: string; text: string }[] = [];

const POLICY_LINKS = [
  { href: "/terms", text: "Terms" },
  { href: "/privacy", text: "Privacy" },
  { href: "/return-policy", text: "Returns" },
  { href: "/accessibility", text: "Accessibility" },
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

  const productSection = _productLinks.length > 0 ? `<p>${_productLinks.join(" | ")}</p>` : "";

  return {
    header: `<header><nav aria-label="Site Navigation"><p><a href="/"><strong>RentMyGadgets</strong></a> | ${navHtml}</p><p>${collectionHtml}</p></nav></header>`,
    bodyLinks: `${catSection}${productSection}${blogSection}`,
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
  cachedCrawlerNav = buildCrawlerNav(url, [], []);
  cachedCrawlerNavTime = now;
  return cachedCrawlerNav;
}

export async function injectMeta(html: string, meta: PageMeta, url: string): Promise<string> {
  const fullTitle = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} | ${SITE_NAME}`;
  const safeTitle = escapeHtml(fullTitle);
  const safeDesc = escapeHtml(meta.description);
  const image = toAbsoluteUrl(meta.image || DEFAULT_IMAGE);
  const fullUrl = meta.canonicalUrl || `${BASE_URL}${stripTrackingParams(url)}`;
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

  if (meta.pagination) {
    if (meta.pagination.prevUrl) {
      result = result.replace("</head>", `    <link rel="prev" href="${escapeHtml(meta.pagination.prevUrl)}" />\n  </head>`);
    }
    if (meta.pagination.nextUrl) {
      result = result.replace("</head>", `    <link rel="next" href="${escapeHtml(meta.pagination.nextUrl)}" />\n  </head>`);
    }
  }

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
  const crawlerContent = `<div id="ssr-content">${nav.header}<main><h1>${safeH1}</h1><p>${safeDesc}</p>${pageContent}</main>${nav.bodyLinks}${nav.footer}</div>`;
  result = result.replace('<div id="root"></div>', `<div id="root">${crawlerContent}</div>`);

  if (!result.includes('id="ssr-cookie-consent"')) {
    const cookieBanner = `<div id="ssr-cookie-consent" role="dialog" aria-label="Cookie consent" style="position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e5e7eb;padding:16px 24px;z-index:9999;box-shadow:0 -2px 8px rgba(0,0,0,0.1)">
  <p style="margin:0 0 8px;font-size:14px;color:#374151">Your Privacy Matters. We use cookies to enhance your experience and analyze traffic. Some information may be shared with advertising partners. You have the right to opt-out of the sale or sharing of your personal information. <a href="/cookies" style="color:#f97316">Cookie Policy</a> | <a href="/privacy" style="color:#f97316">Privacy Policy</a> | <a href="/do-not-sell" style="color:#f97316">Do Not Sell My Info</a></p>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button style="padding:8px 16px;background:#f97316;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Accept All</button><button style="padding:8px 16px;background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:14px">Reject All</button><button style="padding:8px 16px;background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:14px">Customize</button></div>
</div>`;
    result = result.replace("</body>", `${cookieBanner}\n</body>`);
  }

  if (!result.includes("gtag('consent'")) {
    const consentAndUet = `<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied'});
gtag('set','ads_data_redaction',true);
</script>
<script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"YOUR_UET_TAG_ID",enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o)},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","https://bat.bing.com/bat.js","uetq");</script>`;
    result = result.replace("</head>", `${consentAndUet}\n</head>`);
  }

  return result;
}
