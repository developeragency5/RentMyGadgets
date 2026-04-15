import {
  BrandAdapter,
  AdapterResult,
  AdapterConfig,
  ProductData,
  DEFAULT_CONFIG,
  RateLimiter,
  fetchWithRetry,
  extractMetaContent,
  extractJsonLd,
  cleanText,
} from './types';
import { scrapeAppleGalleryImages } from '../browser-scraper';

const APPLE_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.apple.com',
  searchUrl: 'https://www.apple.com/us/search/',
  rateLimit: 20, // Conservative rate limit for Apple
  timeout: 30000,
};

const APPLE_PRODUCT_PATTERNS: Record<string, { urlPath: string; galleryPath: string; keywords: string[] }> = {
  'MacBook Pro': { urlPath: '/shop/buy-mac/macbook-pro', galleryPath: '/macbook-pro', keywords: ['macbook', 'pro'] },
  'MacBook Air': { urlPath: '/shop/buy-mac/macbook-air', galleryPath: '/macbook-air', keywords: ['macbook', 'air'] },
  'Mac Studio': { urlPath: '/shop/buy-mac/mac-studio', galleryPath: '/mac-studio', keywords: ['mac', 'studio'] },
  'Mac Pro': { urlPath: '/shop/buy-mac/mac-pro', galleryPath: '/mac-pro', keywords: ['mac', 'pro'] },
  'Mac mini': { urlPath: '/shop/buy-mac/mac-mini', galleryPath: '/mac-mini', keywords: ['mac', 'mini'] },
  'iMac': { urlPath: '/shop/buy-mac/imac', galleryPath: '/imac', keywords: ['imac'] },
  'Pro Display XDR': { urlPath: '/shop/product/HMUA2LL/A/pro-display-xdr', galleryPath: '/pro-display-xdr', keywords: ['pro', 'display', 'xdr'] },
  'Studio Display': { urlPath: '/studio-display', galleryPath: '/studio-display', keywords: ['studio', 'display'] },
  'AirPods Pro': { urlPath: '/shop/product/MTJV3AM/A/airpods-pro', galleryPath: '/airpods-pro', keywords: ['airpods', 'pro'] },
  'AirPods Max': { urlPath: '/shop/product/MGYH3AM/A/airpods-max', galleryPath: '/airpods-max', keywords: ['airpods', 'max'] },
  'AirPods': { urlPath: '/shop/product/MV7N2AM/A/airpods', galleryPath: '/airpods', keywords: ['airpods'] },
  'iPad Pro': { urlPath: '/shop/buy-ipad/ipad-pro', galleryPath: '/ipad-pro', keywords: ['ipad', 'pro'] },
  'iPad Air': { urlPath: '/shop/buy-ipad/ipad-air', galleryPath: '/ipad-air', keywords: ['ipad', 'air'] },
  'iPad mini': { urlPath: '/shop/buy-ipad/ipad-mini', galleryPath: '/ipad-mini', keywords: ['ipad', 'mini'] },
  'iPad': { urlPath: '/shop/buy-ipad/ipad', galleryPath: '/ipad', keywords: ['ipad'] },
  'Apple Watch Ultra': { urlPath: '/shop/buy-watch/apple-watch-ultra', galleryPath: '/apple-watch-ultra', keywords: ['watch', 'ultra'] },
  'Apple Watch': { urlPath: '/shop/buy-watch/apple-watch', galleryPath: '/apple-watch-series-10', keywords: ['apple', 'watch'] },
  'iPhone': { urlPath: '/shop/buy-iphone', galleryPath: '/iphone', keywords: ['iphone'] },
  'Magic Keyboard': { urlPath: '/shop/product/MK2C3LL/A/magic-keyboard', galleryPath: '/shop/mac/accessories', keywords: ['magic', 'keyboard'] },
  'Magic Mouse': { urlPath: '/shop/product/MK2E3AM/A/magic-mouse', galleryPath: '/shop/mac/accessories', keywords: ['magic', 'mouse'] },
  'Magic Trackpad': { urlPath: '/shop/product/MK2D3AM/A/magic-trackpad', galleryPath: '/shop/mac/accessories', keywords: ['magic', 'trackpad'] },
};

export class AppleAdapter implements BrandAdapter {
  brand = 'Apple';
  supportedPatterns = [
    /^Apple\s/i,
    /^Mac\s?(Book|Studio|Pro|mini)?/i,
    /^iMac/i,
    /^iPad/i,
    /^iPhone/i,
    /^AirPods/i,
    /^Apple\s?Watch/i,
    /^Magic\s(Keyboard|Mouse|Trackpad)/i,
    /^Pro\sDisplay/i,
    /^Studio\sDisplay/i,
  ];

  private rateLimiter = new RateLimiter(APPLE_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'apple') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      // Find matching product category
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        // Try search fallback
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${APPLE_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        APPLE_CONFIG,
        this.rateLimiter
      );

      if (!html || status !== 200) {
        return {
          success: false,
          productId: '',
          brand: this.brand,
          error: `Failed to fetch product page: HTTP ${status}`,
          httpStatus: status,
          durationMs: Date.now() - startTime,
          sourceUrl: productUrl,
        };
      }

      // Use Puppeteer to scrape gallery images from the store page (carousel with 6-8 images)
      let browserGalleryImages: string[] = [];
      try {
        console.log(`[apple-adapter] Using browser to scrape carousel images from: ${productUrl}`);
        const marketingUrl = matchedProduct.galleryPath ? `${APPLE_CONFIG.baseUrl}${matchedProduct.galleryPath}` : undefined;
        const galleryResult = await scrapeAppleGalleryImages(productUrl, marketingUrl);
        if (galleryResult.success && galleryResult.images.length > 0) {
          browserGalleryImages = galleryResult.images;
          console.log(`[apple-adapter] Browser scraped ${browserGalleryImages.length} carousel images`);
        }
      } catch (err) {
        console.log('[apple-adapter] Browser scraping failed, falling back to static extraction');
      }

      // Also fetch marketing page for additional gallery images (different angles)
      let galleryHtml: string | null = null;
      if (matchedProduct.galleryPath && matchedProduct.galleryPath !== matchedProduct.urlPath) {
        try {
          const galleryUrl = `${APPLE_CONFIG.baseUrl}${matchedProduct.galleryPath}`;
          console.log(`[apple-adapter] Fetching marketing page for gallery: ${galleryUrl}`);
          const galleryResult = await fetchWithRetry(galleryUrl, APPLE_CONFIG, this.rateLimiter);
          if (galleryResult.html && galleryResult.status === 200) {
            galleryHtml = galleryResult.html;
          }
        } catch (err) {
          console.log('[apple-adapter] Gallery page fetch failed, continuing with store images');
        }
      }

      const productData = await this.extractProductData(html, productUrl, galleryHtml, browserGalleryImages);

      if (!productData) {
        return {
          success: false,
          productId: '',
          brand: this.brand,
          error: 'Could not extract product data',
          durationMs: Date.now() - startTime,
          sourceUrl: productUrl,
        };
      }

      return {
        success: true,
        productId: '',
        brand: this.brand,
        data: productData,
        durationMs: Date.now() - startTime,
        sourceUrl: productUrl,
        httpStatus: status,
      };
    } catch (error: any) {
      return {
        success: false,
        productId: '',
        brand: this.brand,
        error: error.message,
        durationMs: Date.now() - startTime,
      };
    }
  }

  private findProductMatch(productName: string): { urlPath: string; galleryPath: string; keywords: string[] } | null {
    const nameLower = productName.toLowerCase();
    
    // Try exact matches first
    for (const [product, config] of Object.entries(APPLE_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    // Try keyword matching
    for (const [_, config] of Object.entries(APPLE_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${APPLE_CONFIG.searchUrl}?q=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        APPLE_CONFIG,
        this.rateLimiter
      );

      if (!html || status !== 200) {
        return {
          success: false,
          productId: '',
          brand: this.brand,
          error: `Search failed: HTTP ${status}`,
          httpStatus: status,
          durationMs: Date.now() - startTime,
          sourceUrl: searchUrl,
        };
      }

      // Extract first product link from search results
      const productLinkMatch = html.match(/href=["'](\/shop\/product\/[^"']+)["']/i) ||
                               html.match(/href=["'](\/[^"']*(?:mac|ipad|iphone|watch|airpods)[^"']*?)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${APPLE_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          APPLE_CONFIG,
          this.rateLimiter
        );

        if (productHtml && productStatus === 200) {
          const productData = await this.extractProductData(productHtml, productUrl);
          if (productData) {
            return {
              success: true,
              productId: '',
              brand: this.brand,
              data: productData,
              durationMs: Date.now() - startTime,
              sourceUrl: productUrl,
              httpStatus: productStatus,
            };
          }
        }
      }

      // Extract data from search results page itself
      const ogImage = extractMetaContent(html, 'og:image');
      const ogDescription = extractMetaContent(html, 'og:description');

      if (ogImage) {
        return {
          success: true,
          productId: '',
          brand: this.brand,
          data: {
            name: productName,
            imageUrl: ogImage,
            description: ogDescription || undefined,
            productUrl: searchUrl,
          },
          durationMs: Date.now() - startTime,
          sourceUrl: searchUrl,
          httpStatus: status,
        };
      }

      return {
        success: false,
        productId: '',
        brand: this.brand,
        error: 'No product found in search results',
        durationMs: Date.now() - startTime,
        sourceUrl: searchUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        productId: '',
        brand: this.brand,
        error: error.message,
        durationMs: Date.now() - startTime,
        sourceUrl: searchUrl,
      };
    }
  }

  async extractProductData(html: string, productUrl: string, galleryHtml?: string | null, browserGalleryImages?: string[]): Promise<ProductData | null> {
    try {
      // Extract Open Graph metadata
      const ogImage = extractMetaContent(html, 'og:image');
      const ogTitle = extractMetaContent(html, 'og:title');
      const ogDescription = extractMetaContent(html, 'og:description');
      const twitterImage = extractMetaContent(html, 'twitter:image');

      // Extract JSON-LD structured data
      const jsonLd = extractJsonLd(html, 'Product');
      
      // Build image URL - prefer high-res versions
      let imageUrl = ogImage || twitterImage;
      if (imageUrl) {
        // Apple often has wid/hei parameters - request larger version
        imageUrl = imageUrl.replace(/wid=\d+/i, 'wid=1200')
                          .replace(/hei=\d+/i, 'hei=1200')
                          .replace(/fmt=\w+/i, 'fmt=png');
      }

      // Helper to extract unique image path (without size/query params)
      const getImageKey = (url: string): string => {
        try {
          // For relative URLs, just process the path
          const path = url.startsWith('http') ? new URL(url).pathname : url;
          // Remove size suffixes like _small, _medium, _large, _small_2x, _large_2x, __x_large_2x
          // and resolution suffixes
          return path
            .replace(/_(small|medium|large|xlarge)(_2x)?/gi, '')
            .replace(/__[^.]+/g, '') // Remove __x_large_2x patterns
            .replace(/\.(jpg|jpeg|png|webp)$/i, '')
            .replace(/\/images\/overview\/[^/]+\//, '/'); // Normalize section paths
        } catch {
          return url.replace(/_(small|medium|large)(_2x)?/gi, '').slice(0, 60);
        }
      };
      
      // Helper to check if this is a valid product image (not logo, icon, nav, etc)
      const isValidProductImage = (url: string): boolean => {
        const lowerUrl = url.toLowerCase();
        // Skip logos, icons, navigation, and meta images
        if (lowerUrl.includes('/logo') || lowerUrl.includes('_logo')) return false;
        if (lowerUrl.includes('/icon') || lowerUrl.includes('_icon')) return false;
        if (lowerUrl.includes('/nav/') || lowerUrl.includes('/ac/')) return false;
        if (lowerUrl.includes('knowledge_graph')) return false;
        if (lowerUrl.includes('/meta/')) return false;
        if (lowerUrl.includes('structured-data')) return false;
        if (lowerUrl.includes('_16x16') || lowerUrl.includes('_32x32')) return false;
        // Only accept actual product images with reasonable dimensions in name
        return true;
      };

      // Start with browser-scraped gallery images (from carousel - highest priority)
      const galleryImages: string[] = [];
      const seenImagePaths = new Set<string>();
      
      // Add browser-scraped carousel images first (these are the 6-8 carousel images from the store)
      if (browserGalleryImages && browserGalleryImages.length > 0) {
        console.log(`[apple-adapter] Adding ${browserGalleryImages.length} browser-scraped carousel images`);
        for (const imgUrl of browserGalleryImages) {
          const imageKey = getImageKey(imgUrl);
          if (!seenImagePaths.has(imageKey)) {
            seenImagePaths.add(imageKey);
            galleryImages.push(imgUrl);
          }
        }
      }
      
      // First try to extract from marketing page (has diverse angle shots)
      if (galleryHtml) {
        // Look for images in Apple's marketing page - check multiple sources
        // Look for product carousel/gallery sections - these typically have names like "gallery", "rotate", "design"
        const productImagePatterns = [
          // Carousel/gallery images with specific product sections
          /["'](\/v\/[^"']*\/images\/overview\/[^"']*\.(jpg|jpeg|png|webp)[^"']*)["']/gi,
          /["'](\/v\/[^"']*\/images\/design\/[^"']*\.(jpg|jpeg|png|webp)[^"']*)["']/gi,
          /["'](\/v\/[^"']*\/images\/routers\/[^"']*\.(jpg|jpeg|png|webp)[^"']*)["']/gi,
          /["'](https:\/\/www\.apple\.com\/v\/[^"']*\/images\/overview\/[^"']*\.(jpg|jpeg|png|webp)[^"']*)["']/gi,
        ];
        
        for (const pattern of productImagePatterns) {
          let match;
          pattern.lastIndex = 0;
          while ((match = pattern.exec(galleryHtml)) !== null && galleryImages.length < 5) {
            let imgUrl = match[1];
            
            // Skip invalid images (logos, icons, etc)
            if (!isValidProductImage(imgUrl)) continue;
            
            // Make URL absolute if relative
            if (imgUrl.startsWith('/')) {
              imgUrl = `https://www.apple.com${imgUrl}`;
            }
            
            // Prefer larger versions (large_2x suffix)
            imgUrl = imgUrl
              .replace(/_(small|medium)(_2x)?/gi, '_large_2x');
            
            const imageKey = getImageKey(imgUrl);
            if (!seenImagePaths.has(imageKey)) {
              seenImagePaths.add(imageKey);
              galleryImages.push(imgUrl);
              console.log(`[apple-adapter] Found gallery image: ${imgUrl.slice(-80)}`);
            }
          }
        }
        
        // 2. Look for images in source/picture elements with srcset (for product galleries)
        const srcsetPattern = /srcset="([^"]+)"/gi;
        let srcsetMatch;
        while ((srcsetMatch = srcsetPattern.exec(galleryHtml)) !== null && galleryImages.length < 5) {
          const srcset = srcsetMatch[1];
          // Get the largest image from srcset (last one or 2x version)
          const urls = srcset.split(',').map(s => s.trim().split(' ')[0]).filter(u => u.length > 0);
          // Find the largest (2x) version
          const largestUrl = urls.find(u => u.includes('_large_2x') || u.includes('_2x')) || urls[urls.length - 1];
          
          if (largestUrl && largestUrl.includes('/images/') && isValidProductImage(largestUrl)) {
            let imgUrl = largestUrl.startsWith('/') ? `https://www.apple.com${largestUrl}` : largestUrl;
            const imageKey = getImageKey(imgUrl);
            if (!seenImagePaths.has(imageKey)) {
              seenImagePaths.add(imageKey);
              galleryImages.push(imgUrl);
              console.log(`[apple-adapter] Found gallery image from srcset: ${imgUrl.slice(-80)}`);
            }
          }
        }
        
        console.log(`[apple-adapter] Found ${galleryImages.length} gallery images from marketing page`);
      }
      
      // Fallback to store images if marketing images are limited
      // Store images often include product configuration views (colors, angles)
      if (galleryImages.length < 4) {
        const storePatterns = [
          /["'](https:\/\/store\.storeimages\.cdn-apple\.com\/[^"']*\/as-images[^"']+)["']/g,
          /["'](https:\/\/store\.storeimages\.cdn-apple\.com\/[^"']+)["']/g,
        ];
        
        for (const storePattern of storePatterns) {
          let storeMatch;
          storePattern.lastIndex = 0;
          while ((storeMatch = storePattern.exec(html)) !== null && galleryImages.length < 5) {
            let imgUrl = storeMatch[1];
            
            // Skip icons, logos, and tiny images
            if (!isValidProductImage(imgUrl)) continue;
            
            // Request larger version
            imgUrl = imgUrl
              .replace(/wid=\d+/i, 'wid=1200')
              .replace(/hei=\d+/i, 'hei=1200');
            
            const imageKey = getImageKey(imgUrl);
            if (!seenImagePaths.has(imageKey)) {
              seenImagePaths.add(imageKey);
              galleryImages.push(imgUrl);
              console.log(`[apple-adapter] Found store image: ${imgUrl.slice(-70)}`);
            }
          }
        }
      }

      // Extract specs from page
      const specs: string[] = [];
      const specsJson: Record<string, unknown> = {};

      // Look for feature bullets
      const featurePattern = /<li[^>]*class=["'][^"']*feature[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi;
      let featureMatch;
      while ((featureMatch = featurePattern.exec(html)) !== null) {
        const spec = cleanText(featureMatch[1]);
        if (spec.length > 5 && spec.length < 200) {
          specs.push(spec);
        }
      }

      // Extract from JSON-LD if available
      if (jsonLd) {
        if (jsonLd.description) {
          specsJson.description = jsonLd.description;
        }
        if (jsonLd.sku) {
          specsJson.sku = jsonLd.sku;
        }
        if (jsonLd.brand) {
          specsJson.brand = typeof jsonLd.brand === 'object' 
            ? (jsonLd.brand as any).name 
            : jsonLd.brand;
        }
      }

      // Extract product name from title
      let name = ogTitle || '';
      // Clean up "Buy X - Apple" format
      name = name.replace(/\s*-\s*Apple\s*$/i, '')
                 .replace(/^Buy\s+/i, '')
                 .trim();

      if (!imageUrl && !name) {
        return null;
      }

      return {
        name: name || 'Apple Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://support.apple.com/search?q=${encodeURIComponent(name || '')}`,
        specs: specs.length > 0 ? specs : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[apple-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const appleAdapter = new AppleAdapter();
