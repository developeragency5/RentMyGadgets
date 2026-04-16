// @ts-nocheck
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { calculateCartPricing, type CartPricingResult } from "@shared/pricing";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { IMAGES_BASE_DIR, getImageStats } from "./image-processor";
import { getSchedulerStatus, triggerManualSync } from "./scheduler";
import { getSyncProgress, getRecentSyncRuns, getSyncRunById } from "./sync-service";
import { generateSyncReport, getRecentSyncReports, generateAlerts, formatReportAsText, getProductSyncStatus } from "./sync-reports";
import { getSupportedBrands } from "./adapters";
import { 
  generateProductAnglesFromUrl, 
  listAIGeneratedImages, 
  getAIImageStats, 
  AI_IMAGES_DIR,
  generateMatchingGallery
} from "./ai-image-generator";
import { captureAndAnalyzeGallery } from "./reference-analyzer";
import { scrapeAppleGalleryImages } from "./browser-scraper";
import { cache } from "./cache";

// Cookie config helper - in production, scope to .rentmygadgets.com so cookies work
// across apex and www subdomain (and via Cloudflare proxy).
const PROD_COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || ".rentmygadgets.com";
function sessionCookieOpts(maxAgeMs: number) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    maxAge: maxAgeMs,
    path: '/',
    ...(isProd ? { domain: PROD_COOKIE_DOMAIN } : {}),
  };
}

// Secure password hashing with bcrypt
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session store with secure tokens
const sessions: Map<string, { userId: string; expires: Date }> = new Map();

// Generate cryptographically secure session ID
function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = new Date();
  for (const [key, session] of sessions.entries()) {
    if (session.expires < now) {
      sessions.delete(key);
    }
  }
}, 60 * 1000); // Every minute

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Sitemap.xml for SEO
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const baseUrl = "https://rentmygadgets.com";
      const today = new Date().toISOString().split('T')[0];
      
      const staticPages = [
        { loc: "/", priority: "1.0", changefreq: "daily" },
        { loc: "/categories", priority: "0.9", changefreq: "daily" },
        { loc: "/products", priority: "0.9", changefreq: "daily" },
        { loc: "/about", priority: "0.7", changefreq: "monthly" },
        { loc: "/contact", priority: "0.7", changefreq: "monthly" },
        { loc: "/blog", priority: "0.8", changefreq: "weekly" },
        { loc: "/how-it-works", priority: "0.8", changefreq: "monthly" },
        { loc: "/rent-to-own", priority: "0.8", changefreq: "monthly" },
        { loc: "/gadgetcare", priority: "0.8", changefreq: "monthly" },
        { loc: "/search", priority: "0.7", changefreq: "daily" },
        { loc: "/compare", priority: "0.6", changefreq: "monthly" },
        { loc: "/terms", priority: "0.3", changefreq: "yearly" },
        { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
        { loc: "/rental-policy", priority: "0.5", changefreq: "yearly" },
        { loc: "/return-policy", priority: "0.5", changefreq: "yearly" },
        { loc: "/shipping-policy", priority: "0.5", changefreq: "yearly" },
        { loc: "/damage-policy", priority: "0.5", changefreq: "yearly" },
        { loc: "/security-deposit", priority: "0.4", changefreq: "yearly" },
        { loc: "/cookies", priority: "0.3", changefreq: "yearly" },
        { loc: "/do-not-sell", priority: "0.3", changefreq: "yearly" },
        { loc: "/accessibility", priority: "0.3", changefreq: "yearly" },
        { loc: "/advertising-disclosure", priority: "0.3", changefreq: "yearly" },
      ];

      const categories = await storage.getAllCategories();
      const categoryPages = categories.map(cat => ({
        loc: `/categories/${cat.id}`,
        priority: "0.8",
        changefreq: "daily"
      }));

      const products = await storage.getAllProducts();
      const productPages = products.map(prod => ({
        loc: `/product/${prod.id}`,
        priority: "0.7",
        changefreq: "weekly"
      }));

      const blogPosts = await storage.getAllBlogPosts();
      const blogPages = blogPosts
        .filter(post => post.status === "published")
        .map(post => ({
          loc: `/blog/${post.slug}`,
          priority: "0.6",
          changefreq: "monthly"
        }));

      const allPages = [...staticPages, ...categoryPages, ...productPages, ...blogPages];
      
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Serve stock images via API route (bypasses Vite middleware)
  app.get("/api/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(process.cwd(), 'attached_assets/stock_images', filename);
    
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // Serve stock images from /stock_images/ path (for blog posts and other content)
  app.get("/stock_images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(process.cwd(), 'attached_assets/stock_images', filename);
    
    // Security: Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // Serve product images from /product_images/ path (for product gallery images)
  app.get("/product_images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(process.cwd(), 'attached_assets', filename);
    
    // Security: Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // Serve AI-generated images from /generated_images/ path
  app.get("/generated_images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(process.cwd(), 'attached_assets/generated_images', filename);
    
    // Security: Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // Serve processed product images (optimized WebP/JPEG)
  app.get("/api/product-images/:productId/:filename", (req, res) => {
    const { productId, filename } = req.params;
    
    // Security: Validate productId and filename patterns to prevent path traversal
    const validIdPattern = /^[a-zA-Z0-9_-]+$/;
    const validFilenamePattern = /^[a-zA-Z0-9_-]+\.(webp|jpg|jpeg|png)$/;
    
    if (!validIdPattern.test(productId) || !validFilenamePattern.test(filename)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    
    const imagePath = path.join(IMAGES_BASE_DIR, productId, filename);
    
    // Security: Verify resolved path is within allowed directory
    const resolvedPath = path.resolve(imagePath);
    const allowedBase = path.resolve(IMAGES_BASE_DIR);
    if (!resolvedPath.startsWith(allowedBase + path.sep)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (fs.existsSync(resolvedPath)) {
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days cache
      res.setHeader('Vary', 'Accept');
      fs.createReadStream(resolvedPath).pipe(res);
    } else {
      res.status(404).json({ error: 'Product image not found' });
    }
  });

  // Get image processing stats
  app.get("/api/image-stats", (_req, res) => {
    try {
      const stats = getImageStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get sync scheduler status
  app.get("/api/sync/status", (_req, res) => {
    try {
      const status = getSchedulerStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get current sync progress
  app.get("/api/sync/progress", (_req, res) => {
    try {
      const progress = getSyncProgress();
      res.json(progress || { status: 'idle' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Trigger manual sync (requires admin auth)
  app.post("/api/sync/trigger", async (req, res) => {
    try {
      // Require authentication for manual sync
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Check if user is admin
      const user = await storage.getUser(session.userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      const { brand } = req.body || {};
      const result = await triggerManualSync(brand);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Quick test endpoint for Apple sync (no auth for testing)
  app.post("/api/sync/test-apple", async (_req, res) => {
    try {
      const result = await triggerManualSync('Apple');
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sync by brand endpoint
  app.post("/api/sync/brand/:brand", async (req, res) => {
    try {
      const { brand } = req.params;
      const supportedBrands = getSupportedBrands();
      
      if (!supportedBrands.map(b => b.toLowerCase()).includes(brand.toLowerCase())) {
        return res.status(400).json({ 
          error: `Unsupported brand: ${brand}`,
          supportedBrands 
        });
      }
      
      const result = await triggerManualSync(brand);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get list of supported brands
  app.get("/api/sync/brands", (_req, res) => {
    const brands = getSupportedBrands();
    res.json({ brands, count: brands.length });
  });

  // Get sync run history
  app.get("/api/sync/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const runs = await getRecentSyncRuns(limit);
      res.json({ runs, count: runs.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get detailed sync report for a run
  app.get("/api/sync/report/:runId", async (req, res) => {
    try {
      const { runId } = req.params;
      const report = await generateSyncReport(runId);
      
      if (!report) {
        return res.status(404).json({ error: 'Sync run not found' });
      }
      
      const alerts = generateAlerts(report);
      res.json({ report, alerts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get text format report
  app.get("/api/sync/report/:runId/text", async (req, res) => {
    try {
      const { runId } = req.params;
      const report = await generateSyncReport(runId);
      
      if (!report) {
        return res.status(404).json({ error: 'Sync run not found' });
      }
      
      const textReport = formatReportAsText(report);
      res.type('text/plain').send(textReport);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get recent sync reports summary
  app.get("/api/sync/reports", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const reports = await getRecentSyncReports(limit);
      res.json({ reports, count: reports.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get overall product sync status
  app.get("/api/sync/product-status", async (_req, res) => {
    try {
      const status = await getProductSyncStatus();
      const imageStats = getImageStats();
      res.json({ 
        products: status,
        images: imageStats
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sample sync - run sync for 10-20 products of a specific brand
  app.post("/api/sync/sample", async (req, res) => {
    try {
      const { brand, count = 15 } = req.body || {};
      const supportedBrands = getSupportedBrands();
      
      // If no brand specified, pick a random supported brand
      const selectedBrand = brand || supportedBrands[Math.floor(Math.random() * supportedBrands.length)];
      
      console.log(`[sync] Starting sample sync for ${count} ${selectedBrand} products`);
      
      const result = await triggerManualSync(selectedBrand);
      res.json({ 
        ...result, 
        brand: selectedBrand,
        requestedCount: count,
        note: 'Sample sync started. Check /api/sync/status for progress.'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Test sync with specific product names (synchronous - waits for completion)
  app.post("/api/sync/test-products", async (req, res) => {
    try {
      const { products } = req.body || {};
      
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ 
          error: 'Please provide an array of product names',
          example: { products: ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac Mini'] }
        });
      }
      
      const { syncExistingProducts } = await import('./csv-sync');
      
      console.log(`[sync] Testing sync for ${products.length} products:`, products);
      
      const result = await syncExistingProducts(products);
      
      res.json({
        summary: {
          total: result.total,
          succeeded: result.succeeded,
          failed: result.failed,
          successRate: result.total > 0 ? Math.round((result.succeeded / result.total) * 100) : 0
        },
        results: result.results
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // AI Image Generation Routes
  // ============================================

  // Serve AI-generated product images
  app.get("/api/product-images/ai/:productId/:filename", (req, res) => {
    const { productId, filename } = req.params;
    
    const validIdPattern = /^[a-zA-Z0-9_-]+$/;
    const validFilenamePattern = /^[a-zA-Z0-9_-]+\.(webp|jpg|jpeg|png)$/;
    
    if (!validIdPattern.test(productId) || !validFilenamePattern.test(filename)) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    
    const imagePath = path.join(AI_IMAGES_DIR, productId, filename);
    
    const resolvedPath = path.resolve(imagePath);
    const allowedBase = path.resolve(AI_IMAGES_DIR);
    if (!resolvedPath.startsWith(allowedBase + path.sep)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (fs.existsSync(resolvedPath)) {
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=604800');
      fs.createReadStream(resolvedPath).pipe(res);
    } else {
      res.status(404).json({ error: 'AI-generated image not found' });
    }
  });

  // Generate multi-angle images for a product
  app.post("/api/ai-images/generate", async (req, res) => {
    try {
      const { productId, productName, brand, category, imageUrl, angles } = req.body;
      
      if (!productId || !productName || !brand) {
        return res.status(400).json({ 
          error: 'Missing required fields: productId, productName, brand',
          example: {
            productId: 'macbook-air-m3',
            productName: 'MacBook Air 13-inch M3',
            brand: 'Apple',
            category: 'Laptops',
            imageUrl: 'https://example.com/product.jpg',
            angles: ['front', 'side-left', 'side-right', 'top', 'three-quarter', 'detail']
          }
        });
      }
      
      console.log(`[ai-images] Generating multi-angle images for ${productName}...`);
      
      const result = await generateProductAnglesFromUrl(
        productId,
        productName,
        brand,
        category || 'Electronics',
        imageUrl,
        angles
      );
      
      res.json(result);
    } catch (error: any) {
      console.error('[ai-images] Generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get AI image generation stats (must be before :productId route)
  app.get("/api/ai-images/stats", (_req, res) => {
    try {
      const stats = getAIImageStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List AI-generated images for a product
  app.get("/api/ai-images/:productId", (req, res) => {
    try {
      const { productId } = req.params;
      const images = listAIGeneratedImages(productId);
      res.json({ productId, images, count: images.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate images for an existing product from database
  app.post("/api/ai-images/generate-from-db/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const { angles } = req.body || {};
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      console.log(`[ai-images] Generating images for ${product.name} from database...`);
      
      const result = await generateProductAnglesFromUrl(
        productId,
        product.name,
        product.brand || 'Unknown',
        product.categoryId?.toString() || 'Electronics',
        product.imageUrl || '',
        angles
      );
      
      res.json(result);
    } catch (error: any) {
      console.error('[ai-images] Generation from DB error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate reference-matched images from manufacturer gallery
  app.post("/api/ai-images/generate-from-manufacturer/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const { manufacturerUrl, marketingUrl } = req.body || {};
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const brand = product.brand || 'Unknown';
      
      console.log(`[ai-images] Scraping manufacturer gallery for ${product.name}...`);

      let galleryUrls: string[] = [];
      
      if (brand.toLowerCase() === 'apple') {
        const galleryResult = await scrapeAppleGalleryImages(
          manufacturerUrl || product.brandProductUrl || '',
          marketingUrl
        );
        if (galleryResult.success) {
          galleryUrls = galleryResult.images;
        }
      }

      if (galleryUrls.length === 0) {
        return res.status(400).json({ 
          error: 'Could not find manufacturer gallery images',
          hint: 'Provide manufacturerUrl in request body'
        });
      }

      console.log(`[ai-images] Found ${galleryUrls.length} manufacturer images, analyzing...`);

      const analyzedAssets = await captureAndAnalyzeGallery(
        productId,
        product.name,
        brand,
        galleryUrls
      );

      if (analyzedAssets.length === 0) {
        return res.status(400).json({ error: 'Could not analyze manufacturer images' });
      }

      console.log(`[ai-images] Generating ${analyzedAssets.length} reference-matched images...`);

      const result = await generateMatchingGallery(
        productId,
        product.name,
        brand,
        analyzedAssets
      );

      res.json({
        ...result,
        manufacturerImagesFound: galleryUrls.length,
        analyzedImages: analyzedAssets.length,
        note: 'Images generated using AI to match manufacturer gallery. These are AI-generated representations, not official photos.'
      });
    } catch (error: any) {
      console.error('[ai-images] Reference generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // Batch AI Image Generation Routes
  // ============================================

  // Create a new batch run for a category
  app.post("/api/batch-images/create", async (req, res) => {
    try {
      const { createBatchRun } = await import('./batch-image-runner');
      const { category, maxProducts, startFromBrand, dryRun } = req.body || {};
      
      if (!category) {
        return res.status(400).json({
          error: 'Category is required',
          supportedCategories: ['Desktops & Laptops', 'Printers & Scanners', 'Headphones', 'Cameras & Gear', 'Routers']
        });
      }
      
      const runId = await createBatchRun({
        category,
        maxProducts,
        startFromBrand,
        dryRun
      });
      
      res.json({
        runId,
        message: `Batch run created for ${category}`,
        nextStep: `POST /api/batch-images/run/${runId} to start processing`
      });
    } catch (error: any) {
      console.error('[batch-images] Create run error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Start or resume a batch run
  app.post("/api/batch-images/run/:runId", async (req, res) => {
    try {
      const { runBatch } = await import('./batch-image-runner');
      const { runId } = req.params;
      const { concurrency = 2 } = req.body || {};
      
      console.log(`[batch-images] Starting batch run ${runId}...`);
      
      runBatch(runId, concurrency).then(result => {
        console.log(`[batch-images] Batch run ${runId} completed:`, result);
      }).catch(error => {
        console.error(`[batch-images] Batch run ${runId} failed:`, error);
      });
      
      res.json({
        message: 'Batch run started',
        runId,
        checkStatus: `/api/batch-images/status/${runId}`
      });
    } catch (error: any) {
      console.error('[batch-images] Run error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get batch run status
  app.get("/api/batch-images/status/:runId", async (req, res) => {
    try {
      const { getBatchRunStatus } = await import('./batch-image-runner');
      const { runId } = req.params;
      
      const status = await getBatchRunStatus(runId);
      
      if (!status) {
        return res.status(404).json({ error: 'Batch run not found' });
      }
      
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List all batch runs
  app.get("/api/batch-images/runs", async (req, res) => {
    try {
      const { listBatchRuns } = await import('./batch-image-runner');
      const { category } = req.query;
      
      const runs = await listBatchRuns(category as string | undefined);
      
      res.json({
        runs,
        count: runs.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cancel a batch run
  app.post("/api/batch-images/cancel/:runId", async (req, res) => {
    try {
      const { cancelBatchRun } = await import('./batch-image-runner');
      const { runId } = req.params;
      
      await cancelBatchRun(runId);
      
      res.json({ message: 'Batch run cancelled', runId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get available categories and product counts
  app.get("/api/batch-images/categories", async (_req, res) => {
    try {
      const { generateDesktopsLaptopsSpec } = await import('./batch-image-spec-parser');
      
      const desktopSpecs = generateDesktopsLaptopsSpec();
      const brands = [...new Set(desktopSpecs.map(s => s.brand))];
      
      res.json({
        categories: [
          {
            name: 'Desktops & Laptops',
            productCount: desktopSpecs.length,
            imageCount: desktopSpecs.reduce((sum, s) => sum + s.preferredImageViews.length, 0),
            brands: brands.length,
            brandList: brands
          }
        ],
        totalProducts: desktopSpecs.length,
        totalImages: desktopSpecs.reduce((sum, s) => sum + s.preferredImageViews.length, 0),
        note: 'Images will be AI-generated with disclaimers. Not official manufacturer photos.'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Quick start - create and run batch for a category
  app.post("/api/batch-images/quick-start", async (req, res) => {
    try {
      const { createBatchRun, runBatch } = await import('./batch-image-runner');
      const { category, maxProducts = 5, brand } = req.body || {};
      
      if (!category) {
        return res.status(400).json({
          error: 'Category is required',
          example: { category: 'Desktops & Laptops', maxProducts: 5, brand: 'Apple' }
        });
      }
      
      const runId = await createBatchRun({
        category,
        maxProducts,
        startFromBrand: brand
      });
      
      runBatch(runId, 2).then(result => {
        console.log(`[batch-images] Quick start ${runId} completed:`, result);
      }).catch(error => {
        console.error(`[batch-images] Quick start ${runId} failed:`, error);
      });
      
      res.json({
        runId,
        message: `Started batch generation for ${maxProducts} products in ${category}`,
        checkStatus: `/api/batch-images/status/${runId}`
      });
    } catch (error: any) {
      console.error('[batch-images] Quick start error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Serve batch-generated static images
  app.get("/static/images/*", (req, res) => {
    const imagePath = path.join(process.cwd(), req.path);
    
    const resolvedPath = path.resolve(imagePath);
    const allowedBase = path.resolve(process.cwd(), 'static/images');
    if (!resolvedPath.startsWith(allowedBase + path.sep)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (fs.existsSync(resolvedPath)) {
      const ext = path.extname(imagePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.setHeader('X-AI-Generated', 'true');
      fs.createReadStream(resolvedPath).pipe(res);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // ============================================
  // Manufacturer Image Download Routes
  // ============================================

  // Download genuine manufacturer images for a product
  app.post("/api/manufacturer-images/download", async (req, res) => {
    try {
      const { downloadManufacturerImages } = await import('./manufacturer-image-downloader');
      const { category, brand, productModel, preferredImageViews, outputDir, filenameBase } = req.body;
      
      if (!category || !brand || !productModel) {
        return res.status(400).json({
          error: 'Missing required fields',
          example: {
            category: 'Desktops & Laptops',
            brand: 'Dell',
            productModel: 'XPS 13 9310',
            preferredImageViews: ['hero', 'front', '3-quarter'],
            outputDir: '/static/images/Desktops & Laptops/Dell/',
            filenameBase: 'desktops_laptops_dell_xps13_9310'
          }
        });
      }
      
      const result = await downloadManufacturerImages({
        category,
        brand,
        productModel,
        preferredImageViews: preferredImageViews || ['hero', 'front', '3-quarter'],
        outputDir: outputDir || `/static/images/${category}/${brand}/`,
        filenameBase: filenameBase || `${category.toLowerCase().replace(/\s+/g, '_')}_${brand.toLowerCase()}_${productModel.toLowerCase().replace(/\s+/g, '_')}`
      });
      
      res.json(result);
    } catch (error: any) {
      console.error('[manufacturer-images] Download error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Auth middleware - reads session from HttpOnly cookie
  const getSession = (req: any) => {
    const sessionId = req.cookies?.session_id as string;
    if (!sessionId) return null;
    const session = sessions.get(sessionId);
    if (!session || session.expires < new Date()) {
      sessions.delete(sessionId);
      return null;
    }
    return session;
  };

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const registerSchema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        fullName: z.string().optional()
      });
      
      const data = registerSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      // Create user
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName || null
      });
      
      // Create session
      const sessionId = generateSessionId();
      sessions.set(sessionId, {
        userId: user.id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
      
      // Set HttpOnly cookie for secure session management
      res.cookie('session_id', sessionId, sessionCookieOpts(7 * 24 * 60 * 60 * 1000));
      
      res.json({ 
        user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName }
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Create session
      const sessionId = generateSessionId();
      sessions.set(sessionId, {
        userId: user.id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      
      // Set HttpOnly cookie for secure session management
      res.cookie('session_id', sessionId, sessionCookieOpts(7 * 24 * 60 * 60 * 1000));
      
      res.json({ 
        user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Guest Login
  app.post("/api/auth/guest", async (req, res) => {
    try {
      // Generate a unique guest username
      const guestId = generateSessionId().substring(0, 8);
      const guestUsername = `guest_${guestId}`;
      const guestEmail = `${guestUsername}@guest.rentmygadgets.com`;
      
      // Create guest user with a random password (they won't need it)
      const randomPassword = generateSessionId();
      const hashedPassword = await hashPassword(randomPassword);
      
      const user = await storage.createUser({
        username: guestUsername,
        email: guestEmail,
        password: hashedPassword,
        fullName: "Guest User"
      });
      
      // Create session
      const sessionId = generateSessionId();
      sessions.set(sessionId, {
        userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours for guests
      });
      
      // Set HttpOnly cookie for secure session management (shorter expiry for guests)
      res.cookie('session_id', sessionId, sessionCookieOpts(24 * 60 * 60 * 1000));
      
      res.json({ 
        user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, isGuest: true }
      });
    } catch (error: any) {
      console.error("Guest login error:", error);
      res.status(500).json({ error: "Failed to create guest session" });
    }
  });

  // Logout
  app.post("/api/auth/logout", async (req, res) => {
    const sessionId = req.cookies?.session_id as string;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    // Clear the session cookie
    res.clearCookie('session_id', {
      path: '/',
      ...(process.env.NODE_ENV === 'production' ? { domain: PROD_COOKIE_DOMAIN } : {}),
    });
    res.json({ success: true });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = await storage.getUser(session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    res.json({ 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      fullName: user.fullName
    });
  });

  // Cart API endpoints
  const cartItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(1).max(5).default(1),
    rentalPeriod: z.enum(["day", "week", "month", "year"]),
    rentalDuration: z.string().optional().default("monthly"),
    rentalMonths: z.number().optional().default(1),
    variantConfiguration: z.record(z.string()).optional(),
    variantPriceAdjustment: z.number().optional().default(0),
    selectedColor: z.string().optional().nullable(),
    hasGadgetCare: z.boolean().optional().default(false),
    productName: z.string(),
    productPricePerMonth: z.number(),
    productImageUrl: z.string().optional().nullable(),
    productBrand: z.string().optional().nullable(),
    productSpecs: z.array(z.string()).optional().nullable(),
  });

  // GET /api/cart - Get user's cart items
  app.get("/api/cart", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const cartItems = await storage.getCartByUser(session.userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  // GET /api/pricing/cart - Get server-calculated cart pricing
  app.get("/api/pricing/cart", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const cartItems = await storage.getCartByUser(session.userId);
      
      if (cartItems.length === 0) {
        return res.json({
          lineItems: [],
          subtotal: 0,
          gadgetCareTotal: 0,
          taxableAmount: 0,
          taxRate: 0.08,
          gadgetCareRate: 0.15,
          taxEstimate: 0,
          grandTotal: 0,
        } as CartPricingResult);
      }
      
      const pricingInput = cartItems.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        pricePerMonth: parseFloat(String(item.productPricePerMonth)),
        quantity: item.quantity || 1,
        rentalPeriod: item.rentalPeriod as 'day' | 'week' | 'month' | 'year',
        variantPriceAdjustment: parseFloat(String(item.variantPriceAdjustment || '0')),
        hasGadgetCare: item.hasGadgetCare || false,
      }));
      
      const pricing = calculateCartPricing(pricingInput);
      res.json(pricing);
    } catch (error) {
      console.error("Error calculating cart pricing:", error);
      res.status(500).json({ error: "Failed to calculate pricing" });
    }
  });

  // POST /api/cart - Add item to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const data = cartItemSchema.parse(req.body);
      
      const existingItem = await storage.findCartItem(
        session.userId,
        data.productId,
        data.variantConfiguration,
        data.selectedColor || undefined,
        data.rentalDuration,
        data.hasGadgetCare
      );
      
      if (existingItem) {
        const newQuantity = Math.min((existingItem.quantity || 1) + data.quantity, 5);
        const updated = await storage.updateCartItem(existingItem.id, { quantity: newQuantity });
        return res.json(updated);
      }
      
      const cartItem = await storage.addToCart({
        userId: session.userId,
        productId: data.productId,
        quantity: data.quantity,
        rentalPeriod: data.rentalPeriod,
        rentalDuration: data.rentalDuration,
        rentalMonths: data.rentalMonths,
        variantConfiguration: data.variantConfiguration || {},
        variantPriceAdjustment: String(data.variantPriceAdjustment || 0),
        selectedColor: data.selectedColor || null,
        hasGadgetCare: data.hasGadgetCare || false,
        productName: data.productName,
        productPricePerMonth: String(data.productPricePerMonth),
        productImageUrl: data.productImageUrl || null,
        productBrand: data.productBrand || null,
        productSpecs: data.productSpecs || null,
      });
      
      res.status(201).json(cartItem);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ error: error.message || "Failed to add to cart" });
    }
  });

  // PUT /api/cart/:id - Update cart item
  app.put("/api/cart/:id", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const cartItem = await storage.getCartItem(req.params.id);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      if (cartItem.userId !== session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const updateSchema = z.object({
        quantity: z.number().min(1).max(5).optional(),
        rentalPeriod: z.enum(["day", "week", "month", "year"]).optional(),
        rentalDuration: z.string().optional(),
        rentalMonths: z.number().optional(),
        hasGadgetCare: z.boolean().optional(),
      });
      
      const updates = updateSchema.parse(req.body);
      const updated = await storage.updateCartItem(req.params.id, updates);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      res.status(400).json({ error: error.message || "Failed to update cart item" });
    }
  });

  // DELETE /api/cart/:id - Remove item from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const cartItem = await storage.getCartItem(req.params.id);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      if (cartItem.userId !== session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      await storage.removeFromCart(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  // DELETE /api/cart - Clear entire cart
  app.delete("/api/cart", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      await storage.clearCart(session.userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // POST /api/cart/sync - Sync localStorage cart to server (for login)
  app.post("/api/cart/sync", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid cart items" });
      }
      
      const syncedItems = [];
      for (const item of items) {
        try {
          const data = cartItemSchema.parse(item);
          
          const existingItem = await storage.findCartItem(
            session.userId,
            data.productId,
            data.variantConfiguration,
            data.selectedColor || undefined,
            data.rentalDuration,
            data.hasGadgetCare
          );
          
          if (existingItem) {
            const newQuantity = Math.min((existingItem.quantity || 1) + data.quantity, 5);
            const updated = await storage.updateCartItem(existingItem.id, { quantity: newQuantity });
            syncedItems.push(updated);
          } else {
            const cartItem = await storage.addToCart({
              userId: session.userId,
              productId: data.productId,
              quantity: Math.min(data.quantity, 5),
              rentalPeriod: data.rentalPeriod,
              rentalDuration: data.rentalDuration,
              rentalMonths: data.rentalMonths,
              variantConfiguration: data.variantConfiguration || {},
              variantPriceAdjustment: String(data.variantPriceAdjustment || 0),
              selectedColor: data.selectedColor || null,
              hasGadgetCare: data.hasGadgetCare || false,
              productName: data.productName,
              productPricePerMonth: String(data.productPricePerMonth),
              productImageUrl: data.productImageUrl || null,
              productBrand: data.productBrand || null,
              productSpecs: data.productSpecs || null,
            });
            syncedItems.push(cartItem);
          }
        } catch (itemError) {
          console.error("Error syncing cart item:", itemError);
        }
      }
      
      const allItems = await storage.getCartByUser(session.userId);
      res.json(allItems);
    } catch (error) {
      console.error("Error syncing cart:", error);
      res.status(500).json({ error: "Failed to sync cart" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const cached = cache.getAllCategories();
      if (cached) {
        return res.json(cached);
      }
      
      const categories = await storage.getAllCategories();
      cache.setAllCategories(categories);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const cached = cache.getCategory(req.params.id);
      if (cached) {
        return res.json(cached);
      }
      
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      cache.setCategory(category);
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, featured } = req.query;
      
      let products;
      if (categoryId) {
        const cached = cache.getProductsByCategory(categoryId as string);
        if (cached) {
          products = cached;
        } else {
          products = await storage.getProductsByCategory(categoryId as string);
          cache.setProductsByCategory(categoryId as string, products);
        }
      } else if (featured === 'true') {
        const cached = cache.getFeaturedProducts();
        if (cached) {
          products = cached;
        } else {
          products = await storage.getFeaturedProducts();
          cache.setFeaturedProducts(products);
        }
      } else {
        const cached = cache.getAllProducts();
        if (cached) {
          products = cached;
        } else {
          products = await storage.getAllProducts();
          cache.setAllProducts(products);
        }
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const cached = cache.getProduct(req.params.id);
      if (cached) {
        return res.json(cached);
      }
      
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      cache.setProduct(product);
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get product content (AI-generated info sections)
  app.get("/api/products/:id/content", async (req, res) => {
    try {
      const productId = req.params.id;
      
      // Check for cached content first
      let content = await storage.getProductContent(productId);
      
      if (content) {
        return res.json(content);
      }
      
      // Get product and category info for AI generation
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const category = await storage.getCategory(product.categoryId);
      
      // Generate content using Gemini AI
      const { generateProductContent, generateProductSpecifications } = await import("./gemini-content");
      
      // Generate content and specifications in parallel
      const [generatedContent, generatedSpecs] = await Promise.all([
        generateProductContent(
          product.name,
          product.brand || "Unknown",
          category?.name || "Electronics",
          product.description || undefined
        ),
        generateProductSpecifications(
          product.name,
          product.brand || "Unknown",
          category?.name || "Electronics",
          product.description || undefined
        )
      ]);
      
      // Cache the generated content
      content = await storage.createProductContent({
        productId,
        howItWorks: generatedContent.howItWorks,
        keyBenefits: generatedContent.keyBenefits,
        considerations: generatedContent.considerations,
        targetAudience: generatedContent.targetAudience,
        safetyGuidelines: generatedContent.safetyGuidelines,
        maintenanceTips: generatedContent.maintenanceTips,
        specifications: generatedSpecs,
      });
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching/generating product content:", error);
      res.status(500).json({ error: "Failed to fetch product content" });
    }
  });

  // Get product variant options
  app.get("/api/products/:id/variants", async (req, res) => {
    try {
      const productId = req.params.id;
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const variantOptions = await storage.getProductVariantOptions(productId);
      
      const grouped: Record<string, Array<{
        id: string;
        label: string;
        value: string;
        priceAdjustment: number;
        isDefault: boolean;
        available: boolean;
        displayOrder: number;
      }>> = {};
      
      for (const option of variantOptions) {
        if (!grouped[option.variantType]) {
          grouped[option.variantType] = [];
        }
        grouped[option.variantType].push({
          id: option.id,
          label: option.optionLabel,
          value: option.optionValue,
          priceAdjustment: parseFloat(option.priceAdjustmentMonthly),
          isDefault: option.isDefault,
          available: option.available,
          displayOrder: option.displayOrder
        });
      }
      
      res.json(grouped);
    } catch (error) {
      console.error("Error fetching product variants:", error);
      res.status(500).json({ error: "Failed to fetch product variants" });
    }
  });

  // Search products with autocomplete
  app.get("/api/products/search/suggestions", async (req, res) => {
    try {
      const { q, limit = "6" } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        return res.json([]);
      }
      
      const query = q.toLowerCase().trim();
      const maxResults = Math.min(parseInt(limit as string) || 6, 10);
      
      const allProducts = await storage.getAllProducts();
      
      // Score and filter products based on search relevance
      const scored = allProducts
        .map(product => {
          let score = 0;
          const name = product.name.toLowerCase();
          const brand = product.brand?.toLowerCase() || '';
          const description = product.description?.toLowerCase() || '';
          
          // Exact name match gets highest score
          if (name === query) score += 100;
          // Name starts with query
          else if (name.startsWith(query)) score += 50;
          // Name contains query
          else if (name.includes(query)) score += 30;
          
          // Brand match
          if (brand === query) score += 40;
          else if (brand.startsWith(query)) score += 25;
          else if (brand.includes(query)) score += 15;
          
          // Description match
          if (description.includes(query)) score += 10;
          
          // Specs match
          if (product.specs?.some(spec => spec.toLowerCase().includes(query))) {
            score += 5;
          }
          
          // Boost featured products
          if (product.featured && score > 0) score += 5;
          
          return { product, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(item => ({
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          imageUrl: item.product.imageUrl,
          pricePerMonth: item.product.pricePerMonth,
          categoryId: item.product.categoryId
        }));
      
      res.json(scored);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });

  // Orders
  // SECURITY: This endpoint ignores any client-submitted items/prices.
  // All cart data and pricing is fetched from the server-side database.
  app.post("/api/orders", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Please log in to place an order" });
      }

      // SECURITY: Only accept shipping/billing address from client
      // Completely ignore any req.body.items - all cart data comes from server
      const { deliveryAddress, startDate, endDate } = req.body;
      
      if (!deliveryAddress) {
        return res.status(400).json({ error: "Delivery address is required" });
      }

      // STEP 1: Fetch authenticated user's cart from database (server-authoritative)
      const cartItems = await storage.getCartByUser(session.userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // FRAUD PROTECTION: Check max 5 units per product using SERVER cart data
      for (const cartItem of cartItems) {
        if ((cartItem.quantity || 1) > 5) {
          return res.status(400).json({ 
            error: `Maximum 5 units allowed per product. Please reduce the quantity for "${cartItem.productName}".`,
            code: "MAX_QUANTITY_EXCEEDED"
          });
        }
      }

      // FRAUD PROTECTION: Check max 3 orders per user per day
      const userOrders = await storage.getOrdersByUser(session.userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const ordersToday = userOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
      
      if (ordersToday.length >= 3) {
        return res.status(400).json({ 
          error: "You have reached the maximum of 3 orders per day. Please try again tomorrow.",
          code: "MAX_ORDERS_PER_DAY"
        });
      }

      // STEP 2: Calculate pricing using server cart data only
      const pricingInput = cartItems.map(cartItem => ({
        id: cartItem.id,
        productId: cartItem.productId,
        productName: cartItem.productName,
        pricePerMonth: parseFloat(String(cartItem.productPricePerMonth)),
        quantity: cartItem.quantity || 1,
        rentalPeriod: cartItem.rentalPeriod as 'day' | 'week' | 'month' | 'year',
        variantPriceAdjustment: parseFloat(String(cartItem.variantPriceAdjustment || '0')),
        hasGadgetCare: cartItem.hasGadgetCare || false,
      }));
      
      const pricing = calculateCartPricing(pricingInput);
      const totalAmount = pricing.grandTotal;
      
      // STEP 3: Validate all products exist and build order items from server data
      const orderItemsData = [];
      
      for (const lineItem of pricing.lineItems) {
        const product = await storage.getProduct(lineItem.productId);
        if (!product) {
          return res.status(400).json({ error: `Product not found: ${lineItem.productId}` });
        }
        
        if (!product.available) {
          return res.status(400).json({ error: `Product "${product.name}" is no longer available` });
        }
        
        orderItemsData.push({
          productId: lineItem.productId,
          quantity: lineItem.quantity,
          pricePerMonth: product.pricePerMonth,
          rentalPeriod: lineItem.rentalPeriod,
          subtotal: lineItem.itemTotal.toFixed(2)
        });
      }

      // STEP 4: Create order with server-calculated total
      const order = await storage.createOrder({
        userId: session.userId,
        status: 'pending',
        totalAmount: totalAmount.toFixed(2),
        startDate: new Date(startDate || Date.now()),
        endDate: new Date(endDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
        deliveryAddress
      });

      // STEP 5: Create order items from server cart data
      for (const itemData of orderItemsData) {
        await storage.createOrderItem({
          orderId: order.id,
          ...itemData
        });
      }

      // STEP 6: Clear the user's cart after successful order creation
      await storage.clearCart(session.userId);

      res.json({ order, message: "Order placed successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const orders = await storage.getOrdersByUser(session.userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Verify user owns this order
      if (order.userId !== session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const items = await storage.getOrderItems(order.id);
      
      // Fetch product details for each item
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        })
      );

      res.json({ ...order, items: itemsWithProducts });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Blog Posts
  app.get("/api/blog", async (req, res) => {
    try {
      const { category } = req.query;
      let posts;
      if (category) {
        posts = await storage.getBlogPostsByCategory(category as string);
      } else {
        posts = await storage.getAllBlogPosts();
      }
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  return httpServer;
}
