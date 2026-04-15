import { GoogleGenAI, Modality } from "@google/genai";
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import pLimit from 'p-limit';
import pRetry, { AbortError } from 'p-retry';
import { ImageDescriptor, buildGenerationPrompt, AnalyzedAsset } from './reference-analyzer';

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export interface ProductImageInput {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  originalImageUrl?: string;
  originalImageBuffer?: Buffer;
}

export interface GeneratedAngle {
  angle: string;
  description: string;
  imagePath: string;
  imageUrl: string;
  width: number;
  height: number;
  fileSize: number;
}

export interface MultiAngleResult {
  success: boolean;
  productId: string;
  productName: string;
  angles: GeneratedAngle[];
  errors: string[];
  totalGenerationTimeMs: number;
}

const ANGLE_PROMPTS = [
  {
    angle: 'front',
    prompt: (product: ProductImageInput) => 
      `Create a photorealistic product photography image of the ${product.brand} ${product.productName}. 
      Show the FRONT VIEW of the product.
      Requirements:
      - Professional studio lighting with soft shadows
      - Pure white background (#FFFFFF)
      - Product centered in frame
      - Sharp focus, high detail
      - Accurate representation of the actual ${product.brand} ${product.productName} - colors, materials, branding must match reality
      - Commercial product photography style
      - No text overlays or watermarks
      - 8K quality, photorealistic`
  },
  {
    angle: 'side-left',
    prompt: (product: ProductImageInput) =>
      `Create a photorealistic product photography image of the ${product.brand} ${product.productName}.
      Show the LEFT SIDE PROFILE VIEW (45-degree angle from left).
      Requirements:
      - Professional studio lighting with soft shadows
      - Pure white background (#FFFFFF)
      - Product angled to show left side details
      - Sharp focus, high detail
      - Accurate representation of the actual ${product.brand} ${product.productName} - ports, buttons, vents visible
      - Commercial product photography style
      - No text overlays or watermarks
      - 8K quality, photorealistic`
  },
  {
    angle: 'side-right',
    prompt: (product: ProductImageInput) =>
      `Create a photorealistic product photography image of the ${product.brand} ${product.productName}.
      Show the RIGHT SIDE PROFILE VIEW (45-degree angle from right).
      Requirements:
      - Professional studio lighting with soft shadows
      - Pure white background (#FFFFFF)
      - Product angled to show right side details
      - Sharp focus, high detail
      - Accurate representation of the actual ${product.brand} ${product.productName} - ports, buttons, vents visible
      - Commercial product photography style
      - No text overlays or watermarks
      - 8K quality, photorealistic`
  },
  {
    angle: 'top',
    prompt: (product: ProductImageInput) =>
      `Create a photorealistic product photography image of the ${product.brand} ${product.productName}.
      Show the TOP-DOWN VIEW (bird's eye view looking straight down).
      Requirements:
      - Professional studio lighting with even illumination
      - Pure white background (#FFFFFF)
      - Product viewed from directly above
      - Sharp focus showing surface details, keyboard layout (if laptop), controls
      - Accurate representation of the actual ${product.brand} ${product.productName}
      - Commercial product photography style
      - No text overlays or watermarks
      - 8K quality, photorealistic`
  },
  {
    angle: 'three-quarter',
    prompt: (product: ProductImageInput) =>
      `Create a photorealistic product photography image of the ${product.brand} ${product.productName}.
      Show a THREE-QUARTER HERO VIEW (45-degree angle showing front and one side).
      Requirements:
      - Professional studio lighting with dramatic but natural shadows
      - Pure white background (#FFFFFF)
      - Classic product hero shot angle
      - Sharp focus, high detail on branding and key features
      - Accurate representation of the actual ${product.brand} ${product.productName}
      - Premium commercial product photography style
      - No text overlays or watermarks
      - 8K quality, photorealistic`
  },
  {
    angle: 'detail',
    prompt: (product: ProductImageInput) =>
      `Create a photorealistic CLOSE-UP DETAIL image of the ${product.brand} ${product.productName}.
      Focus on a KEY FEATURE or distinctive element of the product.
      Requirements:
      - Macro photography style with shallow depth of field
      - Professional studio lighting
      - Pure white or slightly gray gradient background
      - Extreme detail showing texture, materials, finish quality
      - For laptops: keyboard, trackpad, or hinge detail
      - For cameras: lens mount, controls, or display
      - For headphones: ear cushion, drivers, or controls
      - Accurate representation of the actual ${product.brand} ${product.productName}
      - Commercial product photography style
      - No text overlays or watermarks
      - 8K quality, photorealistic`
  }
];

const IMAGES_BASE_DIR = path.join(process.cwd(), 'attached_assets', 'product_images');
const AI_IMAGES_DIR = path.join(IMAGES_BASE_DIR, 'ai_generated');

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

async function generateSingleAngle(
  product: ProductImageInput,
  angleConfig: typeof ANGLE_PROMPTS[0],
  referenceImageBase64?: string
): Promise<{ angle: string; imageData: string; mimeType: string } | null> {
  const prompt = angleConfig.prompt(product);
  
  const contents: any[] = [];
  
  if (referenceImageBase64) {
    contents.push({
      role: "user",
      parts: [
        { 
          text: `Reference image of the ${product.brand} ${product.productName} for accurate reproduction. Generate a new image matching this product exactly but from a different angle.\n\n${prompt}` 
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: referenceImageBase64
          }
        }
      ]
    });
  } else {
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const candidate = response.candidates?.[0];
  const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);
  
  if (!imagePart?.inlineData?.data) {
    return null;
  }

  return {
    angle: angleConfig.angle,
    imageData: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || "image/png"
  };
}

async function saveGeneratedImage(
  productId: string,
  angle: string,
  imageData: string,
  mimeType: string
): Promise<GeneratedAngle> {
  const productDir = path.join(AI_IMAGES_DIR, productId);
  ensureDirectoryExists(productDir);

  const imageBuffer = Buffer.from(imageData, 'base64');
  
  const hash = crypto.createHash('md5').update(productId + angle).digest('hex').substring(0, 8);
  const filename = `${productId.substring(0, 8)}_${hash}_${angle}.webp`;
  const outputPath = path.join(productDir, filename);

  const outputInfo = await sharp(imageBuffer)
    .resize(1200, 1200, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: true
    })
    .webp({ quality: 90 })
    .toFile(outputPath);

  return {
    angle,
    description: `${angle} view`,
    imagePath: outputPath,
    imageUrl: `/api/product-images/ai/${productId}/${filename}`,
    width: outputInfo.width,
    height: outputInfo.height,
    fileSize: outputInfo.size
  };
}

export async function generateMultiAngleImages(
  product: ProductImageInput,
  options: {
    angles?: string[];
    includeReference?: boolean;
    concurrency?: number;
  } = {}
): Promise<MultiAngleResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const generatedAngles: GeneratedAngle[] = [];
  
  const requestedAngles = options.angles || ['front', 'side-left', 'side-right', 'top', 'three-quarter', 'detail'];
  const concurrency = options.concurrency || 2;
  
  let referenceImageBase64: string | undefined;
  
  if (options.includeReference !== false) {
    if (product.originalImageBuffer) {
      referenceImageBase64 = product.originalImageBuffer.toString('base64');
    } else if (product.originalImageUrl) {
      try {
        const response = await fetch(product.originalImageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          const resized = await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
          referenceImageBase64 = resized.toString('base64');
        }
      } catch (e: any) {
        console.log(`[ai-image-generator] Could not fetch reference image: ${e.message}`);
      }
    }
  }
  
  const angleConfigs = ANGLE_PROMPTS.filter(a => requestedAngles.includes(a.angle));
  
  const limit = pLimit(concurrency);
  
  const generationPromises = angleConfigs.map(angleConfig =>
    limit(() =>
      pRetry(
        async () => {
          console.log(`[ai-image-generator] Generating ${angleConfig.angle} view for ${product.productName}...`);
          
          const result = await generateSingleAngle(product, angleConfig, referenceImageBase64);
          
          if (!result) {
            throw new Error(`No image generated for ${angleConfig.angle}`);
          }
          
          const saved = await saveGeneratedImage(
            product.productId,
            result.angle,
            result.imageData,
            result.mimeType
          );
          
          console.log(`[ai-image-generator] Generated ${angleConfig.angle}: ${saved.imageUrl}`);
          
          return saved;
        },
        {
          retries: 3,
          minTimeout: 2000,
          maxTimeout: 30000,
          factor: 2,
          onFailedAttempt: (error: any) => {
            if (!isRateLimitError(error)) {
              throw new AbortError(error.message || 'Non-rate-limit error');
            }
            console.log(`[ai-image-generator] Rate limited, retrying ${angleConfig.angle}...`);
          }
        }
      ).catch((error: any) => {
        errors.push(`${angleConfig.angle}: ${error.message}`);
        return null;
      })
    )
  );
  
  const results = await Promise.all(generationPromises);
  
  for (const result of results) {
    if (result) {
      generatedAngles.push(result);
    }
  }
  
  return {
    success: generatedAngles.length > 0,
    productId: product.productId,
    productName: product.productName,
    angles: generatedAngles,
    errors,
    totalGenerationTimeMs: Date.now() - startTime
  };
}

export async function generateProductAnglesFromUrl(
  productId: string,
  productName: string,
  brand: string,
  category: string,
  imageUrl: string,
  angles?: string[]
): Promise<MultiAngleResult> {
  return generateMultiAngleImages({
    productId,
    productName,
    brand,
    category,
    originalImageUrl: imageUrl
  }, { angles });
}

export async function generateProductAnglesFromBuffer(
  productId: string,
  productName: string,
  brand: string,
  category: string,
  imageBuffer: Buffer,
  angles?: string[]
): Promise<MultiAngleResult> {
  return generateMultiAngleImages({
    productId,
    productName,
    brand,
    category,
    originalImageBuffer: imageBuffer
  }, { angles });
}

export function getAIGeneratedImagePath(productId: string, angle: string): string | null {
  const productDir = path.join(AI_IMAGES_DIR, productId);
  
  if (!fs.existsSync(productDir)) {
    return null;
  }
  
  const files = fs.readdirSync(productDir);
  const matchingFile = files.find(f => f.includes(`_${angle}.`));
  
  if (matchingFile) {
    return path.join(productDir, matchingFile);
  }
  
  return null;
}

export function listAIGeneratedImages(productId: string): GeneratedAngle[] {
  const productDir = path.join(AI_IMAGES_DIR, productId);
  
  if (!fs.existsSync(productDir)) {
    return [];
  }
  
  const files = fs.readdirSync(productDir);
  const angles: GeneratedAngle[] = [];
  
  for (const file of files) {
    const match = file.match(/_([a-z-]+)\.(webp|jpg|png)$/);
    if (match) {
      const filePath = path.join(productDir, file);
      const stats = fs.statSync(filePath);
      
      angles.push({
        angle: match[1],
        description: `${match[1]} view`,
        imagePath: filePath,
        imageUrl: `/api/product-images/ai/${productId}/${file}`,
        width: 0,
        height: 0,
        fileSize: stats.size
      });
    }
  }
  
  return angles;
}

export function deleteAIGeneratedImages(productId: string): boolean {
  const productDir = path.join(AI_IMAGES_DIR, productId);
  
  try {
    if (fs.existsSync(productDir)) {
      fs.rmSync(productDir, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`[ai-image-generator] Error deleting AI images for ${productId}:`, error);
    return false;
  }
}

export function getAIImageStats(): {
  totalProducts: number;
  totalImages: number;
  totalSizeBytes: number;
  byAngle: Record<string, number>;
} {
  const stats: {
    totalProducts: number;
    totalImages: number;
    totalSizeBytes: number;
    byAngle: Record<string, number>;
  } = {
    totalProducts: 0,
    totalImages: 0,
    totalSizeBytes: 0,
    byAngle: {}
  };

  if (!fs.existsSync(AI_IMAGES_DIR)) {
    return stats;
  }

  const productDirs = fs.readdirSync(AI_IMAGES_DIR);
  stats.totalProducts = productDirs.length;

  for (const productDir of productDirs) {
    const productPath = path.join(AI_IMAGES_DIR, productDir);
    const dirStat = fs.statSync(productPath);

    if (dirStat.isDirectory()) {
      const files = fs.readdirSync(productPath);
      for (const file of files) {
        const filePath = path.join(productPath, file);
        const fileStat = fs.statSync(filePath);
        stats.totalImages++;
        stats.totalSizeBytes += fileStat.size;

        const match = file.match(/_([a-z-]+)\.(webp|jpg|png)$/);
        if (match) {
          const angle = match[1];
          stats.byAngle[angle] = (stats.byAngle[angle] || 0) + 1;
        }
      }
    }
  }

  return stats;
}

export interface ReferenceGenerationResult {
  success: boolean;
  assetId: string;
  imagePath: string;
  imageUrl: string;
  width: number;
  height: number;
  fileSize: number;
  promptUsed: string;
  durationMs: number;
  error?: string;
}

export async function generateFromReference(
  analyzedAsset: AnalyzedAsset,
  productName: string,
  brand: string,
  index: number
): Promise<ReferenceGenerationResult> {
  const startTime = Date.now();
  
  try {
    const prompt = buildGenerationPrompt(analyzedAsset.descriptor, brand, productName);
    
    console.log(`[ai-image-generator] Generating reference-matched image ${index + 1} for ${productName}`);
    console.log(`[ai-image-generator] Matching: ${analyzedAsset.descriptor.cameraAngle} view, ${analyzedAsset.descriptor.shotPurpose} shot`);

    let referenceImageBase64: string | undefined;
    if (fs.existsSync(analyzedAsset.localPath)) {
      const imageBuffer = fs.readFileSync(analyzedAsset.localPath);
      const resized = await sharp(imageBuffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
      referenceImageBase64 = resized.toString('base64');
    }

    const contents: any[] = [];
    
    if (referenceImageBase64) {
      contents.push({
        role: "user",
        parts: [
          { 
            text: `Use this reference image of the ${brand} ${productName} to create a matching product photo. Replicate the EXACT angle, composition, and lighting style.\n\n${prompt}` 
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: referenceImageBase64
            }
          }
        ]
      });
    } else {
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);
    
    if (!imagePart?.inlineData?.data) {
      throw new Error('No image generated from model');
    }

    const productDir = path.join(AI_IMAGES_DIR, analyzedAsset.productId);
    ensureDirectoryExists(productDir);

    const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    
    const angleStr = analyzedAsset.descriptor.cameraAngle.replace(/[^a-z0-9]/gi, '-');
    const hash = crypto.createHash('md5').update(analyzedAsset.productId + angleStr + index).digest('hex').substring(0, 8);
    const filename = `ref_${index.toString().padStart(2, '0')}_${angleStr}_${hash}.webp`;
    const outputPath = path.join(productDir, filename);

    const outputInfo = await sharp(imageBuffer)
      .resize(1200, 1200, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        withoutEnlargement: true
      })
      .webp({ quality: 90 })
      .toFile(outputPath);

    const durationMs = Date.now() - startTime;
    console.log(`[ai-image-generator] Generated reference-matched image in ${durationMs}ms`);

    return {
      success: true,
      assetId: analyzedAsset.assetId,
      imagePath: outputPath,
      imageUrl: `/api/product-images/ai/${analyzedAsset.productId}/${filename}`,
      width: outputInfo.width,
      height: outputInfo.height,
      fileSize: outputInfo.size,
      promptUsed: prompt,
      durationMs
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[ai-image-generator] Reference generation error:`, error.message);
    
    return {
      success: false,
      assetId: analyzedAsset.assetId,
      imagePath: '',
      imageUrl: '',
      width: 0,
      height: 0,
      fileSize: 0,
      promptUsed: '',
      durationMs,
      error: error.message
    };
  }
}

export async function generateMatchingGallery(
  productId: string,
  productName: string,
  brand: string,
  analyzedAssets: AnalyzedAsset[]
): Promise<{
  success: boolean;
  productId: string;
  productName: string;
  generated: ReferenceGenerationResult[];
  totalImages: number;
  successCount: number;
  failedCount: number;
  totalDurationMs: number;
}> {
  const startTime = Date.now();
  const results: ReferenceGenerationResult[] = [];
  
  console.log(`[ai-image-generator] Generating ${analyzedAssets.length} reference-matched images for ${productName}`);

  for (let i = 0; i < analyzedAssets.length; i++) {
    const asset = analyzedAssets[i];
    
    const result = await pRetry(
      async () => {
        const genResult = await generateFromReference(asset, productName, brand, i);
        if (!genResult.success && genResult.error?.includes('429')) {
          throw new Error(genResult.error);
        }
        return genResult;
      },
      {
        retries: 3,
        minTimeout: 3000,
        maxTimeout: 30000,
        factor: 2,
        onFailedAttempt: (error) => {
          console.log(`[ai-image-generator] Retrying image ${i + 1}...`);
        }
      }
    ).catch((error) => ({
      success: false,
      assetId: asset.assetId,
      imagePath: '',
      imageUrl: '',
      width: 0,
      height: 0,
      fileSize: 0,
      promptUsed: '',
      durationMs: 0,
      error: error.message
    }));

    results.push(result);

    if (i < analyzedAssets.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;

  console.log(`[ai-image-generator] Gallery generation complete: ${successCount}/${analyzedAssets.length} succeeded`);

  return {
    success: successCount > 0,
    productId,
    productName,
    generated: results,
    totalImages: analyzedAssets.length,
    successCount,
    failedCount,
    totalDurationMs: Date.now() - startTime
  };
}

export { AI_IMAGES_DIR, ANGLE_PROMPTS };
