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

const SONY_CONFIG: AdapterConfig = {
  ...DEFAULT_CONFIG,
  baseUrl: 'https://electronics.sony.com',
  searchUrl: 'https://electronics.sony.com/search/',
  rateLimit: 20,
  timeout: 30000,
};

const SONY_PRODUCT_PATTERNS: Record<string, { urlPath: string; keywords: string[]; baseUrl?: string }> = {
  'Alpha A7 IV': { urlPath: '/imaging/interchangeable-lens-cameras/full-frame/p/ilce7m4-b', keywords: ['alpha', 'a7', 'iv', '7m4'] },
  'Alpha A7R V': { urlPath: '/imaging/interchangeable-lens-cameras/full-frame/p/ilce7rm5-b', keywords: ['alpha', 'a7r', 'v', '7rm5'] },
  'Alpha A7S III': { urlPath: '/imaging/interchangeable-lens-cameras/full-frame/p/ilce7sm3-b', keywords: ['alpha', 'a7s', 'iii', '7sm3'] },
  'Alpha A7C II': { urlPath: '/imaging/interchangeable-lens-cameras/full-frame/p/ilce7cm2-b', keywords: ['alpha', 'a7c', 'ii', '7cm2'] },
  'Alpha A9 III': { urlPath: '/imaging/interchangeable-lens-cameras/full-frame/p/ilce9m3-b', keywords: ['alpha', 'a9', 'iii', '9m3'] },
  'Alpha A1': { urlPath: '/imaging/interchangeable-lens-cameras/full-frame/p/ilce1-b', keywords: ['alpha', 'a1', 'ilce1'] },
  'Alpha A6700': { urlPath: '/imaging/interchangeable-lens-cameras/aps-c/p/ilce6700-b', keywords: ['alpha', 'a6700', '6700'] },
  'Alpha A6400': { urlPath: '/imaging/interchangeable-lens-cameras/aps-c/p/ilce6400-b', keywords: ['alpha', 'a6400', '6400'] },
  'FX3': { urlPath: '/products/cinema-line', keywords: ['fx3', 'cinema'], baseUrl: 'https://pro.sony/ue_US' },
  'FX6': { urlPath: '/products/cinema-line', keywords: ['fx6', 'cinema'], baseUrl: 'https://pro.sony/ue_US' },
  'FX9': { urlPath: '/products/cinema-line', keywords: ['fx9', 'cinema'], baseUrl: 'https://pro.sony/ue_US' },
  'FX30': { urlPath: '/imaging/interchangeable-lens-cameras/aps-c/p/ilmefx30b', keywords: ['fx30'] },
  'WH-1000XM5': { urlPath: '/audio/headphones/headband/p/wh1000xm5-b', keywords: ['wh-1000xm5', 'wh1000xm5', '1000xm5'] },
  'WH-1000XM4': { urlPath: '/audio/headphones/headband/p/wh1000xm4-b', keywords: ['wh-1000xm4', 'wh1000xm4', '1000xm4'] },
  'WH-CH720N': { urlPath: '/audio/headphones/headband/p/whch720n-b', keywords: ['wh-ch720n', 'whch720n', 'ch720n'] },
  'WH-CH520': { urlPath: '/audio/headphones/headband/p/whch520-b', keywords: ['wh-ch520', 'whch520', 'ch520'] },
  'WH-ULT900N': { urlPath: '/audio/headphones/headband/p/whult900n-b', keywords: ['wh-ult900n', 'whult900n', 'ult900n', 'ult'] },
  'WF-1000XM5': { urlPath: '/audio/headphones/truly-wireless/p/wf1000xm5-b', keywords: ['wf-1000xm5', 'wf1000xm5'] },
  'WF-1000XM4': { urlPath: '/audio/headphones/truly-wireless/p/wf1000xm4-b', keywords: ['wf-1000xm4', 'wf1000xm4'] },
  'WF-C700N': { urlPath: '/audio/headphones/truly-wireless/p/wfc700n-b', keywords: ['wf-c700n', 'wfc700n', 'c700n'] },
  'WF-C500': { urlPath: '/audio/headphones/truly-wireless/p/wfc500-b', keywords: ['wf-c500', 'wfc500', 'c500'] },
  'LinkBuds S': { urlPath: '/audio/headphones/truly-wireless/p/wfls900n-b', keywords: ['linkbuds', 's', 'wfls900n'] },
  'LinkBuds': { urlPath: '/audio/headphones/truly-wireless/p/wfl900-w', keywords: ['linkbuds'] },
  'MDR-MV1': { urlPath: '/audio/headphones/headband/p/mdrmv1', keywords: ['mdr-mv1', 'mdrmv1', 'mv1'] },
  'MDR-M1': { urlPath: '/audio/headphones/headband/p/mdrm1', keywords: ['mdr-m1', 'mdrm1'] },
  'MDR-Z1R': { urlPath: '/audio/headphones/headband/p/mdrz1r', keywords: ['mdr-z1r', 'mdrz1r', 'z1r'] },
  'MDR-7506': { urlPath: '/audio/headphones/headband/p/mdr7506', keywords: ['mdr-7506', 'mdr7506', '7506'] },
  'INZONE H9': { urlPath: '/audio/gaming-headsets/p/whg900n-w', keywords: ['inzone', 'h9'] },
  'INZONE H7': { urlPath: '/audio/gaming-headsets/p/whg700-w', keywords: ['inzone', 'h7'] },
  'INZONE H5': { urlPath: '/audio/gaming-headsets/p/mdrg500-w', keywords: ['inzone', 'h5'] },
  'ZV-E10': { urlPath: '/imaging/interchangeable-lens-cameras/aps-c/p/ilczve10-b', keywords: ['zv-e10', 'zve10'] },
  'ZV-E10 II': { urlPath: '/imaging/interchangeable-lens-cameras/aps-c/p/ilczve10m2-b', keywords: ['zv-e10', 'ii', 'zve10m2'] },
  'ZV-E1': { urlPath: '/imaging/interchangeable-lens-cameras/full-frame/p/ilczve1-b', keywords: ['zv-e1', 'zve1'] },
  'ZV-1 II': { urlPath: '/imaging/compact-cameras/all-compact-cameras/p/zv1m2-b', keywords: ['zv-1', 'ii', 'zv1m2'] },
  'PlayStation 5': { urlPath: '/gaming/playstation-5', keywords: ['playstation', 'ps5', '5'] },
  'PlayStation VR2': { urlPath: '/gaming/playstation-vr2', keywords: ['playstation', 'vr2', 'psvr'] },
  'DualSense': { urlPath: '/gaming/playstation-5-accessories/p/cfizct1w', keywords: ['dualsense', 'controller'] },
  'SRS-XB100': { urlPath: '/audio/speakers/wireless-speakers/p/srsxb100-b', keywords: ['srs-xb100', 'srsxb100', 'xb100'] },
  'SRS-XG300': { urlPath: '/audio/speakers/wireless-speakers/p/srsxg300-b', keywords: ['srs-xg300', 'srsxg300', 'xg300'] },
  'ULT Tower 10': { urlPath: '/audio/speakers/wireless-speakers/p/srsult1000', keywords: ['ult', 'tower', '10', 'srsult1000'] },
  'Bravia XR A95L': { urlPath: '/tv-video/televisions/oled/p/xr77a95l', keywords: ['bravia', 'a95l', 'oled'] },
  'Bravia XR A80L': { urlPath: '/tv-video/televisions/oled/p/xr55a80l', keywords: ['bravia', 'a80l', 'oled'] },
  'Bravia XR X90L': { urlPath: '/tv-video/televisions/all-tvs/p/xr55x90l', keywords: ['bravia', 'x90l'] },
};

export class SonyAdapter implements BrandAdapter {
  brand = 'Sony';
  supportedPatterns = [
    /^Sony\s/i,
    /^Alpha\s/i,
    /^(A[1-9]|A\d{4})\b/i,
    /^FX[36-9]0?\b/i,
    /^WH-/i,
    /^WF-/i,
    /^MDR-/i,
    /^INZONE\s/i,
    /^ZV-/i,
    /^LinkBuds/i,
    /^PlayStation/i,
    /^DualSense/i,
    /^SRS-/i,
    /^Bravia/i,
    /^ULT\s/i,
  ];

  private rateLimiter = new RateLimiter(SONY_CONFIG.rateLimit);

  canHandle(productName: string, brand?: string): boolean {
    if (brand?.toLowerCase() === 'sony') return true;
    return this.supportedPatterns.some(pattern => pattern.test(productName));
  }

  async findProduct(productName: string, _sku?: string): Promise<AdapterResult> {
    const startTime = Date.now();
    
    try {
      const matchedProduct = this.findProductMatch(productName);
      
      if (!matchedProduct) {
        return await this.searchProduct(productName, startTime);
      }

      const baseUrl = matchedProduct.baseUrl || SONY_CONFIG.baseUrl;
      const productUrl = `${baseUrl}${matchedProduct.urlPath}`;
      
      const { html, status } = await fetchWithRetry(
        productUrl,
        SONY_CONFIG,
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
    
    for (const [product, config] of Object.entries(SONY_PRODUCT_PATTERNS)) {
      if (nameLower.includes(product.toLowerCase())) {
        return config;
      }
    }
    
    for (const [_, config] of Object.entries(SONY_PRODUCT_PATTERNS)) {
      const matchCount = config.keywords.filter(kw => nameLower.includes(kw.toLowerCase())).length;
      if (matchCount >= Math.min(2, config.keywords.length)) {
        return config;
      }
    }
    
    if (nameLower.includes('alpha') || /\ba[1-9]\b/i.test(nameLower) || /\ba\d{4}\b/i.test(nameLower)) {
      return { urlPath: '/imaging/interchangeable-lens-cameras/full-frame', keywords: ['alpha'] };
    }
    if (/^fx\d/i.test(nameLower)) {
      return { urlPath: '/products/cinema-line', keywords: ['fx', 'cinema'], baseUrl: 'https://pro.sony/ue_US' };
    }
    if (nameLower.startsWith('wh-') || nameLower.includes('wh-')) {
      return { urlPath: '/audio/headphones/headband', keywords: ['wh'] };
    }
    if (nameLower.startsWith('wf-') || nameLower.includes('wf-')) {
      return { urlPath: '/audio/headphones/truly-wireless', keywords: ['wf'] };
    }
    if (nameLower.startsWith('mdr-') || nameLower.includes('mdr-')) {
      return { urlPath: '/audio/headphones', keywords: ['mdr'] };
    }
    
    return null;
  }

  private async searchProduct(productName: string, startTime: number): Promise<AdapterResult> {
    const searchQuery = encodeURIComponent(productName);
    const searchUrl = `${SONY_CONFIG.searchUrl}${searchQuery}`;

    try {
      const { html, status } = await fetchWithRetry(
        searchUrl,
        SONY_CONFIG,
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

      const productLinkMatch = html.match(/href=["'](\/[^"']*\/p\/[^"']+)["']/i);
      
      if (productLinkMatch) {
        const productUrl = `${SONY_CONFIG.baseUrl}${productLinkMatch[1]}`;
        const { html: productHtml, status: productStatus } = await fetchWithRetry(
          productUrl,
          SONY_CONFIG,
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
          .replace(/\/w_\d+/, '/w_1200')
          .replace(/\/h_\d+/, '/h_1200');
      }

      const galleryImages: string[] = [];
      const galleryPatterns = [
        /["'](https:\/\/[^"']*sony[^"']*\.(jpg|png|webp))["']/gi,
        /["'](https:\/\/[^"']*sonyimages[^"']*\.(jpg|png|webp))["']/gi,
        /data-src=["']([^"']+\.(jpg|png|webp))["']/gi,
        /srcset=["']([^\s"']+\.(jpg|png|webp))/gi,
      ];
      
      for (const pattern of galleryPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          let imgUrl = match[1];
          if (!imgUrl.startsWith('http')) {
            imgUrl = `https://electronics.sony.com${imgUrl}`;
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
        /<td[^>]*class=["'][^"']*spec-value[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi,
        /<span[^>]*class=["'][^"']*key-feature[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
        /<p[^>]*class=["'][^"']*product-feature[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi,
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

      const specTablePattern = /<tr[^>]*>\s*<t[hd][^>]*>([\s\S]*?)<\/t[hd]>\s*<t[hd][^>]*>([\s\S]*?)<\/t[hd]>\s*<\/tr>/gi;
      let tableMatch;
      while ((tableMatch = specTablePattern.exec(html)) !== null) {
        const key = cleanText(tableMatch[1]);
        const value = cleanText(tableMatch[2]);
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
        if (jsonLd.mpn) {
          specsJson.modelNumber = jsonLd.mpn;
        }
        if (jsonLd.gtin13) {
          specsJson.ean = jsonLd.gtin13;
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
        .replace(/\s*\|\s*Sony\s*(US|USA|UK)?/gi, '')
        .replace(/\s*-\s*Sony\s*/gi, '')
        .replace(/Buy\s+/i, '')
        .replace(/\s*\|.*$/, '')
        .trim();

      if (!imageUrl && !name) {
        return null;
      }

      let supportUrl = 'https://www.sony.com/electronics/support';
      const modelMatch = productUrl.match(/\/p\/([^\/\?]+)/i);
      if (modelMatch) {
        supportUrl = `https://www.sony.com/electronics/support/search/${encodeURIComponent(modelMatch[1])}`;
      }

      return {
        name: name || 'Sony Product',
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
      console.error('[sony-adapter] Error extracting product data:', error);
      return null;
    }
  }
}

export const sonyAdapter = new SonyAdapter();
