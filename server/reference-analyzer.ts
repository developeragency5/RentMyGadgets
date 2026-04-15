import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import sharp from 'sharp';

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export interface ImageDescriptor {
  cameraAngle: 'front' | 'rear' | 'left' | 'right' | 'top' | 'bottom' | 'three-quarter' | 'detail' | 'lifestyle' | 'accessory';
  cameraHeight: 'eye-level' | 'low' | 'high';
  framing: 'close-up' | 'medium' | 'wide';
  orientation: 'portrait' | 'landscape' | 'square';
  backgroundDescription: string;
  lightingStyle: string;
  focalFeatures: string[];
  notableProps: string[];
  shotPurpose: 'hero' | 'feature' | 'lifestyle' | 'context' | 'detail';
  colorScheme: string;
  productPosition: string;
  confidence: number;
}

export interface GalleryAssetCapture {
  url: string;
  altText?: string;
  inferredRole: 'gallery' | 'hero' | 'detail';
  order: number;
  sourcePage: string;
}

export interface AnalyzedAsset {
  assetId: string;
  productId: string;
  sourceUrl: string;
  localPath: string;
  descriptor: ImageDescriptor;
  hash: string;
  width: number;
  height: number;
}

const MANUFACTURER_ASSETS_DIR = path.join(process.cwd(), 'attached_assets', 'product_images', 'manufacturer');

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function downloadManufacturerAsset(
  url: string,
  productId: string,
  order: number
): Promise<{ localPath: string; hash: string; width: number; height: number } | null> {
  try {
    const productDir = path.join(MANUFACTURER_ASSETS_DIR, productId, 'source');
    ensureDirectoryExists(productDir);

    // Comprehensive HTML entity decoding
    let cleanedUrl = url
      .replace(/&amp;/g, '&')
      .replace(/&#38;/g, '&')
      .replace(/&#x26;/g, '&');
    
    // Log for debugging
    console.log(`[reference-analyzer] Original URL: ${url.substring(0, 100)}...`);
    console.log(`[reference-analyzer] Cleaned URL: ${cleanedUrl.substring(0, 100)}...`);
    console.log(`[reference-analyzer] Has amp: ${url.includes('&amp;')} -> ${cleanedUrl.includes('&amp;')}`);
    
    // Try URL constructor to normalize
    try {
      const urlObj = new URL(cleanedUrl);
      cleanedUrl = urlObj.toString();
    } catch (e) {
      // Keep as-is if not a valid URL
    }

    const response = await fetch(cleanedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.log(`[reference-analyzer] Failed to download ${cleanedUrl}: ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    const filename = `asset_${order.toString().padStart(2, '0')}_${hash.substring(0, 8)}.jpg`;
    const localPath = path.join(productDir, filename);

    await sharp(buffer)
      .jpeg({ quality: 90 })
      .toFile(localPath);

    console.log(`[reference-analyzer] Downloaded ${url} -> ${localPath}`);

    return { localPath, hash, width, height };
  } catch (error: any) {
    console.error(`[reference-analyzer] Error downloading ${url}:`, error.message);
    return null;
  }
}

function buildAnalysisPrompt(brand: string, productName: string): string {
  return `You are cataloging official marketing imagery for the ${brand} ${productName}. 

Analyze this product image and describe the camera viewpoint, composition, and lighting in structured JSON format.

Return ONLY valid JSON with these exact keys:
{
  "cameraAngle": "front|rear|left|right|top|bottom|three-quarter|detail|lifestyle|accessory",
  "cameraHeight": "eye-level|low|high",
  "framing": "close-up|medium|wide",
  "orientation": "portrait|landscape|square",
  "backgroundDescription": "description of the background (e.g., 'pure white studio', 'gradient gray', 'dark ambient')",
  "lightingStyle": "description of lighting (e.g., 'soft diffused studio lighting', 'dramatic side lighting')",
  "focalFeatures": ["array", "of", "emphasized", "product", "elements"],
  "notableProps": ["any", "accessories", "or", "props", "shown"],
  "shotPurpose": "hero|feature|lifestyle|context|detail",
  "colorScheme": "dominant colors in the image",
  "productPosition": "description of product placement (e.g., 'centered', 'angled 45 degrees left')",
  "confidence": 0.0 to 1.0 rating of analysis confidence
}

Focus on objective visual facts. Do not infer product specifications.
Return ONLY the JSON object, no additional text or markdown.`;
}

export async function analyzeGalleryAsset(
  imagePath: string,
  brand: string,
  productName: string
): Promise<ImageDescriptor | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error(`[reference-analyzer] Image not found: ${imagePath}`);
      return null;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const resizedBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    const base64Image = resizedBuffer.toString('base64');

    console.log(`[reference-analyzer] Analyzing image: ${path.basename(imagePath)}`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: [
        {
          role: "user",
          parts: [
            { text: buildAnalysisPrompt(brand, productName) },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ],
    });

    const textResponse = response.text;
    if (!textResponse) {
      console.error('[reference-analyzer] No response from vision model');
      return null;
    }

    let jsonStr = textResponse.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const descriptor = JSON.parse(jsonStr) as ImageDescriptor;
    
    console.log(`[reference-analyzer] Analysis complete: ${descriptor.cameraAngle} view, ${descriptor.shotPurpose} shot`);

    return descriptor;
  } catch (error: any) {
    console.error(`[reference-analyzer] Analysis error:`, error.message);
    return null;
  }
}

export function buildGenerationPrompt(
  descriptor: ImageDescriptor,
  brand: string,
  productName: string
): string {
  const directives: string[] = [
    `Create a photorealistic product photography image of the ${brand} ${productName}.`,
    '',
    'MATCH THE FOLLOWING SPECIFICATIONS EXACTLY:',
    '',
    `Camera Angle: ${descriptor.cameraAngle.toUpperCase()} VIEW`,
    `Camera Height: ${descriptor.cameraHeight}`,
    `Framing: ${descriptor.framing} shot`,
    `Product Position: ${descriptor.productPosition}`,
    '',
    'VISUAL REQUIREMENTS:',
    `- Background: ${descriptor.backgroundDescription}`,
    `- Lighting: ${descriptor.lightingStyle}`,
    `- Color scheme: ${descriptor.colorScheme}`,
    '',
    'FOCAL ELEMENTS TO EMPHASIZE:',
    ...descriptor.focalFeatures.map(f => `- ${f}`),
  ];

  if (descriptor.notableProps.length > 0) {
    directives.push('', 'PROPS/ACCESSORIES TO INCLUDE:');
    directives.push(...descriptor.notableProps.map(p => `- ${p}`));
  }

  directives.push(
    '',
    'STYLE DIRECTIVES:',
    `- Shot purpose: ${descriptor.shotPurpose} image`,
    `- Orientation: ${descriptor.orientation}`,
    '- Professional commercial product photography quality',
    '- 8K resolution, photorealistic rendering',
    '- Sharp focus on product details',
    `- Accurate representation of the actual ${brand} ${productName}`,
    `- Include only the official ${brand} branding on the product itself`,
    '- No text overlays, watermarks, or additional graphics'
  );

  return directives.join('\n');
}

export async function captureAndAnalyzeGallery(
  productId: string,
  productName: string,
  brand: string,
  galleryUrls: string[]
): Promise<AnalyzedAsset[]> {
  const analyzedAssets: AnalyzedAsset[] = [];

  console.log(`[reference-analyzer] Processing ${galleryUrls.length} gallery images for ${productName}`);

  for (let i = 0; i < galleryUrls.length; i++) {
    const url = galleryUrls[i];
    
    const downloadResult = await downloadManufacturerAsset(url, productId, i);
    if (!downloadResult) {
      console.log(`[reference-analyzer] Skipping ${url} - download failed`);
      continue;
    }

    const descriptor = await analyzeGalleryAsset(
      downloadResult.localPath,
      brand,
      productName
    );

    if (!descriptor) {
      console.log(`[reference-analyzer] Skipping ${url} - analysis failed`);
      continue;
    }

    analyzedAssets.push({
      assetId: crypto.randomUUID(),
      productId,
      sourceUrl: url,
      localPath: downloadResult.localPath,
      descriptor,
      hash: downloadResult.hash,
      width: downloadResult.width,
      height: downloadResult.height,
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`[reference-analyzer] Analyzed ${analyzedAssets.length}/${galleryUrls.length} images`);

  return analyzedAssets;
}

export { MANUFACTURER_ASSETS_DIR };
