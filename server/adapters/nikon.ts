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

const NIKON_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.nikonusa.com',
  searchUrl: 'https://www.nikonusa.com/search?q=',
  rateLimit: 20,
  timeout: 30000,
};

const NIKON_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'Z9': { urlPath: '/p/z-9/1653', keywords: ['z9', 'z 9'] },
  'Z8': { urlPath: '/p/z-8/1715', keywords: ['z8', 'z 8'] },
  'Z7 II': { urlPath: '/p/z-7ii/1641', keywords: ['z7', 'z 7', 'ii'] },
  'Z7': { urlPath: '/p/z-7/1595', keywords: ['z7', 'z 7'] },
  'Z6 III': { urlPath: '/p/z-6iii/1749', keywords: ['z6', 'z 6', 'iii'] },
  'Z6 II': { urlPath: '/p/z-6ii/1642', keywords: ['z6', 'z 6', 'ii'] },
  'Z6': { urlPath: '/p/z-6/1598', keywords: ['z6', 'z 6'] },
  'Z5': { urlPath: '/p/z-5/1626', keywords: ['z5', 'z 5'] },
  'Zf': { urlPath: '/p/z-f/1718', keywords: ['zf', 'z f'] },
  'Zfc': { urlPath: '/p/z-fc/1673', keywords: ['zfc', 'z fc'] },
  'Z30': { urlPath: '/p/z-30/1698', keywords: ['z30', 'z 30'] },
  'Z50': { urlPath: '/p/z-50/1633', keywords: ['z50', 'z 50'] },
  'D6': { urlPath: '/p/d6/1624', keywords: ['d6'] },
  'D850': { urlPath: '/p/d850/1585', keywords: ['d850'] },
  'D780': { urlPath: '/p/d780/1619', keywords: ['d780'] },
  'D500': { urlPath: '/p/d500/1559', keywords: ['d500'] },
  'D7500': { urlPath: '/p/d7500/1581', keywords: ['d7500'] },
  'COOLPIX P1000': { urlPath: '/p/coolpix-p1000/1593', keywords: ['coolpix', 'p1000'] },
  'COOLPIX P950': { urlPath: '/p/coolpix-p950/1616', keywords: ['coolpix', 'p950'] },
  'COOLPIX B600': { urlPath: '/p/coolpix-b600/1608', keywords: ['coolpix', 'b600'] },
  'NIKKOR Z 24-70mm f/4 S': { urlPath: '/p/nikkor-z-24-70mm-f-4-s/20072', keywords: ['nikkor', 'z', '24-70', 'f/4'] },
  'NIKKOR Z 24-70mm f/2.8 S': { urlPath: '/p/nikkor-z-24-70mm-f-2.8-s/20089', keywords: ['nikkor', 'z', '24-70', 'f/2.8'] },
  'NIKKOR Z 70-200mm f/2.8 VR S': { urlPath: '/p/nikkor-z-70-200mm-f-2.8-vr-s/20091', keywords: ['nikkor', 'z', '70-200', 'f/2.8'] },
  'NIKKOR Z 50mm f/1.8 S': { urlPath: '/p/nikkor-z-50mm-f-1.8-s/20083', keywords: ['nikkor', 'z', '50mm', 'f/1.8'] },
  'NIKKOR Z 35mm f/1.8 S': { urlPath: '/p/nikkor-z-35mm-f-1.8-s/20081', keywords: ['nikkor', 'z', '35mm', 'f/1.8'] },
  'NIKKOR Z 85mm f/1.8 S': { urlPath: '/p/nikkor-z-85mm-f-1.8-s/20088', keywords: ['nikkor', 'z', '85mm', 'f/1.8'] },
  'NIKKOR Z 14-24mm f/2.8 S': { urlPath: '/p/nikkor-z-14-24mm-f-2.8-s/20097', keywords: ['nikkor', 'z', '14-24', 'f/2.8'] },
  'NIKKOR Z 100-400mm f/4.5-5.6 VR S': { urlPath: '/p/nikkor-z-100-400mm-f-4.5-5.6-vr-s/20106', keywords: ['nikkor', 'z', '100-400'] },
};

export class NikonAdapter implements BrandAdapter {
  brand = 'Nikon';
  supportedPatterns = [
    /^Nikon\s/i,
    /^NIKKOR\s/i,
    /^Z\s?\d+/i,
    /^Zf[c]?\b/i,
    /^D\d{3,4}\b/i,
    /^COOLPIX\s/i,
  ];

  private rateLimiter = new RateLimiter(NIKON_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'nikon') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${NIKON_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        NIKON_CONFIG,
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
    
    for (const [product, config] of Object.entries(NIKON_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(NIKON_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw.toLowerCase())).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${NIKON_CONFIG.searchUrl}${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        NIKON_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/p\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${NIKON_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          NIKON_CONFIG,
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
          .replace(/\?.*$/, '')
          .replace(/\/w_\d+/, '/w_1200')
          .replace(/\/h_\d+/, '/h_1200');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/[^"']*nikonusa\.com[^"']*\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/[^"']*cloudinary[^"']*nikon[^"']*\.(jpg|png|webp))["']/gi,
        /["'](\/\/[^"']*nikonusa\.com[^"']*\.(jpg|png|webp))["']/gi,
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
        /<td[^>]*class=["'][^"']*spec-value[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi,
        /<span[^>]*class=["'][^"']*specification[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
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
        if (jsonLd.brand && typeof jsonLd.brand === 'object') {
          specsJson.brand = (jsonLd.brand as any).name || 'Nikon';
        }
        if (jsonLd.offers && typeof jsonLd.offers === 'object') {
          const offers = jsonLd.offers as Record<string, unknown>;
          if (offers.price) {
            specsJson.price = offers.price;
          }
        }
      }

      let name = ogTitle || '';
      name = name
        .replace(/\s*\|\s*Nikon\s*(USA)?/gi, '')
        .replace(/\s*-\s*Nikon\s*/gi, '')
        .replace(/Buy\s+/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      return {
        name: name || 'Nikon Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://www.nikonusa.com/support`,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[nikon-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const nikonAdapter = new NikonAdapter();
