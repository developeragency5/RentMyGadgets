import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import pLimit from 'p-limit';
import { ProductImageSpec, generateDesktopsLaptopsSpec } from './batch-image-spec-parser';
import { db } from './storage';
import { aiBatchRuns, aiBatchItems, products } from '@shared/schema';
import { eq, and, inArray } from 'drizzle-orm';

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const VIEW_PROMPTS: Record<string, string> = {
  'hero': 'centered front-facing view, clean composition, product as the main focus, eye-level perspective',
  'front': 'direct front view, straight-on perspective, symmetrical framing',
  '3-quarter': 'three-quarter angle view showing front and side, 45-degree rotation, dynamic perspective',
  'angle': 'angled view from slight elevation, showing depth and dimension',
  'side': 'side profile view, perpendicular to front, showing thinness and ports',
  'top': 'top-down bird\'s eye view, showing full surface layout',
  'ports': 'close-up view of ports and connectivity options, showing I/O details',
  'rear': 'back panel view showing vents, ports, and design elements',
  'back': 'rear view showing the back design, vents, and logos',
  'rackview': 'server rack perspective view, showing mounting orientation',
  '360-view': 'three-quarter angle showing convertible hinge in tent or presentation mode',
  'keyboard': 'overhead angle focusing on keyboard layout and trackpad',
  'open': 'laptop in open position at natural viewing angle, screen visible',
  'gaming-angle': 'dramatic low angle showing gaming aesthetics, RGB lighting, aggressive design',
  'io': 'I/O panel view showing all available ports and connections',
  'tablet-mode': 'device in tablet mode, screen facing forward, touch-ready pose',
  'creative-angle': 'artistic angle showcasing screen and color accuracy for creative work',
  'studio-mode': 'tilted screen mode for digital art creation and interaction',
  'inside': 'internal view showing components, fans, and RGB lighting through glass panel',
  'slim-profile': 'side view emphasizing ultra-thin profile and lightweight design',
  'modular': 'exploded or close-up view showing modular/upgradeable components',
  's-pen': 'view showing stylus/S Pen integration and usage',
  'slot': 'ultra-thin behind-monitor mounting view',
  'rugged': 'angled view emphasizing rugged construction and durability features',
};

export interface BatchRunConfig {
  category: string;
  maxProducts?: number;
  startFromBrand?: string;
  concurrency?: number;
  dryRun?: boolean;
}

export interface BatchRunStatus {
  runId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  category: string;
  totalProducts: number;
  totalImages: number;
  processedImages: number;
  succeededImages: number;
  failedImages: number;
  skippedImages: number;
  currentProduct?: string;
  currentBrand?: string;
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
}

function buildImagePrompt(brand: string, model: string, viewType: string, category: string): string {
  const viewDescription = VIEW_PROMPTS[viewType] || VIEW_PROMPTS['hero'];
  
  const productType = getProductType(category, model);
  
  return `Photorealistic product photography of the ${brand} ${model} ${productType}. ${viewDescription}. 

Professional studio photography with:
- Pure white seamless background (#FFFFFF)
- Soft diffused studio lighting with subtle shadows
- Sharp focus on product details
- High-end commercial photography style
- No text, logos, watermarks, or annotations
- Clean, minimalist composition
- Accurate product representation
- 4K resolution quality

The image should look like an official product photo from ${brand}'s website.`;
}

function getProductType(category: string, model: string): string {
  const lowerModel = model.toLowerCase();
  
  if (category === 'Desktops & Laptops') {
    if (lowerModel.includes('macbook') || lowerModel.includes('laptop') || 
        lowerModel.includes('book') || lowerModel.includes('thinkpad') ||
        lowerModel.includes('zenbook') || lowerModel.includes('vivobook') ||
        lowerModel.includes('blade') || lowerModel.includes('xps') ||
        lowerModel.includes('spectre') || lowerModel.includes('envy') ||
        lowerModel.includes('gram') || lowerModel.includes('swift') ||
        lowerModel.includes('aspire') && !lowerModel.includes('tc')) {
      return 'laptop';
    }
    if (lowerModel.includes('imac')) {
      return 'all-in-one desktop computer';
    }
    if (lowerModel.includes('mac mini') || lowerModel.includes('nuc') || 
        lowerModel.includes('mini pc') || lowerModel.includes('nucbox') ||
        lowerModel.includes('deskmeet') || lowerModel.includes('elitedesk')) {
      return 'mini PC';
    }
    if (lowerModel.includes('mac studio')) {
      return 'compact workstation';
    }
    if (lowerModel.includes('mac pro')) {
      return 'professional workstation';
    }
    if (lowerModel.includes('workstation') || lowerModel.includes('thinkstation') ||
        lowerModel.includes('precision')) {
      return 'workstation tower';
    }
    if (lowerModel.includes('gaming') || lowerModel.includes('omen') ||
        lowerModel.includes('rog') || lowerModel.includes('predator') ||
        lowerModel.includes('legion') || lowerModel.includes('aurora') ||
        lowerModel.includes('player')) {
      if (lowerModel.includes('desktop') || lowerModel.includes('tower') ||
          lowerModel.includes('25l') || lowerModel.includes('45l') ||
          lowerModel.includes('strix g') || lowerModel.includes('aurora') ||
          lowerModel.includes('trident') || lowerModel.includes('infinite') ||
          lowerModel.includes('orion') || lowerModel.includes('player')) {
        return 'gaming desktop PC';
      }
      return 'gaming laptop';
    }
    return 'computer';
  }
  
  return 'device';
}

function isRetryableError(error: any): boolean {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code?.toLowerCase() || '';
  return (
    message.includes('rate limit') ||
    message.includes('quota') ||
    message.includes('too many requests') ||
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('econnreset') ||
    message.includes('503') ||
    message.includes('429') ||
    code.includes('resource_exhausted') ||
    code.includes('unavailable')
  );
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImageWithRetry(prompt: string, maxAttempts: number = 3): Promise<Buffer | null> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt }
            ]
          }
        ],
        config: {
          responseModalities: ["image", "text"],
        }
      });

      if (response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith('image/')) {
              const imageData = part.inlineData.data;
              if (imageData) {
                return Buffer.from(imageData, 'base64');
              }
            }
          }
        }
      }
      return null;
    } catch (error: any) {
      lastError = error;
      console.error(`[batch-runner] Attempt ${attempt}/${maxAttempts} failed: ${error.message}`);
      
      if (attempt < maxAttempts && isRetryableError(error)) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
        console.log(`[batch-runner] Retrying in ${backoffMs}ms...`);
        await sleep(backoffMs);
      } else if (!isRetryableError(error)) {
        throw error;
      }
    }
  }
  
  throw lastError || new Error('Failed after max retries');
}

function ensureDirectoryExists(dirPath: string): void {
  const fullPath = path.join(process.cwd(), dirPath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

async function saveImage(buffer: Buffer, outputDir: string, filename: string): Promise<string> {
  ensureDirectoryExists(outputDir);
  const fullPath = path.join(process.cwd(), outputDir.replace(/^\//, ''), filename);
  fs.writeFileSync(fullPath, buffer);
  return fullPath;
}

export async function createBatchRun(config: BatchRunConfig): Promise<string> {
  const specs = generateDesktopsLaptopsSpec().filter(s => s.category === config.category);
  
  let filteredSpecs = specs;
  if (config.startFromBrand) {
    const brandIndex = specs.findIndex(s => s.brand === config.startFromBrand);
    if (brandIndex >= 0) {
      filteredSpecs = specs.slice(brandIndex);
    }
  }
  if (config.maxProducts) {
    filteredSpecs = filteredSpecs.slice(0, config.maxProducts);
  }
  
  const totalImages = filteredSpecs.reduce((sum, s) => sum + s.preferredImageViews.length, 0);
  
  const [run] = await db.insert(aiBatchRuns).values({
    category: config.category,
    status: 'pending',
    totalProducts: filteredSpecs.length,
    totalImages,
    processedImages: 0,
    succeededImages: 0,
    failedImages: 0,
    skippedImages: 0,
    config: config as any,
  }).returning();
  
  const items = filteredSpecs.flatMap(spec => 
    spec.preferredImageViews.map((view, idx) => ({
      runId: run.id,
      brand: spec.brand,
      productModel: spec.productModel,
      viewType: view,
      viewOrder: idx,
      status: 'pending' as const,
      outputDir: spec.outputDir,
      filenameBase: spec.filenameBase,
    }))
  );
  
  if (items.length > 0) {
    await db.insert(aiBatchItems).values(items);
  }
  
  console.log(`[batch-runner] Created batch run ${run.id} with ${filteredSpecs.length} products, ${totalImages} images`);
  return run.id;
}

export async function runBatch(runId: string, concurrency: number = 2): Promise<BatchRunStatus> {
  const [run] = await db.select().from(aiBatchRuns).where(eq(aiBatchRuns.id, runId));
  if (!run) {
    throw new Error(`Batch run ${runId} not found`);
  }
  
  await db.update(aiBatchRuns).set({
    status: 'running',
    startedAt: new Date(),
  }).where(eq(aiBatchRuns.id, runId));
  
  const items = await db.select().from(aiBatchItems)
    .where(and(
      eq(aiBatchItems.runId, runId),
      inArray(aiBatchItems.status, ['pending', 'failed'])
    ))
    .orderBy(aiBatchItems.id);
  
  console.log(`[batch-runner] Starting batch run ${runId} with ${items.length} pending items`);
  
  const limit = pLimit(concurrency);
  let processed = run.processedImages;
  let succeeded = run.succeededImages;
  let failed = run.failedImages;
  
  const tasks = items.map(item => limit(async () => {
    try {
      await db.update(aiBatchItems).set({
        status: 'in_progress',
        startedAt: new Date(),
      }).where(eq(aiBatchItems.id, item.id));
      
      await db.update(aiBatchRuns).set({
        currentBrand: item.brand,
        currentProduct: item.productModel,
      }).where(eq(aiBatchRuns.id, runId));
      
      const prompt = buildImagePrompt(item.brand, item.productModel, item.viewType, run.category);
      
      console.log(`[batch-runner] Generating ${item.brand} ${item.productModel} (${item.viewType})...`);
      
      const imageBuffer = await generateImageWithRetry(prompt, 3);
      
      if (imageBuffer) {
        const filename = `${item.filenameBase}_${item.viewType}.png`;
        const savedPath = await saveImage(imageBuffer, item.outputDir, filename);
        
        await db.update(aiBatchItems).set({
          status: 'succeeded',
          completedAt: new Date(),
          outputPath: savedPath,
          prompt,
          durationMs: Date.now() - (item.startedAt?.getTime() || Date.now()),
        }).where(eq(aiBatchItems.id, item.id));
        
        succeeded++;
        console.log(`[batch-runner] ✓ Saved ${filename}`);
      } else {
        throw new Error('No image data returned');
      }
    } catch (error: any) {
      await db.update(aiBatchItems).set({
        status: 'failed',
        completedAt: new Date(),
        errorMessage: error.message,
      }).where(eq(aiBatchItems.id, item.id));
      
      failed++;
      console.error(`[batch-runner] ✗ Failed ${item.brand} ${item.productModel}: ${error.message}`);
    }
    
    processed++;
    await db.update(aiBatchRuns).set({
      processedImages: processed,
      succeededImages: succeeded,
      failedImages: failed,
    }).where(eq(aiBatchRuns.id, runId));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }));
  
  await Promise.all(tasks);
  
  const completedAt = new Date();
  const startedAt = run.startedAt || new Date();
  const durationMs = completedAt.getTime() - startedAt.getTime();
  
  await db.update(aiBatchRuns).set({
    status: failed > 0 && succeeded === 0 ? 'failed' : 'completed',
    completedAt,
    durationMs,
    currentBrand: null,
    currentProduct: null,
  }).where(eq(aiBatchRuns.id, runId));
  
  console.log(`[batch-runner] Batch run ${runId} completed: ${succeeded} succeeded, ${failed} failed`);
  
  return {
    runId,
    status: failed > 0 && succeeded === 0 ? 'failed' : 'completed',
    category: run.category,
    totalProducts: run.totalProducts,
    totalImages: run.totalImages,
    processedImages: processed,
    succeededImages: succeeded,
    failedImages: failed,
    skippedImages: run.skippedImages,
    startedAt,
    completedAt,
    durationMs,
  };
}

export async function getBatchRunStatus(runId: string): Promise<BatchRunStatus | null> {
  const [run] = await db.select().from(aiBatchRuns).where(eq(aiBatchRuns.id, runId));
  if (!run) return null;
  
  return {
    runId: run.id,
    status: run.status as any,
    category: run.category,
    totalProducts: run.totalProducts,
    totalImages: run.totalImages,
    processedImages: run.processedImages,
    succeededImages: run.succeededImages,
    failedImages: run.failedImages,
    skippedImages: run.skippedImages,
    currentProduct: run.currentProduct || undefined,
    currentBrand: run.currentBrand || undefined,
    startedAt: run.startedAt || undefined,
    completedAt: run.completedAt || undefined,
    durationMs: run.durationMs || undefined,
  };
}

export async function listBatchRuns(category?: string): Promise<BatchRunStatus[]> {
  let query = db.select().from(aiBatchRuns);
  if (category) {
    query = query.where(eq(aiBatchRuns.category, category)) as any;
  }
  
  const runs = await query.orderBy(aiBatchRuns.createdAt);
  
  return runs.map(run => ({
    runId: run.id,
    status: run.status as any,
    category: run.category,
    totalProducts: run.totalProducts,
    totalImages: run.totalImages,
    processedImages: run.processedImages,
    succeededImages: run.succeededImages,
    failedImages: run.failedImages,
    skippedImages: run.skippedImages,
    currentProduct: run.currentProduct || undefined,
    currentBrand: run.currentBrand || undefined,
    startedAt: run.startedAt || undefined,
    completedAt: run.completedAt || undefined,
    durationMs: run.durationMs || undefined,
  }));
}

export async function cancelBatchRun(runId: string): Promise<void> {
  await db.update(aiBatchRuns).set({
    status: 'cancelled',
    completedAt: new Date(),
  }).where(eq(aiBatchRuns.id, runId));
  
  await db.update(aiBatchItems).set({
    status: 'skipped',
  }).where(and(
    eq(aiBatchItems.runId, runId),
    inArray(aiBatchItems.status, ['pending', 'in_progress'])
  ));
}
