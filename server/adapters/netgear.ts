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

const NETGEAR_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.netgear.com',
  searchUrl: 'https://www.netgear.com/search/',
  rateLimit: 20,
  timeout: 30000,
};

const NETGEAR_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'Orbi': { urlPath: '/home/wifi/mesh/', keywords: ['orbi'] },
  'Orbi Pro': { urlPath: '/business/wifi/mesh/', keywords: ['orbi', 'pro'] },
  'Orbi Mesh': { urlPath: '/home/wifi/mesh/', keywords: ['orbi', 'mesh'] },
  'Nighthawk': { urlPath: '/home/wifi/routers/', keywords: ['nighthawk'] },
  'Nighthawk Router': { urlPath: '/home/wifi/routers/', keywords: ['nighthawk', 'router'] },
  'Nighthawk AX': { urlPath: '/home/wifi/routers/', keywords: ['nighthawk', 'ax'] },
  'Nighthawk Pro Gaming': { urlPath: '/home/wifi/routers/', keywords: ['nighthawk', 'gaming'] },
  'ReadyNAS': { urlPath: '/business/solutions/storage/', keywords: ['readynas'] },
  'ReadyNAS Pro': { urlPath: '/business/solutions/storage/', keywords: ['readynas', 'pro'] },
  'Managed Switch': { urlPath: '/business/wired/switches/', keywords: ['managed', 'switch'] },
  'Unmanaged Switch': { urlPath: '/business/wired/switches/', keywords: ['unmanaged', 'switch'] },
  'PoE Switch': { urlPath: '/business/wired/switches/', keywords: ['poe', 'switch'] },
  'Smart Switch': { urlPath: '/business/wired/switches/', keywords: ['smart', 'switch'] },
  'Network Switch': { urlPath: '/business/wired/switches/', keywords: ['network', 'switch'] },
  'Ethernet Switch': { urlPath: '/business/wired/switches/', keywords: ['ethernet', 'switch'] },
  'WiFi Range Extender': { urlPath: '/home/wifi/range-extenders/', keywords: ['range', 'extender'] },
  'WiFi Extender': { urlPath: '/home/wifi/range-extenders/', keywords: ['wifi', 'extender'] },
  'Cable Modem': { urlPath: '/home/wifi/modems/', keywords: ['cable', 'modem'] },
  'Modem Router': { urlPath: '/home/wifi/modems/', keywords: ['modem', 'router'] },
  'Access Point': { urlPath: '/business/wifi/access-points/', keywords: ['access', 'point'] },
  'Wireless Access Point': { urlPath: '/business/wifi/access-points/', keywords: ['wireless', 'access', 'point'] },
};

export class NetgearAdapter implements BrandAdapter {
  brand = 'Netgear';
  supportedPatterns = [
    /^Netgear\s/i,
    /^Orbi\s?/i,
    /^Nighthawk\s?/i,
    /^ReadyNAS\s?/i,
    /Netgear.*Switch/i,
    /Netgear.*Router/i,
    /Netgear.*Mesh/i,
    /Netgear.*Extender/i,
    /Netgear.*Modem/i,
    /Netgear.*Access\s?Point/i,
  ];

  private rateLimiter = new RateLimiter(NETGEAR_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'netgear') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();

    try {
      const matchedProduct = this.findProductMatch(productName);

      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${NETGEAR_CONFIG.baseUrl}${matchedProduct.urlPath}`;

      const { html, status } = await fetchWithRetry(
        productUrl,
        NETGEAR_CONFIG,
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

      const productData = await this.extractProductData(html, productUrl);

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

  private findProductMatch(productName: string): { urlPath: string; keywords: string[] } | null {
    const nameLower = productName.toLowerCase();

    for (const [product, config] of Object.entries(NETGEAR_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }

    for (const [_, config] of Object.entries(NETGEAR_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }

    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${NETGEAR_CONFIG.searchUrl}?q=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        NETGEAR_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/(?:home|business)\/[^"']+)["']/i);

      if (productLinkMatch) {
        const productUrl = `${NETGEAR_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          NETGEAR_CONFIG,
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
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${NETGEAR_CONFIG.baseUrl}${imageUrl}`;
      }

      const galleryImages: string[] = [];
      const galleryPattern = /["']((?:https?:)?\/\/[^"']*netgear[^"']*\.(?:jpg|jpeg|png|webp))["']/gi;
      let galleryMatch;
      while ((galleryMatch = galleryPattern.exec(html)) !== null) {
        let imgUrl = galleryMatch[1];
        if (imgUrl.startsWith('//')) {
          imgUrl = `https:${imgUrl}`;
        }
        if (!galleryImages.includes(imgUrl) && galleryImages.length < 5) {
          galleryImages.push(imgUrl);
        }
      }

      const specs: string[] = [];
      const specsJson: Record<string, unknown> = {};

      const featurePattern = /<li[^>]*class=["'][^"']*(?:feature|spec|benefit)[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi;
      let featureMatch;
      while ((featureMatch = featurePattern.exec(html)) !== null) {
        const spec = cleanText(featureMatch[1]);
        if (spec.length > 5 && spec.length < 200) {
          specs.push(spec);
        }
      }

      const specTablePattern = /<tr[^>]*>\s*<t[hd][^>]*>([\s\S]*?)<\/t[hd]>\s*<t[hd][^>]*>([\s\S]*?)<\/t[hd]>\s*<\/tr>/gi;
      let specMatch;
      while ((specMatch = specTablePattern.exec(html)) !== null) {
        const key = cleanText(specMatch[1]);
        const value = cleanText(specMatch[2]);
        if (key && value && key.length < 50 && value.length < 200) {
          specsJson[key] = value;
        }
      }

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
        if (jsonLd.model) {
          specsJson.model = jsonLd.model;
        }
      }

      let name = ogTitle || '';
      name = name.replace(/\s*[-|]\s*NETGEAR\s*$/i, '')
                 .replace(/\s*[-|]\s*Netgear\s*$/i, '')
                 .replace(/^Buy\s+/i, '')
                 .trim();

      if (!imageUrl && !name) {
        return null;
      }

      return {
        name: name || 'Netgear Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://www.netgear.com/support/product/${encodeURIComponent(name || '')}`,
        specs: specs.length > 0 ? specs : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[netgear-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const netgearAdapter = new NetgearAdapter();
