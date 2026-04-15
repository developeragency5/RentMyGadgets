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

const ASUS_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.asus.com',
  searchUrl: 'https://www.asus.com/us/searchall/',
  rateLimit: 20,
  timeout: 30000,
};

const ASUS_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[]; baseUrl?: string }> = {
  'ROG Zephyrus': { urlPath: '/us/laptops/rog-zephyrus/', keywords: ['rog', 'zephyrus'], baseUrl: 'https://rog.asus.com' },
  'ROG Strix': { urlPath: '/us/laptops/rog-strix/', keywords: ['rog', 'strix'], baseUrl: 'https://rog.asus.com' },
  'ROG Flow': { urlPath: '/us/laptops/rog-flow/', keywords: ['rog', 'flow'], baseUrl: 'https://rog.asus.com' },
  'ROG Gaming Laptop': { urlPath: '/us/laptops/', keywords: ['rog'], baseUrl: 'https://rog.asus.com' },
  'ZenBook Pro': { urlPath: '/us/laptops/for-home/zenbook/', keywords: ['zenbook', 'pro'] },
  'ZenBook': { urlPath: '/us/laptops/for-home/zenbook/', keywords: ['zenbook'] },
  'ProArt Studiobook': { urlPath: '/us/laptops/for-creators/proart-studiobook/', keywords: ['proart', 'studiobook'] },
  'ProArt': { urlPath: '/us/laptops/for-creators/proart-studiobook/', keywords: ['proart'] },
  'VivoBook Pro': { urlPath: '/us/laptops/for-home/vivobook/', keywords: ['vivobook', 'pro'] },
  'VivoBook': { urlPath: '/us/laptops/for-home/vivobook/', keywords: ['vivobook'] },
  'TUF Gaming': { urlPath: '/us/laptops/for-gaming/tuf-gaming/', keywords: ['tuf', 'gaming'] },
  'TUF': { urlPath: '/us/laptops/for-gaming/tuf-gaming/', keywords: ['tuf'] },
  'ROG Rapture': { urlPath: '/us/networking/', keywords: ['rog', 'rapture'], baseUrl: 'https://rog.asus.com' },
  'ROG Router': { urlPath: '/us/networking/', keywords: ['rog', 'router'], baseUrl: 'https://rog.asus.com' },
  'ZenWiFi': { urlPath: '/us/networking-iot-servers/wifi-routers/zenwifi-wifi-systems/', keywords: ['zenwifi'] },
  'RT-AX': { urlPath: '/us/networking-iot-servers/wifi-routers/', keywords: ['rt-ax'] },
  'RT-': { urlPath: '/us/networking-iot-servers/wifi-routers/', keywords: ['rt-'] },
  'ExpertBook': { urlPath: '/us/laptops/for-work/expertbook/', keywords: ['expertbook'] },
  'Chromebook': { urlPath: '/us/laptops/for-home/chromebook/', keywords: ['chromebook'] },
  'ROG Phone': { urlPath: '/us/phones/rog-phone/', keywords: ['rog', 'phone'], baseUrl: 'https://rog.asus.com' },
  'ROG Swift': { urlPath: '/us/monitors/rog-swift/', keywords: ['rog', 'swift'], baseUrl: 'https://rog.asus.com' },
  'ProArt Display': { urlPath: '/us/displays-desktops/monitors/proart/', keywords: ['proart', 'display'] },
  'ZenScreen': { urlPath: '/us/displays-desktops/monitors/zenscreen/', keywords: ['zenscreen'] },
};

export class ASUSAdapter implements BrandAdapter {
  brand = 'ASUS';
  supportedPatterns = [
    /^ASUS\s/i,
    /^ROG\s/i,
    /^ZenBook\s/i,
    /^VivoBook\s/i,
    /^ProArt\s/i,
    /^TUF\s/i,
    /^ExpertBook\s/i,
    /^ZenWiFi\s/i,
    /^RT-\w+/i,
    /^ZenScreen\s/i,
  ];

  private rateLimiter = new RateLimiter(ASUS_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'asus') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const baseUrl = matchedProduct.baseUrl || ASUS_CONFIG.baseUrl;
      const productUrl = `${baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        ASUS_CONFIG,
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

  private findProductMatch(productName: string): { urlPath: string; keywords: string[]; baseUrl?: string } | null {
    const nameLower = productName.toLowerCase();
    
    for (const [product, config] of Object.entries(ASUS_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(ASUS_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw.toLowerCase())).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${ASUS_CONFIG.searchUrl}?searchTerm=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        ASUS_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](https:\/\/(?:www\.asus\.com|rog\.asus\.com)\/[^"']*\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = productLinkMatch[1];
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          ASUS_CONFIG,
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
          .replace(/\/w\/\d+\//, '/w/1200/')
          .replace(/\/h\/\d+\//, '/h/1200/')
          .replace(/\?.*$/, '');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/dlcdnwebimgs\.asus\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/dlcdnimgs\.asus\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/rog\.asus\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/www\.asus\.com\/[^"']+\.(jpg|png|webp))["']/gi,
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

      const specs: string[] = [];
      const specsJson: Record<string, unknown> = {};

      const specPatterns = [
        /<div[^>]*class=["'][^"']*spec-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
        /<li[^>]*class=["'][^"']*feature[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi,
        /<td[^>]*class=["'][^"']*spec-value[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi,
        /<div[^>]*class=["'][^"']*ProductSpecItem[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
        /<span[^>]*class=["'][^"']*spec-content[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
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
      }

      let name = ogTitle || '';
      name = name
        .replace(/\s*\|\s*ASUS\s*(USA|Global)?/gi, '')
        .replace(/\s*-\s*ASUS\s*/gi, '')
        .replace(/\s*\|\s*ROG\s*/gi, '')
        .replace(/Buy\s+/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      const supportUrl = productUrl.includes('rog.asus.com')
        ? `https://rog.asus.com/us/support/`
        : `https://www.asus.com/us/support/`;

      return {
        name: name || 'ASUS Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `${supportUrl}?searchTerm=${encodeURIComponent(name || '')}`,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[asus-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const asusAdapter = new ASUSAdapter();
