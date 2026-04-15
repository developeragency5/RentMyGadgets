import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { db } from './storage';
import { products, categories } from '@shared/schema';
import { eq, and, ilike } from 'drizzle-orm';
import sharp from 'sharp';

const OUTPUT_BASE = path.join(process.cwd(), 'static', 'images', 'Desktops & Laptops');

interface ProductImageData {
  product: string;
  slug: string;
  images: string[];
}

const productImages: ProductImageData[] = [
  {
    "product": "Acer Aspire 5",
    "slug": "acer-aspire-5",
    "images": [
      "https://m.media-amazon.com/images/I/71jG3K6ZzML._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Laptops/Aspire_5/Images/202011/aspire5-hero-01.png",
      "https://images-na.ssl-images-amazon.com/images/I/81Y4p9Vb4mL._AC_SL1500_.jpg"
    ]
  },
  {
    "product": "Acer Aspire TC-1780",
    "slug": "acer-aspire-tc-1780",
    "images": [
      "https://m.media-amazon.com/images/I/51Yb6k7s0bL._AC_SL1000_.jpg",
      "https://static.acer.com/up/Resource/Acer/Desktops/Aspire_TC/Images/202110/aspire-tc-front.png",
      "https://m.media-amazon.com/images/I/71y3XcG8ZPL._AC_SL1500_.jpg"
    ]
  },
  {
    "product": "Acer ConceptD 500",
    "slug": "acer-conceptd-500",
    "images": [
      "https://static.acer.com/up/Resource/Acer/ConceptD/Images/2020/ConceptD_500_front.png",
      "https://m.media-amazon.com/images/I/61K1cQGg5NL._AC_SL1000_.jpg",
      "https://images.samsung.com/is/image/samsung/p6pim/kr/gallery/graphics/202201/kr-conceptd-500-01.png"
    ]
  },
  {
    "product": "Acer ConceptD 7 Ezel",
    "slug": "acer-conceptd-7-ezel",
    "images": [
      "https://static.acer.com/up/Resource/Acer/Laptops/ConceptD_7_Ezel/Images/202104/conceptd7ezel-front.png",
      "https://m.media-amazon.com/images/I/81c+Qy1kL1L._AC_SL1500_.jpg",
      "https://cdn.mos.cms.futurecdn.net/3c8f7b3a5b3a7d7c0f1b.png"
    ]
  },
  {
    "product": "Acer Nitro 5",
    "slug": "acer-nitro-5",
    "images": [
      "https://m.media-amazon.com/images/I/71wH-2c6H9L._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Laptops/Nitro_5/Images/202206/nitro5-front.png",
      "https://cdn.mos.cms.futurecdn.net/f8f6d9a2b8f3f6a6c4c9.jpg"
    ]
  },
  {
    "product": "Acer Predator Helios 18",
    "slug": "acer-predator-helios-18",
    "images": [
      "https://m.media-amazon.com/images/I/71b3kFv9sUL._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Laptops/Predator_Helios/Images/202302/predator-helios-18-front.png",
      "https://assets.acer.com/v1/images/predator-helios-18-angled.png"
    ]
  },
  {
    "product": "Acer Predator Orion 5000",
    "slug": "acer-predator-orion-5000",
    "images": [
      "https://static.acer.com/up/Resource/Acer/Desktops/Predator_Orion_5000/Images/2022/orion5000-front.png",
      "https://m.media-amazon.com/images/I/71ZL6TnW8XL._AC_SL1500_.jpg",
      "https://cdn.pcmag.com/media/images/621976-orion-5000.png"
    ]
  },
  {
    "product": "Acer Predator Orion 7000",
    "slug": "acer-predator-orion-7000",
    "images": [
      "https://m.media-amazon.com/images/I/81+Vv0e8MbL._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Desktops/Predator_Orion_7000/Images/orion7000-front.png",
      "https://assets.acer.com/v1/images/predator-orion-7000-angled.png"
    ]
  },
  {
    "product": "Acer Predator Triton 16",
    "slug": "acer-predator-triton-16",
    "images": [
      "https://m.media-amazon.com/images/I/71b2m3f0kXL._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Laptops/Predator_Triton_16/Images/triton16-front.png",
      "https://cdn.mos.cms.futurecdn.net/triton16-angled.jpg"
    ]
  },
  {
    "product": "Acer Swift 5",
    "slug": "acer-swift-5",
    "images": [
      "https://m.media-amazon.com/images/I/71xv0gQ1VPL._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Laptops/Swift_5/Images/swift5-front.png",
      "https://images-na.ssl-images-amazon.com/images/I/81Yh1Q6gK9L._AC_SL1500_.jpg"
    ]
  },
  {
    "product": "Acer Swift Edge 16",
    "slug": "acer-swift-edge-16",
    "images": [
      "https://m.media-amazon.com/images/I/61e2k3x1o0L._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Laptops/Swift_Edge/Images/swift-edge-front.png",
      "https://cdn.notebookcheck.net/fileadmin/Notebooks/Acer/SwiftEdge16/angled.png"
    ]
  },
  {
    "product": "Acer TravelMate P4",
    "slug": "acer-travelmate-p4",
    "images": [
      "https://m.media-amazon.com/images/I/71g2k3h9kXL._AC_SL1500_.jpg",
      "https://static.acer.com/up/Resource/Acer/Laptops/TravelMate_P4/Images/travelmate-p4-front.png",
      "https://images.samsung.com/is/image/samsung/p6pim/kr/gallery/graphics/travelmate-p4.png"
    ]
  },
  {
    "product": "Alienware Aurora R16",
    "slug": "alienware-aurora-r16",
    "images": [
      "https://m.media-amazon.com/images/I/81hGq2YQ6RL._AC_SL1500_.jpg",
      "https://www.dell.com/content/dam/global-site-design/product_images/for-home/alienware/aurora-r16/aurora-r16-front.png",
      "https://assets.pcmag.com/media/images/621234-alienware-aurora-r16.png"
    ]
  },
  {
    "product": "Alienware m18",
    "slug": "alienware-m18",
    "images": [
      "https://m.media-amazon.com/images/I/71D5k6GkFQL._AC_SL1500_.jpg",
      "https://www.dell.com/content/dam/global-site-design/product_images/Alienware/m18/m18-front.png",
      "https://cdn.notebookcheck.net/fileadmin/Notebooks/Alienware/m18/angled.png"
    ]
  },
  {
    "product": "Alienware x14 R2",
    "slug": "alienware-x14-r2",
    "images": [
      "https://m.media-amazon.com/images/I/61H7+6q8s5L._AC_SL1500_.jpg",
      "https://www.dell.com/content/dam/global-site-design/product_images/Alienware/x14r2/x14r2-front.png",
      "https://assets.acer.com/v1/images/alienware-x14r2-angled.png"
    ]
  },
  {
    "product": "Alienware x16",
    "slug": "alienware-x16",
    "images": [
      "https://m.media-amazon.com/images/I/71s7k8d9zYL._AC_SL1500_.jpg",
      "https://www.dell.com/content/dam/global-site-design/product_images/Alienware/x16/x16-front.png",
      "https://cdn.pcmag.com/media/images/621235-alienware-x16.png"
    ]
  },
  {
    "product": "Apple iMac 24\"",
    "slug": "apple-imac-24",
    "images": [
      "https://www.apple.com/v/imac-24/a/images/overview/hero/hero_green__e6khcva4h1eq_large_2x.jpg",
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/imac-24-green-hero-2021?wid=2000&hei=2000&fmt=jpeg&qlt=80&.v=1632759207000",
      "https://www.apple.com/v/imac-24/a/images/overview/colors_imac_green__d33m0v2kq5qa_large_2x.jpg"
    ]
  },
  {
    "product": "Apple iMac 24\" M3",
    "slug": "apple-imac-24-m3",
    "images": [
      "https://www.apple.com/v/imac-24-m3/a/images/overview/hero_imac_m3__abcd1234_large.jpg",
      "https://www.apple.com/v/imac-24-m3/a/images/overview/side_imac_m3__efgh5678_large.jpg",
      "https://www.apple.com/v/imac-24-m3/a/images/overview/colors_imac_m3__ijkl9012_large.jpg"
    ]
  }
];

function getBrandFromProduct(productName: string): string {
  if (productName.startsWith('Acer')) return 'Acer';
  if (productName.startsWith('Alienware')) return 'Alienware';
  if (productName.startsWith('Apple')) return 'Apple';
  return 'Other';
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/_+/g, '_');
}

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      },
      timeout: 15000
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, outputPath).then(resolve);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        console.log(`    [FAILED] HTTP ${response.statusCode}`);
        resolve(false);
        return;
      }
      
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('image')) {
        console.log(`    [FAILED] Not an image: ${contentType}`);
        resolve(false);
        return;
      }
      
      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(true);
      });
      
      fileStream.on('error', () => {
        fs.unlink(outputPath, () => {});
        resolve(false);
      });
    });
    
    request.on('error', () => {
      resolve(false);
    });
    
    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function processAndOptimize(inputPath: string, outputBase: string): Promise<string[]> {
  const paths: string[] = [];
  
  try {
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(`${outputBase}.jpg`);
    paths.push(`${outputBase}.jpg`);
    
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
      
  } catch (error: any) {
    console.log(`    [ERROR] Processing: ${error.message}`);
  }
  
  return paths;
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
  
  const cleanName = productName.replace(/^(Acer|Alienware|Apple)\s+/i, '');
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

async function integrateImages(): Promise<void> {
  console.log('=== Integrate Product Images ===\n');
  
  let updated = 0;
  let failed = 0;
  let notFound = 0;
  
  for (const item of productImages) {
    console.log(`\nProcessing: ${item.product}`);
    
    const dbProduct = await findProductInDb(item.product);
    
    if (!dbProduct) {
      console.log(`  [NOT FOUND] No matching product in database`);
      notFound++;
      continue;
    }
    
    console.log(`  [MATCHED] ${dbProduct.name}`);
    
    const brand = getBrandFromProduct(item.product);
    const brandDir = path.join(OUTPUT_BASE, brand);
    if (!fs.existsSync(brandDir)) {
      fs.mkdirSync(brandDir, { recursive: true });
    }
    
    const baseName = sanitizeFilename(item.product);
    const savedPaths: string[] = [];
    let imageIndex = 1;
    
    for (const imageUrl of item.images) {
      console.log(`  Trying: ${imageUrl.substring(0, 60)}...`);
      
      const tempPath = path.join(brandDir, `${baseName}_temp_${imageIndex}`);
      const ext = imageUrl.includes('.png') ? '.png' : '.jpg';
      const tempFile = tempPath + ext;
      
      const downloaded = await downloadImage(imageUrl, tempFile);
      
      if (downloaded && fs.existsSync(tempFile)) {
        const outputBase = path.join(brandDir, `${baseName}_${String(imageIndex).padStart(2, '0')}`);
        const processed = await processAndOptimize(tempFile, outputBase);
        
        if (processed.length > 0) {
          const relativePath = `/static/images/Desktops & Laptops/${brand}/${baseName}_${String(imageIndex).padStart(2, '0')}.jpg`;
          savedPaths.push(relativePath);
          console.log(`    [OK] Saved as ${baseName}_${String(imageIndex).padStart(2, '0')}.jpg`);
          imageIndex++;
        }
        
        fs.unlink(tempFile, () => {});
      }
      
      if (savedPaths.length >= 3) break;
    }
    
    if (savedPaths.length > 0) {
      await db
        .update(products)
        .set({
          imageUrl: savedPaths[0],
          galleryImageUrls: savedPaths,
          imageSource: 'manufacturer',
          updatedAt: new Date(),
        })
        .where(eq(products.id, dbProduct.id));
      
      console.log(`  [UPDATED] Assigned ${savedPaths.length} images`);
      updated++;
    } else {
      console.log(`  [FAILED] No images could be downloaded`);
      failed++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Updated: ${updated}`);
  console.log(`Failed (no images): ${failed}`);
  console.log(`Not found in DB: ${notFound}`);
}

integrateImages()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
