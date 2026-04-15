import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { db } from './storage';
import { products, categories } from '@shared/schema';
import { eq, and, ilike } from 'drizzle-orm';
import sharp from 'sharp';

interface ProductImageData {
  product: string;
  slug: string;
  images: string[];
}

const STATIC_DIR = path.join(process.cwd(), 'static', 'images', 'Desktops & Laptops');

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': new URL(url).origin,
      },
      timeout: 30000,
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        console.log(`  [SKIP] HTTP ${response.statusCode} for ${url}`);
        resolve(false);
        return;
      }
      
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('image')) {
        console.log(`  [SKIP] Not an image: ${contentType}`);
        resolve(false);
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        console.log(`  [ERROR] Write error: ${err.message}`);
        resolve(false);
      });
    });
    
    request.on('error', (err) => {
      console.log(`  [ERROR] Request error: ${err.message}`);
      resolve(false);
    });
    
    request.on('timeout', () => {
      request.destroy();
      console.log(`  [TIMEOUT] ${url}`);
      resolve(false);
    });
  });
}

async function processImage(inputPath: string, outputBase: string): Promise<{
  original: string;
  webp: string;
  medium: string;
  thumb: string;
} | null> {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      return null;
    }
    
    if (metadata.width < 100 || metadata.height < 100) {
      console.log(`  [SKIP] Image too small: ${metadata.width}x${metadata.height}`);
      return null;
    }
    
    const ext = path.extname(inputPath).toLowerCase();
    const originalPath = `${outputBase}${ext}`;
    
    fs.copyFileSync(inputPath, originalPath);
    
    const webpPath = `${outputBase}.webp`;
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    const mediumPath = `${outputBase}_800${ext}`;
    await sharp(inputPath)
      .resize(800, null, { withoutEnlargement: true })
      .toFile(mediumPath);
    
    const thumbPath = `${outputBase}_thumb${ext}`;
    await sharp(inputPath)
      .resize(300, null, { withoutEnlargement: true })
      .toFile(thumbPath);
    
    return {
      original: originalPath,
      webp: webpPath,
      medium: mediumPath,
      thumb: thumbPath,
    };
  } catch (error: any) {
    console.log(`  [ERROR] Processing failed: ${error.message}`);
    return null;
  }
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/_+/g, '_');
}

async function findProductInDb(productName: string): Promise<{ id: string; name: string } | null> {
  const desktopsCategory = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, 'Desktops & Laptops'))
    .limit(1);
  
  if (!desktopsCategory.length) {
    console.log('  [ERROR] Category not found');
    return null;
  }
  
  const categoryId = desktopsCategory[0].id;
  
  let product = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(and(
      eq(products.categoryId, categoryId),
      ilike(products.name, productName)
    ))
    .limit(1);
  
  if (product.length) {
    return product[0];
  }
  
  const searchTerms = productName.split(' ').filter(t => t.length > 2);
  for (const term of searchTerms) {
    product = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(and(
        eq(products.categoryId, categoryId),
        ilike(products.name, `%${term}%`)
      ))
      .limit(5);
    
    const exactMatch = product.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(p.name.toLowerCase())
    );
    
    if (exactMatch) {
      return exactMatch;
    }
  }
  
  return null;
}

async function integrateProductImages(jsonFilePath: string): Promise<void> {
  console.log('=== Product Image Integration ===\n');
  
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const productData: ProductImageData[] = JSON.parse(jsonContent);
  
  console.log(`Found ${productData.length} products in JSON file\n`);
  
  const results = {
    success: 0,
    notFound: 0,
    noImages: 0,
    errors: [] as string[],
  };
  
  for (const item of productData) {
    console.log(`\nProcessing: ${item.product}`);
    
    const dbProduct = await findProductInDb(item.product);
    
    if (!dbProduct) {
      console.log(`  [NOT FOUND] No matching product in database`);
      results.notFound++;
      results.errors.push(`Not found: ${item.product}`);
      continue;
    }
    
    console.log(`  [MATCHED] ${dbProduct.name} (ID: ${dbProduct.id})`);
    
    const brandMatch = item.product.match(/^(\w+)/);
    const brand = brandMatch ? brandMatch[1] : 'Unknown';
    const brandDir = path.join(STATIC_DIR, brand);
    
    if (!fs.existsSync(brandDir)) {
      fs.mkdirSync(brandDir, { recursive: true });
    }
    
    const baseFilename = sanitizeFilename(item.product);
    const downloadedImages: string[] = [];
    
    for (let i = 0; i < item.images.length; i++) {
      const imageUrl = item.images[i];
      const tempPath = path.join(brandDir, `temp_${baseFilename}_${i + 1}.jpg`);
      
      console.log(`  Downloading image ${i + 1}/${item.images.length}...`);
      
      const downloaded = await downloadImage(imageUrl, tempPath);
      
      if (downloaded && fs.existsSync(tempPath)) {
        const stats = fs.statSync(tempPath);
        if (stats.size > 5000) {
          const outputBase = path.join(brandDir, `${baseFilename}_${String(i + 1).padStart(2, '0')}`);
          const processed = await processImage(tempPath, outputBase);
          
          if (processed) {
            const relativePath = path.relative(process.cwd(), processed.original);
            downloadedImages.push('/' + relativePath.replace(/\\/g, '/'));
            console.log(`  [OK] Saved: ${path.basename(processed.original)}`);
          }
        } else {
          console.log(`  [SKIP] File too small: ${stats.size} bytes`);
        }
        
        fs.unlinkSync(tempPath);
      }
    }
    
    if (downloadedImages.length > 0) {
      const mainImage = downloadedImages[0];
      const galleryImages = downloadedImages;
      
      await db
        .update(products)
        .set({
          imageUrl: mainImage,
          galleryImageUrls: galleryImages,
          imageSource: 'external',
          updatedAt: new Date(),
        })
        .where(eq(products.id, dbProduct.id));
      
      console.log(`  [UPDATED] Database updated with ${downloadedImages.length} images`);
      results.success++;
    } else {
      console.log(`  [NO IMAGES] Could not download any images`);
      results.noImages++;
      results.errors.push(`No images downloaded: ${item.product}`);
    }
  }
  
  console.log('\n=== Integration Complete ===');
  console.log(`Success: ${results.success}/${productData.length}`);
  console.log(`Not found in DB: ${results.notFound}`);
  console.log(`No images downloaded: ${results.noImages}`);
  
  if (results.errors.length > 0) {
    console.log('\nIssues:');
    results.errors.forEach(e => console.log(`  - ${e}`));
  }
}

const jsonFile = process.argv[2] || 'attached_assets/Pasted--product-Acer-Aspire-5-slug-acer-aspire-5-images-https-_1764779489339.txt';

integrateProductImages(jsonFile)
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
