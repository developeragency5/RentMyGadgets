// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { db } from './storage';
import { products, categories } from '@shared/schema';
import { eq, and, ilike, or } from 'drizzle-orm';

const STATIC_DIR = path.join(process.cwd(), 'static', 'images', 'Desktops & Laptops');

interface ProductMapping {
  productName: string;
  searchTerms: string[];
  brand: string;
}

const batch2Products: ProductMapping[] = [
  { productName: 'Apple iMac 24" M3 (16GB)', searchTerms: ['imac', '24', 'm3', '16gb'], brand: 'Apple' },
  { productName: 'Mac Mini M2', searchTerms: ['mac', 'mini', 'm2'], brand: 'Apple' },
  { productName: 'Mac Mini M2 Pro', searchTerms: ['mac', 'mini', 'm2', 'pro'], brand: 'Apple' },
  { productName: 'Mac Pro M2 Ultra', searchTerms: ['mac', 'pro', 'm2', 'ultra'], brand: 'Apple' },
  { productName: 'Mac Studio M2 Max', searchTerms: ['mac', 'studio', 'm2', 'max'], brand: 'Apple' },
  { productName: 'Mac Studio M2 Ultra', searchTerms: ['mac', 'studio', 'm2', 'ultra'], brand: 'Apple' },
  { productName: 'MacBook Air 13" M3', searchTerms: ['macbook', 'air', '13', 'm3'], brand: 'Apple' },
  { productName: 'MacBook Air 15"', searchTerms: ['macbook', 'air', '15'], brand: 'Apple' },
  { productName: 'MacBook Air 15" M2', searchTerms: ['macbook', 'air', '15', 'm2'], brand: 'Apple' },
  { productName: 'MacBook Air 15" M3', searchTerms: ['macbook', 'air', '15', 'm3'], brand: 'Apple' },
  { productName: 'Apple MacBook Pro 13" M2', searchTerms: ['macbook', 'pro', '13', 'm2'], brand: 'Apple' },
  { productName: 'MacBook Pro 14" M3', searchTerms: ['macbook', 'pro', '14', 'm3'], brand: 'Apple' },
  { productName: 'MacBook Pro 14" M3 Max', searchTerms: ['macbook', 'pro', '14', 'm3', 'max'], brand: 'Apple' },
  { productName: 'MacBook Pro 16"', searchTerms: ['macbook', 'pro', '16'], brand: 'Apple' },
  { productName: 'ASUS Chromebook Plus CX34', searchTerms: ['chromebook', 'cx34'], brand: 'ASUS' },
  { productName: 'ASUS ExpertBook B9', searchTerms: ['expertbook', 'b9'], brand: 'ASUS' },
  { productName: 'ASUS NUC 13 Pro', searchTerms: ['nuc', '13', 'pro'], brand: 'ASUS' },
  { productName: 'ASUS ProArt Station PD5', searchTerms: ['proart', 'station', 'pd5'], brand: 'ASUS' },
  { productName: 'ASUS ProArt Studiobook 16', searchTerms: ['proart', 'studiobook', '16'], brand: 'ASUS' },
];

async function findExistingImages(brand: string): Promise<Map<string, string[]>> {
  const imageMap = new Map<string, string[]>();
  const brandDir = path.join(STATIC_DIR, brand);
  
  if (!fs.existsSync(brandDir)) {
    console.log(`  No directory found for ${brand}`);
    return imageMap;
  }
  
  const files = fs.readdirSync(brandDir);
  const imageFiles = files.filter(f => 
    (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')) &&
    !f.includes('_thumb') && !f.includes('_800')
  );
  
  for (const file of imageFiles) {
    const relativePath = `/static/images/Desktops & Laptops/${brand}/${file}`;
    const baseName = file.replace(/\.(jpg|png|webp)$/, '').toLowerCase();
    
    if (!imageMap.has(baseName)) {
      imageMap.set(baseName, []);
    }
    imageMap.get(baseName)!.push(relativePath);
  }
  
  return imageMap;
}

async function findProductInDb(productName: string): Promise<{ id: string; name: string } | null> {
  const desktopsCategory = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, 'Desktops & Laptops'))
    .limit(1);
  
  if (!desktopsCategory.length) return null;
  const categoryId = desktopsCategory[0].id;
  
  // Try exact match first
  let result = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(and(
      eq(products.categoryId, categoryId),
      ilike(products.name, productName)
    ))
    .limit(1);
  
  if (result.length) return result[0];
  
  // Try partial match
  const cleanName = productName.replace(/['"]/g, '').replace(/Apple\s+/i, '');
  result = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(and(
      eq(products.categoryId, categoryId),
      ilike(products.name, `%${cleanName}%`)
    ))
    .limit(1);
  
  if (result.length) return result[0];
  
  // Try key terms
  const terms = cleanName.split(/\s+/).filter(t => t.length > 2);
  for (const term of terms) {
    if (['air', 'pro', 'max', 'ultra', 'mini', 'studio'].includes(term.toLowerCase())) continue;
    
    result = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(and(
        eq(products.categoryId, categoryId),
        ilike(products.name, `%${term}%`)
      ))
      .limit(5);
    
    const match = result.find(p => {
      const pLower = p.name.toLowerCase();
      const searchLower = cleanName.toLowerCase();
      return pLower.includes(searchLower) || searchLower.includes(pLower);
    });
    
    if (match) return match;
  }
  
  return null;
}

function matchImagesToProduct(productName: string, imageMap: Map<string, string[]>): string[] {
  const nameLower = productName.toLowerCase();
  const matchedImages: string[] = [];
  
  for (const [baseName, images] of imageMap.entries()) {
    // Check if image name relates to product
    const baseNameLower = baseName.toLowerCase();
    
    // MacBook Air matches
    if (nameLower.includes('macbook air') && baseNameLower.includes('macbook_air')) {
      if (nameLower.includes('13') && baseNameLower.includes('13')) {
        matchedImages.push(...images);
      } else if (nameLower.includes('15') && baseNameLower.includes('15')) {
        if (nameLower.includes('m2') && baseNameLower.includes('m2')) {
          matchedImages.push(...images);
        } else if (nameLower.includes('m3') && baseNameLower.includes('m3')) {
          matchedImages.push(...images);
        } else if (!nameLower.includes('m2') && !nameLower.includes('m3') && !baseNameLower.includes('m2') && !baseNameLower.includes('m3')) {
          matchedImages.push(...images);
        }
      }
    }
    
    // Mac Mini matches
    if (nameLower.includes('mac mini') && baseNameLower.includes('mac_mini')) {
      matchedImages.push(...images);
    }
    
    // Mac Studio matches
    if (nameLower.includes('mac studio') && baseNameLower.includes('mac_studio')) {
      matchedImages.push(...images);
    }
    
    // Mac Pro matches  
    if (nameLower.includes('mac pro') && !nameLower.includes('macbook') && baseNameLower.includes('mac_pro')) {
      matchedImages.push(...images);
    }
    
    // iMac matches
    if (nameLower.includes('imac') && baseNameLower.includes('imac')) {
      matchedImages.push(...images);
    }
  }
  
  return [...new Set(matchedImages)].slice(0, 5);
}

async function assignExistingImages(): Promise<void> {
  console.log('=== Assign Existing Images to Products ===\n');
  
  // Load existing images by brand
  const appleImages = await findExistingImages('Apple');
  const asusImages = await findExistingImages('ASUS');
  
  console.log(`Found ${appleImages.size} Apple image sets`);
  console.log(`Found ${asusImages.size} ASUS image sets\n`);
  
  let updated = 0;
  let notFound = 0;
  let noImages = 0;
  
  for (const mapping of batch2Products) {
    console.log(`\nProcessing: ${mapping.productName}`);
    
    const dbProduct = await findProductInDb(mapping.productName);
    
    if (!dbProduct) {
      console.log(`  [NOT FOUND] No matching product in database`);
      notFound++;
      continue;
    }
    
    console.log(`  [MATCHED] ${dbProduct.name}`);
    
    const imageMap = mapping.brand === 'Apple' ? appleImages : asusImages;
    const images = matchImagesToProduct(mapping.productName, imageMap);
    
    if (images.length > 0) {
      await db
        .update(products)
        .set({
          imageUrl: images[0],
          galleryImageUrls: images,
          imageSource: 'manufacturer',
          updatedAt: new Date(),
        })
        .where(eq(products.id, dbProduct.id));
      
      console.log(`  [UPDATED] Assigned ${images.length} images`);
      updated++;
    } else {
      console.log(`  [NO IMAGES] No matching images found`);
      noImages++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Updated: ${updated}`);
  console.log(`Not found in DB: ${notFound}`);
  console.log(`No matching images: ${noImages}`);
}

assignExistingImages()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
