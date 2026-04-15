import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface ImageSize {
  name: string;
  width: number;
  height: number;
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface ProcessedImage {
  size: string;
  path: string;
  width: number;
  height: number;
  format: string;
  fileSize: number;
}

export interface ImageProcessingResult {
  success: boolean;
  originalUrl: string;
  productId: string;
  images: ProcessedImage[];
  error?: string;
  processingTimeMs: number;
}

const IMAGE_SIZES: ImageSize[] = [
  { name: 'hero', width: 1200, height: 1200, fit: 'contain' },
  { name: 'card', width: 600, height: 600, fit: 'contain' },
  { name: 'thumb', width: 200, height: 200, fit: 'cover' },
  { name: 'og', width: 1200, height: 630, fit: 'cover' }
];

const IMAGES_BASE_DIR = path.join(process.cwd(), 'attached_assets', 'product_images');
const WEBP_QUALITY = 85;
const JPEG_QUALITY = 90;
const MAX_DOWNLOAD_SIZE = 20 * 1024 * 1024; // 20MB max download
const DOWNLOAD_TIMEOUT = 30000; // 30 seconds

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateImageFilename(productId: string, sizeName: string, format: string): string {
  const hash = crypto.createHash('md5').update(productId).digest('hex').substring(0, 8);
  return `${productId.substring(0, 8)}_${hash}_${sizeName}.${format}`;
}

export async function downloadImage(url: string): Promise<Buffer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/avif,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': new URL(url).origin
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    // Check Content-Length header if available (early rejection)
    const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_DOWNLOAD_SIZE) {
      throw new Error(`Image too large: ${contentLength} bytes`);
    }

    // Stream with size enforcement regardless of Content-Length header
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      totalBytes += value.length;
      if (totalBytes > MAX_DOWNLOAD_SIZE) {
        reader.cancel();
        throw new Error(`Image exceeded max size during download: ${totalBytes} bytes`);
      }
      
      chunks.push(value);
    }
    
    // Combine chunks into single buffer
    const combined = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    
    return Buffer.from(combined);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getImageMetadata(imageBuffer: Buffer): Promise<{
  width: number;
  height: number;
  format: string;
  channels: number;
  hasAlpha: boolean;
}> {
  const metadata = await sharp(imageBuffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    channels: metadata.channels || 3,
    hasAlpha: metadata.hasAlpha || false
  };
}

export async function processImage(
  imageBuffer: Buffer,
  size: ImageSize,
  productId: string,
  outputFormat: 'webp' | 'jpeg' = 'webp'
): Promise<ProcessedImage> {
  const productDir = path.join(IMAGES_BASE_DIR, productId);
  ensureDirectoryExists(productDir);

  const filename = generateImageFilename(productId, size.name, outputFormat);
  const outputPath = path.join(productDir, filename);

  let pipeline = sharp(imageBuffer)
    .resize(size.width, size.height, {
      fit: size.fit,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: true
    });

  if (outputFormat === 'webp') {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY, effort: 4 });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const outputInfo = await pipeline.toFile(outputPath);

  return {
    size: size.name,
    path: `/api/product-images/${productId}/${filename}`,
    width: outputInfo.width,
    height: outputInfo.height,
    format: outputFormat,
    fileSize: outputInfo.size
  };
}

export async function processProductImage(
  imageUrl: string,
  productId: string,
  options: {
    sizes?: ImageSize[];
    format?: 'webp' | 'jpeg';
    generateFallback?: boolean;
  } = {}
): Promise<ImageProcessingResult> {
  const startTime = Date.now();
  const sizes = options.sizes || IMAGE_SIZES;
  const format = options.format || 'webp';
  const generateFallback = options.generateFallback ?? true;

  try {
    const imageBuffer = await downloadImage(imageUrl);
    const metadata = await getImageMetadata(imageBuffer);

    console.log(`[image-processor] Downloaded image: ${metadata.width}x${metadata.height} ${metadata.format}`);

    const processedImages: ProcessedImage[] = [];

    for (const size of sizes) {
      try {
        const processed = await processImage(imageBuffer, size, productId, format);
        processedImages.push(processed);

        if (generateFallback && format === 'webp') {
          const fallback = await processImage(imageBuffer, size, productId, 'jpeg');
          processedImages.push(fallback);
        }
      } catch (sizeError: any) {
        console.error(`[image-processor] Error processing size ${size.name}:`, sizeError.message);
      }
    }

    return {
      success: processedImages.length > 0,
      originalUrl: imageUrl,
      productId,
      images: processedImages,
      processingTimeMs: Date.now() - startTime
    };
  } catch (error: any) {
    return {
      success: false,
      originalUrl: imageUrl,
      productId,
      images: [],
      error: error.message,
      processingTimeMs: Date.now() - startTime
    };
  }
}

export async function processProductImageBatch(
  items: Array<{ imageUrl: string; productId: string }>,
  concurrency: number = 3
): Promise<ImageProcessingResult[]> {
  const results: ImageProcessingResult[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(item => processProductImage(item.imageUrl, item.productId))
    );
    results.push(...batchResults);

    if (i + concurrency < items.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

export function getProductImagePath(productId: string, sizeName: string, format: 'webp' | 'jpeg' = 'webp'): string | null {
  const productDir = path.join(IMAGES_BASE_DIR, productId);
  const filename = generateImageFilename(productId, sizeName, format);
  const fullPath = path.join(productDir, filename);

  if (fs.existsSync(fullPath)) {
    return fullPath;
  }

  if (format === 'webp') {
    const jpegFilename = generateImageFilename(productId, sizeName, 'jpeg');
    const jpegPath = path.join(productDir, jpegFilename);
    if (fs.existsSync(jpegPath)) {
      return jpegPath;
    }
  }

  return null;
}

export function getProductImageUrl(productId: string, sizeName: string, format: 'webp' | 'jpeg' = 'webp'): string {
  const filename = generateImageFilename(productId, sizeName, format);
  return `/api/product-images/${productId}/${filename}`;
}

export async function deleteProductImages(productId: string): Promise<boolean> {
  const productDir = path.join(IMAGES_BASE_DIR, productId);

  try {
    if (fs.existsSync(productDir)) {
      fs.rmSync(productDir, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`[image-processor] Error deleting images for ${productId}:`, error);
    return false;
  }
}

export async function generatePlaceholderImage(
  productId: string,
  text: string = 'No Image',
  backgroundColor: string = '#f5f5f5'
): Promise<ProcessedImage[]> {
  const productDir = path.join(IMAGES_BASE_DIR, productId);
  ensureDirectoryExists(productDir);

  const processedImages: ProcessedImage[] = [];

  for (const size of IMAGE_SIZES) {
    const svgContent = `
      <svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="${Math.floor(size.width / 10)}px" 
          fill="#999999" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >${text}</text>
      </svg>
    `;

    const filename = generateImageFilename(productId, size.name, 'webp');
    const outputPath = path.join(productDir, filename);

    const outputInfo = await sharp(Buffer.from(svgContent))
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    processedImages.push({
      size: size.name,
      path: `/api/product-images/${productId}/${filename}`,
      width: outputInfo.width,
      height: outputInfo.height,
      format: 'webp',
      fileSize: outputInfo.size
    });
  }

  return processedImages;
}

export function getImageStats(): {
  totalProducts: number;
  totalImages: number;
  totalSizeBytes: number;
  bySize: Record<string, number>;
} {
  const stats = {
    totalProducts: 0,
    totalImages: 0,
    totalSizeBytes: 0,
    bySize: {} as Record<string, number>
  };

  if (!fs.existsSync(IMAGES_BASE_DIR)) {
    return stats;
  }

  const productDirs = fs.readdirSync(IMAGES_BASE_DIR);
  stats.totalProducts = productDirs.length;

  for (const productDir of productDirs) {
    const productPath = path.join(IMAGES_BASE_DIR, productDir);
    const stat = fs.statSync(productPath);

    if (stat.isDirectory()) {
      const files = fs.readdirSync(productPath);
      for (const file of files) {
        const filePath = path.join(productPath, file);
        const fileStat = fs.statSync(filePath);
        stats.totalImages++;
        stats.totalSizeBytes += fileStat.size;

        const sizeName = file.split('_').slice(-1)[0].split('.')[0];
        stats.bySize[sizeName] = (stats.bySize[sizeName] || 0) + 1;
      }
    }
  }

  return stats;
}

export { IMAGE_SIZES, IMAGES_BASE_DIR };
