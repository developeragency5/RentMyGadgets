import { db } from "./storage";
import { products, imageSyncLogs, type Product } from "@shared/schema";
import { eq } from "drizzle-orm";

interface ManufacturerConfig {
  domains: string[];
  searchUrlPattern: string;
  productUrlPatterns: string[];
  imageSelectors: string[];
}

const MANUFACTURER_CONFIGS: Record<string, ManufacturerConfig> = {
  Apple: {
    domains: ["apple.com"],
    searchUrlPattern: "https://www.apple.com/search/{query}",
    productUrlPatterns: ["apple.com/shop/", "apple.com/macbook", "apple.com/mac", "apple.com/airpods"],
    imageSelectors: ["og:image", "twitter:image", ".gallery-image", ".product-image"]
  },
  Dell: {
    domains: ["dell.com", "dell.co.uk"],
    searchUrlPattern: "https://www.dell.com/en-us/search/{query}",
    productUrlPatterns: ["dell.com/en-us/shop/", "dell.com/en-uk/shop/"],
    imageSelectors: ["og:image", ".product-image", ".hero-image"]
  },
  HP: {
    domains: ["hp.com", "store.hp.com"],
    searchUrlPattern: "https://www.hp.com/us-en/search.html#q={query}",
    productUrlPatterns: ["hp.com/us-en/shop/", "store.hp.com/"],
    imageSelectors: ["og:image", ".product-image"]
  },
  Lenovo: {
    domains: ["lenovo.com"],
    searchUrlPattern: "https://www.lenovo.com/us/en/search?text={query}",
    productUrlPatterns: ["lenovo.com/us/en/p/", "lenovo.com/us/en/laptops/"],
    imageSelectors: ["og:image", ".product-image"]
  },
  ASUS: {
    domains: ["asus.com"],
    searchUrlPattern: "https://www.asus.com/us/searchresult?searchKey={query}",
    productUrlPatterns: ["asus.com/us/laptops/", "asus.com/us/motherboards/"],
    imageSelectors: ["og:image", ".product-image"]
  },
  Sony: {
    domains: ["sony.com", "electronics.sony.com"],
    searchUrlPattern: "https://electronics.sony.com/search/{query}",
    productUrlPatterns: ["electronics.sony.com/", "sony.com/"],
    imageSelectors: ["og:image", ".product-image"]
  },
  Canon: {
    domains: ["usa.canon.com", "canon.com"],
    searchUrlPattern: "https://www.usa.canon.com/search?q={query}",
    productUrlPatterns: ["usa.canon.com/shop/", "canon.com/"],
    imageSelectors: ["og:image", ".product-image"]
  },
  Nikon: {
    domains: ["nikonusa.com", "nikon.com"],
    searchUrlPattern: "https://www.nikonusa.com/search?q={query}",
    productUrlPatterns: ["nikonusa.com/p/", "nikon.com/"],
    imageSelectors: ["og:image", ".product-image"]
  },
  Samsung: {
    domains: ["samsung.com"],
    searchUrlPattern: "https://www.samsung.com/us/search/searchMain?keyword={query}",
    productUrlPatterns: ["samsung.com/us/computing/", "samsung.com/us/mobile/"],
    imageSelectors: ["og:image", ".product-image"]
  },
  Microsoft: {
    domains: ["microsoft.com"],
    searchUrlPattern: "https://www.microsoft.com/en-us/search?q={query}",
    productUrlPatterns: ["microsoft.com/en-us/d/", "microsoft.com/en-us/surface/"],
    imageSelectors: ["og:image", ".product-image"]
  }
};

interface ImageValidationResult {
  url: string;
  valid: boolean;
  httpStatus: number | null;
  contentType: string | null;
  error?: string;
}

interface SyncResult {
  productId: string;
  productName: string;
  success: boolean;
  imagesFound: number;
  mainImage: string | null;
  galleryImages: string[];
  sourceUrl: string | null;
  error?: string;
  httpStatus?: number;
}

export async function validateImageUrl(url: string): Promise<ImageValidationResult> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const contentType = response.headers.get('content-type') || '';
    const isValidImage = contentType.startsWith('image/');
    
    return {
      url,
      valid: response.ok && isValidImage,
      httpStatus: response.status,
      contentType
    };
  } catch (error: any) {
    return {
      url,
      valid: false,
      httpStatus: null,
      contentType: null,
      error: error.message
    };
  }
}

export function cleanImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 
                           'fbclid', 'gclid', 'ref', 'source', 'campaign'];
    trackingParams.forEach(param => parsed.searchParams.delete(param));
    return parsed.toString();
  } catch {
    return url;
  }
}

export function extractBrandFromName(name: string): string | null {
  const brandPatterns = [
    { pattern: /^(Apple|Mac|MacBook|iMac|AirPods)/i, brand: 'Apple' },
    { pattern: /^Dell/i, brand: 'Dell' },
    { pattern: /^HP\s/i, brand: 'HP' },
    { pattern: /^(Lenovo|ThinkPad|ThinkStation|Legion)/i, brand: 'Lenovo' },
    { pattern: /^(ASUS|ROG|ZenBook)/i, brand: 'ASUS' },
    { pattern: /^Sony/i, brand: 'Sony' },
    { pattern: /^Canon/i, brand: 'Canon' },
    { pattern: /^Nikon/i, brand: 'Nikon' },
    { pattern: /^(Samsung|Galaxy)/i, brand: 'Samsung' },
    { pattern: /^(Microsoft|Surface)/i, brand: 'Microsoft' },
    { pattern: /^Razer/i, brand: 'Razer' },
    { pattern: /^MSI/i, brand: 'MSI' },
    { pattern: /^Acer/i, brand: 'Acer' },
    { pattern: /^Intel/i, brand: 'Intel' },
    { pattern: /^Epson/i, brand: 'Epson' },
    { pattern: /^Brother/i, brand: 'Brother' },
    { pattern: /^Xerox/i, brand: 'Xerox' },
    { pattern: /^Sennheiser/i, brand: 'Sennheiser' },
    { pattern: /^Bose/i, brand: 'Bose' },
    { pattern: /^(Fujifilm|Fuji)/i, brand: 'Fujifilm' },
    { pattern: /^(Panasonic|Lumix)/i, brand: 'Panasonic' },
    { pattern: /^(DJI|Mavic)/i, brand: 'DJI' },
    { pattern: /^GoPro/i, brand: 'GoPro' },
    { pattern: /^(Netgear|Nighthawk|Orbi)/i, brand: 'Netgear' },
    { pattern: /^(TP-Link|Archer|Deco)/i, brand: 'TP-Link' },
    { pattern: /^(Ubiquiti|UniFi)/i, brand: 'Ubiquiti' },
    { pattern: /^(Cisco|Meraki)/i, brand: 'Cisco' },
  ];

  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(name)) {
      return brand;
    }
  }
  return name.split(' ')[0];
}

export function generateManufacturerSearchUrl(brand: string, productName: string): string | null {
  const config = MANUFACTURER_CONFIGS[brand];
  if (!config) return null;
  
  const query = encodeURIComponent(productName.replace(/[^\w\s]/g, ' ').trim());
  return config.searchUrlPattern.replace('{query}', query);
}

export function getManufacturerDomains(brand: string): string[] {
  const config = MANUFACTURER_CONFIGS[brand];
  return config?.domains || [];
}

export async function logSyncAttempt(
  productId: string, 
  syncType: string, 
  status: string, 
  sourceUrl: string | null,
  imagesFound: number,
  errorMessage: string | null,
  httpStatus: number | null
): Promise<void> {
  await db.insert(imageSyncLogs).values({
    productId,
    syncType,
    status,
    sourceUrl,
    imagesFound,
    errorMessage,
    httpStatus
  });
}

export async function syncProductImages(productId: string): Promise<SyncResult> {
  const [product] = await db.select().from(products).where(eq(products.id, productId));
  
  if (!product) {
    return {
      productId,
      productName: 'Unknown',
      success: false,
      imagesFound: 0,
      mainImage: null,
      galleryImages: [],
      sourceUrl: null,
      error: 'Product not found'
    };
  }

  const brand = product.brand || extractBrandFromName(product.name);
  const searchUrl = generateManufacturerSearchUrl(brand || '', product.name);
  
  const currentImageUrl = product.imageUrl;
  let imageValid = false;
  let httpStatus: number | null = null;
  
  if (currentImageUrl) {
    const validation = await validateImageUrl(currentImageUrl);
    imageValid = validation.valid;
    httpStatus = validation.httpStatus;
  }
  
  const syncStatus = imageValid ? 'valid' : 'invalid';
  
  await db.update(products)
    .set({
      brand: brand,
      lastImageSync: new Date(),
      imageSyncStatus: syncStatus,
      imageSourceUrl: searchUrl
    })
    .where(eq(products.id, productId));

  await logSyncAttempt(
    productId,
    'manual',
    syncStatus,
    searchUrl,
    imageValid ? 1 : 0,
    imageValid ? null : 'Current image URL is invalid or unreachable',
    httpStatus
  );

  return {
    productId,
    productName: product.name,
    success: imageValid,
    imagesFound: imageValid ? 1 : 0,
    mainImage: imageValid ? currentImageUrl : null,
    galleryImages: (product.galleryImageUrls || []) as string[],
    sourceUrl: searchUrl,
    httpStatus: httpStatus || undefined
  };
}

export async function syncAllProductImages(batchSize: number = 10): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: SyncResult[];
}> {
  const allProducts = await db.select().from(products);
  const results: SyncResult[] = [];
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < allProducts.length; i += batchSize) {
    const batch = allProducts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((p: Product) => syncProductImages(p.id))
    );
    
    for (const result of batchResults) {
      results.push(result);
      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }
  }

  return {
    total: allProducts.length,
    successful,
    failed,
    results
  };
}

export async function updateProductImage(
  productId: string, 
  imageUrl: string,
  galleryUrls?: string[]
): Promise<{ success: boolean; error?: string }> {
  const cleanedUrl = cleanImageUrl(imageUrl);
  const validation = await validateImageUrl(cleanedUrl);
  
  if (!validation.valid) {
    return {
      success: false,
      error: `Image URL is invalid: ${validation.error || `HTTP ${validation.httpStatus}`}`
    };
  }

  const updateData: any = {
    imageUrl: cleanedUrl,
    lastImageSync: new Date(),
    imageSyncStatus: 'valid'
  };

  if (galleryUrls) {
    const validGallery: string[] = [];
    for (const url of galleryUrls) {
      const cleaned = cleanImageUrl(url);
      const galleryValidation = await validateImageUrl(cleaned);
      if (galleryValidation.valid) {
        validGallery.push(cleaned);
      }
    }
    updateData.galleryImageUrls = validGallery;
  }

  await db.update(products)
    .set(updateData)
    .where(eq(products.id, productId));

  await logSyncAttempt(
    productId,
    'manual_override',
    'valid',
    cleanedUrl,
    1 + (galleryUrls?.length || 0),
    null,
    validation.httpStatus
  );

  return { success: true };
}

export async function getImageSyncStatus(): Promise<{
  totalProducts: number;
  validImages: number;
  invalidImages: number;
  neverSynced: number;
  lastSyncTime: Date | null;
}> {
  const allProducts = await db.select().from(products);
  
  let validImages = 0;
  let invalidImages = 0;
  let neverSynced = 0;
  let lastSyncTime: Date | null = null;

  for (const product of allProducts) {
    if (!product.lastImageSync) {
      neverSynced++;
    } else if (product.imageSyncStatus === 'valid') {
      validImages++;
    } else {
      invalidImages++;
    }

    if (product.lastImageSync) {
      if (!lastSyncTime || product.lastImageSync > lastSyncTime) {
        lastSyncTime = product.lastImageSync;
      }
    }
  }

  return {
    totalProducts: allProducts.length,
    validImages,
    invalidImages,
    neverSynced,
    lastSyncTime
  };
}

export async function getProductsWithInvalidImages(): Promise<Array<{
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  imageSyncStatus: string | null;
  lastImageSync: Date | null;
}>> {
  const allProducts = await db.select({
    id: products.id,
    name: products.name,
    brand: products.brand,
    imageUrl: products.imageUrl,
    imageSyncStatus: products.imageSyncStatus,
    lastImageSync: products.lastImageSync
  }).from(products);

  return allProducts.filter((p: typeof allProducts[0]) => 
    p.imageSyncStatus === 'invalid' || !p.imageUrl || !p.lastImageSync
  );
}

export async function getSyncLogs(productId?: string, limit: number = 50): Promise<any[]> {
  if (productId) {
    return db.select()
      .from(imageSyncLogs)
      .where(eq(imageSyncLogs.productId, productId))
      .orderBy(imageSyncLogs.createdAt)
      .limit(limit);
  }
  
  return db.select()
    .from(imageSyncLogs)
    .orderBy(imageSyncLogs.createdAt)
    .limit(limit);
}
