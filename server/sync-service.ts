// @ts-nocheck
import { storage } from './storage';
import { findProductData, getSupportedBrands } from './adapters';
import { processProductImage, ImageProcessingResult } from './image-processor';
import { extractBrandFromName } from './image-scraper';
import type { Product, SyncRun, InsertProductSyncLog } from '@shared/schema';

export interface SyncConfig {
  batchSize: number;
  maxProductsPerRun: number;
  delayBetweenProducts: number; // ms
  processImages: boolean;
  brandFilter?: string; // Optional: filter by brand name
}

const DEFAULT_SYNC_CONFIG: SyncConfig = {
  batchSize: 10,
  maxProductsPerRun: 150,
  delayBetweenProducts: 2000, // 2 seconds between products
  processImages: true,
};

export interface SyncProgress {
  runId: string;
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  currentProduct?: string;
  status: 'running' | 'completed' | 'failed';
}

let currentSyncProgress: SyncProgress | null = null;

export function getSyncProgress(): SyncProgress | null {
  return currentSyncProgress;
}

export async function runProductSync(config: Partial<SyncConfig> = {}): Promise<SyncRun | null> {
  const syncConfig = { ...DEFAULT_SYNC_CONFIG, ...config };
  
  // Check if sync is already running
  if (currentSyncProgress?.status === 'running') {
    console.log('[sync-service] Sync already in progress');
    return null;
  }

  const startTime = Date.now();
  console.log('[sync-service] Starting product sync...');
  console.log('[sync-service] Supported brands:', getSupportedBrands().join(', '));

  // Create sync run record
  const syncRun = await storage.createSyncRun({
    status: 'running',
    totalProducts: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    config: syncConfig as Record<string, unknown>,
  });

  if (!syncRun) {
    console.error('[sync-service] Failed to create sync run');
    return null;
  }

  currentSyncProgress = {
    runId: syncRun.id,
    total: 0,
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    status: 'running',
  };

  try {
    // Get products needing sync (optionally filtered by brand)
    let products: Product[];
    if (syncConfig.brandFilter) {
      console.log(`[sync-service] Filtering by brand: ${syncConfig.brandFilter}`);
      const brandProducts = await storage.getProductsByBrand(syncConfig.brandFilter);
      // Filter to only those needing sync
      products = brandProducts
        .filter(p => !p.syncStatus || p.syncStatus === 'pending' || p.syncStatus === 'failed')
        .slice(0, syncConfig.maxProductsPerRun);
    } else {
      products = await storage.getProductsNeedingSync(syncConfig.maxProductsPerRun);
    }
    currentSyncProgress.total = products.length;

    console.log(`[sync-service] Found ${products.length} products needing sync${syncConfig.brandFilter ? ` for brand: ${syncConfig.brandFilter}` : ''}`);

    // Update sync run with total
    await storage.updateSyncRun(syncRun.id, { totalProducts: products.length });

    // Process products in batches
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      currentSyncProgress.currentProduct = product.name;
      currentSyncProgress.processed = i + 1;

      try {
        const result = await syncSingleProduct(product, syncRun.id, syncConfig);
        
        if (result.success) {
          currentSyncProgress.succeeded++;
        } else if (result.skipped) {
          currentSyncProgress.skipped++;
        } else {
          currentSyncProgress.failed++;
        }
      } catch (error: any) {
        console.error(`[sync-service] Error syncing ${product.name}:`, error.message);
        currentSyncProgress.failed++;
        
        await logSyncAttempt(syncRun.id, product, 'sync', 'failed', {
          errorMessage: error.message,
          errorCode: 'SYNC_ERROR',
        });
        
        await storage.updateProductSyncStatus(product.id, 'failed', error.message);
      }

      // Update progress in database periodically
      if (i % 10 === 0 || i === products.length - 1) {
        await storage.updateSyncRun(syncRun.id, {
          processed: currentSyncProgress.processed,
          succeeded: currentSyncProgress.succeeded,
          failed: currentSyncProgress.failed,
          skipped: currentSyncProgress.skipped,
        });
      }

      // Delay between products
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, syncConfig.delayBetweenProducts));
      }
    }

    // Complete sync run
    const durationMs = Date.now() - startTime;
    const completedRun = await storage.updateSyncRun(syncRun.id, {
      status: 'completed',
      completedAt: new Date(),
      durationMs,
      processed: currentSyncProgress.processed,
      succeeded: currentSyncProgress.succeeded,
      failed: currentSyncProgress.failed,
      skipped: currentSyncProgress.skipped,
    });

    currentSyncProgress.status = 'completed';
    console.log(`[sync-service] Sync completed in ${Math.round(durationMs / 1000)}s`);
    console.log(`[sync-service] Results: ${currentSyncProgress.succeeded} succeeded, ${currentSyncProgress.failed} failed, ${currentSyncProgress.skipped} skipped`);

    return completedRun || syncRun;
  } catch (error: any) {
    console.error('[sync-service] Sync failed:', error.message);
    
    await storage.updateSyncRun(syncRun.id, {
      status: 'failed',
      completedAt: new Date(),
      durationMs: Date.now() - startTime,
      errorSummary: { error: error.message },
    });

    currentSyncProgress.status = 'failed';
    return syncRun;
  }
}

interface SingleSyncResult {
  success: boolean;
  skipped: boolean;
  imageProcessed: boolean;
}

async function syncSingleProduct(
  product: Product,
  runId: string,
  config: SyncConfig
): Promise<SingleSyncResult> {
  const brand = product.brand || extractBrandFromName(product.name);
  
  console.log(`[sync-service] Syncing: ${product.name} (${brand || 'unknown brand'})`);

  // Check if brand is supported
  const supportedBrands = getSupportedBrands().map(b => b.toLowerCase());
  if (!brand || !supportedBrands.includes(brand.toLowerCase())) {
    console.log(`[sync-service] Skipping ${product.name}: unsupported brand`);
    
    await logSyncAttempt(runId, product, 'lookup', 'skipped', {
      errorMessage: `Brand not supported: ${brand || 'unknown'}`,
    });
    
    return { success: false, skipped: true, imageProcessed: false };
  }

  // Backup original data before syncing
  await storage.backupProductData(product.id);

  // Find product data using adapter
  const adapterResult = await findProductData(product.name, brand, product.sku || undefined);

  if (!adapterResult || !adapterResult.success || !adapterResult.data) {
    console.log(`[sync-service] No data found for ${product.name}`);
    
    await logSyncAttempt(runId, product, 'lookup', 'failed', {
      errorMessage: adapterResult?.error || 'No product data found',
      httpStatus: adapterResult?.httpStatus,
      sourceUrl: adapterResult?.sourceUrl,
    });
    
    await storage.updateProductSyncStatus(product.id, 'failed', adapterResult?.error || 'No data found');
    return { success: false, skipped: false, imageProcessed: false };
  }

  const productData = adapterResult.data;
  let imageProcessed = false;

  // Process image if available and enabled
  if (config.processImages && productData.imageUrl) {
    try {
      const imageResult = await processProductImage(productData.imageUrl, product.id);
      
      if (imageResult.success && imageResult.images.length > 0) {
        // Get the hero image path for main image
        const heroImage = imageResult.images.find(img => img.size === 'hero');
        
        // Process gallery images from adapter (different angles/views)
        const galleryPaths: string[] = [];
        
        if (productData.galleryImageUrls && productData.galleryImageUrls.length > 0) {
          console.log(`[sync-service] Processing ${productData.galleryImageUrls.length} gallery images for ${product.name}`);
          
          // Process each gallery image (up to 4 additional images)
          for (let i = 0; i < Math.min(productData.galleryImageUrls.length, 4); i++) {
            const galleryUrl = productData.galleryImageUrls[i];
            try {
              // Add suffix to differentiate gallery images
              const galleryResult = await processProductImage(galleryUrl, `${product.id}_gallery_${i}`);
              if (galleryResult.success && galleryResult.images.length > 0) {
                // Use the card-size version for gallery thumbnails
                const cardImage = galleryResult.images.find(img => img.size === 'card') || 
                                  galleryResult.images.find(img => img.size === 'hero');
                if (cardImage) {
                  galleryPaths.push(cardImage.path);
                }
              }
            } catch (galleryError: any) {
              console.error(`[sync-service] Gallery image ${i} failed for ${product.name}:`, galleryError.message);
            }
          }
        }
        
        if (heroImage) {
          await storage.updateProductImages(
            product.id,
            heroImage.path,
            galleryPaths.length > 0 ? galleryPaths : undefined,
            'synced'
          );
          imageProcessed = true;
        }
      }
      
      await logSyncAttempt(runId, product, 'image', imageResult.success ? 'success' : 'failed', {
        sourceUrl: productData.imageUrl,
        imagesFound: imageResult.images.length,
        galleryImagesFound: productData.galleryImageUrls?.length || 0,
        durationMs: imageResult.processingTimeMs,
        errorMessage: imageResult.error,
      });
    } catch (error: any) {
      console.error(`[sync-service] Image processing failed for ${product.name}:`, error.message);
      
      await logSyncAttempt(runId, product, 'image', 'failed', {
        sourceUrl: productData.imageUrl,
        errorMessage: error.message,
      });
    }
  }

  // Update product with synced data
  const updateData: Record<string, unknown> = {
    syncStatus: 'synced',
    syncSource: adapterResult.brand,
    lastSyncAttempt: new Date(),
    lastSyncSuccess: new Date(),
    updatedAt: new Date(),
  };

  if (productData.productUrl) {
    updateData.brandProductUrl = productData.productUrl;
  }
  if (productData.supportUrl) {
    updateData.brandSupportUrl = productData.supportUrl;
  }
  if (productData.description && !product.description) {
    updateData.description = productData.description;
  }
  if (productData.descriptionShort) {
    updateData.descriptionShort = productData.descriptionShort;
  }
  if (productData.descriptionLong) {
    updateData.descriptionLong = productData.descriptionLong;
  }
  if (productData.specs && productData.specs.length > 0) {
    updateData.specs = productData.specs;
  }
  if (productData.specsJson) {
    updateData.specsJson = productData.specsJson;
  }
  if (productData.specHtml) {
    updateData.specHtml = productData.specHtml;
  }

  await storage.updateProduct(product.id, updateData);

  await logSyncAttempt(runId, product, 'sync', 'success', {
    sourceUrl: adapterResult.sourceUrl,
    durationMs: adapterResult.durationMs,
    dataFetched: {
      hasImage: !!productData.imageUrl,
      hasDescription: !!productData.description,
      hasSpecs: !!productData.specs,
      imageProcessed,
    },
  });

  console.log(`[sync-service] Successfully synced ${product.name}`);
  return { success: true, skipped: false, imageProcessed };
}

async function logSyncAttempt(
  runId: string,
  product: Product,
  phase: string,
  status: string,
  details: {
    sourceUrl?: string;
    imagesFound?: number;
    durationMs?: number;
    errorMessage?: string;
    errorCode?: string;
    httpStatus?: number;
    dataFetched?: Record<string, unknown>;
  }
): Promise<void> {
  const log: InsertProductSyncLog = {
    runId,
    productId: product.id,
    productName: product.name,
    brand: product.brand || undefined,
    phase,
    action: phase,
    syncType: 'automated',
    status,
    sourceUrl: details.sourceUrl || undefined,
    imagesFound: details.imagesFound || 0,
    durationMs: details.durationMs || undefined,
    errorMessage: details.errorMessage || undefined,
    errorCode: details.errorCode || undefined,
    httpStatus: details.httpStatus || undefined,
    dataFetched: details.dataFetched || undefined,
  };

  await storage.createProductSyncLog(log);
}

export async function getRecentSyncRuns(limit: number = 10): Promise<SyncRun[]> {
  return storage.getRecentSyncRuns(limit);
}

export async function getSyncRunById(runId: string): Promise<SyncRun | undefined> {
  return storage.getSyncRun(runId);
}
