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

const CANON_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.usa.canon.com',
  searchUrl: 'https://www.usa.canon.com/search',
  rateLimit: 20,
  timeout: 30000,
};

const CANON_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'EOS R5 Mark II': { urlPath: '/shop/p/eos-r5-mark-ii', keywords: ['eos', 'r5', 'mark', 'ii'] },
  'EOS R5': { urlPath: '/shop/p/eos-r5', keywords: ['eos', 'r5'] },
  'EOS R6 Mark II': { urlPath: '/shop/p/eos-r6-mark-ii', keywords: ['eos', 'r6', 'mark', 'ii'] },
  'EOS R6': { urlPath: '/shop/p/eos-r6', keywords: ['eos', 'r6'] },
  'EOS R7': { urlPath: '/shop/p/eos-r7', keywords: ['eos', 'r7'] },
  'EOS R8': { urlPath: '/shop/p/eos-r8', keywords: ['eos', 'r8'] },
  'EOS R10': { urlPath: '/shop/p/eos-r10', keywords: ['eos', 'r10'] },
  'EOS R50': { urlPath: '/shop/p/eos-r50', keywords: ['eos', 'r50'] },
  'EOS R100': { urlPath: '/shop/p/eos-r100', keywords: ['eos', 'r100'] },
  'EOS R3': { urlPath: '/shop/p/eos-r3', keywords: ['eos', 'r3'] },
  'EOS R': { urlPath: '/shop/p/eos-r', keywords: ['eos', 'r'] },
  'EOS RP': { urlPath: '/shop/p/eos-rp', keywords: ['eos', 'rp'] },
  'EOS 5D Mark IV': { urlPath: '/shop/p/eos-5d-mark-iv', keywords: ['eos', '5d', 'mark', 'iv'] },
  'EOS 6D Mark II': { urlPath: '/shop/p/eos-6d-mark-ii', keywords: ['eos', '6d', 'mark', 'ii'] },
  'EOS 90D': { urlPath: '/shop/p/eos-90d', keywords: ['eos', '90d'] },
  'EOS Rebel T8i': { urlPath: '/shop/p/eos-rebel-t8i', keywords: ['eos', 'rebel', 't8i'] },
  'EOS Rebel SL3': { urlPath: '/shop/p/eos-rebel-sl3', keywords: ['eos', 'rebel', 'sl3'] },
  'EOS 1D X Mark III': { urlPath: '/shop/p/eos-1d-x-mark-iii', keywords: ['eos', '1d', 'x', 'mark', 'iii'] },
  'RF 24-70mm': { urlPath: '/shop/p/rf24-70mm-f2-8-l-is-usm', keywords: ['rf', '24-70mm'] },
  'RF 70-200mm': { urlPath: '/shop/p/rf70-200mm-f2-8-l-is-usm', keywords: ['rf', '70-200mm'] },
  'RF 50mm': { urlPath: '/shop/p/rf50mm-f1-2-l-usm', keywords: ['rf', '50mm'] },
  'RF 85mm': { urlPath: '/shop/p/rf85mm-f1-2-l-usm', keywords: ['rf', '85mm'] },
  'RF 100-500mm': { urlPath: '/shop/p/rf100-500mm-f4-5-7-1-l-is-usm', keywords: ['rf', '100-500mm'] },
  'RF 15-35mm': { urlPath: '/shop/p/rf15-35mm-f2-8-l-is-usm', keywords: ['rf', '15-35mm'] },
  'RF 28-70mm': { urlPath: '/shop/p/rf28-70mm-f2-l-usm', keywords: ['rf', '28-70mm'] },
  'RF 100mm Macro': { urlPath: '/shop/p/rf100mm-f2-8-l-macro-is-usm', keywords: ['rf', '100mm', 'macro'] },
  'PIXMA TR8620a': { urlPath: '/shop/p/pixma-tr8620a', keywords: ['pixma', 'tr8620'] },
  'PIXMA TS6420a': { urlPath: '/shop/p/pixma-ts6420a', keywords: ['pixma', 'ts6420'] },
  'PIXMA G7020': { urlPath: '/shop/p/pixma-g7020', keywords: ['pixma', 'g7020'] },
  'PIXMA PRO-200': { urlPath: '/shop/p/pixma-pro-200', keywords: ['pixma', 'pro-200'] },
  'PIXMA PRO-300': { urlPath: '/shop/p/pixma-pro-300', keywords: ['pixma', 'pro-300'] },
  'PIXMA TS8320': { urlPath: '/shop/p/pixma-ts8320', keywords: ['pixma', 'ts8320'] },
  'PIXMA MG3620': { urlPath: '/shop/p/pixma-mg3620', keywords: ['pixma', 'mg3620'] },
  'PIXMA iX6820': { urlPath: '/shop/p/pixma-ix6820', keywords: ['pixma', 'ix6820'] },
  'imagePROGRAF PRO-1000': { urlPath: '/shop/p/imageprograf-pro-1000', keywords: ['imageprograf', 'pro-1000'] },
  'imagePROGRAF PRO-300': { urlPath: '/shop/p/imageprograf-pro-300', keywords: ['imageprograf', 'pro-300'] },
  'imagePROGRAF PRO-4100': { urlPath: '/shop/p/imageprograf-pro-4100', keywords: ['imageprograf', 'pro-4100'] },
  'imagePROGRAF PRO-6100': { urlPath: '/shop/p/imageprograf-pro-6100', keywords: ['imageprograf', 'pro-6100'] },
  'imagePROGRAF TM-300': { urlPath: '/shop/p/imageprograf-tm-300', keywords: ['imageprograf', 'tm-300'] },
  'imagePROGRAF TM-350': { urlPath: '/shop/p/imageprograf-tm-350', keywords: ['imageprograf', 'tm-350'] },
  'imagePROGRAF GP-4000': { urlPath: '/shop/p/imageprograf-gp-4000', keywords: ['imageprograf', 'gp-4000'] },
  'imageCLASS MF269dw II': { urlPath: '/shop/p/imageclass-mf269dw-ii', keywords: ['imageclass', 'mf269dw'] },
  'imageCLASS MF453dw': { urlPath: '/shop/p/imageclass-mf453dw', keywords: ['imageclass', 'mf453dw'] },
  'imageCLASS MF654Cdw': { urlPath: '/shop/p/imageclass-mf654cdw', keywords: ['imageclass', 'mf654cdw'] },
  'imageCLASS LBP236dw': { urlPath: '/shop/p/imageclass-lbp236dw', keywords: ['imageclass', 'lbp236dw'] },
  'imageCLASS LBP632Cdw': { urlPath: '/shop/p/imageclass-lbp632cdw', keywords: ['imageclass', 'lbp632cdw'] },
  'imageCLASS MF743Cdw': { urlPath: '/shop/p/imageclass-mf743cdw', keywords: ['imageclass', 'mf743cdw'] },
  'imageCLASS D1650': { urlPath: '/shop/p/imageclass-d1650', keywords: ['imageclass', 'd1650'] },
};

export class CanonAdapter implements BrandAdapter {
  brand = 'Canon';
  supportedPatterns = [
    /^Canon\s/i,
    /^EOS\s/i,
    /^RF\s?\d+/i,
    /^PIXMA\s/i,
    /^imagePROGRAF\s/i,
    /^imageCLASS\s/i,
    /^PowerShot\s/i,
    /^VIXIA\s/i,
    /^SELPHY\s/i,
  ];

  private rateLimiter = new RateLimiter(CANON_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'canon') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${CANON_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        CANON_CONFIG,
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
    
    for (const [product, config] of Object.entries(CANON_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(CANON_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${CANON_CONFIG.searchUrl}?q=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        CANON_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/shop\/p\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${CANON_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          CANON_CONFIG,
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
          .replace(/\/\d+x\d+\//, '/1200x1200/');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/[^"']*\.usa\.canon\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/static\.usa\.canon\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](\/\/[^"']*canon[^"']+\.(jpg|png|webp))["']/gi,
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
        /<tr[^>]*class=["'][^"']*spec-row[^"']*["'][^>]*>([\s\S]*?)<\/tr>/gi,
        /<span[^>]*class=["'][^"']*key-feature[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
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

      const megapixelMatch = html.match(/(\d+\.?\d*)\s*(?:MP|megapixel)/i);
      if (megapixelMatch) {
        specsJson.megapixels = megapixelMatch[1];
      }

      const sensorMatch = html.match(/(full[- ]frame|aps-c|micro four thirds)/i);
      if (sensorMatch) {
        specsJson.sensorType = sensorMatch[1];
      }

      const isoMatch = html.match(/ISO\s*(?:range:?\s*)?(\d+)\s*[-–]\s*(\d+)/i);
      if (isoMatch) {
        specsJson.isoRange = `${isoMatch[1]}-${isoMatch[2]}`;
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
        if (jsonLd.image) {
          if (typeof jsonLd.image === 'string' && !imageUrl) {
            imageUrl = jsonLd.image;
          } else if (Array.isArray(jsonLd.image)) {
            for (const img of jsonLd.image) {
              const imgStr = typeof img === 'string' ? img : (img as any)?.url;
              if (imgStr && !galleryImages.includes(imgStr) && galleryImages.length < 5) {
                galleryImages.push(imgStr);
              }
            }
          }
        }
      }

      let name = ogTitle || '';
      name = name
        .replace(/\s*\|\s*Canon\s*(USA|U\.S\.A\.)?/gi, '')
        .replace(/\s*-\s*Canon\s*/gi, '')
        .replace(/^Buy\s+/i, '')
        .replace(/^Shop\s+/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      const productType = this.detectProductType(name);

      return {
        name: name || 'Canon Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://www.usa.canon.com/support/p/${this.generateSupportSlug(name)}`,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? { ...specsJson, productType } : { productType },
      };
    } catch (error) {
      console.error('[canon-adapter] Error extracting product data:', error);
      return null;
    }
  }

  private detectProductType(name: string): string {
    const nameLower = name.toLowerCase();
    
    if (/eos\s*r\d*|eos\s*rp/i.test(name)) {
      return 'mirrorless-camera';
    }
    if (/eos\s*\d+d|eos\s*rebel|eos\s*1d/i.test(name)) {
      return 'dslr-camera';
    }
    if (/^rf\s*\d+/i.test(name)) {
      return 'rf-lens';
    }
    if (/^ef\s*\d+/i.test(name)) {
      return 'ef-lens';
    }
    if (nameLower.includes('pixma')) {
      return 'inkjet-printer';
    }
    if (nameLower.includes('imageprograf')) {
      return 'large-format-printer';
    }
    if (nameLower.includes('imageclass')) {
      return 'laser-printer';
    }
    if (nameLower.includes('powershot')) {
      return 'compact-camera';
    }
    if (nameLower.includes('vixia')) {
      return 'camcorder';
    }
    if (nameLower.includes('selphy')) {
      return 'photo-printer';
    }
    
    return 'other';
  }

  private generateSupportSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const canonAdapter = new CanonAdapter();
