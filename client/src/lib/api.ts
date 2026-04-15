import type { Category, Product } from "@shared/schema";

const API_BASE = "/api";

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function fetchProducts(params?: { categoryId?: string; featured?: boolean }): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) {
    searchParams.append("categoryId", params.categoryId);
  }
  if (params?.featured) {
    searchParams.append("featured", "true");
  }
  
  const url = searchParams.toString() ? `${API_BASE}/products?${searchParams}` : `${API_BASE}/products`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export async function fetchCategory(id: string): Promise<Category> {
  const response = await fetch(`${API_BASE}/categories/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }
  return response.json();
}

export interface SearchSuggestion {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  pricePerMonth: string;
  categoryId: string;
}

export async function fetchSearchSuggestions(query: string, limit = 6): Promise<SearchSuggestion[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }
  const response = await fetch(`${API_BASE}/products/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export interface TargetAudience {
  icon: string;
  title: string;
  description: string;
}

export interface SpecCategory {
  category: string;
  specs: { label: string; value: string }[];
}

export interface ProductSpecifications {
  keySpecs: { label: string; value: string }[];
  categories: SpecCategory[];
}

export interface ProductContent {
  id: string;
  productId: string;
  howItWorks: string | null;
  keyBenefits: string[] | null;
  considerations: string[] | null;
  targetAudience: TargetAudience[] | null;
  safetyGuidelines: string[] | null;
  maintenanceTips: string[] | null;
  specifications: ProductSpecifications | null;
  generatedAt: string;
  updatedAt: string;
}

export async function fetchProductContent(productId: string): Promise<ProductContent> {
  const response = await fetch(`${API_BASE}/products/${productId}/content`);
  if (!response.ok) {
    throw new Error("Failed to fetch product content");
  }
  return response.json();
}

export interface VariantOption {
  id: string;
  label: string;
  value: string;
  priceAdjustment: number;
  isDefault: boolean;
  available: boolean;
  displayOrder: number;
}

export type VariantGroups = Record<string, VariantOption[]>;

export async function fetchProductVariants(productId: string): Promise<VariantGroups> {
  const response = await fetch(`${API_BASE}/products/${productId}/variants`);
  if (!response.ok) {
    throw new Error("Failed to fetch product variants");
  }
  return response.json();
}
