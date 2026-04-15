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

const HP_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://www.hp.com',
  searchUrl: 'https://www.hp.com/us-en/search.html',
  rateLimit: 20,
  timeout: 30000,
};

const HP_PRODUCT_PATTERNS: Record<string, { urlTemplate: string; keywords: string[] }> = {
  'Spectre x360 14': { urlTemplate: '/us-en/shop/pdp/hp-spectre-x360-14', keywords: ['spectre', 'x360', '14'] },
  'Spectre x360 16': { urlTemplate: '/us-en/shop/pdp/hp-spectre-x360-16', keywords: ['spectre', 'x360', '16'] },
  'Spectre x360': { urlTemplate: '/us-en/shop/pdp/hp-spectre-x360', keywords: ['spectre', 'x360'] },
  'Spectre': { urlTemplate: '/us-en/shop/pdp/hp-spectre', keywords: ['spectre'] },
  'EliteBook 840': { urlTemplate: '/us-en/shop/pdp/hp-elitebook-840', keywords: ['elitebook', '840'] },
  'EliteBook 860': { urlTemplate: '/us-en/shop/pdp/hp-elitebook-860', keywords: ['elitebook', '860'] },
  'EliteBook 1040': { urlTemplate: '/us-en/shop/pdp/hp-elitebook-1040', keywords: ['elitebook', '1040'] },
  'EliteBook x360': { urlTemplate: '/us-en/shop/pdp/hp-elitebook-x360', keywords: ['elitebook', 'x360'] },
  'EliteBook': { urlTemplate: '/us-en/shop/pdp/hp-elitebook', keywords: ['elitebook'] },
  'ZBook Studio': { urlTemplate: '/us-en/shop/pdp/hp-zbook-studio', keywords: ['zbook', 'studio'] },
  'ZBook Fury': { urlTemplate: '/us-en/shop/pdp/hp-zbook-fury', keywords: ['zbook', 'fury'] },
  'ZBook Power': { urlTemplate: '/us-en/shop/pdp/hp-zbook-power', keywords: ['zbook', 'power'] },
  'ZBook Firefly': { urlTemplate: '/us-en/shop/pdp/hp-zbook-firefly', keywords: ['zbook', 'firefly'] },
  'ZBook': { urlTemplate: '/us-en/shop/pdp/hp-zbook', keywords: ['zbook'] },
  'Envy x360 15': { urlTemplate: '/us-en/shop/pdp/hp-envy-x360-15', keywords: ['envy', 'x360', '15'] },
  'Envy x360 16': { urlTemplate: '/us-en/shop/pdp/hp-envy-x360-16', keywords: ['envy', 'x360', '16'] },
  'Envy x360': { urlTemplate: '/us-en/shop/pdp/hp-envy-x360', keywords: ['envy', 'x360'] },
  'Envy 17': { urlTemplate: '/us-en/shop/pdp/hp-envy-17', keywords: ['envy', '17'] },
  'Envy 16': { urlTemplate: '/us-en/shop/pdp/hp-envy-16', keywords: ['envy', '16'] },
  'Envy 15': { urlTemplate: '/us-en/shop/pdp/hp-envy-15', keywords: ['envy', '15'] },
  'Envy': { urlTemplate: '/us-en/shop/pdp/hp-envy', keywords: ['envy'] },
  'Pavilion Plus': { urlTemplate: '/us-en/shop/pdp/hp-pavilion-plus', keywords: ['pavilion', 'plus'] },
  'Pavilion x360': { urlTemplate: '/us-en/shop/pdp/hp-pavilion-x360', keywords: ['pavilion', 'x360'] },
  'Pavilion 15': { urlTemplate: '/us-en/shop/pdp/hp-pavilion-15', keywords: ['pavilion', '15'] },
  'Pavilion 16': { urlTemplate: '/us-en/shop/pdp/hp-pavilion-16', keywords: ['pavilion', '16'] },
  'Pavilion': { urlTemplate: '/us-en/shop/pdp/hp-pavilion', keywords: ['pavilion'] },
  'OMEN 16': { urlTemplate: '/us-en/shop/pdp/hp-omen-16', keywords: ['omen', '16'] },
  'OMEN 17': { urlTemplate: '/us-en/shop/pdp/hp-omen-17', keywords: ['omen', '17'] },
  'OMEN Transcend': { urlTemplate: '/us-en/shop/pdp/hp-omen-transcend', keywords: ['omen', 'transcend'] },
  'OMEN': { urlTemplate: '/us-en/shop/pdp/hp-omen', keywords: ['omen'] },
  'Z8 Workstation': { urlTemplate: '/us-en/shop/pdp/hp-z8-workstation', keywords: ['z8', 'workstation'] },
  'Z6 Workstation': { urlTemplate: '/us-en/shop/pdp/hp-z6-workstation', keywords: ['z6', 'workstation'] },
  'Z4 Workstation': { urlTemplate: '/us-en/shop/pdp/hp-z4-workstation', keywords: ['z4', 'workstation'] },
  'Z2 Tower': { urlTemplate: '/us-en/shop/pdp/hp-z2-tower-workstation', keywords: ['z2', 'tower'] },
  'Z2 Mini': { urlTemplate: '/us-en/shop/pdp/hp-z2-mini-workstation', keywords: ['z2', 'mini'] },
  'Z Workstation': { urlTemplate: '/us-en/shop/pdp/hp-z-workstation', keywords: ['z', 'workstation'] },
  'LaserJet Pro MFP': { urlTemplate: '/us-en/shop/pdp/hp-laserjet-pro-mfp', keywords: ['laserjet', 'pro', 'mfp'] },
  'LaserJet Pro': { urlTemplate: '/us-en/shop/pdp/hp-laserjet-pro', keywords: ['laserjet', 'pro'] },
  'LaserJet Enterprise': { urlTemplate: '/us-en/shop/pdp/hp-laserjet-enterprise', keywords: ['laserjet', 'enterprise'] },
  'LaserJet MFP': { urlTemplate: '/us-en/shop/pdp/hp-laserjet-mfp', keywords: ['laserjet', 'mfp'] },
  'LaserJet': { urlTemplate: '/us-en/shop/pdp/hp-laserjet', keywords: ['laserjet'] },
  'OfficeJet Pro': { urlTemplate: '/us-en/shop/pdp/hp-officejet-pro', keywords: ['officejet', 'pro'] },
  'OfficeJet': { urlTemplate: '/us-en/shop/pdp/hp-officejet', keywords: ['officejet'] },
  'DeskJet': { urlTemplate: '/us-en/shop/pdp/hp-deskjet', keywords: ['deskjet'] },
  'ENVY Inspire': { urlTemplate: '/us-en/shop/pdp/hp-envy-inspire', keywords: ['envy', 'inspire'] },
  'Smart Tank': { urlTemplate: '/us-en/shop/pdp/hp-smart-tank', keywords: ['smart', 'tank'] },
};

export class HPAdapter implements BrandAdapter {
  brand = 'HP';
  supportedPatterns = [
    /^HP\s/i,
    /^Spectre\s/i,
    /^EliteBook\s/i,
    /^ZBook\s/i,
    /^Envy\s/i,
    /^Pavilion\s/i,
    /^OMEN\s/i,
    /^LaserJet\s/i,
    /^OfficeJet\s/i,
    /^DeskJet\s/i,
    /^ProBook\s/i,
    /^Victus\s/i,
    /^Z\d+\s+Workstation/i,
    /^Smart\s?Tank\s/i,
  ];

  private rateLimiter = new RateLimiter(HP_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'hp' || brand?.toLowerCase() === 'hewlett-packard') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const productUrl = `${HP_CONFIG.baseUrl}${matchedProduct.urlTemplate}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        HP_CONFIG,
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

  private findProductMatch(productName: string): { urlTemplate: string; keywords: string[] } | null {
    const nameLower = productName.toLowerCase();
    
    for (const [product, config] of Object.entries(HP_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(HP_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw)).length;
      if (matchCount >= config.keywords.length) {
        return config;
      }
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${HP_CONFIG.searchUrl}?q=${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        HP_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/us-en\/shop\/pdp\/[^"']+)["']/i) ||
                               html.match(/href=["'](https:\/\/www\.hp\.com\/us-en\/shop\/pdp\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productPath = productLinkMatch[1].startsWith('http') 
          ? productLinkMatch[1] 
          : `${HP_CONFIG.baseUrl}${productLinkMatch[1]}`;
        
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productPath,
          HP_CONFIG,
          this.rateLimiter
        );

        if (productHtml && productStatus === 200) {
          const productData = await this.extractProductData(productHtml, productPath);
          if (productData) {
            return {
              success: true,
              productId: '',
              brand: this.brand,
              data: productData,
              durationMs: Date.now() - startTime,
              sourceUrl: productPath,
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
          .replace(/\/w\/\d+\//, '/w/1200/')
          .replace(/\/h\/\d+\//, '/h/1200/');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/ssl-product-images\.www8-hp\.com\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/www\.hp\.com\/[^"']*\/product-images\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/m\.media-amazon\.com\/images\/[^"']+\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/[^"']*hp[^"']*\/images\/[^"']+\.(jpg|png|webp))["']/gi,
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
        /<li[^>]*class=["'][^"']*spec[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi,
        /<div[^>]*class=["'][^"']*feature[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
        /<tr[^>]*class=["'][^"']*spec-row[^"']*["'][^>]*>([\s\S]*?)<\/tr>/gi,
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

      const processorMatch = html.match(/Intel[®]?\s*Core[™]?\s*[^\s<]+[^<]{0,50}/i) ||
                             html.match(/AMD\s*Ryzen[™]?\s*[^\s<]+[^<]{0,50}/i);
      if (processorMatch) {
        const processor = cleanText(processorMatch[0]);
        if (!specs.includes(processor)) {
          specs.unshift(processor);
          specsJson.processor = processor;
        }
      }

      const memoryMatch = html.match(/(\d+)\s*GB\s*(DDR\d+|RAM|Memory)/i);
      if (memoryMatch) {
        specsJson.memory = `${memoryMatch[1]} GB`;
      }

      const storageMatch = html.match(/(\d+)\s*(GB|TB)\s*(SSD|HDD|PCIe|NVMe)/i);
      if (storageMatch) {
        specsJson.storage = `${storageMatch[1]} ${storageMatch[2]} ${storageMatch[3]}`;
      }

      const displayMatch = html.match(/(\d+\.?\d*)["\u2033\u201D]?\s*(diagonal|display|screen|FHD|QHD|4K|OLED|IPS)/i);
      if (displayMatch) {
        specsJson.display = cleanText(displayMatch[0]);
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
        if (jsonLd.gtin13 || jsonLd.gtin) {
          specsJson.gtin = jsonLd.gtin13 || jsonLd.gtin;
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
        .replace(/\s*\|\s*HP[®]?\s*(Official\s*Site)?/gi, '')
        .replace(/\s*-\s*HP[®]?\s*/gi, '')
        .replace(/^Buy\s+/i, '')
        .replace(/\s*\|\s*HP\.com/gi, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      return {
        name: name || 'HP Product',
        description: ogDescription || undefined,
        descriptionShort: ogDescription?.slice(0, 160),
        imageUrl: imageUrl || undefined,
        galleryImageUrls: galleryImages.length > 0 ? galleryImages : undefined,
        productUrl,
        supportUrl: `https://support.hp.com/us-en/search?q=${encodeURIComponent(name)}`,
        specs: specs.length > 0 ? specs.slice(0, 10) : undefined,
        specsJson: Object.keys(specsJson).length > 0 ? specsJson : undefined,
      };
    } catch (error) {
      console.error('[hp-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const hpAdapter = new HPAdapter();
