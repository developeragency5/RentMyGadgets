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

const MICROSOFT_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.microsoft.com',
  searchUrl: 'https://www.microsoft.com/en-us/search/shop/devices?q=',
  rateLimit: 20,
  timeout: 30000,
};

const MICROSOFT_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'Surface Pro 11': { urlPath: '/en-us/surface/devices/surface-pro-11th-edition', keywords: ['surface', 'pro', '11'] },
  'Surface Pro 10': { urlPath: '/en-us/surface/devices/surface-pro-10', keywords: ['surface', 'pro', '10'] },
  'Surface Pro 9': { urlPath: '/en-us/surface/devices/surface-pro-9', keywords: ['surface', 'pro', '9'] },
  'Surface Pro 8': { urlPath: '/en-us/surface/devices/surface-pro-8', keywords: ['surface', 'pro', '8'] },
  'Surface Pro 7': { urlPath: '/en-us/surface/devices/surface-pro-7', keywords: ['surface', 'pro', '7'] },
  'Surface Pro': { urlPath: '/en-us/surface/devices/surface-pro-11th-edition', keywords: ['surface', 'pro'] },
  'Surface Laptop 7': { urlPath: '/en-us/surface/devices/surface-laptop-7th-edition', keywords: ['surface', 'laptop', '7'] },
  'Surface Laptop 6': { urlPath: '/en-us/surface/devices/surface-laptop-6-for-business', keywords: ['surface', 'laptop', '6'] },
  'Surface Laptop 5': { urlPath: '/en-us/surface/devices/surface-laptop-5', keywords: ['surface', 'laptop', '5'] },
  'Surface Laptop 4': { urlPath: '/en-us/surface/devices/surface-laptop-4', keywords: ['surface', 'laptop', '4'] },
  'Surface Laptop Studio 2': { urlPath: '/en-us/surface/devices/surface-laptop-studio-2', keywords: ['surface', 'laptop', 'studio', '2'] },
  'Surface Laptop Studio': { urlPath: '/en-us/surface/devices/surface-laptop-studio-2', keywords: ['surface', 'laptop', 'studio'] },
  'Surface Laptop': { urlPath: '/en-us/surface/devices/surface-laptop-7th-edition', keywords: ['surface', 'laptop'] },
  'Surface Studio 2+': { urlPath: '/en-us/surface/devices/surface-studio-2-plus', keywords: ['surface', 'studio', '2'] },
  'Surface Studio 2': { urlPath: '/en-us/surface/devices/surface-studio-2-plus', keywords: ['surface', 'studio'] },
  'Surface Studio': { urlPath: '/en-us/surface/devices/surface-studio-2-plus', keywords: ['surface', 'studio'] },
  'Surface Go 4': { urlPath: '/en-us/surface/devices/surface-go-4', keywords: ['surface', 'go', '4'] },
  'Surface Go 3': { urlPath: '/en-us/surface/devices/surface-go-3', keywords: ['surface', 'go', '3'] },
  'Surface Go': { urlPath: '/en-us/surface/devices/surface-go-4', keywords: ['surface', 'go'] },
  'Surface Book 3': { urlPath: '/en-us/surface/devices/surface-book-3', keywords: ['surface', 'book', '3'] },
  'Surface Book': { urlPath: '/en-us/surface/devices/surface-book-3', keywords: ['surface', 'book'] },
  'Surface Hub 2S': { urlPath: '/en-us/surface/business/surface-hub-2s', keywords: ['surface', 'hub', '2s'] },
  'Surface Hub': { urlPath: '/en-us/surface/business/surface-hub-2s', keywords: ['surface', 'hub'] },
  'Xbox Series X': { urlPath: 'https://www.xbox.com/en-US/consoles/xbox-series-x', keywords: ['xbox', 'series', 'x'] },
  'Xbox Series S': { urlPath: 'https://www.xbox.com/en-US/consoles/xbox-series-s', keywords: ['xbox', 'series', 's'] },
  'Xbox': { urlPath: 'https://www.xbox.com/en-US/consoles/', keywords: ['xbox'] },
  'Surface Pen': { urlPath: '/en-us/surface/accessories/surface-pen', keywords: ['surface', 'pen'] },
  'Surface Slim Pen': { urlPath: '/en-us/surface/accessories/surface-slim-pen-2', keywords: ['surface', 'slim', 'pen'] },
  'Surface Keyboard': { urlPath: '/en-us/surface/accessories', keywords: ['surface', 'keyboard'] },
  'Surface Mouse': { urlPath: '/en-us/surface/accessories', keywords: ['surface', 'mouse'] },
  'Surface Dock': { urlPath: '/en-us/surface/accessories/surface-dock-2', keywords: ['surface', 'dock'] },
  'Surface Arc Mouse': { urlPath: '/en-us/surface/accessories/surface-arc-mouse', keywords: ['surface', 'arc', 'mouse'] },
  'Surface Headphones': { urlPath: '/en-us/surface/accessories/surface-headphones-2', keywords: ['surface', 'headphones'] },
  'Surface Earbuds': { urlPath: '/en-us/surface/accessories/surface-earbuds', keywords: ['surface', 'earbuds'] },
  'Surface Accessories': { urlPath: '/en-us/surface/accessories', keywords: ['surface', 'accessories'] },
};

export class MicrosoftAdapter implements BrandAdapter {
  brand = 'Microsoft';
  supportedPatterns = [
    /^Microsoft\s/i,
    /^Surface\s/i,
    /^Xbox\s/i,
    /^Surface\s?(Pro|Laptop|Studio|Go|Book|Hub|Pen|Dock|Mouse|Keyboard|Headphones|Earbuds)/i,
  ];

  private rateLimiter = new RateLimiter(MICROSOFT_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'microsoft') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = matchedProduct.urlPath.startsWith('http') 
        ? matchedProduct.urlPath 
        : `${MICROSOFT_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        MICROSOFT_CONFIG,
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
    
    for (const [product, config] of Object.entries(MICROSOFT_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(MICROSOFT_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${MICROSOFT_CONFIG.searchUrl}${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        MICROSOFT_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/en-us\/surface\/devices\/[^"']+)["']/i) ||
                               html.match(/href=["'](\/en-us\/d\/[^"']+)["']/i) ||
                               html.match(/href=["'](https:\/\/www\.xbox\.com\/[^"']+consoles[^"']*)["']/i);
      
      if (productLinkMatch) {
        const productUrl = productLinkMatch[1].startsWith('http') 
          ? productLinkMatch[1]
          : `${MICROSOFT_CONFIG.baseUrl}${productLinkMatch[1]}`;
        
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          MICROSOFT_CONFIG,
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
          .replace(/w=\d+/i, 'w=1200')
          .replace(/h=\d+/i, 'h=1200');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/img-prod-cms-rt-microsoft-com\.akamaized\.net\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/cdn-dynmedia-1\.microsoft\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/store-images\.s-microsoft\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](\/\/img-prod-cms-rt-microsoft-com\.akamaized\.net\/[^"']+\.(jpg|png|webp))["']/gi,
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
        /<div[^>]*class=["'][^"']*spec[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
        /<li[^>]*class=["'][^"']*feature[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi,
        /<span[^>]*class=["'][^"']*ocHighlight[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
        /<p[^>]*class=["'][^"']*c-paragraph[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi,
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
        .replace(/\s*\|\s*Microsoft\s*(Store)?/gi, '')
        .replace(/\s*-\s*Microsoft\s*/gi, '')
        .replace(/Buy\s+/i, '')
        .replace(/\s*–\s*.*$/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      const supportUrl = productUrl.includes('xbox.com')
        ? `https://support.xbox.com/en-US/`
        : `https://support.microsoft.com/en-us/surface`;

      return {
        name: name || 'Microsoft Product',
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
      console.error('[microsoft-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const microsoftAdapter = new MicrosoftAdapter();
