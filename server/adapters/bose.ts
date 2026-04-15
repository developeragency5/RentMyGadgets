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

const BOSE_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.bose.com',
  searchUrl: 'https://www.bose.com/search',
  rateLimit: 20,
  timeout: 30000,
};

const BOSE_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'QuietComfort Ultra Headphones': { urlPath: '/c/headphones', keywords: ['quietcomfort', 'ultra', 'headphones'] },
  'QuietComfort Headphones': { urlPath: '/c/headphones', keywords: ['quietcomfort', 'headphones'] },
  'QuietComfort 45': { urlPath: '/c/headphones', keywords: ['quietcomfort', '45'] },
  'QuietComfort 35': { urlPath: '/c/headphones', keywords: ['quietcomfort', '35'] },
  'Noise Cancelling Headphones 700': { urlPath: '/c/headphones', keywords: ['noise', 'cancelling', '700'] },
  'SoundLink Flex': { urlPath: '/c/speakers', keywords: ['soundlink', 'flex'] },
  'SoundLink Max': { urlPath: '/c/speakers', keywords: ['soundlink', 'max'] },
  'SoundLink Micro': { urlPath: '/c/speakers', keywords: ['soundlink', 'micro'] },
  'SoundLink Revolve': { urlPath: '/c/speakers', keywords: ['soundlink', 'revolve'] },
  'SoundLink Color': { urlPath: '/c/speakers', keywords: ['soundlink', 'color'] },
  'SoundLink Mini': { urlPath: '/c/speakers', keywords: ['soundlink', 'mini'] },
  'Portable Home Speaker': { urlPath: '/c/speakers', keywords: ['portable', 'home', 'speaker'] },
  'Home Speaker 500': { urlPath: '/c/speakers', keywords: ['home', 'speaker', '500'] },
  'Home Speaker 300': { urlPath: '/c/speakers', keywords: ['home', 'speaker', '300'] },
  'Smart Soundbar': { urlPath: '/c/speakers', keywords: ['smart', 'soundbar'] },
  'Soundbar 900': { urlPath: '/c/speakers', keywords: ['soundbar', '900'] },
  'Soundbar 700': { urlPath: '/c/speakers', keywords: ['soundbar', '700'] },
  'Soundbar 600': { urlPath: '/c/speakers', keywords: ['soundbar', '600'] },
  'QuietComfort Ultra Earbuds': { urlPath: '/c/earbuds', keywords: ['quietcomfort', 'ultra', 'earbuds'] },
  'QuietComfort Earbuds': { urlPath: '/c/earbuds', keywords: ['quietcomfort', 'earbuds'] },
  'QuietComfort Earbuds II': { urlPath: '/c/earbuds', keywords: ['quietcomfort', 'earbuds', 'ii'] },
  'Ultra Open Earbuds': { urlPath: '/c/earbuds', keywords: ['ultra', 'open', 'earbuds'] },
  'Sport Earbuds': { urlPath: '/c/earbuds', keywords: ['sport', 'earbuds'] },
  'SoundSport': { urlPath: '/c/earbuds', keywords: ['soundsport'] },
};

export class BoseAdapter implements BrandAdapter {
  brand = 'Bose';
  supportedPatterns = [
    /^Bose\s/i,
    /^QuietComfort/i,
    /^SoundLink/i,
    /^SoundSport/i,
    /Bose\s+(Home\s+)?Speaker/i,
    /Bose\s+Soundbar/i,
    /Bose\s+Earbuds/i,
    /Noise\s+Cancelling\s+Headphones\s+700/i,
  ];

  private rateLimiter = new RateLimiter(BOSE_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'bose') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();

    try {
      const matchedProduct = this.findProductMatch(productName);

      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${BOSE_CONFIG.baseUrl}${matchedProduct.urlPath}`;

      const { html, status } = await fetchWithRetry(
        productUrl,
        BOSE_CONFIG,
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

    for (const [product, config] of Object.entries(BOSE_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }

    for (const [_, config] of Object.entries(BOSE_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }

    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${BOSE_CONFIG.searchUrl}?q=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        BOSE_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/p\/[^"']+)["']/i) ||
                               html.match(/href=["'](\/[^"']*(?:headphones|speakers|earbuds)[^"']*?)["']/i);

      if (productLinkMatch) {
        const productUrl = `${BOSE_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          BOSE_CONFIG,
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

      const galleryImages: string[] = [];
      const galleryPattern = /["'](https:\/\/(?:assets\.bose\.com|www\.bose\.com\/[^"']*\.(?:jpg|jpeg|png|webp)))["']/gi;
      let galleryMatch;
      while ((galleryMatch = galleryPattern.exec(html)) !== null) {
        const imgUrl = galleryMatch[1];
        if (!galleryImages.includes(imgUrl) && galleryImages.length < 5) {
          galleryImages.push(imgUrl);
        }
      }

      const specs: string[] = [];
      const specsJson: Record<string, unknown> = {};

      const featurePattern = /<li[^>]*class=["'][^"']*feature[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi;
      let featureMatch;
      while ((featureMatch = featurePattern.exec(html)) !== null) {
        const spec = cleanText(featureMatch[1]);
        if (spec.length > 5 && spec.length < 200) {
          specs.push(spec);
        }
      }

      const specRowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let specRowMatch;
      while ((specRowMatch = specRowPattern.exec(html)) !== null) {
        const row = specRowMatch[1];
        const thMatch = row.match(/<th[^>]*>([\s\S]*?)<\/th>/i);
        const tdMatch = row.match(/<td[^>]*>([\s\S]*?)<\/td>/i);
        if (thMatch && tdMatch) {
          const key = cleanText(thMatch[1]);
          const value = cleanText(tdMatch[1]);
          if (key && value) {
            specsJson[key] = value;
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
        if (jsonLd.brand) {
          specsJson.brand = typeof jsonLd.brand === 'object'
            ? (jsonLd.brand as any).name
            : jsonLd.brand;
        }
      }

      let name = ogTitle || '';
      name = name.replace(/\s*[-|]\s*Bose\s*$/i, '')
                 .replace(/\s*[-|]\s*Buy\s*$/i, '')
                 .trim();

      if (!imageUrl && !name) {
        return null;
      }

      return {
        name: name || 'Bose Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://www.bose.com/support?q=${encodeURIComponent(name || '')}`,
        specs: specs.length > 0 ? specs : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[bose-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const boseAdapter = new BoseAdapter();
