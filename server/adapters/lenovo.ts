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

const LENOVO_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.lenovo.com',
  searchUrl: 'https://www.lenovo.com/us/en/search?text=',
  rateLimit: 20,
  timeout: 30000,
};

const LENOVO_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'ThinkPad X1 Carbon': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-x1/thinkpad-x1-carbon-gen-12-14-inch-intel', keywords: ['thinkpad', 'x1', 'carbon'] },
  'ThinkPad X1 Yoga': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-x1/thinkpad-x1-yoga-gen-9-14-inch-intel', keywords: ['thinkpad', 'x1', 'yoga'] },
  'ThinkPad X1 Nano': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-x1/thinkpad-x1-nano-gen-3-13-inch-intel', keywords: ['thinkpad', 'x1', 'nano'] },
  'ThinkPad X1 Extreme': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-x1/thinkpad-x1-extreme-gen-5-16-inch-intel', keywords: ['thinkpad', 'x1', 'extreme'] },
  'ThinkPad T14': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-t-series/thinkpad-t14-gen-5-14-inch-intel', keywords: ['thinkpad', 't14'] },
  'ThinkPad T14s': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-t-series/thinkpad-t14s-gen-5-14-inch-intel', keywords: ['thinkpad', 't14s'] },
  'ThinkPad T16': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-t-series/thinkpad-t16-gen-3-16-inch-intel', keywords: ['thinkpad', 't16'] },
  'ThinkPad L14': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-l-series/thinkpad-l14-gen-5-14-inch-intel', keywords: ['thinkpad', 'l14'] },
  'ThinkPad L16': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-l-series/thinkpad-l16-gen-1-16-inch-intel', keywords: ['thinkpad', 'l16'] },
  'ThinkPad E14': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-e-series/thinkpad-e14-gen-6-14-inch-intel', keywords: ['thinkpad', 'e14'] },
  'ThinkPad E16': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-e-series/thinkpad-e16-gen-2-16-inch-intel', keywords: ['thinkpad', 'e16'] },
  'ThinkPad P14s': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-p-series/thinkpad-p14s-gen-5-14-inch-intel', keywords: ['thinkpad', 'p14s'] },
  'ThinkPad P16': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-p-series/thinkpad-p16-gen-2-16-inch-intel', keywords: ['thinkpad', 'p16'] },
  'ThinkPad P16s': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-p-series/thinkpad-p16s-gen-3-16-inch-intel', keywords: ['thinkpad', 'p16s'] },
  'ThinkPad P1': { urlPath: '/us/en/p/laptops/thinkpad/thinkpad-p-series/thinkpad-p1-gen-7-16-inch-intel', keywords: ['thinkpad', 'p1'] },
  'Legion Pro 7i': { urlPath: '/us/en/p/laptops/legion-laptops/legion-pro-series/legion-pro-7i-gen-9-16-inch-intel', keywords: ['legion', 'pro', '7i'] },
  'Legion Pro 7': { urlPath: '/us/en/p/laptops/legion-laptops/legion-pro-series/legion-pro-7-gen-9-16-inch-amd', keywords: ['legion', 'pro', '7'] },
  'Legion Pro 5i': { urlPath: '/us/en/p/laptops/legion-laptops/legion-pro-series/legion-pro-5i-gen-9-16-inch-intel', keywords: ['legion', 'pro', '5i'] },
  'Legion Pro 5': { urlPath: '/us/en/p/laptops/legion-laptops/legion-pro-series/legion-pro-5-gen-9-16-inch-amd', keywords: ['legion', 'pro', '5'] },
  'Legion 9i': { urlPath: '/us/en/p/laptops/legion-laptops/legion-9-series/legion-9i-gen-9-16-inch-intel', keywords: ['legion', '9i'] },
  'Legion 7i': { urlPath: '/us/en/p/laptops/legion-laptops/legion-7-series/legion-7i-gen-9-16-inch-intel', keywords: ['legion', '7i'] },
  'Legion 5i Pro': { urlPath: '/us/en/p/laptops/legion-laptops/legion-5-series/legion-5i-pro-gen-8-16-inch-intel', keywords: ['legion', '5i', 'pro'] },
  'Legion 5i': { urlPath: '/us/en/p/laptops/legion-laptops/legion-5-series/legion-5i-gen-9-16-inch-intel', keywords: ['legion', '5i'] },
  'Legion 5': { urlPath: '/us/en/p/laptops/legion-laptops/legion-5-series/legion-5-gen-9-16-inch-amd', keywords: ['legion', '5'] },
  'Legion Slim 7i': { urlPath: '/us/en/p/laptops/legion-laptops/legion-slim-series/legion-slim-7i-gen-9-16-inch-intel', keywords: ['legion', 'slim', '7i'] },
  'Legion Slim 5': { urlPath: '/us/en/p/laptops/legion-laptops/legion-slim-series/legion-slim-5-gen-9-16-inch-amd', keywords: ['legion', 'slim', '5'] },
  'Yoga 9i': { urlPath: '/us/en/p/laptops/yoga/yoga-2-in-1-series/yoga-9i-2-in-1-gen-9-14-inch-intel', keywords: ['yoga', '9i'] },
  'Yoga 7i': { urlPath: '/us/en/p/laptops/yoga/yoga-2-in-1-series/yoga-7i-2-in-1-gen-9-16-inch-intel', keywords: ['yoga', '7i'] },
  'Yoga 7': { urlPath: '/us/en/p/laptops/yoga/yoga-2-in-1-series/yoga-7-2-in-1-gen-9-14-inch-amd', keywords: ['yoga', '7'] },
  'Yoga Slim 7i': { urlPath: '/us/en/p/laptops/yoga/yoga-slim-series/yoga-slim-7i-gen-9-14-inch-intel', keywords: ['yoga', 'slim', '7i'] },
  'Yoga Slim 7': { urlPath: '/us/en/p/laptops/yoga/yoga-slim-series/yoga-slim-7-gen-9-14-inch-amd', keywords: ['yoga', 'slim', '7'] },
  'Yoga Pro 9i': { urlPath: '/us/en/p/laptops/yoga/yoga-pro-series/yoga-pro-9i-gen-9-16-inch-intel', keywords: ['yoga', 'pro', '9i'] },
  'Yoga Pro 7': { urlPath: '/us/en/p/laptops/yoga/yoga-pro-series/yoga-pro-7-gen-9-14-inch-amd', keywords: ['yoga', 'pro', '7'] },
  'Yoga Book 9i': { urlPath: '/us/en/p/laptops/yoga/yoga-book-series/yoga-book-9i-gen-9-13-3-inch-intel', keywords: ['yoga', 'book', '9i'] },
  'IdeaPad Pro 5i': { urlPath: '/us/en/p/laptops/ideapad/ideapad-pro-series/ideapad-pro-5i-gen-9-16-inch-intel', keywords: ['ideapad', 'pro', '5i'] },
  'IdeaPad Pro 5': { urlPath: '/us/en/p/laptops/ideapad/ideapad-pro-series/ideapad-pro-5-gen-9-16-inch-amd', keywords: ['ideapad', 'pro', '5'] },
  'IdeaPad Slim 5i': { urlPath: '/us/en/p/laptops/ideapad/ideapad-slim-5-series/ideapad-slim-5i-gen-9-16-inch-intel', keywords: ['ideapad', 'slim', '5i'] },
  'IdeaPad Slim 5': { urlPath: '/us/en/p/laptops/ideapad/ideapad-slim-5-series/ideapad-slim-5-gen-9-16-inch-amd', keywords: ['ideapad', 'slim', '5'] },
  'IdeaPad Slim 3i': { urlPath: '/us/en/p/laptops/ideapad/ideapad-slim-3-series/ideapad-slim-3i-gen-9-15-inch-intel', keywords: ['ideapad', 'slim', '3i'] },
  'IdeaPad Slim 3': { urlPath: '/us/en/p/laptops/ideapad/ideapad-slim-3-series/ideapad-slim-3-gen-9-15-inch-amd', keywords: ['ideapad', 'slim', '3'] },
  'IdeaPad 3i': { urlPath: '/us/en/p/laptops/ideapad/ideapad-3-series/ideapad-3i-gen-8-15-inch-intel', keywords: ['ideapad', '3i'] },
  'IdeaPad 3': { urlPath: '/us/en/p/laptops/ideapad/ideapad-3-series/ideapad-3-gen-8-15-inch-amd', keywords: ['ideapad', '3'] },
  'IdeaPad Gaming 3': { urlPath: '/us/en/p/laptops/ideapad/ideapad-gaming-laptops/ideapad-gaming-3-gen-8-16-inch-amd', keywords: ['ideapad', 'gaming', '3'] },
  'IdeaPad Gaming 3i': { urlPath: '/us/en/p/laptops/ideapad/ideapad-gaming-laptops/ideapad-gaming-3i-gen-8-16-inch-intel', keywords: ['ideapad', 'gaming', '3i'] },
  'ThinkStation P3': { urlPath: '/us/en/p/workstations/thinkstation/thinkstation-p3', keywords: ['thinkstation', 'p3'] },
  'ThinkStation P5': { urlPath: '/us/en/p/workstations/thinkstation/thinkstation-p5', keywords: ['thinkstation', 'p5'] },
  'ThinkStation P7': { urlPath: '/us/en/p/workstations/thinkstation/thinkstation-p7', keywords: ['thinkstation', 'p7'] },
  'ThinkStation P620': { urlPath: '/us/en/p/workstations/thinkstation/thinkstation-p620', keywords: ['thinkstation', 'p620'] },
  'ThinkStation P920': { urlPath: '/us/en/p/workstations/thinkstation/thinkstation-p920', keywords: ['thinkstation', 'p920'] },
  'ThinkCentre M70q': { urlPath: '/us/en/p/desktops/thinkcentre/thinkcentre-m-series-tiny/thinkcentre-m70q-gen-5', keywords: ['thinkcentre', 'm70q'] },
  'ThinkCentre M70s': { urlPath: '/us/en/p/desktops/thinkcentre/thinkcentre-m-series-sff/thinkcentre-m70s-gen-5', keywords: ['thinkcentre', 'm70s'] },
  'ThinkCentre M90q': { urlPath: '/us/en/p/desktops/thinkcentre/thinkcentre-m-series-tiny/thinkcentre-m90q-gen-5', keywords: ['thinkcentre', 'm90q'] },
  'ThinkCentre M90s': { urlPath: '/us/en/p/desktops/thinkcentre/thinkcentre-m-series-sff/thinkcentre-m90s-gen-5', keywords: ['thinkcentre', 'm90s'] },
  'ThinkCentre M90t': { urlPath: '/us/en/p/desktops/thinkcentre/thinkcentre-m-series-towers/thinkcentre-m90t-gen-5', keywords: ['thinkcentre', 'm90t'] },
  'ThinkCentre neo 50q': { urlPath: '/us/en/p/desktops/thinkcentre/thinkcentre-neo-series/thinkcentre-neo-50q-gen-5', keywords: ['thinkcentre', 'neo', '50q'] },
  'ThinkCentre neo 50s': { urlPath: '/us/en/p/desktops/thinkcentre/thinkcentre-neo-series/thinkcentre-neo-50s-gen-5', keywords: ['thinkcentre', 'neo', '50s'] },
};

export class LenovoAdapter implements BrandAdapter {
  brand = 'Lenovo';
  supportedPatterns = [
    /^Lenovo\s/i,
    /^ThinkPad\s/i,
    /^ThinkStation\s/i,
    /^ThinkCentre\s/i,
    /^Legion\s/i,
    /^Yoga\s/i,
    /^IdeaPad\s/i,
    /^IdeaCentre\s/i,
    /^ThinkBook\s/i,
    /^ThinkVision\s/i,
    /^LOQ\s/i,
  ];

  private rateLimiter = new RateLimiter(LENOVO_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'lenovo') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${LENOVO_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        LENOVO_CONFIG,
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
    
    for (const [product, config] of Object.entries(LENOVO_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(LENOVO_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${LENOVO_CONFIG.searchUrl}${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        LENOVO_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/us\/en\/p\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${LENOVO_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          LENOVO_CONFIG,
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
          .replace(/wid=\d+/i, 'wid=1200')
          .replace(/hei=\d+/i, 'hei=1200');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/p\d+-ofp\.static\.pub\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/www\.lenovo\.com\/[^"']+\/images\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/news\.lenovo\.com\/[^"']+\.(jpg|png|webp))["']/gi,
      ];
      
      for (const pattern of galleryPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          const imgUrl = match[1];
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
        /<td[^>]*class=["'][^"']*spec[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi,
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

      const keySpecsPattern = /<div[^>]*class=["'][^"']*key-specs[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
      let keySpecsMatch;
      while ((keySpecsMatch = keySpecsPattern.exec(html)) !== null) {
        const keySpec = cleanText(keySpecsMatch[1]);
        if (keySpec.length > 5 && keySpec.length < 300 && !specs.includes(keySpec)) {
          specs.push(keySpec);
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
          specsJson.brand = (jsonLd.brand as any).name;
        }
        if (jsonLd.offers && typeof jsonLd.offers === 'object') {
          const offers = jsonLd.offers as Record<string, unknown>;
          if (offers.price) {
            specsJson.price = offers.price;
          }
          if (offers.priceCurrency) {
            specsJson.currency = offers.priceCurrency;
          }
        }
      }

      let name = ogTitle || '';
      name = name
        .replace(/\s*\|\s*Lenovo\s*(US)?/gi, '')
        .replace(/\s*-\s*Lenovo\s*/gi, '')
        .replace(/Buy\s+/i, '')
        .replace(/Shop\s+/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      const productCategory = this.detectProductCategory(name || productUrl);
      const supportUrl = this.buildSupportUrl(name, productCategory);

      return {
        name: name || 'Lenovo Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[lenovo-adapter] Error extracting product data:', error);
      return null;
    }
  }

  private detectProductCategory(identifier: string): string {
    const lower = identifier.toLowerCase();
    if (lower.includes('thinkpad')) return 'thinkpad';
    if (lower.includes('thinkstation')) return 'thinkstation';
    if (lower.includes('thinkcentre')) return 'thinkcentre';
    if (lower.includes('legion')) return 'legion';
    if (lower.includes('yoga')) return 'yoga';
    if (lower.includes('ideapad')) return 'ideapad';
    if (lower.includes('ideacentre')) return 'ideacentre';
    if (lower.includes('thinkbook')) return 'thinkbook';
    if (lower.includes('loq')) return 'loq';
    return 'laptops';
  }

  private buildSupportUrl(productName: string, category: string): string {
    const baseSupport = 'https://support.lenovo.com/us/en';
    
    const categoryPaths: Record<string, string> = {
      'thinkpad': '/solutions/ht500638-thinkpad-notebooks-overview',
      'thinkstation': '/solutions/ht500639-thinkstation-workstations-overview',
      'thinkcentre': '/solutions/ht500641-thinkcentre-desktops-overview',
      'legion': '/solutions/gaming',
      'yoga': '/solutions/ht500638-thinkpad-notebooks-overview',
      'ideapad': '/solutions/ht500637-lenovo-notebooks-overview',
      'ideacentre': '/solutions/ht500640-lenovo-desktops-overview',
      'thinkbook': '/solutions/ht500637-lenovo-notebooks-overview',
      'loq': '/solutions/gaming',
    };

    if (categoryPaths[category]) {
      return `${baseSupport}${categoryPaths[category]}`;
    }

    return `${baseSupport}/search?query=${encodeURIComponent(productName)}`;
  }
}

export const lenovoAdapter = new LenovoAdapter();
