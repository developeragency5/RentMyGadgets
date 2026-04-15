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

const DELL_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.dell.com',
  searchUrl: 'https://www.dell.com/en-us/search/',
  rateLimit: 20,
  timeout: 30000,
};

const DELL_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'XPS 13': { urlPath: '/en-us/shop/dell-laptops/xps-13-laptop/spd/xps-13-9340-laptop', keywords: ['xps', '13'] },
  'XPS 14': { urlPath: '/en-us/shop/dell-laptops/xps-14-laptop/spd/xps-14-9440-laptop', keywords: ['xps', '14'] },
  'XPS 15': { urlPath: '/en-us/shop/dell-laptops/xps-15-laptop/spd/xps-15-9530-laptop', keywords: ['xps', '15'] },
  'XPS 16': { urlPath: '/en-us/shop/dell-laptops/xps-16-laptop/spd/xps-16-9640-laptop', keywords: ['xps', '16'] },
  'XPS 17': { urlPath: '/en-us/shop/dell-laptops/xps-17-laptop/spd/xps-17-9730-laptop', keywords: ['xps', '17'] },
  'XPS Desktop': { urlPath: '/en-us/shop/desktop-computers/xps-desktop/spd/xps-8960-desktop', keywords: ['xps', 'desktop'] },
  'Alienware m16': { urlPath: '/en-us/shop/gaming-laptops/alienware-m16-r2-gaming-laptop/spd/alienware-m16-r2-laptop', keywords: ['alienware', 'm16'] },
  'Alienware m18': { urlPath: '/en-us/shop/gaming-laptops/alienware-m18-r2-gaming-laptop/spd/alienware-m18-r2-laptop', keywords: ['alienware', 'm18'] },
  'Alienware x16': { urlPath: '/en-us/shop/gaming-laptops/alienware-x16-r2-gaming-laptop/spd/alienware-x16-r2-laptop', keywords: ['alienware', 'x16'] },
  'Alienware Aurora': { urlPath: '/en-us/shop/gaming-pcs/alienware-aurora-r16-gaming-desktop/spd/alienware-aurora-r16-desktop', keywords: ['alienware', 'aurora'] },
  'Latitude 5540': { urlPath: '/en-us/shop/business-laptops/latitude-5540-laptop/spd/latitude-15-5540-laptop', keywords: ['latitude', '5540'] },
  'Latitude 7440': { urlPath: '/en-us/shop/business-laptops/latitude-7440-laptop/spd/latitude-14-7440-laptop', keywords: ['latitude', '7440'] },
  'Latitude 9440': { urlPath: '/en-us/shop/business-laptops/latitude-9440-laptop/spd/latitude-14-9440-2in1-laptop', keywords: ['latitude', '9440'] },
  'Inspiron 14': { urlPath: '/en-us/shop/dell-laptops/inspiron-14-laptop/spd/inspiron-14-5445-laptop', keywords: ['inspiron', '14'] },
  'Inspiron 15': { urlPath: '/en-us/shop/dell-laptops/inspiron-15-laptop/spd/inspiron-15-3535-laptop', keywords: ['inspiron', '15'] },
  'Inspiron 16': { urlPath: '/en-us/shop/dell-laptops/inspiron-16-laptop/spd/inspiron-16-5645-laptop', keywords: ['inspiron', '16'] },
  'Precision 5680': { urlPath: '/en-us/shop/workstations/precision-5680-mobile-workstation/spd/precision-16-5680-laptop', keywords: ['precision', '5680'] },
  'Precision 7680': { urlPath: '/en-us/shop/workstations/precision-7680-mobile-workstation/spd/precision-17-7680-laptop', keywords: ['precision', '7680'] },
  'Precision 7875': { urlPath: '/en-us/shop/workstations/precision-7875-tower-workstation/spd/precision-7875-workstation', keywords: ['precision', '7875'] },
  'OptiPlex 7010': { urlPath: '/en-us/shop/desktops-all-in-one/optiplex-7010-small-form-factor/spd/optiplex-7010-sff', keywords: ['optiplex', '7010'] },
  'OptiPlex 7020': { urlPath: '/en-us/shop/desktops-all-in-one/optiplex-7020-tower/spd/optiplex-7020-tower', keywords: ['optiplex', '7020'] },
  'PowerEdge': { urlPath: '/en-us/shop/servers-storage-and-networking', keywords: ['poweredge'] },
  'UltraSharp': { urlPath: '/en-us/shop/monitors/dell-ultrasharp-monitors', keywords: ['ultrasharp'] },
  'S Series Monitor': { urlPath: '/en-us/shop/monitors/dell-s-series-monitors', keywords: ['dell', 'monitor', 's'] },
  'P Series Monitor': { urlPath: '/en-us/shop/monitors/dell-p-series-monitors', keywords: ['dell', 'monitor', 'p'] },
};

export class DellAdapter implements BrandAdapter {
  brand = 'Dell';
  supportedPatterns = [
    /^Dell\s/i,
    /^XPS\s/i,
    /^Alienware\s/i,
    /^Latitude\s/i,
    /^Inspiron\s/i,
    /^Precision\s/i,
    /^OptiPlex\s/i,
    /^PowerEdge\s/i,
    /^UltraSharp\s/i,
    /^Vostro\s/i,
    /^G\d+\s/i, // G15, G16 gaming laptops
  ];

  private rateLimiter = new RateLimiter(DELL_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'dell') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${DELL_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        DELL_CONFIG,
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
    
    for (const [product, config] of Object.entries(DELL_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(DELL_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${DELL_CONFIG.searchUrl}${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        DELL_CONFIG,
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
      const productLinkMatch = html.match(/href=["'](\/en-us\/shop\/[^"']+\/spd\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${DELL_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          DELL_CONFIG,
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

      // Extract from search results page
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
      
      // Dell often uses CDN with different resolutions
      if (imageUrl) {
        imageUrl = imageUrl
          .replace(/\/w\/\d+\//, '/w/1200/')
          .replace(/\/h\/\d+\//, '/h/1200/')
          .replace(/\?.*$/, ''); // Remove query params for cleaner URL
      }

      // Extract gallery images
      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/i\.dell\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/snpi\.dell\.com\/[^"']+\.(jpg|png|webp))["']/gi,
      ];
      
      for (const pattern of galleryPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const imgUrl = match[1].replace(/\?.*$/, '');
          if (!galleryImages.includes(imgUrl) && galleryImages.length < 5) {
            galleryImages.push(imgUrl);
          }
        }
      }

      // Extract specs
      const specs: string[] = [];
      const specsJson: Record<string, unknown> = {};

      // Dell spec patterns
      const specPatterns = [
        /<div[^>]*class=["'][^"']*spec-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
        /<li[^>]*class=["'][^"']*feature[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi,
        /<td[^>]*class=["'][^"']*spec-value[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi,
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

      // Extract from JSON-LD
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
      }

      // Clean product name
      let name = ogTitle || '';
      name = name
        .replace(/\s*\|\s*Dell\s*(USA|UK)?/gi, '')
        .replace(/\s*-\s*Dell\s*/gi, '')
        .replace(/Buy\s+/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      return {
        name: name || 'Dell Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://www.dell.com/support/home/en-us/product-support/product/${encodeURIComponent(name)}`,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[dell-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const dellAdapter = new DellAdapter();
