import { db } from "./storage";
import { products, productContent, categories } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";
import { generateProductContent, generateProductSpecifications } from "./gemini-content";
import pLimit from "p-limit";

const CONCURRENCY = 2;
const DELAY_BETWEEN_PRODUCTS = 1500;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function prewarmProductContent(): Promise<{ 
  generated: number; 
  skipped: number; 
  failed: number;
  errors: string[];
}> {
  console.log("[prewarm] Starting product content pre-generation...");
  
  const allProducts = await db.select().from(products);
  console.log(`[prewarm] Found ${allProducts.length} products`);
  
  const existingContent = await db.select({ productId: productContent.productId }).from(productContent);
  const existingProductIds = new Set(existingContent.map(c => c.productId));
  
  const productsToGenerate = allProducts.filter(p => !existingProductIds.has(p.id));
  console.log(`[prewarm] ${productsToGenerate.length} products need content generation`);
  console.log(`[prewarm] ${existingProductIds.size} products already have cached content`);
  
  if (productsToGenerate.length === 0) {
    console.log("[prewarm] All products already have content - nothing to do");
    return { generated: 0, skipped: existingProductIds.size, failed: 0, errors: [] };
  }
  
  const allCategories = await db.select().from(categories);
  const categoryMap = new Map(allCategories.map(c => [c.id, c.name]));
  
  let generated = 0;
  let failed = 0;
  const errors: string[] = [];
  
  const limit = pLimit(CONCURRENCY);
  
  const tasks = productsToGenerate.map((product, index) => 
    limit(async () => {
      const categoryName = categoryMap.get(product.categoryId) || "Technology";
      
      console.log(`[prewarm] [${index + 1}/${productsToGenerate.length}] Generating content for: ${product.name}`);
      
      try {
        const productName = product.name || "Unknown Product";
        const brand = product.brand || "Unknown Brand";
        const description = product.description || undefined;
        const [content, specs] = await Promise.all([
          generateProductContent(productName, brand, categoryName, description),
          generateProductSpecifications(productName, brand, categoryName, description)
        ]);
        
        await db.insert(productContent).values({
          productId: product.id,
          howItWorks: content.howItWorks,
          keyBenefits: content.keyBenefits,
          considerations: content.considerations,
          targetAudience: content.targetAudience as any,
          safetyGuidelines: content.safetyGuidelines,
          maintenanceTips: content.maintenanceTips,
          specifications: specs as any,
        });
        
        generated++;
        console.log(`[prewarm] [${index + 1}/${productsToGenerate.length}] ✓ Generated content for: ${product.name}`);
        
        await sleep(DELAY_BETWEEN_PRODUCTS);
        
      } catch (error: any) {
        failed++;
        const errorMsg = `Failed to generate content for ${product.name}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`[prewarm] [${index + 1}/${productsToGenerate.length}] ✗ ${errorMsg}`);
      }
    })
  );
  
  await Promise.all(tasks);
  
  console.log(`[prewarm] Complete! Generated: ${generated}, Skipped: ${existingProductIds.size}, Failed: ${failed}`);
  
  return { 
    generated, 
    skipped: existingProductIds.size, 
    failed, 
    errors 
  };
}

export async function getContentCacheStatus(): Promise<{
  total: number;
  cached: number;
  missing: number;
  percentage: number;
}> {
  const allProducts = await db.select({ id: products.id }).from(products);
  const existingContent = await db.select({ productId: productContent.productId }).from(productContent);
  
  const total = allProducts.length;
  const cached = existingContent.length;
  const missing = total - cached;
  const percentage = total > 0 ? Math.round((cached / total) * 100) : 0;
  
  return { total, cached, missing, percentage };
}
