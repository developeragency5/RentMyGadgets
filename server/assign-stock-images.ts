// @ts-nocheck
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
  // Apple iMac products
  { productName: 'iMac 24"', brand: 'Apple', stockImagePatterns: ['apple_imac_24_inch_c', 'apple_imac_24_inch_d', 'apple_imac_24_inch_m'] },
  { productName: 'iMac 24" M3', brand: 'Apple', stockImagePatterns: ['apple_imac_24_inch_c', 'apple_imac_24_inch_d', 'apple_imac_24_inch_m'] },
  { productName: 'iMac 24" M3 (16GB)', brand: 'Apple', stockImagePatterns: ['apple_imac_24_inch_c', 'apple_imac_24_inch_d', 'apple_imac_24_inch_m'] },
  
  // Apple Mac Mini products
  { productName: 'Mac Mini M2', brand: 'Apple', stockImagePatterns: ['apple_mac_mini_m2_co', 'apple_mac_mini_deskt'] },
  { productName: 'Mac Mini M2 Pro', brand: 'Apple', stockImagePatterns: ['apple_mac_mini_m2_co', 'apple_mac_mini_deskt'] },
  
  // Apple Mac Pro
  { productName: 'Mac Pro M2 Ultra', brand: 'Apple', stockImagePatterns: ['apple_mac_pro_tower_'] },
  
  // Apple Mac Studio products
  { productName: 'Mac Studio M2 Max', brand: 'Apple', stockImagePatterns: ['apple_mac_studio_pro', 'apple_mac_studio_des'] },
  { productName: 'Mac Studio M2 Ultra', brand: 'Apple', stockImagePatterns: ['apple_mac_studio_pro', 'apple_mac_studio_des'] },
  
  // Apple MacBook Air products
  { productName: 'MacBook Air 13" M3', brand: 'Apple', stockImagePatterns: ['apple_macbook_air_m3', 'macbook_air_laptop_c'] },
  { productName: 'MacBook Air 15"', brand: 'Apple', stockImagePatterns: ['apple_macbook_air_15', 'macbook_air_laptop_c'] },
  { productName: 'Apple MacBook Air 15" M2', brand: 'Apple', stockImagePatterns: ['apple_macbook_air_15', 'apple_macbook_air_m3', 'macbook_air_laptop_c'] },
  { productName: 'Apple MacBook Air 15" M3', brand: 'Apple', stockImagePatterns: ['apple_macbook_air_15', 'apple_macbook_air_m3', 'macbook_air_laptop_c'] },
  
  // Apple MacBook Pro products
  { productName: 'Apple MacBook Pro 13" M2', brand: 'Apple', stockImagePatterns: ['apple_macbook_pro_14', 'apple_macbook_pro_la', 'macbook_pro_laptop_k'] },
  { productName: 'MacBook Pro 14" M3', brand: 'Apple', stockImagePatterns: ['apple_macbook_pro_14', 'macbook_pro_laptop_k'] },
  { productName: 'MacBook Pro 14" M3 Max', brand: 'Apple', stockImagePatterns: ['apple_macbook_pro_14', 'macbook_pro_laptop_k'] },
  { productName: 'MacBook Pro 16"', brand: 'Apple', stockImagePatterns: ['apple_macbook_pro_16', 'macbook_pro_laptop_k'] },
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
  
  return [...new Set(images)].slice(0, 10);
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
  
  const cleanName = productName.replace(/Apple\s+/i, '');
  result = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(and(
      eq(products.categoryId, categoryId),
      ilike(products.name, `%${cleanName}%`)
    ))
    .limit(1);
  
  return result.length ? result[0] : null;
}

async function assignStockImages(): Promise<void> {
  console.log('=== Assign Stock Images to Products ===\n');
  
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
