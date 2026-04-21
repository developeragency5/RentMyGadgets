# RentMyGadgets - Tech Rental Platform

## Overview

RentMyGadgets is a full-stack web application designed for renting high-end technology equipment such as laptops, desktops, and cameras. It provides features for product browsing by category, a shopping cart with flexible rental periods, secure user authentication, comprehensive order management, and an administrative dashboard for inventory and order oversight. The platform also automates product data synchronization from manufacturer websites and incorporates AI for generating product images and rich content, aiming to deliver a seamless rental experience with a focus on compliance and performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

- **Component Library**: Utilizes Shadcn/ui (Radix UI + Tailwind CSS) for building accessible and customizable user interface components.
- **Styling**: Employs a utility-first approach with Tailwind CSS, featuring a custom theme with an orange/amber color palette.
- **Policy Pages**: Integrates 11 comprehensive policy pages covering rental terms, privacy (CCPA/CPRA compliant), shipping, and damage, accessible via the footer and checkout process, along with a cookie consent banner.

### Technical Implementations

- **Frontend**: Developed with React 18, TypeScript, Vite, Wouter for routing, TanStack Query for server state management, and React Context for global state.
- **Backend**: Built on Node.js with Express.js, TypeScript, Drizzle ORM for PostgreSQL interactions, bcryptjs for secure password hashing, and custom session-based authentication.
- **Data Storage**: PostgreSQL (hosted on Neon Serverless) stores data for users, categories, products, carts, orders, and order items, using UUID v4 for identifiers and Decimal types for monetary values.
- **Build & Deployment**: ESBuild is used for server bundling and Vite for client bundling.

### Feature Specifications

- **Automated Product Data Sync**: A nightly system that fetches product data from manufacturer websites, converting images to WebP and generating reports. (Note: Apple products have been removed from the platform; Apple adapter remains in codebase but no Apple products exist in DB or static data.)
- **Batch AI Image Generation**: A system for generating professional product photography using text-to-image AI, supporting various angles and clearly marking AI-generated content.
- **AI Product Content Generation**: Rich product page content (How It Works, Key Benefits, Considerations, Who Should Rent This, Safety & Maintenance, Full Specifications) is generated using Gemini AI and cached in the database.
- **Similar Products**: Displays 6 related products on detail pages.
- **Product Variant Configuration**: A configurator for products allowing selection of storage, memory, and chip options with real-time price updates.
- **Tiered Rental Pricing**: Implements a progressive discount structure for longer rental durations (1, 3, 6, 12 months).
- **GadgetCare+ Protection Plan**: An optional protection plan (15% of rental total) covering accidental damage and malfunctions, with dynamic pricing and a dedicated information page.
- **Legal Compliance**: Adheres to CCPA/CPRA requirements, including privacy policies, "Do Not Sell" options, cookie consent, and an accessibility statement.
- **SEO-Friendly Product URLs**: Uses slug-based URLs for product pages, automatically generated and stored in the database.
- **SEO & Performance Optimizations**: Includes server-side meta injection, comprehensive JSON-LD structured data, crawler-friendly navigation, image sitemaps, multi-image Open Graph tags, and SEO-optimized collection pages.
- **HTML Sitemap Page**: A dedicated `/html-sitemap` page that lists all products, categories, collections, blog posts, and policy pages as visible links — solving orphaned sitemap page issues.
- **Category Landing Pages**: 6 SEO landing pages (laptops/desktops, smartphones, headphones/audio, cameras, routers, printers) with hero sections, benefits, sub-categories, FAQs, and CTAs.
- **Collection URL Mapping**: 19 collection slugs mapped to category UUIDs in `COLLECTION_CATEGORY_MAP` (product-list.tsx), with SEO titles/descriptions per collection.
- **Security Headers**: Utilizes Helmet for CSP, X-Frame-Options, and other security headers.
- **Advertising Platform Integration**: Incorporates Google Ads and Microsoft Ads tracking, consent-gated for privacy compliance.
- **Privacy & Consent Compliance**: Features GPC detection, a granular cookie consent banner, "Do Not Sell/Share" toggles, and consent-gated script loading.

### Cloudflare Pages Deployment Notes

- **Dual Database Setup**: The Replit dev environment uses a Replit-managed PostgreSQL (`helium/heliumdb`), while the CF Pages deployment connects to a separate Neon Serverless PostgreSQL. These databases may have different schemas (e.g., the Neon DB may be missing the `slug` column on the products table). All CF product queries use raw SQL (`SELECT *`) via `queryProducts()` helper to avoid Drizzle schema mismatches.
- **Product Query Resilience**: The `queryProducts()` helper in `functions/_lib/db.ts` uses raw SQL with `SELECT *` and snake_to_camelCase conversion. Slug-based lookups fall back to name-based search when the `slug` column is absent.
- **Gallery Array Parsing**: CF Workers `fixGalleryArrays` uses inline parsing (not raw SQL) to handle PostgreSQL array columns. This avoids 500 errors that occurred when the raw neon SQL query crashed on CF Workers.
- **Sitemap**: Product URLs use slug-based paths (`/product/:slug`). Gallery images are included with robust type guards.
- **SEO Injection**: The catch-all function injects product-specific OG images, JSON-LD structured data, and gallery images into server-rendered HTML for crawlers (Bing, Google).
- **Static JSON Fallback**: Frontend `fetchWithFallback` falls back to `/data/products.json` when the API is unavailable.

### System Design Choices

- **Monorepo Structure**: A unified codebase for both frontend and backend.
- **Authentication**: Uses HttpOnly cookie-based sessions for security, stored in-memory with a 7-day expiry.
- **API**: RESTful endpoints with credentials: 'include' for secure cookie transmission.
- **Data Access**: Drizzle ORM ensures type-safe interactions with PostgreSQL.
- **Scalability**: Incorporates batch processing, rate limiting, and retry logic for data sync and AI image generation.
- **Security Architecture**: Features server-side cart synchronization, server-authoritative pricing, and secure order creation to prevent manipulation.

### Cart API Endpoints

- **GET /api/cart**: Retrieve authenticated user's cart.
- **POST /api/cart**: Add an item to the cart.
- **PUT /api/cart/:id**: Update a cart item.
- **DELETE /api/cart/:id**: Remove a specific cart item.
- **DELETE /api/cart**: Clear the entire cart.
- **POST /api/cart/sync**: Synchronize localStorage cart to the server.
- **GET /api/pricing/cart**: Get server-calculated cart pricing.

## External Dependencies

- **Database**: Neon (serverless PostgreSQL hosting).
- **NPM Packages**:
    - **UI**: `@radix-ui/*`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `tailwindcss`, `clsx`, `tailwind-merge`, `class-variance-authority`.
    - **Development/Build**: `@replit/vite-plugin-*`, `tsx`, `drizzle-kit`.
    - **Security**: `bcryptjs`.
- **Image Assets**: Product images are stored locally in `public/images/products/{brand}/` as optimized WebP files.
- **AI Image Generation**: Leverages external AI models for text-to-image generation and Sharp for image optimization.