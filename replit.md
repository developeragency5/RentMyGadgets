# RentMyGadgets - Tech Rental Platform

## Overview

RentMyGadgets is a full-stack web application for renting high-end technology equipment like laptops, desktops, cameras, and accessories. It features product browsing by category, a shopping cart with flexible rental periods, user authentication, order management, and an admin dashboard for inventory and order oversight. The platform also includes an automated system for syncing product data from manufacturer websites and a batch AI image generation system for product photography. It's built as a monorepo using React for the frontend and Express.js for the backend, with PostgreSQL for data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

- **Component Library**: Shadcn/ui (Radix UI + Tailwind CSS) for accessible, customizable UI components.
- **Styling**: Utility-first Tailwind CSS with a custom theme featuring an orange/amber color palette.
- **Policy Pages**: Comprehensive set of 11 policy pages covering rental, privacy (CCPA/CPRA compliant), shipping, damage, and more, integrated into the footer and checkout process. Includes a cookie consent banner and preference center.

### Technical Implementations

- **Frontend**: React 18 with TypeScript, Vite, Wouter for routing, TanStack Query for server state, and React Context for global state.
- **Backend**: Node.js with Express.js, TypeScript, Drizzle ORM for PostgreSQL interactions, bcryptjs for password hashing, and custom session-based authentication (in-memory).
- **Data Storage**: PostgreSQL (via Neon Serverless) with a schema supporting users, categories, products, carts, orders, and order items. UUID v4 for IDs and Decimal type for monetary values.
- **Build & Deployment**: ESBuild for server bundling and Vite for client bundling.

### Feature Specifications

- **Automated Product Data Sync**: A nightly, fully automated system that fetches product images, descriptions, and specifications from 14 manufacturer websites. It uses a Brand Adapter Pattern for extensibility, processes images into WebP format with multiple sizes, and generates detailed reports with alerts.
- **Batch AI Image Generation**: A system to generate professional product photography using text-to-image AI. It includes a specification parser, a batch runner for orchestration, and supports 20+ image angles. Images are clearly marked as AI-generated and saved to a static directory.
- **AI Product Content Generation**: Rich product page content generated with Gemini AI (gemini-2.5-flash), including:
    - How It Works section with step-by-step rental process
    - Key Benefits highlighting product advantages
    - Considerations for potential concerns
    - Who Should Rent This targeting 4-6 user personas with icons
    - Safety & Maintenance Tips with guidelines
    - Full Specifications with key specs summary and tabbed categories
    - Content cached in `product_content` database table to avoid regeneration
    - Uses p-retry with exponential backoff for robust API calls
- **Similar Products**: Product detail pages show 6 related products from the same category.
- **Product Variant Configuration**: Apple-style product configurator for MacBook products with:
    - Storage options (256GB to 8TB) with dynamic monthly price adjustments
    - Memory options (8GB to 128GB) with price adjustments
    - Chip upgrades (M3 Pro to M4 Max) with price adjustments
    - Real-time price updates as options are selected
    - Stored in `product_variant_options` database table
    - API endpoint: GET /api/products/:id/variants
    - Frontend component: VariantSelector.tsx with proper state reset on navigation
- **Tiered Rental Pricing**: Competitive pricing system with progressive discounts for longer rental terms:
    - 1 Month: Full price (no discount)
    - 3 Months: 10% monthly rate discount
    - 6 Months: 20% monthly rate discount
    - 12 Months: 30% monthly rate discount
    - Frontend utility: `client/src/lib/pricing.ts` with `calculateRentalPricing()` function
    - Cart context updated to support `rentalDuration` and `rentalMonths` fields
    - Product detail page shows rental term selector with savings badges
    - Cart page displays correct rental term labels, pricing, and calculated end dates
    - Backwards compatible with legacy `rentalPeriod` (day/week/month/year) for existing carts
- **GadgetCare+ Protection Plan**: AppleCare+-style protection plan for all rentals:
    - Pricing: 15% of rental total (GADGET_CARE_RATE constant in cart-context.tsx)
    - Coverage includes: accidental damage, liquid spills, hardware malfunctions, priority repairs
    - Toggle on product detail page with coverage details and dynamic pricing display
    - Per-item protection stored in cart context with `hasGadgetCare` field
    - Cart page shows GadgetCare+ badge on protected items and line item in order summary
    - Checkout page displays GadgetCare+ in all order summary sections
    - Uses `getGadgetCareTotal()` function for accurate per-item protection pricing
    - Protection cost correctly scales with rental duration and quantity
    - Dedicated GadgetCare+ page at `/gadgetcare` with coverage details, benefits, how it works, and FAQ
    - Navigation links in header menu and footer Quick Links (blue styling)
- **Legal Compliance**: Implementation of CCPA/CPRA requirements, including privacy policy, "Do Not Sell" page, cookie consent, and accessibility statement (WCAG 2.1 AA).
- **SEO & Performance Optimizations** (hardcoded production domain `www.rentmygadgets.com` for all canonical/OG/sitemap URLs):
    - **Server-Side Meta Injection** (`server/seo-injector.ts`): Injects route-specific `<title>`, `<meta>`, Open Graph, Twitter Card, canonical URL, and JSON-LD structured data into HTML before serving — eliminates cloaking violations for ad platform bots that don't execute JavaScript
    - **Comprehensive JSON-LD Structured Data**: Every page has appropriate schema markup — Organization+WebSite on homepage, Product+BreadcrumbList on product pages, CollectionPage+BreadcrumbList on category pages, AboutPage/ContactPage/WebPage/Blog/SearchResultsPage/HowTo on other pages. Supports array of schemas per page.
    - **Crawler-Friendly Navigation**: Lean hidden `<nav>` with ~20 key links (8 main nav + 6 categories + 4 footer policy) injected into HTML body after `<div id="root">`. Product discovery relies on sitemap.xml rather than inline links to keep per-page link count under 30. Links cached for 1 hour.
    - Product pages get dynamic meta from DB (name, price, description, brand, availability as Schema.org Product)
    - Category pages get dynamic meta from DB (name, description, CollectionPage schema)
    - All 26 static routes have unique, descriptive meta tags with JSON-LD structured data
    - Both dev (`vite.ts`) and production (`static.ts`) use the same async injection pipeline
    - **Image Sitemap**: Google Image Sitemap extension (`xmlns:image`) with `<image:image>` tags for all product images (600+ URLs). Each product's sitemap entry includes `<image:loc>` and `<image:title>` for main + gallery images, making them directly crawlable.
    - **Multi-Image OG Tags**: Product pages include multiple `og:image` tags (main + gallery), all gallery images in JSON-LD Product schema `image` array, and correct `twitter:image`. Dev server strips default template tags before Vite transform to prevent overwriting (`server/vite.ts`).
    - **Printer Collection Pages**: 4 SEO-optimized collection landing pages at `/collections/office-printers`, `/collections/laser-printers`, `/collections/color-laser-printers`, `/collections/small-office-printers`. Each has unique title, description, keywords, and CollectionPage JSON-LD. Client-side SeoHead and server-side seo-injector stay in sync. Routes reuse the ProductList component mapped to the Printers & Scanners category.
    - Dynamic sitemap.xml at /sitemap.xml with 181+ URLs including all pages, categories, products, blog posts, and collection pages (with `<lastmod>` dates)
    - robots.txt with absolute sitemap URL (`https://www.rentmygadgets.com/sitemap.xml`) and Disallow for /api/, /checkout, /dashboard
    - Canonical URLs on all pages via SeoHead component (client-side) and seo-injector (server-side)
    - React.lazy() and Suspense for code splitting (non-critical pages lazy loaded)
    - Enhanced meta keywords for transactional pages (Cart, Checkout, Search)
- **Security Headers (Helmet)**:
    - Content Security Policy (CSP) allowing Google Analytics and Microsoft Ads
    - X-Frame-Options, X-Content-Type-Options, and other standard headers
    - Cross-origin policies configured for manufacturer image CDNs
- **Advertising Platform Integration**:
    - Google Ads gtag.js — consent-gated, only loads after user accepts Analytics cookies
    - Microsoft Ads UET tracking — consent-gated, only loads after user accepts Marketing cookies
    - Scripts managed by `ConsentGatedScripts.tsx` component (no hardcoded scripts in index.html)
    - 14-day free returns badge on product pages for policy compliance
- **Privacy & Consent Compliance (CCPA/CPRA/GDPR)**:
    - Consent utility: `client/src/lib/consent.ts` with GPC detection, consent state management
    - Global Privacy Control (GPC): Browser `Sec-GPC` header detected server-side (`server/index.ts`), `navigator.globalPrivacyControl` detected client-side; auto-opts-out of analytics/marketing
    - Cookie consent banner with granular controls (Essential/Functional/Analytics/Marketing)
    - "Do Not Sell/Share" toggle integrated into consent preferences
    - Consent-gated script loading: analytics/marketing scripts only injected after explicit user consent
    - Cookie cleanup: tracking cookies (`_ga`, `_gid`, `_fbp`, etc.) removed on consent revocation
    - Policy pages: Privacy Policy, Cookie Policy, Do Not Sell, Accessibility Statement, Advertising Disclosure

### System Design Choices

- **Monorepo Structure**: Centralized codebase for frontend and backend.
- **Authentication**: HttpOnly cookie-based sessions for security (protects against XSS session theft). Sessions stored in-memory on server with 7-day expiry.
- **API**: RESTful endpoints with credentials: 'include' for cookie transmission.
- **Data Access**: Drizzle ORM for type-safe PostgreSQL interactions.
- **Scalability (Sync System)**: Batch processing, rate limiting, and graceful failure handling for product data sync.
- **Scalability (AI Image Generation)**: Resumable batch runs, concurrent processing, and exponential backoff retry logic.

### Security Architecture (January 2026)

- **Server-Side Cart Sync**: Cart items persist in database for authenticated users (localStorage fallback for guests). All cart mutations sync to server with optimistic updates and rollback on failure.
- **Server-Authoritative Pricing**: All pricing calculations (tiered discounts, GadgetCare+, tax) performed server-side via `shared/pricing.ts`. Checkout fetches verified totals from GET /api/pricing/cart.
- **Secure Order Creation**: POST /api/orders ignores client-submitted items. Uses server cart and calculateCartPricing() to prevent price manipulation.
- **HttpOnly Cookies**: Session tokens stored in HttpOnly cookies (not localStorage) to prevent XSS attacks. Cookies set with secure=true in production, sameSite=lax for CSRF protection.

### Cart API Endpoints

- **GET /api/cart** - Get authenticated user's cart items
- **POST /api/cart** - Add item to cart (merges duplicates, max 5 units)
- **PUT /api/cart/:id** - Update cart item (quantity, rental period, GadgetCare)
- **DELETE /api/cart/:id** - Remove specific cart item
- **DELETE /api/cart** - Clear entire cart
- **POST /api/cart/sync** - Sync localStorage cart to server on login
- **GET /api/pricing/cart** - Get server-calculated cart pricing

## External Dependencies

- **Database**: Neon (serverless PostgreSQL hosting).
- **NPM Packages**:
    - **UI**: `@radix-ui/*`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `tailwindcss`, `clsx`, `tailwind-merge`, `class-variance-authority`.
    - **Development/Build**: `@replit/vite-plugin-*`, `tsx`, `drizzle-kit`.
    - **Security**: `bcryptjs`.
- **Image Assets**: Product images stored locally in `public/images/products/{brand}/` as optimized WebP files.
- **Product Images**: 115+ products use locally-hosted, SEO-optimized WebP images with descriptive filenames (e.g., `brother-mfc-l8900cdw-front-view.webp`). Remaining ~34 products use external CDN URLs from manufacturer-approved sources. All local images were converted from JPG/PNG to WebP (90% size reduction from 323MB to 31MB).
- **Image SEO**: 
    - File naming: `{brand}-{product-slug}-{view-description}.webp` pattern
    - Alt text: Dynamic, context-aware alt text derived from filename view descriptions via `deriveAltText()` in `product-image.tsx`
    - Loading: Lazy loading (`loading="lazy"`) and async decoding on all product images
- **Product Gallery Images**: 120 products have multi-image galleries populated from local filesystem images. Gallery URLs stored in `gallery_image_urls` text[] column. `fixGalleryArrays()` in `server/storage.ts` works around a Neon HTTP driver bug where text[] columns return empty arrays (uses `array_to_json()` for correct deserialization). `server/populate-gallery-images.ts` script scans `public/images/products/{brand}/` and matches images to products by slug. Run it with `npx tsx server/populate-gallery-images.ts` to re-populate after adding new images.
- **AI Image Generation**: External AI models (implied by "text-to-image AI" and "Sharp-based image optimization").