import puppeteer, { Browser, Page } from 'puppeteer';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { downloadImage } from './image-processor';

let browserInstance: Browser | null = null;

export interface ImageDownloadRequest {
  category: string;
  brand: string;
  productModel: string;
  preferredImageViews: string[];
  outputDir: string;
  filenameBase: string;
}

export interface DownloadedImage {
  viewType: string;
  originalUrl: string;
  savedPaths: {
    original: string;
    webp: string;
    medium: string;
    thumbnail: string;
  };
  alt: string;
  hasOverlay: boolean;
}

export interface ImageDownloadResult {
  status: 'OK' | 'NO_IMAGE_FOUND' | 'HAS_OVERLAY' | 'ACCESS_DENIED' | 'ERROR';
  details: string;
  images: DownloadedImage[];
  metadata: {
    brand: string;
    model: string;
    category: string;
    sourceUrl: string;
    savedPaths: string[];
    downloadedAt: string;
  };
  manifestPath?: string;
}

const BRAND_CONFIGS: Record<string, {
  baseUrl: string;
  searchUrlTemplate: string;
  productUrlPatterns: RegExp[];
  imageSelectors: string[];
  gallerySelectors: string[];
}> = {
  'Dell': {
    baseUrl: 'https://www.dell.com',
    searchUrlTemplate: 'https://www.dell.com/en-us/search/{query}',
    productUrlPatterns: [
      /dell\.com\/en-us\/shop\/[^"']+\/spd\/[^"']+/i,
      /dell\.com\/en-us\/shop\/[^"']+/i,
    ],
    imageSelectors: [
      'img[src*="i.dell.com"]',
      'img[src*="snpi.dell.com"]',
      'img[data-src*="dell.com"]',
      '.hero-carousel img',
      '.product-gallery img',
      '[class*="gallery"] img',
      '[class*="carousel"] img',
    ],
    gallerySelectors: [
      '.hero-carousel',
      '.product-gallery',
      '[class*="gallery"]',
      '[class*="carousel"]',
      '[class*="media-gallery"]',
    ],
  },
};

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    console.log('[manufacturer-downloader] Launching browser...');
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
  }
}

function normalizeUrl(url: string): string {
  return url
    .replace(/&amp;/g, '&')
    .replace(/\\/g, '')
    .trim();
}

function isHighQualityImage(url: string): boolean {
  const lowQualityIndicators = [
    'thumb', 'icon', 'logo', 'badge', 'button',
    '50x', '100x', '150x', 'tiny', 'small',
    'loading', 'placeholder', 'spinner', 'lazy',
    'spacer', 'pixel', '1x1', 'blank',
  ];
  const urlLower = url.toLowerCase();
  
  if (urlLower.endsWith('.gif')) {
    return false;
  }
  
  return !lowQualityIndicators.some(indicator => urlLower.includes(indicator));
}

function classifyImageView(url: string, index: number): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('hero') || urlLower.includes('main') || index === 0) {
    return 'hero';
  }
  if (urlLower.includes('front') || urlLower.includes('face')) {
    return 'front';
  }
  if (urlLower.includes('angle') || urlLower.includes('quarter') || urlLower.includes('3q')) {
    return '3-quarter';
  }
  if (urlLower.includes('side') || urlLower.includes('profile')) {
    return 'side';
  }
  if (urlLower.includes('back') || urlLower.includes('rear')) {
    return 'back';
  }
  if (urlLower.includes('top') || urlLower.includes('above')) {
    return 'top';
  }
  if (urlLower.includes('keyboard') || urlLower.includes('keys')) {
    return 'keyboard';
  }
  if (urlLower.includes('port') || urlLower.includes('io')) {
    return 'ports';
  }
  
  const viewMap = ['hero', 'front', '3-quarter', 'side', 'back'];
  return viewMap[index % viewMap.length];
}

async function findDellProductImages(page: Page, productModel: string): Promise<{ urls: string[]; sourceUrl: string }> {
  const config = BRAND_CONFIGS['Dell'];
  const searchQuery = encodeURIComponent(productModel);
  const searchUrl = config.searchUrlTemplate.replace('{query}', searchQuery);
  
  console.log(`[manufacturer-downloader] Searching Dell for: ${productModel}`);
  console.log(`[manufacturer-downloader] URL: ${searchUrl}`);
  
  const collectedImages = new Set<string>();
  let productPageUrl = searchUrl;
  
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.includes('image/') && isHighQualityImage(url)) {
        if (url.includes('i.dell.com') || url.includes('snpi.dell.com')) {
          const cleanUrl = normalizeUrl(url);
          collectedImages.add(cleanUrl);
        }
      }
    } catch (e) {}
  });
  
  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const productLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/shop/"][href*="/spd/"]'));
      for (const link of links) {
        const href = link.getAttribute('href');
        if (href) return href;
      }
      
      const productCards = Array.from(document.querySelectorAll('[class*="product"] a, [class*="result"] a'));
      for (const card of productCards) {
        const href = card.getAttribute('href');
        if (href && href.includes('/shop/')) return href;
      }
      
      return null;
    });
    
    if (productLink) {
      productPageUrl = productLink.startsWith('http') 
        ? productLink 
        : `${config.baseUrl}${productLink}`;
      
      console.log(`[manufacturer-downloader] Found product page: ${productPageUrl}`);
      
      await page.goto(productPageUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    await autoScroll(page);
    
    await interactWithGallery(page);
    
    const pageImages = await page.evaluate((selectors: string[]) => {
      const images: string[] = [];
      const seen = new Set<string>();
      
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach((img: Element) => {
          const src = img.getAttribute('src') || img.getAttribute('data-src');
          if (src && !seen.has(src) && (src.includes('dell.com') || src.includes('/is/image/'))) {
            seen.add(src);
            images.push(src);
          }
          
          const srcset = img.getAttribute('srcset');
          if (srcset) {
            srcset.split(',').forEach(s => {
              const url = s.trim().split(' ')[0];
              if (url && !seen.has(url) && (url.includes('dell.com') || url.includes('/is/image/'))) {
                seen.add(url);
                images.push(url);
              }
            });
          }
        });
      }
      
      return images;
    }, config.imageSelectors);
    
    pageImages.forEach(url => collectedImages.add(normalizeUrl(url)));
    
  } catch (error: any) {
    console.error(`[manufacturer-downloader] Error scraping Dell: ${error.message}`);
    if (error.message.includes('403') || error.message.includes('Access Denied')) {
      throw new Error('ACCESS_DENIED');
    }
    throw error;
  }
  
  const sortedImages = Array.from(collectedImages)
    .filter(url => isHighQualityImage(url))
    .map(url => upgradeImageResolution(url, 'Dell'))
    .filter((url, index, self) => self.indexOf(url) === index);
  
  console.log(`[manufacturer-downloader] Found ${sortedImages.length} unique images`);
  
  return { urls: sortedImages, sourceUrl: productPageUrl };
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
          resolve();
        }
      }, 150);
      
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, 8000);
    });
  });
}

async function interactWithGallery(page: Page): Promise<void> {
  try {
    const galleryButtons = await page.$$('[class*="thumbnail"], [class*="gallery"] button, [class*="carousel"] button, .nav-dot, .dot');
    
    for (let i = 0; i < Math.min(galleryButtons.length, 6); i++) {
      try {
        await galleryButtons[i].click();
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {}
    }
    
    const nextButtons = await page.$$('[class*="next"], [aria-label*="next"], .slick-next, .carousel-next');
    for (let i = 0; i < Math.min(nextButtons.length * 3, 6); i++) {
      try {
        if (nextButtons[i % nextButtons.length]) {
          await nextButtons[i % nextButtons.length].click();
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      } catch (e) {}
    }
  } catch (e) {}
}

function upgradeImageResolution(url: string, brand: string): string {
  if (brand === 'Dell') {
    return url
      .replace(/wid=\d+/, 'wid=1600')
      .replace(/hei=\d+/, 'hei=1600')
      .replace(/\/w\/\d+\//, '/w/1600/')
      .replace(/\/h\/\d+\//, '/h/1600/')
      .replace(/qlt=\d+/, 'qlt=95');
  }
  if (brand === 'HP') {
    return url
      .replace(/_\d+x\d+\./, '_1600x1600.')
      .replace(/wid=\d+/, 'wid=1600')
      .replace(/hei=\d+/, 'hei=1600');
  }
  if (brand === 'Apple') {
    return url
      .replace(/_\d+x\d+/, '_1600x1600')
      .replace(/\/\d+x\d+\//, '/1600x1600/');
  }
  return url;
}

async function findHPProductImages(
  page: Page,
  productModel: string
): Promise<{ urls: string[]; sourceUrl: string }> {
  const collectedImages = new Set<string>();
  let productPageUrl = '';
  
  const hpProductUrls: Record<string, string> = {
    'Spectre x360 14': 'https://www.hp.com/us-en/shop/pdp/hp-spectre-x360-2-in-1-laptop-14t-eu000-14-768n6av-1',
    'Spectre x360 16': 'https://www.hp.com/us-en/shop/pdp/hp-spectre-x360-2-in-1-laptop-16-aa000-16-7e1h8av-1',
    'Spectre x360 13': 'https://www.hp.com/us-en/shop/pdp/hp-spectre-x360-13-aw2024nr',
    'Elite Dragonfly': 'https://www.hp.com/us-en/shop/pdp/hp-elite-dragonfly-g3-notebook-pc-wolf-pro-security-edition',
    'EliteBook 840': 'https://www.hp.com/us-en/shop/pdp/hp-elitebook-840-g10-notebook-pc-wolf-pro-security-edition',
    'EliteBook 1040': 'https://www.hp.com/us-en/shop/pdp/hp-elitebook-1040-g10-notebook-pc-wolf-pro-security-edition',
    'Envy x360': 'https://www.hp.com/us-en/shop/pdp/hp-envy-x360-2-in-1-laptop-15-fh0013dx',
    'Pavilion Plus': 'https://www.hp.com/us-en/shop/pdp/hp-pavilion-plus-laptop-14-ew0097nr',
    'OMEN 16': 'https://www.hp.com/us-en/shop/pdp/omen-by-hp-16-1-gaming-laptop-16-wf0xxx',
    'OMEN 17': 'https://www.hp.com/us-en/shop/pdp/omen-by-hp-17-3-gaming-laptop-17-cm2000',
    'Victus 15': 'https://www.hp.com/us-en/shop/pdp/victus-by-hp-15-fa1020nr-gaming-laptop',
    'ZBook Studio': 'https://www.hp.com/us-en/shop/pdp/hp-zbook-studio-16-inch-g10-mobile-workstation-pc',
    'ZBook Fury': 'https://www.hp.com/us-en/shop/pdp/hp-zbook-fury-16-inch-g10-mobile-workstation-pc',
  };
  
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('image/') && isHighQualityImage(url)) {
        if ((url.includes('hp.com') || url.includes('ssl-images-amazon')) && 
            !url.includes('favicon') && !url.includes('logo') && !url.includes('icon')) {
          const cleanUrl = normalizeUrl(url);
          collectedImages.add(cleanUrl);
        }
      }
    } catch (e) {}
  });
  
  try {
    let directUrl = '';
    for (const [model, url] of Object.entries(hpProductUrls)) {
      if (productModel.toLowerCase().includes(model.toLowerCase().split(' ')[0]) &&
          productModel.toLowerCase().includes(model.toLowerCase().split(' ')[1] || '')) {
        directUrl = url;
        break;
      }
    }
    
    if (directUrl) {
      console.log(`[manufacturer-downloader] Loading HP product page: ${directUrl}`);
      
      try {
        await page.goto(directUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        productPageUrl = page.url();
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        await autoScroll(page);
        await interactWithGallery(page);
        
        const pageImages = await page.evaluate(() => {
          const images: string[] = [];
          const seen = new Set<string>();
          
          document.querySelectorAll('img, picture source').forEach((el) => {
            const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('srcset')?.split(' ')[0];
            if (src && !seen.has(src) && 
                (src.includes('hp.com') || src.includes('ssl-images-amazon') || src.includes('hpcloud'))) {
              if (!src.includes('logo') && !src.includes('icon') && !src.includes('favicon') && 
                  !src.includes('sprite') && !src.includes('pixel')) {
                seen.add(src);
                images.push(src);
              }
            }
          });
          
          return images;
        });
        
        pageImages.forEach(url => collectedImages.add(normalizeUrl(url)));
        
      } catch (e: any) {
        console.log(`[manufacturer-downloader] HP direct URL error: ${e.message}`);
      }
    }
    
    if (collectedImages.size === 0) {
      console.log(`[manufacturer-downloader] Trying HP store search...`);
      
      const storeSearchUrl = `https://www.hp.com/us-en/shop/slp/laptops?filters=HP_productFamily%3A${encodeURIComponent(productModel.split(' ')[0])}`;
      
      try {
        await page.goto(storeSearchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        productPageUrl = page.url();
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const searchImages = await page.evaluate(() => {
          const images: string[] = [];
          document.querySelectorAll('img[src*="ssl-images-amazon"], img[src*="hp.com"]').forEach((el) => {
            const src = el.getAttribute('src');
            if (src && src.includes('product') && !src.includes('logo')) {
              images.push(src);
            }
          });
          return images;
        });
        
        searchImages.forEach(url => collectedImages.add(normalizeUrl(url)));
      } catch (e: any) {
        console.log(`[manufacturer-downloader] HP store search error: ${e.message}`);
      }
    }
    
  } catch (error: any) {
    console.error(`[manufacturer-downloader] Error scraping HP: ${error.message}`);
  }
  
  const sortedImages = Array.from(collectedImages)
    .filter(url => {
      return isHighQualityImage(url) && 
             !url.includes('.gif') && 
             !url.includes('logo') && 
             !url.includes('icon') &&
             !url.includes('sprite');
    })
    .map(url => upgradeImageResolution(url, 'HP'))
    .filter((url, index, self) => self.indexOf(url) === index);
  
  console.log(`[manufacturer-downloader] Found ${sortedImages.length} unique HP images`);
  
  return { urls: sortedImages, sourceUrl: productPageUrl || 'https://www.hp.com' };
}

async function findAppleProductImages(
  page: Page,
  productModel: string
): Promise<{ urls: string[]; sourceUrl: string }> {
  const collectedImages = new Set<string>();
  let sourceUrl = '';
  
  const pressKitUrls: Record<string, string> = {
    'MacBook Air M2': 'https://www.apple.com/newsroom/2022/06/apple-unveils-all-new-macbook-air-supercharged-by-the-new-m2-chip/',
    'MacBook Air M3': 'https://www.apple.com/newsroom/2024/03/apple-unveils-the-new-13-and-15-inch-macbook-air-with-the-powerful-m3-chip/',
    'MacBook Pro 14': 'https://www.apple.com/newsroom/2023/10/apple-unveils-new-macbook-pro-featuring-m3-chips/',
    'MacBook Pro 16': 'https://www.apple.com/newsroom/2023/10/apple-unveils-new-macbook-pro-featuring-m3-chips/',
    'iMac': 'https://www.apple.com/newsroom/2023/10/apple-introduces-new-imac-supercharged-by-m3-chip/',
    'Mac Studio': 'https://www.apple.com/newsroom/2023/06/apple-introduces-mac-studio-with-m2-max-and-m2-ultra/',
    'Mac Pro': 'https://www.apple.com/newsroom/2023/06/apple-unveils-new-mac-pro-featuring-m2-ultra/',
    'Mac mini': 'https://www.apple.com/newsroom/2023/01/apple-introduces-new-mac-mini-with-m2-and-m2-pro-more-powerful-capable-and-versatile-than-ever/',
  };
  
  const productUrls: Record<string, string> = {
    'MacBook Air M2': 'https://www.apple.com/shop/buy-mac/macbook-air/13-inch-m2',
    'MacBook Air M3': 'https://www.apple.com/shop/buy-mac/macbook-air/13-inch-m3',
    'MacBook Pro 14': 'https://www.apple.com/shop/buy-mac/macbook-pro/14-inch-m3',
    'MacBook Pro 16': 'https://www.apple.com/shop/buy-mac/macbook-pro/16-inch-m3-pro',
    'iMac': 'https://www.apple.com/shop/buy-mac/imac',
    'Mac Studio': 'https://www.apple.com/shop/buy-mac/mac-studio',
    'Mac Pro': 'https://www.apple.com/shop/buy-mac/mac-pro',
    'Mac mini': 'https://www.apple.com/shop/buy-mac/mac-mini',
  };
  
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('image/') && isHighQualityImage(url)) {
        if (url.includes('apple.com') && !url.includes('.svg') && !url.includes('favicon')) {
          const cleanUrl = normalizeUrl(url);
          collectedImages.add(cleanUrl);
        }
      }
    } catch (e) {}
  });
  
  try {
    let pressKitUrl = '';
    for (const [model, url] of Object.entries(pressKitUrls)) {
      if (productModel.toLowerCase().includes(model.toLowerCase().split(' ')[0]) &&
          productModel.toLowerCase().includes(model.toLowerCase().split(' ')[1] || '')) {
        pressKitUrl = url;
        break;
      }
    }
    
    if (pressKitUrl) {
      console.log(`[manufacturer-downloader] Checking Apple Press Kit: ${pressKitUrl}`);
      
      try {
        await page.goto(pressKitUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        sourceUrl = pressKitUrl;
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const pressImages = await page.evaluate(() => {
          const images: string[] = [];
          document.querySelectorAll('img[src*="apple.com"], picture source').forEach((el) => {
            const src = el.getAttribute('src') || el.getAttribute('srcset')?.split(' ')[0];
            if (src && src.includes('apple.com') && !src.includes('.svg')) {
              images.push(src);
            }
          });
          return images;
        });
        
        pressImages.forEach(url => collectedImages.add(normalizeUrl(url)));
      } catch (e) {
        console.log(`[manufacturer-downloader] Press kit page failed, trying product page`);
      }
    }
    
    let productUrl = '';
    for (const [model, url] of Object.entries(productUrls)) {
      if (productModel.toLowerCase().includes(model.toLowerCase().split(' ')[0]) &&
          productModel.toLowerCase().includes(model.toLowerCase().split(' ')[1] || '')) {
        productUrl = url;
        break;
      }
    }
    
    if (productUrl) {
      console.log(`[manufacturer-downloader] Checking Apple Product Page: ${productUrl}`);
      
      await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      if (!sourceUrl) sourceUrl = productUrl;
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await autoScroll(page);
      
      const productImages = await page.evaluate(() => {
        const images: string[] = [];
        const seen = new Set<string>();
        
        document.querySelectorAll('img[src*="apple.com"], picture source, [class*="hero"] img, [class*="gallery"] img').forEach((el) => {
          const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('srcset')?.split(' ')[0];
          if (src && !seen.has(src) && src.includes('apple.com') && !src.includes('.svg')) {
            seen.add(src);
            images.push(src);
          }
        });
        
        return images;
      });
      
      productImages.forEach(url => collectedImages.add(normalizeUrl(url)));
    }
    
  } catch (error: any) {
    console.error(`[manufacturer-downloader] Error scraping Apple: ${error.message}`);
    throw error;
  }
  
  const sortedImages = Array.from(collectedImages)
    .filter(url => {
      const isValid = isHighQualityImage(url) && 
                      !url.includes('.gif') && 
                      !url.includes('.svg') &&
                      url.includes('apple.com');
      return isValid;
    })
    .map(url => upgradeImageResolution(url, 'Apple'))
    .filter((url, index, self) => self.indexOf(url) === index);
  
  console.log(`[manufacturer-downloader] Found ${sortedImages.length} unique Apple images`);
  
  return { urls: sortedImages, sourceUrl: sourceUrl || 'https://www.apple.com' };
}

async function findEpsonProductImages(
  page: Page,
  productModel: string
): Promise<{ urls: string[]; sourceUrl: string }> {
  const collectedImages = new Set<string>();
  let productPageUrl = '';
  
  const epsonProductUrls: Record<string, string> = {
    'EcoTank ET-2850': 'https://epson.com/For-Home/Printers/Inkjet/EcoTank-ET-2850-All-in-One-Cartridge-Free-Supertank-Printer/p/C11CJ63201',
    'EcoTank ET-4850': 'https://epson.com/For-Home/Printers/Inkjet/EcoTank-ET-4850-All-in-One-Cartridge-Free-Supertank-Printer/p/C11CJ21201',
    'EcoTank ET-15000': 'https://epson.com/For-Home/Printers/Inkjet/EcoTank-ET-15000-All-in-One-Cartridge-Free-Supertank-Printer/p/C11CH96201',
    'WorkForce Pro WF-4830': 'https://epson.com/For-Work/Printers/Inkjet/WorkForce-Pro-WF-4830-Wireless-All-in-One-Printer/p/C11CJ06201',
    'Expression Photo XP-8700': 'https://epson.com/For-Home/Printers/Inkjet/Expression-Photo-XP-8700-Wireless-All-in-One-Printer/p/C11CK46201',
  };
  
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('image/') && isHighQualityImage(url)) {
        if (url.includes('epson.com') && !url.includes('logo') && !url.includes('icon')) {
          const cleanUrl = normalizeUrl(url);
          collectedImages.add(cleanUrl);
        }
      }
    } catch (e) {}
  });
  
  try {
    let directUrl = '';
    for (const [model, url] of Object.entries(epsonProductUrls)) {
      if (productModel.toLowerCase().includes(model.toLowerCase().split(' ')[0]) &&
          productModel.toLowerCase().includes(model.toLowerCase().split('-')[0])) {
        directUrl = url;
        break;
      }
    }
    
    if (!directUrl) {
      const searchUrl = `https://epson.com/Search/Printers?q=${encodeURIComponent(productModel)}`;
      console.log(`[manufacturer-downloader] Searching Epson: ${searchUrl}`);
      
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      productPageUrl = page.url();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const productLink = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/p/"]'));
        for (const link of links) {
          const href = link.getAttribute('href');
          if (href) return href;
        }
        return null;
      });
      
      if (productLink) {
        directUrl = productLink.startsWith('http') ? productLink : `https://epson.com${productLink}`;
      }
    }
    
    if (directUrl) {
      console.log(`[manufacturer-downloader] Loading Epson product page: ${directUrl}`);
      
      await page.goto(directUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      productPageUrl = page.url();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await autoScroll(page);
      await interactWithGallery(page);
      
      const pageImages = await page.evaluate(() => {
        const images: string[] = [];
        const seen = new Set<string>();
        
        document.querySelectorAll('img, picture source').forEach((el) => {
          const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('srcset')?.split(' ')[0];
          if (src && !seen.has(src) && src.includes('epson')) {
            if (!src.includes('logo') && !src.includes('icon') && !src.includes('sprite')) {
              seen.add(src);
              images.push(src);
            }
          }
        });
        
        return images;
      });
      
      pageImages.forEach(url => collectedImages.add(normalizeUrl(url)));
    }
    
  } catch (error: any) {
    console.error(`[manufacturer-downloader] Error scraping Epson: ${error.message}`);
  }
  
  const sortedImages = Array.from(collectedImages)
    .filter(url => isHighQualityImage(url) && !url.includes('.gif'))
    .filter((url, index, self) => self.indexOf(url) === index);
  
  console.log(`[manufacturer-downloader] Found ${sortedImages.length} unique Epson images`);
  
  return { urls: sortedImages, sourceUrl: productPageUrl || 'https://epson.com' };
}

async function findSonyProductImages(
  page: Page,
  productModel: string
): Promise<{ urls: string[]; sourceUrl: string }> {
  const collectedImages = new Set<string>();
  let productPageUrl = '';
  
  const sonyDirectImageUrls: Record<string, string[]> = {
    'WH-1000XM5': [
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm5_Primary_image?$categorypdpnav$',
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm5_B_side?$categorypdpnav$',
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm5_B_front?$categorypdpnav$',
    ],
    'WH-1000XM4': [
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm4_Primary_image?$categorypdpnav$',
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm4_B_side?$categorypdpnav$',
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm4_B_front?$categorypdpnav$',
    ],
    'WF-1000XM5': [
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wf-1000xm5_Primary_image?$categorypdpnav$',
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wf-1000xm5_B_case?$categorypdpnav$',
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wf-1000xm5_B_wearing?$categorypdpnav$',
    ],
    'WF-1000XM4': [
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wf-1000xm4_Primary_image?$categorypdpnav$',
      'https://sony.scene7.com/is/image/sonyglobalsolutions/wf-1000xm4_B_case?$categorypdpnav$',
    ],
  };
  
  const sonyProductUrls: Record<string, string> = {
    'WH-1000XM5': 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b',
    'WH-1000XM4': 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm4-b',
    'WF-1000XM5': 'https://electronics.sony.com/audio/headphones/truly-wireless/p/wf1000xm5-b',
    'WF-1000XM4': 'https://electronics.sony.com/audio/headphones/truly-wireless/p/wf1000xm4-b',
    'LinkBuds S': 'https://electronics.sony.com/audio/headphones/truly-wireless/p/wfls900n-b',
    'MDR-MV1': 'https://electronics.sony.com/audio/headphones/headband/p/mdrmv1',
    'INZONE H9': 'https://electronics.sony.com/audio/headphones/headband/p/whg900n-w',
  };
  
  try {
    let directImages: string[] = [];
    for (const [model, urls] of Object.entries(sonyDirectImageUrls)) {
      if (productModel.toLowerCase().includes(model.toLowerCase())) {
        directImages = urls;
        productPageUrl = sonyProductUrls[model] || 'https://electronics.sony.com';
        break;
      }
    }
    
    if (directImages.length > 0) {
      console.log(`[manufacturer-downloader] Using known Sony CDN URLs for ${productModel}`);
      directImages.forEach(url => collectedImages.add(url));
    } else {
      page.on('response', async (response) => {
        try {
          const url = response.url();
          const contentType = response.headers()['content-type'] || '';
          if (contentType.includes('image/') && isHighQualityImage(url)) {
            if ((url.includes('sony.com') || url.includes('sony.net') || url.includes('scene7')) && 
                !url.includes('logo') && !url.includes('icon')) {
              const cleanUrl = normalizeUrl(url);
              collectedImages.add(cleanUrl);
            }
          }
        } catch (e) {}
      });
      
      let directUrl = '';
      for (const [model, url] of Object.entries(sonyProductUrls)) {
        if (productModel.toLowerCase().includes(model.toLowerCase())) {
          directUrl = url;
          break;
        }
      }
      
      if (directUrl) {
        console.log(`[manufacturer-downloader] Loading Sony product page: ${directUrl}`);
        
        await page.goto(directUrl, { waitUntil: 'networkidle2', timeout: 45000 });
        productPageUrl = page.url();
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        await autoScroll(page);
        await interactWithGallery(page);
        
        const pageImages = await page.evaluate(() => {
          const images: string[] = [];
          const seen = new Set<string>();
          
          document.querySelectorAll('img, picture source, [class*="gallery"] img, [class*="product"] img').forEach((el) => {
            const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('srcset')?.split(' ')[0];
            if (src && !seen.has(src) && (src.includes('sony') || src.includes('scene7'))) {
              if (!src.includes('logo') && !src.includes('icon') && !src.includes('sprite')) {
                seen.add(src);
                images.push(src);
              }
            }
          });
          
          return images;
        });
        
        pageImages.forEach(url => collectedImages.add(normalizeUrl(url)));
      }
    }
    
  } catch (error: any) {
    console.error(`[manufacturer-downloader] Error scraping Sony: ${error.message}`);
  }
  
  const sortedImages = Array.from(collectedImages)
    .filter(url => isHighQualityImage(url) && !url.includes('.gif'))
    .filter((url, index, self) => self.indexOf(url) === index);
  
  console.log(`[manufacturer-downloader] Found ${sortedImages.length} unique Sony images`);
  
  return { urls: sortedImages, sourceUrl: productPageUrl || 'https://electronics.sony.com' };
}

async function findBoseProductImages(
  page: Page,
  productModel: string
): Promise<{ urls: string[]; sourceUrl: string }> {
  const collectedImages = new Set<string>();
  let productPageUrl = '';
  
  const boseProductUrls: Record<string, string> = {
    'QuietComfort 45': 'https://www.bose.com/p/headphones/bose-quietcomfort-45-headphones/QC45-HEADPHONEARN.html',
    'QuietComfort Ultra': 'https://www.bose.com/p/headphones/bose-quietcomfort-ultra-headphones/QCUH-HEADPHONEARN.html',
    'QuietComfort Earbuds': 'https://www.bose.com/p/earbuds/bose-quietcomfort-earbuds-ii/QCEB2-EARBUDSARN.html',
    'Ultra Open Earbuds': 'https://www.bose.com/p/earbuds/bose-ultra-open-earbuds/ULOP-EARBUDSARN.html',
    '700': 'https://www.bose.com/p/headphones/bose-headphones-700/HP700-HEADPHONEARN.html',
    'SoundLink Flex': 'https://www.bose.com/p/speakers/bose-soundlink-flex-bluetooth-speaker/SLFLEX-SPEAKERWIR.html',
    'SoundLink Max': 'https://www.bose.com/p/speakers/bose-soundlink-max-speaker/SLMAX-SPEAKERWIR.html',
  };
  
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('image/') && isHighQualityImage(url)) {
        if (url.includes('bose.com') && !url.includes('logo') && !url.includes('icon')) {
          const cleanUrl = normalizeUrl(url);
          collectedImages.add(cleanUrl);
        }
      }
    } catch (e) {}
  });
  
  try {
    let directUrl = '';
    for (const [model, url] of Object.entries(boseProductUrls)) {
      if (productModel.toLowerCase().includes(model.toLowerCase())) {
        directUrl = url;
        break;
      }
    }
    
    if (!directUrl) {
      const searchUrl = `https://www.bose.com/search?q=${encodeURIComponent(productModel)}`;
      console.log(`[manufacturer-downloader] Searching Bose: ${searchUrl}`);
      
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      productPageUrl = page.url();
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`[manufacturer-downloader] Loading Bose product page: ${directUrl}`);
      
      await page.goto(directUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      productPageUrl = page.url();
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    
    await autoScroll(page);
    await interactWithGallery(page);
    
    const pageImages = await page.evaluate(() => {
      const images: string[] = [];
      const seen = new Set<string>();
      
      document.querySelectorAll('img, picture source, [class*="gallery"] img, [class*="product"] img').forEach((el) => {
        const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('srcset')?.split(' ')[0];
        if (src && !seen.has(src) && src.includes('bose')) {
          if (!src.includes('logo') && !src.includes('icon') && !src.includes('sprite')) {
            seen.add(src);
            images.push(src);
          }
        }
      });
      
      return images;
    });
    
    pageImages.forEach(url => collectedImages.add(normalizeUrl(url)));
    
  } catch (error: any) {
    console.error(`[manufacturer-downloader] Error scraping Bose: ${error.message}`);
  }
  
  const sortedImages = Array.from(collectedImages)
    .filter(url => isHighQualityImage(url) && !url.includes('.gif'))
    .filter((url, index, self) => self.indexOf(url) === index);
  
  console.log(`[manufacturer-downloader] Found ${sortedImages.length} unique Bose images`);
  
  return { urls: sortedImages, sourceUrl: productPageUrl || 'https://www.bose.com' };
}

function ensureDirectoryExists(dirPath: string): void {
  const fullPath = path.join(process.cwd(), dirPath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

async function detectOverlay(imageBuffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const { width = 0, height = 0 } = metadata;
    
    const stats = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const pixels = stats.data;
    const totalPixels = width * height;
    
    let whitePixels = 0;
    let blackPixels = 0;
    let textColorPixels = 0;
    
    for (let i = 0; i < pixels.length; i += 3) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      if (r > 250 && g > 250 && b > 250) {
        whitePixels++;
      }
      if (r < 30 && g < 30 && b < 30) {
        blackPixels++;
      }
      if (r > 200 && g < 50 && b < 50) {
        textColorPixels++;
      }
    }
    
    const textRatio = textColorPixels / totalPixels;
    
    if (textRatio > 0.01) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[manufacturer-downloader] Overlay detection error:', error);
    return false;
  }
}

async function processAndSaveImage(
  imageBuffer: Buffer,
  outputDir: string,
  filenameBase: string,
  viewIndex: number
): Promise<{ webp: string; medium: string; thumbnail: string; original: string }> {
  ensureDirectoryExists(outputDir);
  
  const baseDir = path.join(process.cwd(), outputDir.replace(/^\//, ''));
  const suffix = viewIndex > 0 ? `_0${viewIndex + 1}` : '_01';
  
  const originalPath = path.join(baseDir, `${filenameBase}${suffix}.jpg`);
  await sharp(imageBuffer)
    .jpeg({ quality: 95 })
    .toFile(originalPath);
  
  const webpPath = path.join(baseDir, `${filenameBase}${suffix}.webp`);
  await sharp(imageBuffer)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, lossless: false })
    .toFile(webpPath);
  
  const mediumPath = path.join(baseDir, `${filenameBase}${suffix}_800.jpg`);
  await sharp(imageBuffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(mediumPath);
  
  const thumbPath = path.join(baseDir, `${filenameBase}${suffix}_thumb.jpg`);
  await sharp(imageBuffer)
    .resize(300, 300, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 75 })
    .toFile(thumbPath);
  
  return {
    original: originalPath,
    webp: webpPath,
    medium: mediumPath,
    thumbnail: thumbPath,
  };
}

export async function downloadManufacturerImages(
  request: ImageDownloadRequest
): Promise<ImageDownloadResult> {
  const { category, brand, productModel, preferredImageViews, outputDir, filenameBase } = request;
  
  console.log(`[manufacturer-downloader] Starting download for ${brand} ${productModel}`);
  
  const result: ImageDownloadResult = {
    status: 'ERROR',
    details: '',
    images: [],
    metadata: {
      brand,
      model: productModel,
      category,
      sourceUrl: '',
      savedPaths: [],
      downloadedAt: new Date().toISOString(),
    },
  };
  
  let page: Page | null = null;
  
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    let imageUrls: string[] = [];
    let sourceUrl = '';
    
    if (brand === 'Dell') {
      const dellResult = await findDellProductImages(page, productModel);
      imageUrls = dellResult.urls;
      sourceUrl = dellResult.sourceUrl;
    } else if (brand === 'HP') {
      const hpResult = await findHPProductImages(page, productModel);
      imageUrls = hpResult.urls;
      sourceUrl = hpResult.sourceUrl;
    } else if (brand === 'Apple') {
      const appleResult = await findAppleProductImages(page, productModel);
      imageUrls = appleResult.urls;
      sourceUrl = appleResult.sourceUrl;
    } else if (brand === 'Epson') {
      const epsonResult = await findEpsonProductImages(page, productModel);
      imageUrls = epsonResult.urls;
      sourceUrl = epsonResult.sourceUrl;
    } else if (brand === 'Sony') {
      const sonyResult = await findSonyProductImages(page, productModel);
      imageUrls = sonyResult.urls;
      sourceUrl = sonyResult.sourceUrl;
    } else if (brand === 'Bose') {
      const boseResult = await findBoseProductImages(page, productModel);
      imageUrls = boseResult.urls;
      sourceUrl = boseResult.sourceUrl;
    } else {
      result.status = 'ERROR';
      result.details = `Brand ${brand} not yet supported`;
      return result;
    }
    
    result.metadata.sourceUrl = sourceUrl;
    
    if (imageUrls.length === 0) {
      result.status = 'NO_IMAGE_FOUND';
      result.details = `No product images found for ${brand} ${productModel}`;
      return result;
    }
    
    const maxImages = Math.min(preferredImageViews.length, 10);
    let hasOverlayImages = false;
    let savedCount = 0;
    
    for (let i = 0; i < imageUrls.length && savedCount < maxImages; i++) {
      const url = imageUrls[i];
      const viewType = preferredImageViews[savedCount] || classifyImageView(url, savedCount);
      
      console.log(`[manufacturer-downloader] Downloading image ${savedCount + 1}/${maxImages}: ${viewType}`);
      
      try {
        const imageBuffer = await downloadImage(url);
        
        if (imageBuffer.length < 5000) {
          console.log(`[manufacturer-downloader] Skipping tiny image (${imageBuffer.length} bytes): ${url}`);
          continue;
        }
        
        const hasOverlay = await detectOverlay(imageBuffer);
        if (hasOverlay) {
          hasOverlayImages = true;
          console.log(`[manufacturer-downloader] Warning: Image ${savedCount + 1} may have overlays`);
        }
        
        const savedPaths = await processAndSaveImage(
          imageBuffer,
          outputDir,
          filenameBase,
          savedCount
        );
        
        const downloadedImage: DownloadedImage = {
          viewType,
          originalUrl: url,
          savedPaths,
          alt: `${brand} ${productModel}, ${viewType} view`,
          hasOverlay,
        };
        
        result.images.push(downloadedImage);
        result.metadata.savedPaths.push(
          savedPaths.original,
          savedPaths.webp,
          savedPaths.medium,
          savedPaths.thumbnail
        );
        savedCount++;
        
      } catch (downloadError: any) {
        console.error(`[manufacturer-downloader] Failed to download image ${savedCount + 1}: ${downloadError.message}`);
      }
    }
    
    if (result.images.length === 0) {
      result.status = 'NO_IMAGE_FOUND';
      result.details = 'Failed to download any images';
      return result;
    }
    
    const manifestPath = path.join(
      process.cwd(),
      outputDir.replace(/^\//, ''),
      `${filenameBase}_meta.json`
    );
    
    const manifest = {
      brand,
      model: productModel,
      category,
      source: sourceUrl,
      downloadedAt: result.metadata.downloadedAt,
      images: result.images.map(img => ({
        view: img.viewType,
        alt: img.alt,
        caption: `${brand} ${productModel}`,
        source: img.originalUrl,
        hasOverlay: img.hasOverlay,
        paths: img.savedPaths,
      })),
    };
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    result.manifestPath = manifestPath;
    
    if (hasOverlayImages) {
      result.status = 'HAS_OVERLAY';
      result.details = `Downloaded ${result.images.length} images, but some may have text overlays`;
    } else {
      result.status = 'OK';
      result.details = `Successfully downloaded ${result.images.length} images for ${brand} ${productModel}`;
    }
    
    console.log(`[manufacturer-downloader] ${result.details}`);
    
  } catch (error: any) {
    if (error.message === 'ACCESS_DENIED') {
      result.status = 'ACCESS_DENIED';
      result.details = `Dell website blocked access. Cannot scrape images.`;
    } else {
      result.status = 'ERROR';
      result.details = error.message;
    }
    console.error(`[manufacturer-downloader] Error: ${result.details}`);
  } finally {
    if (page) {
      await page.close();
    }
  }
  
  return result;
}
