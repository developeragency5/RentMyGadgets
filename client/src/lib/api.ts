import type { Category, Product } from "@shared/schema";

const API_BASE = "/api";
const BASE_PATH = import.meta.env.BASE_URL || "/";

export async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  if (res.ok && !ct.includes("application/json")) {
    throw new Error(`Expected JSON but got ${ct || "unknown"} from ${url}`);
  }
  return res;
}

function fixImagePaths<T>(data: T): T {
  if (BASE_PATH === "/") return data;
  const prefix = BASE_PATH.replace(/\/$/, "");
  const fixUrl = (url: string | null) => {
    if (!url || url.startsWith("http") || url.startsWith(prefix)) return url;
    if (url.startsWith("/")) return `${prefix}${url}`;
    return url;
  };
  if (Array.isArray(data)) {
    return data.map((item: any) => fixImagePaths(item)) as T;
  }
  if (data && typeof data === "object") {
    const result = { ...data } as any;
    if (result.imageUrl) result.imageUrl = fixUrl(result.imageUrl);
    if (result.images && Array.isArray(result.images)) {
      result.images = result.images.map((img: string) => fixUrl(img) || img);
    }
    return result;
  }
  return data;
}

async function fetchWithFallback<T>(apiUrl: string, staticUrl: string, transform?: (data: any) => T): Promise<T> {
  try {
    const response = await fetch(apiUrl);
    const contentType = response.headers.get("content-type") || "";
    if (response.ok && contentType.includes("application/json")) {
      return response.json();
    }
  } catch {}
  const staticRes = await fetch(staticUrl);
  if (staticRes.ok) {
    const data = await staticRes.json();
    const result = transform ? transform(data) : data;
    return fixImagePaths(result);
  }
  throw new Error(`Failed to fetch: ${apiUrl}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchWithFallback<Category[]>(
    `${API_BASE}/categories`,
    `${BASE_PATH}data/categories.json`
  );
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
  return fetchWithFallback<Product[]>(
    url,
    `${BASE_PATH}data/products.json`,
    (products) => {
      let filtered = products;
      if (params?.categoryId) {
        filtered = filtered.filter((p: Product) => p.categoryId === params.categoryId);
      }
      if (params?.featured) {
        filtered = filtered.filter((p: Product) => p.featured);
      }
      return filtered;
    }
  );
}

export async function fetchProduct(id: string): Promise<Product> {
  return fetchWithFallback<Product>(
    `${API_BASE}/products/${id}`,
    `${BASE_PATH}data/products.json`,
    (products) => {
      const product = products.find((p: Product) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    }
  );
}

export async function fetchCategory(id: string): Promise<Category> {
  return fetchWithFallback<Category>(
    `${API_BASE}/categories/${id}`,
    `${BASE_PATH}data/categories.json`,
    (categories) => {
      const category = categories.find((c: Category) => c.id === id);
      if (!category) throw new Error("Category not found");
      return category;
    }
  );
}

export interface SearchSuggestion {
  id: string;
  slug: string;
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
  const ct = response.headers.get("content-type") || "";
  if (!response.ok || !ct.includes("application/json")) {
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
  const ct = response.headers.get("content-type") || "";
  if (!response.ok || !ct.includes("application/json")) {
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
  const ct = response.headers.get("content-type") || "";
  if (!response.ok || !ct.includes("application/json")) {
    throw new Error("Failed to fetch product variants");
  }
  return response.json();
}
