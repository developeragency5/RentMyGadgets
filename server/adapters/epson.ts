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

const EPSON_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.epson.com',
  searchUrl: 'https://www.epson.com/Search/Printers',
  rateLimit: 20,
  timeout: 30000,
};

const EPSON_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[] }> = {
  'EcoTank ET-15000': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-ET-15000/p/C11CH96201', keywords: ['ecotank', 'et-15000'] },
  'EcoTank ET-8550': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-Photo-ET-8550/p/C11CJ21201', keywords: ['ecotank', 'et-8550'] },
  'EcoTank ET-5850': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-Pro-ET-5850/p/C11CJ29201', keywords: ['ecotank', 'et-5850'] },
  'EcoTank ET-4850': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-ET-4850/p/C11CJ21201', keywords: ['ecotank', 'et-4850'] },
  'EcoTank ET-3850': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-ET-3850/p/C11CJ61201', keywords: ['ecotank', 'et-3850'] },
  'EcoTank ET-2850': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-ET-2850/p/C11CJ63201', keywords: ['ecotank', 'et-2850'] },
  'EcoTank ET-2800': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-ET-2800/p/C11CJ66201', keywords: ['ecotank', 'et-2800'] },
  'EcoTank ET-16650': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-Pro-ET-16650/p/C11CH71201', keywords: ['ecotank', 'et-16650'] },
  'EcoTank ET-5880': { urlPath: '/For-Home/Printers/Inkjet/EcoTank/EcoTank-Pro-ET-5880/p/C11CK56201', keywords: ['ecotank', 'et-5880'] },
  'WorkForce Pro WF-7840': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-Pro-WF-7840/p/C11CH67201', keywords: ['workforce', 'pro', 'wf-7840'] },
  'WorkForce Pro WF-7820': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-Pro-WF-7820/p/C11CH78201', keywords: ['workforce', 'pro', 'wf-7820'] },
  'WorkForce Pro WF-4830': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-Pro-WF-4830/p/C11CJ05201', keywords: ['workforce', 'pro', 'wf-4830'] },
  'WorkForce Pro WF-4820': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-Pro-WF-4820/p/C11CJ06201', keywords: ['workforce', 'pro', 'wf-4820'] },
  'WorkForce Pro WF-3820': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-Pro-WF-3820/p/C11CJ07201', keywords: ['workforce', 'pro', 'wf-3820'] },
  'WorkForce WF-2960': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-WF-2960/p/C11CK60201', keywords: ['workforce', 'wf-2960'] },
  'WorkForce WF-2860': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-WF-2860/p/C11CG28201', keywords: ['workforce', 'wf-2860'] },
  'WorkForce WF-110': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-WF-110/p/C11CH25201', keywords: ['workforce', 'wf-110'] },
  'WorkForce EC-C7000': { urlPath: '/For-Work/Printers/Inkjet/WorkForce/WorkForce-Enterprise-WF-C7000/p/C11CG38201', keywords: ['workforce', 'ec-c7000'] },
  'SureColor P900': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-P900/p/C11CH37201', keywords: ['surecolor', 'p900'] },
  'SureColor P700': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-P700/p/C11CH38201', keywords: ['surecolor', 'p700'] },
  'SureColor P5000': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-P5000/p/SCP5000SE', keywords: ['surecolor', 'p5000'] },
  'SureColor P7570': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-P7570/p/SCP7570SE', keywords: ['surecolor', 'p7570'] },
  'SureColor P9570': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-P9570/p/SCP9570SE', keywords: ['surecolor', 'p9570'] },
  'SureColor F570': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-F570/p/C11CJ09201', keywords: ['surecolor', 'f570'] },
  'SureColor F170': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-F170/p/C11CJ80201', keywords: ['surecolor', 'f170'] },
  'SureColor T3170': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-T3170/p/SCT3170SR', keywords: ['surecolor', 't3170'] },
  'SureColor T5170': { urlPath: '/For-Work/Printers/Large-Format/SureColor/SureColor-T5170/p/SCT5170SR', keywords: ['surecolor', 't5170'] },
  'Expression Photo XP-970': { urlPath: '/For-Home/Printers/Inkjet/Expression-Photo/Expression-Photo-XP-970/p/C11CH45201', keywords: ['expression', 'photo', 'xp-970'] },
  'Expression Photo XP-8700': { urlPath: '/For-Home/Printers/Inkjet/Expression-Photo/Expression-Photo-XP-8700/p/C11CK46201', keywords: ['expression', 'photo', 'xp-8700'] },
  'Expression Photo HD XP-15000': { urlPath: '/For-Home/Printers/Inkjet/Expression-Photo/Expression-Photo-HD-XP-15000/p/C11CG43201', keywords: ['expression', 'photo', 'hd', 'xp-15000'] },
  'Expression Home XP-4200': { urlPath: '/For-Home/Printers/Inkjet/Expression-Home/Expression-Home-XP-4200/p/C11CK65201', keywords: ['expression', 'home', 'xp-4200'] },
  'Expression Home XP-5200': { urlPath: '/For-Home/Printers/Inkjet/Expression-Home/Expression-Home-XP-5200/p/C11CK61201', keywords: ['expression', 'home', 'xp-5200'] },
  'Expression Premium XP-7100': { urlPath: '/For-Home/Printers/Inkjet/Expression-Premium/Expression-Premium-XP-7100/p/C11CH03201', keywords: ['expression', 'premium', 'xp-7100'] },
};

export class EpsonAdapter implements BrandAdapter {
  brand = 'Epson';
  supportedPatterns = [
    /^Epson\s/i,
    /^EcoTank\s/i,
    /^WorkForce\s/i,
    /^SureColor\s/i,
    /^Expression\s/i,
    /\bET-\d+/i,
    /\bWF-\d+/i,
    /\bXP-\d+/i,
  ];

  private rateLimiter = new RateLimiter(EPSON_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'epson') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${EPSON_CONFIG.baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        EPSON_CONFIG,
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
    
    for (const [product, config] of Object.entries(EPSON_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(EPSON_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${EPSON_CONFIG.baseUrl}/Search/Printers?q=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        EPSON_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/For-(?:Home|Work)\/Printers\/[^"']+\/p\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${EPSON_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          EPSON_CONFIG,
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
        /["'](https:\/\/[^"']*\.epson\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/mediaserver\.goepson\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](\/\/[^"']*epson[^"']+\.(jpg|png|webp))["']/gi,
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
        /<li[^>]*class=["'][^"']*bullet[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi,
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

      const printSpeedMatch = html.match(/(\d+\.?\d*)\s*(?:ppm|pages?\s*per\s*minute)/i);
      if (printSpeedMatch) {
        specsJson.printSpeed = printSpeedMatch[1] + ' ppm';
      }

      const resolutionMatch = html.match(/(\d+)\s*x\s*(\d+)\s*dpi/i);
      if (resolutionMatch) {
        specsJson.resolution = `${resolutionMatch[1]}x${resolutionMatch[2]} dpi`;
      }

      const connectivityMatch = html.match(/(Wi-Fi|Ethernet|USB|Bluetooth)/gi);
      if (connectivityMatch) {
        specsJson.connectivity = Array.from(new Set(connectivityMatch));
      }

      const inkTypeMatch = html.match(/(PrecisionCore|Claria|DURABrite|UltraChrome)/i);
      if (inkTypeMatch) {
        specsJson.inkType = inkTypeMatch[1];
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
        .replace(/\s*\|\s*Epson\s*(US|USA|U\.S\.)?/gi, '')
        .replace(/\s*-\s*Epson\s*/gi, '')
        .replace(/^Buy\s+/i, '')
        .replace(/^Shop\s+/i, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      const productType = this.detectProductType(name);

      return {
        name: name || 'Epson Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://epson.com/Support/${this.generateSupportSlug(name)}`,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? { ...specsJson, productType } : { productType },
      };
    } catch (error) {
      console.error('[epson-adapter] Error extracting product data:', error);
      return null;
    }
  }

  private detectProductType(name: string): string {
    const nameLower = name.toLowerCase();
    
    if (/ecotank/i.test(name)) {
      return 'ecotank-printer';
    }
    if (/workforce\s*pro/i.test(name)) {
      return 'business-inkjet-printer';
    }
    if (/workforce/i.test(name)) {
      return 'inkjet-printer';
    }
    if (/surecolor\s*(p\d+|sc-p)/i.test(name)) {
      return 'photo-printer';
    }
    if (/surecolor\s*(f\d+|sc-f)/i.test(name)) {
      return 'dye-sublimation-printer';
    }
    if (/surecolor\s*(t\d+|sc-t)/i.test(name)) {
      return 'technical-printer';
    }
    if (/surecolor/i.test(name)) {
      return 'wide-format-printer';
    }
    if (/expression\s*photo/i.test(name)) {
      return 'photo-printer';
    }
    if (/expression\s*premium/i.test(name)) {
      return 'premium-inkjet-printer';
    }
    if (/expression\s*home/i.test(name)) {
      return 'home-inkjet-printer';
    }
    if (/expression/i.test(name)) {
      return 'inkjet-printer';
    }
    if (nameLower.includes('projector')) {
      return 'projector';
    }
    if (nameLower.includes('scanner')) {
      return 'scanner';
    }
    
    return 'printer';
  }

  private generateSupportSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const epsonAdapter = new EpsonAdapter();
