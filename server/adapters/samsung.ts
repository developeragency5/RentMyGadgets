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

const SAMSUNG_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.samsung.com',
  searchUrl: 'https://www.samsung.com/us/search/searchMain/',
  rateLimit: 20,
  timeout: 30000,
};

const SAMSUNG_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'Galaxy Book4 Ultra': { urlPath: '/us/computing/galaxy-book/galaxy-book4-ultra/', keywords: ['galaxy', 'book4', 'ultra'] },
  'Galaxy Book4 Pro 360': { urlPath: '/us/computing/galaxy-book/galaxy-book4-pro-360/', keywords: ['galaxy', 'book4', 'pro', '360'] },
  'Galaxy Book4 Pro': { urlPath: '/us/computing/galaxy-book/galaxy-book4-pro/', keywords: ['galaxy', 'book4', 'pro'] },
  'Galaxy Book4 360': { urlPath: '/us/computing/galaxy-book/galaxy-book4-360/', keywords: ['galaxy', 'book4', '360'] },
  'Galaxy Book4': { urlPath: '/us/computing/galaxy-book/galaxy-book4/', keywords: ['galaxy', 'book4'] },
  'Galaxy Book3 Ultra': { urlPath: '/us/computing/galaxy-book/galaxy-book3-ultra/', keywords: ['galaxy', 'book3', 'ultra'] },
  'Galaxy Book3 Pro 360': { urlPath: '/us/computing/galaxy-book/galaxy-book3-pro-360/', keywords: ['galaxy', 'book3', 'pro', '360'] },
  'Galaxy Book3 Pro': { urlPath: '/us/computing/galaxy-book/galaxy-book3-pro/', keywords: ['galaxy', 'book3', 'pro'] },
  'Galaxy Book3 360': { urlPath: '/us/computing/galaxy-book/galaxy-book3-360/', keywords: ['galaxy', 'book3', '360'] },
  'Galaxy Book3': { urlPath: '/us/computing/galaxy-book/galaxy-book3/', keywords: ['galaxy', 'book3'] },
  'Galaxy Book': { urlPath: '/us/computing/galaxy-book/', keywords: ['galaxy', 'book'] },
  'Odyssey G9': { urlPath: '/us/computing/monitors/gaming/odyssey-g9/', keywords: ['odyssey', 'g9'] },
  'Odyssey G8': { urlPath: '/us/computing/monitors/gaming/odyssey-g8/', keywords: ['odyssey', 'g8'] },
  'Odyssey G7': { urlPath: '/us/computing/monitors/gaming/odyssey-g7/', keywords: ['odyssey', 'g7'] },
  'Odyssey G6': { urlPath: '/us/computing/monitors/gaming/odyssey-g6/', keywords: ['odyssey', 'g6'] },
  'Odyssey G5': { urlPath: '/us/computing/monitors/gaming/odyssey-g5/', keywords: ['odyssey', 'g5'] },
  'Odyssey G4': { urlPath: '/us/computing/monitors/gaming/odyssey-g4/', keywords: ['odyssey', 'g4'] },
  'Odyssey G3': { urlPath: '/us/computing/monitors/gaming/odyssey-g3/', keywords: ['odyssey', 'g3'] },
  'Odyssey': { urlPath: '/us/computing/monitors/gaming/', keywords: ['odyssey'] },
  'ViewFinity S9': { urlPath: '/us/computing/monitors/high-resolution/viewfinity-s9/', keywords: ['viewfinity', 's9'] },
  'ViewFinity S8': { urlPath: '/us/computing/monitors/high-resolution/viewfinity-s8/', keywords: ['viewfinity', 's8'] },
  'ViewFinity S7': { urlPath: '/us/computing/monitors/high-resolution/viewfinity-s7/', keywords: ['viewfinity', 's7'] },
  'ViewFinity S6': { urlPath: '/us/computing/monitors/high-resolution/viewfinity-s6/', keywords: ['viewfinity', 's6'] },
  'ViewFinity': { urlPath: '/us/computing/monitors/high-resolution/', keywords: ['viewfinity'] },
  'Smart Monitor M8': { urlPath: '/us/computing/monitors/smart-monitors/smart-monitor-m8/', keywords: ['smart', 'monitor', 'm8'] },
  'Smart Monitor M7': { urlPath: '/us/computing/monitors/smart-monitors/smart-monitor-m7/', keywords: ['smart', 'monitor', 'm7'] },
  'Smart Monitor M5': { urlPath: '/us/computing/monitors/smart-monitors/smart-monitor-m5/', keywords: ['smart', 'monitor', 'm5'] },
  'Smart Monitor': { urlPath: '/us/computing/monitors/smart-monitors/', keywords: ['smart', 'monitor'] },
  'T9 Portable SSD': { urlPath: '/us/computing/memory-storage/portable-solid-state-drives/portable-ssd-t9/', keywords: ['t9', 'ssd'] },
  'T7 Shield': { urlPath: '/us/computing/memory-storage/portable-solid-state-drives/portable-ssd-t7-shield/', keywords: ['t7', 'shield', 'ssd'] },
  'T7 Touch': { urlPath: '/us/computing/memory-storage/portable-solid-state-drives/portable-ssd-t7-touch/', keywords: ['t7', 'touch', 'ssd'] },
  'T7 Portable SSD': { urlPath: '/us/computing/memory-storage/portable-solid-state-drives/portable-ssd-t7/', keywords: ['t7', 'ssd'] },
  'Portable SSD': { urlPath: '/us/computing/memory-storage/portable-solid-state-drives/', keywords: ['portable', 'ssd'] },
  'Galaxy Tab S9 Ultra': { urlPath: '/us/tablets/galaxy-tab-s9/galaxy-tab-s9-ultra/', keywords: ['galaxy', 'tab', 's9', 'ultra'] },
  'Galaxy Tab S9+': { urlPath: '/us/tablets/galaxy-tab-s9/galaxy-tab-s9-plus/', keywords: ['galaxy', 'tab', 's9', 'plus'] },
  'Galaxy Tab S9': { urlPath: '/us/tablets/galaxy-tab-s9/', keywords: ['galaxy', 'tab', 's9'] },
  'Galaxy Tab S8 Ultra': { urlPath: '/us/tablets/galaxy-tab-s8/galaxy-tab-s8-ultra/', keywords: ['galaxy', 'tab', 's8', 'ultra'] },
  'Galaxy Tab S8+': { urlPath: '/us/tablets/galaxy-tab-s8/galaxy-tab-s8-plus/', keywords: ['galaxy', 'tab', 's8', 'plus'] },
  'Galaxy Tab S8': { urlPath: '/us/tablets/galaxy-tab-s8/', keywords: ['galaxy', 'tab', 's8'] },
  'Galaxy Tab A9+': { urlPath: '/us/tablets/galaxy-tab-a/galaxy-tab-a9-plus/', keywords: ['galaxy', 'tab', 'a9', 'plus'] },
  'Galaxy Tab A9': { urlPath: '/us/tablets/galaxy-tab-a/galaxy-tab-a9/', keywords: ['galaxy', 'tab', 'a9'] },
  'Galaxy Tab': { urlPath: '/us/tablets/', keywords: ['galaxy', 'tab'] },
};

export class SamsungAdapter implements BrandAdapter {
  brand = 'Samsung';
  supportedPatterns = [
    /^Samsung\s/i,
    /^Galaxy\s?Book/i,
    /^Galaxy\s?Tab/i,
    /^Odyssey\s/i,
    /^ViewFinity\s/i,
    /^Smart\s?Monitor/i,
    /Portable\s?SSD\s?T[79]/i,
    /^T[79]\s?(Shield|Touch)?\s?(Portable\s?)?(SSD)?/i,
  ];

  private rateLimiter = new RateLimiter(SAMSUNG_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'samsung') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${SAMSUNG_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        SAMSUNG_CONFIG,
        this.rateLimiter
      );

      if (!html || status !== 200) {
        return await this.searchProduct(productName, startTime);
      }

      const productData = await this.extractProductData(html, productUrl);

      if (!productData) {
        return await this.searchProduct(productName, startTime);
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

  private findProductMatch(productName: string): { urlPath: string; keywords: string[] } | null {
    const nameLower = productName.toLowerCase();
    
    for (const [product, config] of Object.entries(SAMSUNG_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(SAMSUNG_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${SAMSUNG_CONFIG.searchUrl}?searchTerm=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        SAMSUNG_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/us\/(?:computing|tablets)[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${SAMSUNG_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          SAMSUNG_CONFIG,
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

  async extractProductData(html: string, productUrl: string): Promise<ProductData | null> {
    try {
      const ogImage = extractMetaContent(html, 'og:image');
      const ogTitle = extractMetaContent(html, 'og:title');
      const ogDescription = extractMetaContent(html, 'og:description');
      const twitterImage = extractMetaContent(html, 'twitter:image');

      const jsonLd = extractJsonLd(html, 'Product');
      
      let imageUrl = ogImage || twitterImage;
      
      if (imageUrl) {
        imageUrl = imageUrl
          .replace(/\$\{[^}]+\}/g, '')
          .replace(/\?.*$/, '');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/images\.samsung\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/image-us\.samsung\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](\/\/images\.samsung\.com\/[^"']+\.(jpg|png|webp))["']/gi,
      ];
      
      for (const pattern of galleryPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          let imgUrl = match[1];
          if (imgUrl.startsWith('//')) {
            imgUrl = 'https:' + imgUrl;
          }
          imgUrl = imgUrl.replace(/\?.*$/, '');
          if (!galleryImages.includes(imgUrl) && galleryImages.length < 5) {
            galleryImages.push(imgUrl);
          }
        }
      }

      const specs: string[] = [];
      const specsJson: Record<string, unknown> = {};

      const specPatterns = [
        /<li[^>]*class=["'][^"']*spec[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi,
        /<div[^>]*class=["'][^"']*feature[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
        /<span[^>]*class=["'][^"']*spec-value[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
        /<p[^>]*class=["'][^"']*benefit[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi,
      ];

      for (const pattern of specPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const spec = cleanText(match[1]);
          if (spec.length > 5 && spec.length < 200 && !specs.includes(spec)) {
            specs.push(spec);
          }
        }
      }

      if (jsonLd) {
        if (jsonLd.description) {
          specsJson.description = jsonLd.description;
        }
        if (jsonLd.sku) {
          specsJson.sku = jsonLd.sku;
        }
        if (jsonLd.mpn) {
          specsJson.modelNumber = jsonLd.mpn;
        }
        if (jsonLd.offers && typeof jsonLd.offers === 'object') {
          const offers = jsonLd.offers as Record<string, unknown>;
          if (offers.price) {
            specsJson.price = offers.price;
          }
        }
        if (jsonLd.brand && typeof jsonLd.brand === 'object') {
          specsJson.brand = (jsonLd.brand as any).name || 'Samsung';
        }
      }

      let name = ogTitle || '';
      name = name
        .replace(/\s*\|\s*Samsung\s*(US)?/gi, '')
        .replace(/\s*-\s*Samsung\s*/gi, '')
        .replace(/^Buy\s+/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      return {
        name: name || 'Samsung Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://www.samsung.com/us/support/search/?searchterm=${encodeURIComponent(name || '')}`,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[samsung-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const samsungAdapter = new SamsungAdapter();
