export interface ProductData {
  name: string;
  sku?: string;
  description?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  specs?: string[];
  specsJson?: Record<string, unknown>;
  specHtml?: string;
  imageUrl?: string;
  galleryImageUrls?: string[];
  productUrl?: string;
  supportUrl?: string;
  price?: number;
}

export interface AdapterResult {
  success: boolean;
  productId: string;
  brand: string;
  data?: ProductData;
  error?: string;
  httpStatus?: number;
  durationMs: number;
  sourceUrl?: string;
}

export interface BrandAdapter {
  brand: string;
  supportedPatterns: RegExp[];
  
  canHandle(productName: string, brand?: string): boolean;
  
  findProduct(productName: string, sku?: string): Promise<AdapterResult>;
  
  extractProductData(html: string, productUrl: string): Promise<ProductData | null>;
}

export interface AdapterConfig {
  baseUrl: string;
  searchUrl?: string;
  userAgent: string;
  rateLimit: number; // requests per minute
  timeout: number; // ms
  retryAttempts: number;
  retryDelay: number; // ms
}

export const DEFAULT_CONFIG: AdapterConfig = {
  baseUrl: '',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  rateLimit: 30,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000,
};

export class RateLimiter {
  private requestTimes: number[] = [];
  private requestsPerMinute: number;

  constructor(requestsPerMinute: number) {
    this.requestsPerMinute = requestsPerMinute;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Remove old requests
    this.requestTimes = this.requestTimes.filter(t => t > oneMinuteAgo);
    
    if (this.requestTimes.length >= this.requestsPerMinute) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = oldestRequest + 60000 - now;
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.requestTimes.push(Date.now());
  }
}

export async function fetchWithRetry(
  url: string,
  config: AdapterConfig,
  rateLimiter?: RateLimiter
): Promise<{ html: string; status: number }> {
  if (rateLimiter) {
    await rateLimiter.waitForSlot();
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        }
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          // Retry on rate limit or server errors
          throw new Error(`HTTP ${response.status}`);
        }
        return { html: '', status: response.status };
      }

      const html = await response.text();
      return { html, status: response.status };
    } catch (error: any) {
      lastError = error;
      if (attempt < config.retryAttempts) {
        await new Promise(resolve => 
          setTimeout(resolve, config.retryDelay * attempt)
        );
      }
    }
  }

  throw lastError || new Error('Failed after retries');
}

export function extractMetaContent(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return decodeHtmlEntities(match[1]);
    }
  }
  return null;
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

export function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractJsonLd(html: string, type?: string): Record<string, unknown> | null {
  const scriptPattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptPattern.exec(html)) !== null) {
    try {
      const json = JSON.parse(match[1].trim());
      if (!type) return json;
      
      if (Array.isArray(json)) {
        const found = json.find(item => item['@type'] === type);
        if (found) return found;
      } else if (json['@type'] === type) {
        return json;
      }
    } catch {
      continue;
    }
  }
  return null;
}
