import { GoogleGenAI, Type } from "@google/genai";
import pLimit from "p-limit";
import pRetry, { AbortError } from "p-retry";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

interface TargetAudience {
  icon: string;
  title: string;
  description: string;
}

interface ProductContentData {
  howItWorks: string;
  keyBenefits: string[];
  considerations: string[];
  targetAudience: TargetAudience[];
  safetyGuidelines: string[];
  maintenanceTips: string[];
}

export async function generateProductContent(
  productName: string,
  brand: string,
  categoryName: string,
  description?: string
): Promise<ProductContentData> {
  const prompt = `You are a product expert for a tech rental company. Generate comprehensive, helpful content for renting the following product:

Product: ${productName}
Brand: ${brand}
Category: ${categoryName}
${description ? `Description: ${description}` : ''}

Generate content in JSON format with the following structure:
{
  "howItWorks": "A 2-3 sentence paragraph explaining how this product works, its key technology, and what makes it special. Focus on rental context.",
  "keyBenefits": ["5-6 short bullet points highlighting the key advantages of renting this product"],
  "considerations": ["4-5 honest points about limitations or things renters should be aware of"],
  "targetAudience": [
    {"icon": "briefcase", "title": "Professionals", "description": "Short description of why this group would rent it"},
    {"icon": "graduation-cap", "title": "Students", "description": "Short description"},
    {"icon": "home", "title": "Home Users", "description": "Short description"},
    {"icon": "camera", "title": "Creatives", "description": "Short description"}
  ],
  "safetyGuidelines": ["4-5 safety tips for using this rented equipment properly"],
  "maintenanceTips": ["4-5 care and maintenance tips to keep the equipment in good condition during rental"]
}

Important:
- Keep all text concise and practical
- Focus on rental context (temporary use, care instructions, return in good condition)
- For targetAudience icons, use one of: briefcase, graduation-cap, home, camera, users, laptop, gamepad, music, video, building
- Make content specific to the actual product, not generic
- Be helpful and informative, not salesy`;

  const response = await pRetry(
    async () => {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                howItWorks: { type: Type.STRING },
                keyBenefits: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                },
                considerations: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                },
                targetAudience: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      icon: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["icon", "title", "description"]
                  }
                },
                safetyGuidelines: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                },
                maintenanceTips: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                }
              },
              required: ["howItWorks", "keyBenefits", "considerations", "targetAudience", "safetyGuidelines", "maintenanceTips"]
            }
          }
        });
        return JSON.parse(result.text || "{}") as ProductContentData;
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw new AbortError(error);
      }
    },
    {
      retries: 5,
      minTimeout: 2000,
      maxTimeout: 30000,
      factor: 2,
    }
  );

  return response;
}

export interface SpecCategory {
  category: string;
  specs: { label: string; value: string }[];
}

export interface ProductSpecifications {
  keySpecs: { label: string; value: string }[];
  categories: SpecCategory[];
}

export async function generateProductSpecifications(
  productName: string,
  brand: string,
  categoryName: string,
  description?: string
): Promise<ProductSpecifications> {
  const prompt = `You are a technical product expert. Generate comprehensive, accurate specifications for the following tech product that would be rented out:

Product: ${productName}
Brand: ${brand}
Category: ${categoryName}
${description ? `Description: ${description}` : ''}

Generate detailed specifications in JSON format. Include realistic specifications based on what this product type typically has. The specifications should be organized into categories.

{
  "keySpecs": [
    {"label": "Processor/Chip", "value": "specific value"},
    {"label": "Memory/Storage", "value": "specific value"},
    {"label": "Display/Screen", "value": "specific value"},
    {"label": "Key Feature", "value": "specific value"}
  ],
  "categories": [
    {
      "category": "General",
      "specs": [
        {"label": "Brand", "value": "${brand}"},
        {"label": "Model", "value": "model name"},
        {"label": "Release Year", "value": "year"},
        {"label": "Color Options", "value": "colors"}
      ]
    },
    {
      "category": "Performance",
      "specs": [
        {"label": "Processor", "value": "spec"},
        {"label": "RAM", "value": "spec"},
        {"label": "Storage", "value": "spec"}
      ]
    },
    {
      "category": "Display",
      "specs": [
        {"label": "Screen Size", "value": "spec"},
        {"label": "Resolution", "value": "spec"},
        {"label": "Display Type", "value": "spec"}
      ]
    },
    {
      "category": "Connectivity",
      "specs": [
        {"label": "Wi-Fi", "value": "spec"},
        {"label": "Bluetooth", "value": "spec"},
        {"label": "Ports", "value": "spec"}
      ]
    },
    {
      "category": "Physical",
      "specs": [
        {"label": "Dimensions", "value": "spec"},
        {"label": "Weight", "value": "spec"},
        {"label": "Material", "value": "spec"}
      ]
    }
  ]
}

Important:
- Generate 4-6 key specs that are most important for this product type
- Include 4-6 relevant categories based on product type (not all categories apply to all products)
- For cameras: include Sensor, Lens, Video, etc.
- For laptops: include Performance, Display, Battery, etc.
- For audio: include Driver, Frequency Response, Noise Cancellation, etc.
- For networking: include Speed, Range, Protocols, etc.
- Use realistic, accurate specifications for this specific product
- Values should be specific (e.g., "Apple M3 Pro 12-core" not just "Fast processor")`;

  const response = await pRetry(
    async () => {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                keySpecs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                },
                categories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      specs: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            label: { type: Type.STRING },
                            value: { type: Type.STRING }
                          },
                          required: ["label", "value"]
                        }
                      }
                    },
                    required: ["category", "specs"]
                  }
                }
              },
              required: ["keySpecs", "categories"]
            }
          }
        });
        return JSON.parse(result.text || "{}") as ProductSpecifications;
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw new AbortError(error);
      }
    },
    {
      retries: 5,
      minTimeout: 2000,
      maxTimeout: 30000,
      factor: 2,
    }
  );

  return response;
}
