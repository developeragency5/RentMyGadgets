import fs from 'fs';
import path from 'path';
import { db } from './storage';
import { products, categories } from '@shared/schema';
import { eq, and, ilike } from 'drizzle-orm';
import sharp from 'sharp';

const STOCK_DIR = path.join(process.cwd(), 'attached_assets', 'stock_images');
const OUTPUT_DIR = path.join(process.cwd(), 'static', 'images', 'Desktops & Laptops');

interface ImageAssignment {
  productName: string;
  brand: string;
  stockImagePatterns: string[];
}

const assignments: ImageAssignment[] = [
  // Acer products
  { productName: 'Acer Aspire 5', brand: 'Acer', stockImagePatterns: ['acer_aspire_5_laptop'] },
  { productName: 'Acer Aspire TC-1780', brand: 'Acer', stockImagePatterns: ['acer_aspire_desktop'] },
  { productName: 'Acer ConceptD 500', brand: 'Acer', stockImagePatterns: ['acer_conceptd_white'] },
  { productName: 'Acer ConceptD 7 Ezel', brand: 'Acer', stockImagePatterns: ['acer_conceptd_conver'] },
  { productName: 'Acer Nitro 5', brand: 'Acer', stockImagePatterns: ['acer_nitro_5_gaming'] },
  { productName: 'Acer Predator Helios 18', brand: 'Acer', stockImagePatterns: ['acer_predator_helios'] },
  { productName: 'Acer Predator Orion 5000', brand: 'Acer', stockImagePatterns: ['acer_predator_orion'] },
  { productName: 'Acer Predator Orion 7000', brand: 'Acer', stockImagePatterns: ['acer_predator_orion'] },
  { productName: 'Acer Predator Triton 16', brand: 'Acer', stockImagePatterns: ['acer_predator_triton'] },
  { productName: 'Acer Swift 5', brand: 'Acer', stockImagePatterns: ['acer_swift_5_ultrabo'] },
  { productName: 'Acer Swift Edge 16', brand: 'Acer', stockImagePatterns: ['acer_swift_edge_lapt'] },
  { productName: 'Acer TravelMate P4', brand: 'Acer', stockImagePatterns: ['acer_travelmate_busi'] },
  // Alienware products
  { productName: 'Alienware Aurora R16', brand: 'Alienware', stockImagePatterns: ['alienware_aurora_r16'] },
  { productName: 'Alienware m18', brand: 'Alienware', stockImagePatterns: ['alienware_m18_gaming'] },
  { productName: 'Alienware x14 R2', brand: 'Alienware', stockImagePatterns: ['alienware_x14_compac'] },
  { productName: 'Alienware x16', brand: 'Alienware', stockImagePatterns: ['alienware_x16_gaming'] },
  // Apple products
  { productName: 'iMac 24"', brand: 'Apple', stockImagePatterns: ['apple_imac_24_inch'] },
  { productName: 'iMac 24" M3', brand: 'Apple', stockImagePatterns: ['apple_imac_24_inch'] },
];

async function findStockImages(patterns: string[]): Promise<string[]> {
  const images: string[] = [];
  
  if (!fs.existsSync(STOCK_DIR)) return images;
  
  const files = fs.readdirSync(STOCK_DIR);
  
  for (const pattern of patterns) {
    const matching = files.filter(f => 
      f.startsWith(pattern) && 
      (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
    );
    images.push(...matching.map(f => path.join(STOCK_DIR, f)));
  }
  
  return [...new Set(images)].slice(0, 3);
}

async function processAndSaveImage(inputPath: string, brand: string, baseName: string, index: number): Promise<string | null> {
  try {
    const brandDir = path.join(OUTPUT_DIR, brand);
    if (!fs.existsSync(brandDir)) {
      fs.mkdirSync(brandDir, { recursive: true });
    }
    
    const outputBase = path.join(brandDir, `${baseName}_${String(index).padStart(2, '0')}`);
    const outputPath = `${outputBase}.jpg`;
    
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(`${outputBase}.webp`);
    
    await sharp(inputPath)
      .resize(800, null, { withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(`${outputBase}_800.jpg`);
    
    await sharp(inputPath)
      .resize(300, null, { withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(`${outputBase}_thumb.jpg`);
    
    return `/static/images/Desktops & Laptops/${brand}/${baseName}_${String(index).padStart(2, '0')}.jpg`;
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
  
  if (!desktopsCategory.length) return null;
  const categoryId = desktopsCategory[0].id;
  
  let result = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(and(
      eq(products.categoryId, categoryId),
      ilike(products.name, productName)
    ))
    .limit(1);
  
  if (result.length) return result[0];
  
  result = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(and(
      eq(products.categoryId, categoryId),
      ilike(products.name, `%${productName}%`)
    ))
    .limit(1);
  
  return result.length ? result[0] : null;
}

async function assignStockImages(): Promise<void> {
  console.log('=== Assign Stock Images to Products (Batch 1) ===\n');
  
  let updated = 0;
  let notFound = 0;
  let noImages = 0;
  
  for (const assignment of assignments) {
    console.log(`\nProcessing: ${assignment.productName}`);
    
    const dbProduct = await findProductInDb(assignment.productName);
    
    if (!dbProduct) {
      console.log(`  [NOT FOUND] No matching product in database`);
      notFound++;
      continue;
    }
    
    console.log(`  [MATCHED] ${dbProduct.name}`);
    
    const stockImages = await findStockImages(assignment.stockImagePatterns);
    
    if (stockImages.length === 0) {
      console.log(`  [NO IMAGES] No matching stock images found`);
      noImages++;
      continue;
    }
    
    console.log(`  Found ${stockImages.length} stock images`);
    
    const baseName = sanitizeFilename(assignment.productName);
    const savedPaths: string[] = [];
    
    for (let i = 0; i < stockImages.length; i++) {
      const savedPath = await processAndSaveImage(
        stockImages[i], 
        assignment.brand, 
        baseName, 
        i + 1
      );
      if (savedPath) {
        savedPaths.push(savedPath);
      }
    }
    
    if (savedPaths.length > 0) {
      await db
        .update(products)
        .set({
          imageUrl: savedPaths[0],
          galleryImageUrls: savedPaths,
          imageSource: 'stock',
          updatedAt: new Date(),
        })
        .where(eq(products.id, dbProduct.id));
      
      console.log(`  [UPDATED] Assigned ${savedPaths.length} images`);
      updated++;
    } else {
      noImages++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Updated: ${updated}`);
  console.log(`Not found in DB: ${notFound}`);
  console.log(`No images: ${noImages}`);
}

assignStockImages()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
