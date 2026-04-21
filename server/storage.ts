import { 
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Cart, type InsertCart,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type BlogPost, type InsertBlogPost,
  type SyncRun, type InsertSyncRun,
  type ProductSyncLog, type InsertProductSyncLog,
  type ProductGalleryImage, type InsertProductGalleryImage,
  type ProductContent, type InsertProductContent,
  type ProductVariantOption,
  users, categories, products, carts, orders, orderItems, blogPosts,
  syncRuns, productSyncLogs, productGalleryImages, productContent,
  productVariantOptions
} from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, desc, isNull, or, lt, sql as drizzleSql } from "drizzle-orm";

const neonClient = neon(process.env.DATABASE_URL!);
export const db = drizzle(neonClient);

async function fixGalleryArrays<T extends { id: string; galleryImageUrls?: string[] | null }>(items: T[]): Promise<T[]> {
  if (items.length === 0) return items;
  const ids = items.map(p => p.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
  const rows: { id: string; gallery: string[] | null }[] = await neonClient(
    `SELECT id, array_to_json(gallery_image_urls) as gallery FROM products WHERE id IN (${placeholders})`,
    ids
  );
  const galleryMap = new Map(rows.map(r => [r.id, r.gallery || []]));
  return items.map(p => ({ ...p, galleryImageUrls: galleryMap.get(p.id) || [] }));
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Cart
  getCartByUser(userId: string): Promise<Cart[]>;
  getCartItem(id: string): Promise<Cart | undefined>;
  addToCart(cart: InsertCart): Promise<Cart>;
  updateCartItem(id: string, updates: Partial<InsertCart>): Promise<Cart | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  findCartItem(userId: string, productId: string, variantConfiguration?: Record<string, string>, selectedColor?: string, rentalDuration?: string, hasGadgetCare?: boolean): Promise<Cart | undefined>;
  
  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;
  
  // Sync Runs
  createSyncRun(run: InsertSyncRun): Promise<SyncRun>;
  updateSyncRun(id: string, run: Partial<InsertSyncRun>): Promise<SyncRun | undefined>;
  getSyncRun(id: string): Promise<SyncRun | undefined>;
  getRecentSyncRuns(limit?: number): Promise<SyncRun[]>;
  
  // Product Sync Logs
  createProductSyncLog(log: InsertProductSyncLog): Promise<ProductSyncLog>;
  getProductSyncLogs(productId: string, limit?: number): Promise<ProductSyncLog[]>;
  getSyncRunLogs(runId: string): Promise<ProductSyncLog[]>;
  
  // Sync Queries
  getProductsNeedingSync(limit?: number): Promise<Product[]>;
  getProductsByBrand(brand: string): Promise<Product[]>;
  getProductsBySyncStatus(status: string): Promise<Product[]>;
  updateProductSyncStatus(id: string, status: string, error?: string): Promise<Product | undefined>;
  
  // Product Gallery Images
  getProductGalleryImages(productId: string): Promise<ProductGalleryImage[]>;
  createProductGalleryImage(image: InsertProductGalleryImage): Promise<ProductGalleryImage>;
  deleteProductGalleryImages(productId: string): Promise<void>;
  getProductsWithAIImages(): Promise<{ productId: string; imageCount: number }[]>;
  
  // Product Content (AI-generated)
  getProductContent(productId: string): Promise<ProductContent | undefined>;
  createProductContent(content: InsertProductContent): Promise<ProductContent>;
  updateProductContent(productId: string, content: Partial<InsertProductContent>): Promise<ProductContent | undefined>;
  
  // Product Variant Options
  getProductVariantOptions(productId: string): Promise<ProductVariantOption[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    const result = await db.select().from(products);
    return await fixGalleryArrays(result);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!result[0]) return undefined;
    const fixed = await fixGalleryArrays([result[0]]);
    return fixed[0];
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (!result[0]) return undefined;
    const fixed = await fixGalleryArrays([result[0]]);
    return fixed[0];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.categoryId, categoryId));
    return await fixGalleryArrays(result);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.featured, true));
    return await fixGalleryArrays(result);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  // Cart
  async getCartByUser(userId: string): Promise<Cart[]> {
    return await db.select().from(carts).where(eq(carts.userId, userId)).orderBy(desc(carts.createdAt));
  }

  async getCartItem(id: string): Promise<Cart | undefined> {
    const result = await db.select().from(carts).where(eq(carts.id, id)).limit(1);
    return result[0];
  }

  async addToCart(cart: InsertCart): Promise<Cart> {
    const result = await db.insert(carts).values(cart).returning();
    return result[0];
  }

  async updateCartItem(id: string, updates: Partial<InsertCart>): Promise<Cart | undefined> {
    const result = await db.update(carts).set({ ...updates, updatedAt: new Date() }).where(eq(carts.id, id)).returning();
    return result[0];
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(carts).where(eq(carts.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(carts).where(eq(carts.userId, userId));
  }

  async findCartItem(userId: string, productId: string, variantConfiguration?: Record<string, string>, selectedColor?: string, rentalDuration?: string, hasGadgetCare?: boolean): Promise<Cart | undefined> {
    const cartItems = await db.select().from(carts).where(
      and(
        eq(carts.userId, userId),
        eq(carts.productId, productId)
      )
    );
    
    return cartItems.find(item => {
      const itemConfig = (item.variantConfiguration as Record<string, string>) || {};
      const targetConfig = variantConfiguration || {};
      const configMatch = JSON.stringify(itemConfig) === JSON.stringify(targetConfig);
      const colorMatch = item.selectedColor === selectedColor;
      const durationMatch = (item.rentalDuration || 'monthly') === (rentalDuration || 'monthly');
      const gadgetCareMatch = (item.hasGadgetCare || false) === (hasGadgetCare || false);
      return configMatch && colorMatch && durationMatch && gadgetCareMatch;
    });
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(item).returning();
    return result[0];
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true))).limit(1);
    return result[0];
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(and(eq(blogPosts.category, category), eq(blogPosts.published, true))).orderBy(desc(blogPosts.createdAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  
  // Sync Runs
  async createSyncRun(run: InsertSyncRun): Promise<SyncRun> {
    const result = await db.insert(syncRuns).values(run).returning();
    return result[0];
  }
  
  async updateSyncRun(id: string, run: Partial<InsertSyncRun>): Promise<SyncRun | undefined> {
    const result = await db.update(syncRuns).set(run).where(eq(syncRuns.id, id)).returning();
    return result[0];
  }
  
  async getSyncRun(id: string): Promise<SyncRun | undefined> {
    const result = await db.select().from(syncRuns).where(eq(syncRuns.id, id)).limit(1);
    return result[0];
  }
  
  async getRecentSyncRuns(limit: number = 10): Promise<SyncRun[]> {
    return await db.select().from(syncRuns).orderBy(desc(syncRuns.startedAt)).limit(limit);
  }
  
  // Product Sync Logs
  async createProductSyncLog(log: InsertProductSyncLog): Promise<ProductSyncLog> {
    const result = await db.insert(productSyncLogs).values(log).returning();
    return result[0];
  }
  
  async getProductSyncLogs(productId: string, limit: number = 20): Promise<ProductSyncLog[]> {
    return await db.select().from(productSyncLogs)
      .where(eq(productSyncLogs.productId, productId))
      .orderBy(desc(productSyncLogs.createdAt))
      .limit(limit);
  }
  
  async getSyncRunLogs(runId: string): Promise<ProductSyncLog[]> {
    return await db.select().from(productSyncLogs)
      .where(eq(productSyncLogs.runId, runId))
      .orderBy(desc(productSyncLogs.createdAt));
  }
  
  // Sync Queries
  async getProductsNeedingSync(limit: number = 200): Promise<Product[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return await db.select().from(products)
      .where(
        or(
          isNull(products.syncStatus),
          eq(products.syncStatus, 'pending'),
          and(
            eq(products.syncStatus, 'failed'),
            lt(products.lastSyncAttempt, sevenDaysAgo)
          )
        )
      )
      .orderBy(desc(products.featured))
      .limit(limit);
  }
  
  async getProductsByBrand(brand: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.brand, brand));
  }
  
  async getProductsBySyncStatus(status: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.syncStatus, status));
  }
  
  async updateProductSyncStatus(id: string, status: string, error?: string): Promise<Product | undefined> {
    const updateData: Record<string, unknown> = {
      syncStatus: status,
      lastSyncAttempt: new Date(),
      updatedAt: new Date(),
    };
    if (error) {
      updateData.syncError = error;
    } else if (status === 'synced') {
      updateData.lastSyncSuccess = new Date();
    }
    const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return result[0];
  }
  
  async updateProductImages(
    id: string,
    imageUrl: string,
    galleryUrls?: string[],
    imageSource?: string
  ): Promise<Product | undefined> {
    const updateData: Record<string, unknown> = {
      imageUrl,
      imageSource: imageSource || 'synced',
      lastImageSync: new Date(),
      imageSyncStatus: 'valid',
      updatedAt: new Date(),
    };
    if (galleryUrls) {
      updateData.galleryImageUrls = galleryUrls;
    }
    const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return result[0];
  }
  
  async backupProductData(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) return undefined;
    
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (product.imageUrl && !product.imageUrlOriginal) {
      updateData.imageUrlOriginal = product.imageUrl;
    }
    if (product.description && !product.descriptionOriginal) {
      updateData.descriptionOriginal = product.description;
    }
    
    if (Object.keys(updateData).length > 1) {
      const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
      return result[0];
    }
    return product;
  }
  
  // Product Gallery Images
  async getProductGalleryImages(productId: string): Promise<ProductGalleryImage[]> {
    return await db
      .select()
      .from(productGalleryImages)
      .where(eq(productGalleryImages.productId, productId))
      .orderBy(productGalleryImages.displayOrder);
  }
  
  async createProductGalleryImage(image: InsertProductGalleryImage): Promise<ProductGalleryImage> {
    const result = await db.insert(productGalleryImages).values(image).returning();
    return result[0];
  }
  
  async deleteProductGalleryImages(productId: string): Promise<void> {
    await db.delete(productGalleryImages).where(eq(productGalleryImages.productId, productId));
  }
  
  async getProductsWithAIImages(): Promise<{ productId: string; imageCount: number }[]> {
    const result = await db
      .select({
        productId: productGalleryImages.productId,
        imageCount: drizzleSql<number>`count(*)::int`,
      })
      .from(productGalleryImages)
      .where(eq(productGalleryImages.isAiGenerated, true))
      .groupBy(productGalleryImages.productId);
    return result;
  }
  
  // Product Content (AI-generated)
  async getProductContent(productId: string): Promise<ProductContent | undefined> {
    const result = await db.select().from(productContent).where(eq(productContent.productId, productId)).limit(1);
    return result[0];
  }
  
  async createProductContent(content: InsertProductContent): Promise<ProductContent> {
    const result = await db.insert(productContent).values(content).returning();
    return result[0];
  }
  
  async updateProductContent(productId: string, content: Partial<InsertProductContent>): Promise<ProductContent | undefined> {
    const result = await db.update(productContent).set({ ...content, updatedAt: new Date() }).where(eq(productContent.productId, productId)).returning();
    return result[0];
  }
  
  // Product Variant Options
  async getProductVariantOptions(productId: string): Promise<ProductVariantOption[]> {
    return await db
      .select()
      .from(productVariantOptions)
      .where(eq(productVariantOptions.productId, productId))
      .orderBy(productVariantOptions.variantType, productVariantOptions.displayOrder);
  }
}

export const storage = new DatabaseStorage();
