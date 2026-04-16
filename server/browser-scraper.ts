import type { Browser, Page } from 'puppeteer';

let browserInstance: Browser | null = null;

export interface GalleryScrapingResult {
  success: boolean;
  images: string[];
  error?: string;
  durationMs: number;
}

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    console.log('[browser-scraper] Launching new browser instance...');
    const puppeteer = (await import('puppeteer')).default;
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ],
    });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    console.log('[browser-scraper] Browser closed');
  }
}

export async function scrapeAppleGalleryImages(productUrl: string, marketingPageUrl?: string): Promise<GalleryScrapingResult> {
  const startTime = Date.now();
  let page: Page | null = null;
  
  try {
    console.log(`[browser-scraper] Scraping gallery images from: ${productUrl}`);
    
    const browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const images = new Set<string>();
    
    page.on('response', async (response) => {
      try {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';
        
        if (contentType.includes('image/')) {
          if (url.includes('store.storeimages.cdn-apple.com') || url.includes('apple.com/v/')) {
            if (isValidGalleryImage(url)) {
              const normalizedUrl = normalizeImageUrl(url);
              images.add(normalizedUrl);
            }
          }
        }
      } catch (e) {
      }
    });
    
    await page.goto(productUrl, { 
      waitUntil: 'networkidle2',
      timeout: 45000 
    });
    
    await page.waitForSelector('img, picture, [class*="gallery"], [class*="carousel"]', { timeout: 10000 }).catch(() => {});
    
    await autoScroll(page);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await interactWithCarousel(page, images);
    
    const extractedImages = await page.evaluate(() => {
      const imgUrls: string[] = [];
      const seen = new Set<string>();
      
      const selectors = [
        '.gallery img',
        '.gallery source',
        '.gallery-item img',
        '.ac-gallery img',
        '[class*="carousel"] img',
        '[class*="carousel"] source',
        'picture source',
        'picture img',
        'img[src*="store.storeimages.cdn-apple.com"]',
        'img[srcset*="store.storeimages.cdn-apple.com"]',
        'source[srcset*="store.storeimages.cdn-apple.com"]',
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          let urls: string[] = [];
          
          const srcset = el.getAttribute('srcset');
          if (srcset) {
            const srcsetUrls = srcset.split(',').map(s => s.trim().split(' ')[0]).filter(Boolean);
            urls.push(...srcsetUrls);
          }
          
          const src = el.getAttribute('src');
          if (src) urls.push(src);
          
          const dataSrc = el.getAttribute('data-src');
          if (dataSrc) urls.push(dataSrc);
          
          for (const url of urls) {
            if ((url.includes('store.storeimages.cdn-apple.com') || url.includes('/v/')) && !seen.has(url)) {
              seen.add(url);
              imgUrls.push(url);
            }
          }
        });
      }
      
      return imgUrls;
    });
    
    for (const url of extractedImages) {
      if (isValidGalleryImage(url)) {
        const normalizedUrl = normalizeImageUrl(url);
        images.add(normalizedUrl);
      }
    }
    
    if (marketingPageUrl && images.size < 6) {
      console.log(`[browser-scraper] Fetching marketing page for more images: ${marketingPageUrl}`);
      try {
        await page.goto(marketingPageUrl, { waitUntil: 'networkidle2', timeout: 45000 });
        await autoScroll(page);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const marketingImages = await page.evaluate(() => {
          const urls: string[] = [];
          document.querySelectorAll('img, source, picture source').forEach((el) => {
            const src = (el as HTMLImageElement).src || '';
            const srcset = (el as HTMLSourceElement).srcset || '';
            if (src.includes('/v/') && src.includes('/images/')) urls.push(src);
            if (srcset.includes('/v/') && srcset.includes('/images/')) {
              srcset.split(',').forEach(s => {
                const url = s.trim().split(' ')[0];
                if (url) urls.push(url);
              });
            }
          });
          return urls;
        });
        
        for (const url of marketingImages) {
          if (isValidGalleryImage(url)) {
            let fullUrl = url.startsWith('/') ? `https://www.apple.com${url}` : url;
            fullUrl = fullUrl.replace(/_(small|medium)(_2x)?/gi, '_large_2x');
            images.add(fullUrl);
          }
        }
      } catch (e) {
        console.log('[browser-scraper] Marketing page fetch failed');
      }
    }
    
    const uniqueGalleryImages = deduplicateGalleryImages(Array.from(images));
    
    console.log(`[browser-scraper] Found ${uniqueGalleryImages.length} unique gallery images`);
    
    return {
      success: true,
      images: uniqueGalleryImages,
      durationMs: Date.now() - startTime,
    };
  } catch (error: any) {
    console.error('[browser-scraper] Error:', error.message);
    return {
      success: false,
      images: [],
      error: error.message,
      durationMs: Date.now() - startTime,
    };
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
}

async function interactWithCarousel(page: Page, images: Set<string>): Promise<void> {
  try {
    console.log('[browser-scraper] Interacting with carousel to load multi-angle images...');
    
    const gallerySelectors = [
      '[data-gallery-item]',
      '[class*="gallery-item"]',
      '[class*="rc-gallery"] button',
      '[class*="rc-inline-gallery"] [role="button"]',
      '.gallery button',
      '.carousel button',
      '[class*="slider"] button',
      '[class*="thumbnail"]',
      'button[aria-label*="View"]',
      'button[aria-label*="image"]',
    ];
    
    for (const selector of gallerySelectors) {
      try {
        const buttons = await page.$$(selector);
        if (buttons.length > 0) {
          console.log(`[browser-scraper] Found ${buttons.length} gallery buttons with selector: ${selector}`);
          
          for (let i = 0; i < Math.min(8, buttons.length); i++) {
            try {
              await buttons[i].hover();
              await new Promise(resolve => setTimeout(resolve, 500));
              
              await buttons[i].click();
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              const newImages = await page.evaluate(() => {
                const urls: string[] = [];
                document.querySelectorAll('img[src*="store.storeimages"], source[srcset*="store.storeimages"]').forEach((el) => {
                  const src = (el as HTMLImageElement).src || '';
                  const srcset = (el as HTMLSourceElement).srcset || '';
                  if (src) urls.push(src);
                  if (srcset) {
                    srcset.split(',').forEach(s => {
                      const url = s.trim().split(' ')[0];
                      if (url) urls.push(url);
                    });
                  }
                });
                return urls;
              });
              
              for (const url of newImages) {
                if (isValidGalleryImage(url)) {
                  const normalizedUrl = normalizeImageUrl(url);
                  images.add(normalizedUrl);
                }
              }
            } catch (e) {
            }
          }
          break;
        }
      } catch (e) {
      }
    }
    
    try {
      const nextButtons = await page.$$('[aria-label*="Next"], [aria-label*="next"], .slick-next, button[class*="next"]');
      for (let i = 0; i < 6; i++) {
        for (const btn of nextButtons) {
          try {
            await btn.click();
            await new Promise(resolve => setTimeout(resolve, 800));
          } catch (e) {}
        }
      }
    } catch (e) {}
    
    console.log(`[browser-scraper] After carousel interaction: ${images.size} images collected`);
  } catch (error) {
    console.log('[browser-scraper] Carousel interaction failed:', error);
  }
}

async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, 5000);
    });
  });
}

function isValidGalleryImage(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.endsWith('.svg')) return false;
  if (lowerUrl.includes('/static-resources/')) return false;
  if (lowerUrl.includes('/dist/')) return false;
  if (lowerUrl.includes('/logo')) return false;
  if (lowerUrl.includes('_logo')) return false;
  if (lowerUrl.includes('/icon') && !lowerUrl.includes('icons/')) return false;
  if (lowerUrl.includes('_icon')) return false;
  if (lowerUrl.includes('applecard')) return false;
  if (lowerUrl.includes('applecare')) return false;
  if (lowerUrl.includes('/nav/')) return false;
  if (lowerUrl.includes('/ac/globalfooter')) return false;
  if (lowerUrl.includes('/ac/globalnav')) return false;
  if (lowerUrl.includes('device-type')) return false;
  if (lowerUrl.includes('knowledge_graph')) return false;
  if (lowerUrl.includes('-og-')) return false;
  if (lowerUrl.includes('mac-compare')) return false;
  if (lowerUrl.includes('-compare-')) return false;
  if (lowerUrl.includes('_16x16') || lowerUrl.includes('_32x32')) return false;
  if (lowerUrl.includes('-witb-') && lowerUrl.includes('cable')) return false;
  if (lowerUrl.includes('-witb-') && lowerUrl.includes('adapter')) return false;
  if (lowerUrl.includes('_sw_color')) return false;
  
  if (lowerUrl.includes('/images/overview/') || 
      lowerUrl.includes('/images/design/') ||
      lowerUrl.includes('/images/routers/') ||
      lowerUrl.includes('/images/specs/') ||
      lowerUrl.includes('-select-')) {
    return true;
  }
  
  const sizeMatch = url.match(/wid=(\d+)/i);
  if (sizeMatch) {
    const width = parseInt(sizeMatch[1], 10);
    if (width < 200) return false;
  }
  
  return true;
}

function normalizeImageUrl(url: string): string {
  let normalized = url
    .replace(/wid=\d+/i, 'wid=1200')
    .replace(/hei=\d+/i, 'hei=1200')
    .replace(/qlt=\d+/i, 'qlt=95');
  
  normalized = normalized.replace(/&amp;/g, '&');
  
  return normalized;
}

function getImageBaseKey(url: string): string {
  try {
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    
    path = path.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    
    path = path.replace(/_SW_COLOR$/i, '');
    
    const widMatch = url.match(/wid=\d+/);
    const heiMatch = url.match(/hei=\d+/);
    
    return path;
  } catch {
    return url.slice(0, 80);
  }
}

function deduplicateGalleryImages(urls: string[]): string[] {
  const seen = new Map<string, string>();
  
  for (const url of urls) {
    const key = getImageBaseKey(url);
    
    const existingUrl = seen.get(key);
    if (!existingUrl || isHigherQuality(url, existingUrl)) {
      seen.set(key, url);
    }
  }
  
  const result = Array.from(seen.values());
  
  return result.slice(0, 8);
}

function isHigherQuality(url1: string, url2: string): boolean {
  const getWidth = (url: string) => {
    const match = url.match(/wid=(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  };
  
  return getWidth(url1) > getWidth(url2);
}
