import type { Product, Category } from "@shared/schema";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private products: CacheEntry<Product[]> | null = null;
  private productById: Map<string, CacheEntry<Product>> = new Map();
  private categories: CacheEntry<Category[]> | null = null;
  private categoryById: Map<string, CacheEntry<Category>> = new Map();
  private productsByCategory: Map<string, CacheEntry<Product[]>> = new Map();
  private featuredProducts: CacheEntry<Product[]> | null = null;

  private readonly DEFAULT_TTL = 5 * 60 * 1000;
  private readonly PRODUCT_TTL = 10 * 60 * 1000;

  private isValid<T>(entry: CacheEntry<T> | null | undefined): entry is CacheEntry<T> {
    if (!entry) return false;
    return Date.now() - entry.timestamp < entry.ttl;
  }

  getAllProducts(): Product[] | null {
    if (this.isValid(this.products)) {
      return this.products.data;
    }
    return null;
  }

  setAllProducts(products: Product[]): void {
    const timestamp = Date.now();
    this.products = {
      data: products,
      timestamp,
      ttl: this.PRODUCT_TTL
    };
    products.forEach(p => {
      this.productById.set(p.id, {
        data: p,
        timestamp,
        ttl: this.PRODUCT_TTL
      });
    });
  }

  getProduct(id: string): Product | null {
    const entry = this.productById.get(id);
    if (this.isValid(entry)) {
      return entry.data;
    }
    return null;
  }

  setProduct(product: Product): void {
    this.productById.set(product.id, {
      data: product,
      timestamp: Date.now(),
      ttl: this.PRODUCT_TTL
    });
  }

  getProductsByCategory(categoryId: string): Product[] | null {
    const entry = this.productsByCategory.get(categoryId);
    if (this.isValid(entry)) {
      return entry.data;
    }
    return null;
  }

  setProductsByCategory(categoryId: string, products: Product[]): void {
    this.productsByCategory.set(categoryId, {
      data: products,
      timestamp: Date.now(),
      ttl: this.PRODUCT_TTL
    });
  }

  getFeaturedProducts(): Product[] | null {
    if (this.isValid(this.featuredProducts)) {
      return this.featuredProducts.data;
    }
    return null;
  }

  setFeaturedProducts(products: Product[]): void {
    this.featuredProducts = {
      data: products,
      timestamp: Date.now(),
      ttl: this.PRODUCT_TTL
    };
  }

  getAllCategories(): Category[] | null {
    if (this.isValid(this.categories)) {
      return this.categories.data;
    }
    return null;
  }

  setAllCategories(categories: Category[]): void {
    const timestamp = Date.now();
    this.categories = {
      data: categories,
      timestamp,
      ttl: this.DEFAULT_TTL
    };
    categories.forEach(c => {
      this.categoryById.set(c.id, {
        data: c,
        timestamp,
        ttl: this.DEFAULT_TTL
      });
    });
  }

  getCategory(id: string): Category | null {
    const entry = this.categoryById.get(id);
    if (this.isValid(entry)) {
      return entry.data;
    }
    return null;
  }

  setCategory(category: Category): void {
    this.categoryById.set(category.id, {
      data: category,
      timestamp: Date.now(),
      ttl: this.DEFAULT_TTL
    });
  }

  invalidateProducts(): void {
    this.products = null;
    this.productById.clear();
    this.productsByCategory.clear();
    this.featuredProducts = null;
  }

  invalidateCategories(): void {
    this.categories = null;
    this.categoryById.clear();
  }

  invalidateAll(): void {
    this.invalidateProducts();
    this.invalidateCategories();
  }

  getCacheStats(): {
    products: { cached: number; valid: boolean };
    categories: { cached: number; valid: boolean };
  } {
    return {
      products: {
        cached: this.productById.size,
        valid: this.isValid(this.products)
      },
      categories: {
        cached: this.categoryById.size,
        valid: this.isValid(this.categories)
      }
    };
  }
}

export const cache = new MemoryCache();

export async function warmCache(storage: {
  getAllProducts: () => Promise<Product[]>;
  getAllCategories: () => Promise<Category[]>;
  getFeaturedProducts: () => Promise<Product[]>;
}): Promise<void> {
  console.log("[cache] Warming cache...");
  const startTime = Date.now();

  try {
    const [products, categories, featured] = await Promise.all([
      storage.getAllProducts(),
      storage.getAllCategories(),
      storage.getFeaturedProducts()
    ]);

    cache.setAllProducts(products);
    cache.setAllCategories(categories);
    cache.setFeaturedProducts(featured);

    const stats = cache.getCacheStats();
    console.log(`[cache] Warmed in ${Date.now() - startTime}ms: ${stats.products.cached} products, ${stats.categories.cached} categories`);
  } catch (error) {
    console.error("[cache] Failed to warm cache:", error);
  }
}
