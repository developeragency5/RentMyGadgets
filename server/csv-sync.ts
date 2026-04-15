import * as fs from 'fs';
import * as path from 'path';
import { storage } from './storage';
import { findProductData } from './adapters';
import { processProductImage } from './image-processor';

export interface TestProduct {
  productId: string;
  name: string;
  brand: string;
  sku: string;
  brandUrl: string;
}

export interface TestSyncResult {
  productId: string;
  name: string;
  success: boolean;
  imageUrl?: string;
  imagePath?: string;
  error?: string;
  durationMs: number;
}

export function parseCSV(csvContent: string): TestProduct[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const products: TestProduct[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    
    if (parts.length >= 5) {
      products.push({
        productId: parts[0].trim(),
        name: parts[1].trim().replace(/"/g, ''),
        brand: parts[2].trim(),
        sku: parts[3].trim(),
        brandUrl: parts[4].trim()
      });
    }
  }
  
  return products;
}

export function parseJSON(jsonContent: string): TestProduct[] {
  try {
    const data = JSON.parse(jsonContent);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function loadTestProducts(filePath: string): TestProduct[] {
  const fullPath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.csv') {
    return parseCSV(content);
  } else if (ext === '.json') {
    return parseJSON(content);
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }
}

export async function syncTestProduct(testProduct: TestProduct): Promise<TestSyncResult> {
  const startTime = Date.now();
  
  console.log(`[csv-sync] Syncing: ${testProduct.name} (${testProduct.brand})`);
  
  try {
    const adapterResult = await findProductData(
      testProduct.name, 
      testProduct.brand, 
      testProduct.sku
    );
    
    if (!adapterResult || !adapterResult.success || !adapterResult.data) {
      return {
        productId: testProduct.productId,
        name: testProduct.name,
        success: false,
        error: adapterResult?.error || 'No product data found from adapter',
        durationMs: Date.now() - startTime
      };
    }
    
    const productData = adapterResult.data;
    
    if (!productData.imageUrl) {
      return {
        productId: testProduct.productId,
        name: testProduct.name,
        success: false,
        error: 'No image URL found in product data',
        durationMs: Date.now() - startTime
      };
    }
    
    console.log(`[csv-sync] Found image: ${productData.imageUrl}`);
    
    const imageResult = await processProductImage(productData.imageUrl, testProduct.productId);
    
    if (!imageResult.success) {
      return {
        productId: testProduct.productId,
        name: testProduct.name,
        success: false,
        imageUrl: productData.imageUrl,
        error: imageResult.error || 'Image processing failed',
        durationMs: Date.now() - startTime
      };
    }
    
    const heroImage = imageResult.images.find(img => img.size === 'hero');
    
    console.log(`[csv-sync] Successfully processed ${testProduct.name}`);
    console.log(`[csv-sync] Image sizes generated: ${imageResult.images.map(i => i.size).join(', ')}`);
    
    return {
      productId: testProduct.productId,
      name: testProduct.name,
      success: true,
      imageUrl: productData.imageUrl,
      imagePath: heroImage?.path,
      durationMs: Date.now() - startTime
    };
  } catch (error: any) {
    console.error(`[csv-sync] Error syncing ${testProduct.name}:`, error.message);
    return {
      productId: testProduct.productId,
      name: testProduct.name,
      success: false,
      error: error.message,
      durationMs: Date.now() - startTime
    };
  }
}

export async function runTestSync(filePath: string): Promise<{
  total: number;
  succeeded: number;
  failed: number;
  results: TestSyncResult[];
  durationMs: number;
}> {
  const startTime = Date.now();
  const products = loadTestProducts(filePath);
  
  console.log(`[csv-sync] Loaded ${products.length} products from ${filePath}`);
  
  const results: TestSyncResult[] = [];
  let succeeded = 0;
  let failed = 0;
  
  for (const product of products) {
    const result = await syncTestProduct(product);
    results.push(result);
    
    if (result.success) {
      succeeded++;
    } else {
      failed++;
    }
    
    if (products.indexOf(product) < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const summary = {
    total: products.length,
    succeeded,
    failed,
    results,
    durationMs: Date.now() - startTime
  };
  
  console.log(`[csv-sync] Test sync complete: ${succeeded}/${products.length} succeeded`);
  
  return summary;
}

export async function syncExistingProducts(productNames: string[]): Promise<{
  total: number;
  succeeded: number;
  failed: number;
  results: Array<{ name: string; success: boolean; imagePath?: string; error?: string }>;
}> {
  const results: Array<{ name: string; success: boolean; imagePath?: string; error?: string }> = [];
  let succeeded = 0;
  let failed = 0;
  
  const allProducts = await storage.getAllProducts();
  
  for (const name of productNames) {
    const product = allProducts.find((p: { name: string }) => 
      p.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(p.name.toLowerCase())
    );
    
    if (!product) {
      results.push({ name, success: false, error: 'Product not found in database' });
      failed++;
      continue;
    }
    
    const brand = product.brand || 'Apple';
    
    console.log(`[csv-sync] Syncing existing product: ${product.name} (ID: ${product.id})`);
    
    try {
      const adapterResult = await findProductData(product.name, brand, product.sku || undefined);
      
      if (!adapterResult?.success || !adapterResult.data?.imageUrl) {
        results.push({ name: product.name, success: false, error: 'No image found from adapter' });
        failed++;
        continue;
      }
      
      const imageResult = await processProductImage(adapterResult.data.imageUrl, product.id);
      
      if (!imageResult.success) {
        results.push({ name: product.name, success: false, error: imageResult.error });
        failed++;
        continue;
      }
      
      const heroImage = imageResult.images.find(img => img.size === 'hero');
      
      // Process gallery images from adapter (different angles/views)
      const galleryPaths: string[] = [];
      const productData = adapterResult.data;
      
      if (productData.galleryImageUrls && productData.galleryImageUrls.length > 0) {
        console.log(`[csv-sync] Processing ${productData.galleryImageUrls.length} gallery images for ${product.name}`);
        
        for (let i = 0; i < Math.min(productData.galleryImageUrls.length, 4); i++) {
          const galleryUrl = productData.galleryImageUrls[i];
          try {
            const galleryResult = await processProductImage(galleryUrl, `${product.id}_gallery_${i}`);
            if (galleryResult.success && galleryResult.images.length > 0) {
              const cardImage = galleryResult.images.find(img => img.size === 'card') || 
                                galleryResult.images.find(img => img.size === 'hero');
              if (cardImage) {
                galleryPaths.push(cardImage.path);
              }
            }
          } catch (galleryError: any) {
            console.error(`[csv-sync] Gallery image ${i} failed for ${product.name}:`, galleryError.message);
          }
        }
        console.log(`[csv-sync] Processed ${galleryPaths.length} gallery images successfully`);
      }
      
      if (heroImage) {
        await storage.updateProductImages(
          product.id,
          heroImage.path,
          galleryPaths.length > 0 ? galleryPaths : undefined,
          'synced'
        );
      }
      
      await storage.updateProduct(product.id, {
        syncStatus: 'synced',
        syncSource: 'Apple',
        lastSyncSuccess: new Date(),
        brandProductUrl: adapterResult.data.productUrl,
      });
      
      results.push({ name: product.name, success: true, imagePath: heroImage?.path });
      succeeded++;
      
    } catch (error: any) {
      results.push({ name: product.name, success: false, error: error.message });
      failed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return { total: productNames.length, succeeded, failed, results };
}
