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

const FUJIFILM_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://fujifilm-x.com',
  searchUrl: 'https://fujifilm-x.com/global/products/',
  rateLimit: 20,
  timeout: 30000,
};

const FUJIFILM_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[]; baseUrl?: string }> = {
  'X-H2S': { urlPath: '/global/products/cameras/x-h2s/', keywords: ['x-h2s'] },
  'X-H2': { urlPath: '/global/products/cameras/x-h2/', keywords: ['x-h2'] },
  'X-T5': { urlPath: '/global/products/cameras/x-t5/', keywords: ['x-t5'] },
  'X-T4': { urlPath: '/global/products/cameras/x-t4/', keywords: ['x-t4'] },
  'X-T3': { urlPath: '/global/products/cameras/x-t3/', keywords: ['x-t3'] },
  'X-T30 II': { urlPath: '/global/products/cameras/x-t30-ii/', keywords: ['x-t30', 'ii'] },
  'X-T30': { urlPath: '/global/products/cameras/x-t30/', keywords: ['x-t30'] },
  'X-S20': { urlPath: '/global/products/cameras/x-s20/', keywords: ['x-s20'] },
  'X-S10': { urlPath: '/global/products/cameras/x-s10/', keywords: ['x-s10'] },
  'X-Pro3': { urlPath: '/global/products/cameras/x-pro3/', keywords: ['x-pro3'] },
  'X-E4': { urlPath: '/global/products/cameras/x-e4/', keywords: ['x-e4'] },
  'X100VI': { urlPath: '/global/products/cameras/x100vi/', keywords: ['x100vi', 'x100', 'vi'] },
  'X100V': { urlPath: '/global/products/cameras/x100v/', keywords: ['x100v'] },
  'GFX100S II': { urlPath: '/global/products/cameras/gfx100s-ii/', keywords: ['gfx100s', 'ii', 'gfx', '100s'] },
  'GFX100S': { urlPath: '/global/products/cameras/gfx100s/', keywords: ['gfx100s', 'gfx', '100s'] },
  'GFX100 II': { urlPath: '/global/products/cameras/gfx100-ii/', keywords: ['gfx100', 'ii'] },
  'GFX100': { urlPath: '/global/products/cameras/gfx100/', keywords: ['gfx100'] },
  'GFX50S II': { urlPath: '/global/products/cameras/gfx50s-ii/', keywords: ['gfx50s', 'ii'] },
  'GFX50S': { urlPath: '/global/products/cameras/gfx50s/', keywords: ['gfx50s'] },
  'GFX50R': { urlPath: '/global/products/cameras/gfx50r/', keywords: ['gfx50r'] },
  'Instax Mini 12': { urlPath: '/mini12/', keywords: ['instax', 'mini', '12'], baseUrl: 'https://instax.com' },
  'Instax Mini 11': { urlPath: '/mini11/', keywords: ['instax', 'mini', '11'], baseUrl: 'https://instax.com' },
  'Instax Mini 40': { urlPath: '/mini40/', keywords: ['instax', 'mini', '40'], baseUrl: 'https://instax.com' },
  'Instax Mini 90': { urlPath: '/mini90/', keywords: ['instax', 'mini', '90'], baseUrl: 'https://instax.com' },
  'Instax Mini Evo': { urlPath: '/mini-evo/', keywords: ['instax', 'mini', 'evo'], baseUrl: 'https://instax.com' },
  'Instax Mini LiPlay': { urlPath: '/mini-liplay/', keywords: ['instax', 'mini', 'liplay'], baseUrl: 'https://instax.com' },
  'Instax Square SQ40': { urlPath: '/sq40/', keywords: ['instax', 'square', 'sq40'], baseUrl: 'https://instax.com' },
  'Instax Square SQ1': { urlPath: '/sq1/', keywords: ['instax', 'square', 'sq1'], baseUrl: 'https://instax.com' },
  'Instax Wide 400': { urlPath: '/wide400/', keywords: ['instax', 'wide', '400'], baseUrl: 'https://instax.com' },
  'Instax Wide 300': { urlPath: '/wide300/', keywords: ['instax', 'wide', '300'], baseUrl: 'https://instax.com' },
  'XF 16-55mm F2.8': { urlPath: '/global/products/lenses/xf1655mmf28-r-lm-wr/', keywords: ['xf', '16-55', 'f2.8'] },
  'XF 18-55mm F2.8-4': { urlPath: '/global/products/lenses/xf1855mmf28-4-r-lm-ois/', keywords: ['xf', '18-55', 'f2.8-4'] },
  'XF 23mm F1.4': { urlPath: '/global/products/lenses/xf23mmf14-r-lm-wr/', keywords: ['xf', '23mm', 'f1.4'] },
  'XF 35mm F1.4': { urlPath: '/global/products/lenses/xf35mmf14-r/', keywords: ['xf', '35mm', 'f1.4'] },
  'XF 50mm F1.0': { urlPath: '/global/products/lenses/xf50mmf10-r-wr/', keywords: ['xf', '50mm', 'f1.0'] },
  'XF 56mm F1.2': { urlPath: '/global/products/lenses/xf56mmf12-r-wr/', keywords: ['xf', '56mm', 'f1.2'] },
  'XF 90mm F2': { urlPath: '/global/products/lenses/xf90mmf2-r-lm-wr/', keywords: ['xf', '90mm', 'f2'] },
  'XF 100-400mm': { urlPath: '/global/products/lenses/xf100-400mmf45-56-r-lm-ois-wr/', keywords: ['xf', '100-400'] },
  'GF 32-64mm': { urlPath: '/global/products/lenses/gf32-64mmf4-r-lm-wr/', keywords: ['gf', '32-64'] },
  'GF 45mm': { urlPath: '/global/products/lenses/gf45mmf28-r-wr/', keywords: ['gf', '45mm'] },
  'GF 63mm': { urlPath: '/global/products/lenses/gf63mmf28-r-wr/', keywords: ['gf', '63mm'] },
  'GF 80mm': { urlPath: '/global/products/lenses/gf80mmf17-r-wr/', keywords: ['gf', '80mm'] },
  'GF 110mm': { urlPath: '/global/products/lenses/gf110mmf2-r-lm-wr/', keywords: ['gf', '110mm'] },
};

export class FujifilmAdapter implements BrandAdapter {
  brand = 'Fujifilm';
  supportedPatterns = [
    /^Fujifilm\s/i,
    /^Fuji\s/i,
    /^X-[A-Z]\d+/i,
    /^X-Pro\d/i,
    /^X-E\d/i,
    /^X-T\d+/i,
    /^X-S\d+/i,
    /^X-H\d+/i,
    /^X100/i,
    /^GFX\d+/i,
    /^Instax/i,
    /^Fujinon\s/i,
    /^XF\s?\d+/i,
    /^GF\s?\d+/i,
  ];

  private rateLimiter = new RateLimiter(FUJIFILM_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'fujifilm' || brand?.toLowerCase() === 'fuji') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const baseUrl = matchedProduct.baseUrl || FUJIFILM_CONFIG.baseUrl;
      const productUrl = `${baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        FUJIFILM_CONFIG,
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

  private findProductMatch(productName: string): { urlPath: string; keywords: string[]; baseUrl?: string } | null {
    const nameLower = productName.toLowerCase();
    
    for (const [product, config] of Object.entries(FUJIFILM_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(FUJIFILM_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw.toLowerCase())).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const isInstax = /instax/i.test(productName);
    const isLens = /fujinon|^xf\s?\d+|^gf\s?\d+/i.test(productName);
    
    let searchUrl: string;
    if (isInstax) {
      searchUrl = 'https://instax.com/';
    } else if (isLens) {
      searchUrl = `${FUJIFILM_CONFIG.baseUrl}/global/products/lenses/`;
    } else {
      searchUrl = `${FUJIFILM_CONFIG.baseUrl}/global/products/cameras/`;
    }

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        FUJIFILM_CONFIG,
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

      const productNameLower = productName.toLowerCase();
      const productLinkPattern = /href=["']([^"']*(?:cameras|lenses)\/[^"']+)["']/gi;
      let match;
      
      while ((match = productLinkPattern.exec(html)) !== null) {
        const linkPath = match[1].toLowerCase();
        const productParts = productNameLower.split(/[\s-]+/).filter(p => p.length > 1);
        
        const matchCount = productParts.filter(part => linkPath.includes(part)).length;
        if (matchCount >= Math.ceil(productParts.length / 2)) {
          const fullUrl = match[1].startsWith('http') ? match[1] : `${FUJIFILM_CONFIG.baseUrl}${match[1]}`;
          
          const { html: productHtml, status: productStatus } = await fetchWithRetry(
            fullUrl,
            FUJIFILM_CONFIG,
            this.rateLimiter
          );

          if (productHtml && productStatus === 200) {
            const productData = await this.extractProductData(productHtml, fullUrl);
            if (productData) {
              return {
                success: true,
                productId: '',
                brand: this.brand,
                data: productData,
                durationMs: Date.now() - startTime,
                sourceUrl: fullUrl,
                httpStatus: productStatus,
              };
            }
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
        const baseUrl = productUrl.includes('instax.com') ? 'https://instax.com' : FUJIFILM_CONFIG.baseUrl;
        imageUrl = `${baseUrl}${imageUrl}`;
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https?:\/\/[^"']*fujifilm[^"']*\/(?:images|assets|img)\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi,
        /["'](\/[^"']*\/(?:images|assets|img)\/[^"']+\.(?:jpg|jpeg|png|webp))["']/gi,
        /data-src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi,
        /srcset=["']([^"'\s]+\.(?:jpg|jpeg|png|webp))/gi,
      ];

      for (const pattern of galleryPatterns) {
        let galleryMatch;
        while ((galleryMatch = pattern.exec(html)) !== null && galleryImages.length < 5) {
          let imgUrl = galleryMatch[1];
          if (!imgUrl.startsWith('http')) {
            const baseUrl = productUrl.includes('instax.com') ? 'https://instax.com' : FUJIFILM_CONFIG.baseUrl;
            imgUrl = `${baseUrl}${imgUrl}`;
          }
          if (!galleryImages.includes(imgUrl) && !imgUrl.includes('icon') && !imgUrl.includes('logo')) {
            galleryImages.push(imgUrl);
          }
        }
      }

      const specs: string[] = [];
      const specsJson: Record<string, unknown> = {};

      const specPatterns = [
        /<li[^>]*class=["'][^"']*spec[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi,
        /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi,
        /<tr[^>]*>\s*<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi,
      ];

      for (const pattern of specPatterns) {
        let specMatch;
        while ((specMatch = pattern.exec(html)) !== null) {
          if (specMatch[2]) {
            const key = cleanText(specMatch[1]);
            const value = cleanText(specMatch[2]);
            if (key.length > 0 && value.length > 0 && key.length < 50 && value.length < 200) {
              specsJson[key] = value;
              specs.push(`${key}: ${value}`);
            }
          } else {
            const spec = cleanText(specMatch[1]);
            if (spec.length > 5 && spec.length < 200) {
              specs.push(spec);
            }
          }
        }
      }

      const featurePattern = /<(?:li|p)[^>]*class=["'][^"']*(?:feature|highlight|point)[^"']*["'][^>]*>([\s\S]*?)<\/(?:li|p)>/gi;
      let featureMatch;
      while ((featureMatch = featurePattern.exec(html)) !== null) {
        const spec = cleanText(featureMatch[1]);
        if (spec.length > 5 && spec.length < 200 && !specs.includes(spec)) {
          specs.push(spec);
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
        if (jsonLd.image) {
          const jsonLdImage = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image;
          if (typeof jsonLdImage === 'string' && !imageUrl) {
            imageUrl = jsonLdImage;
          }
        }
      }

      let name = ogTitle || '';
      name = name.replace(/\s*[|\-–]\s*FUJIFILM.*$/i, '')
                 .replace(/\s*[|\-–]\s*Fuji.*$/i, '')
                 .replace(/\s*[|\-–]\s*instax.*$/i, '')
                 .trim();

      if (!imageUrl && !name) {
        return null;
      }

      const supportUrl = productUrl.includes('instax.com')
        ? 'https://instax.com/support/'
        : `https://fujifilm-x.com/global/support/`;

      return {
        name: name || 'Fujifilm Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl,
        specs: specs.length > 0 ? specs.slice(0, 20) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[fujifilm-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const fujifilmAdapter = new FujifilmAdapter();
