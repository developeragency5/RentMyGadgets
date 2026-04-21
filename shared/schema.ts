import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  brand: text("brand"),
  sku: text("sku"),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  pricePerMonth: decimal("price_per_month", { precision: 10, scale: 2 }).notNull(),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }),
  featured: boolean("featured").default(false).notNull(),
  available: boolean("available").default(true).notNull(),
  availableColors: text("available_colors").array().default([]),
  brandProductUrl: text("brand_product_url"),
  brandSupportUrl: text("brand_support_url"),
  imageUrl: text("image_url"),
  imageUrlOriginal: text("image_url_original"),
  galleryImageUrls: text("gallery_image_urls").array().default([]),
  imageSource: text("image_source"),
  description: text("description"),
  descriptionOriginal: text("description_original"),
  descriptionShort: text("description_short"),
  descriptionLong: text("description_long"),
  specs: text("specs").array(),
  specsJson: jsonb("specs_json"),
  specHtml: text("spec_html"),
  syncStatus: text("sync_status"),
  syncError: text("sync_error"),
  syncSource: text("sync_source"),
  lastSyncAttempt: timestamp("last_sync_attempt"),
  lastSyncSuccess: timestamp("last_sync_success"),
  lastImageSync: timestamp("last_image_sync"),
  imageSourceUrl: text("image_source_url"),
  imageSyncStatus: text("image_sync_status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productVariantOptions = pgTable("product_variant_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  variantType: text("variant_type").notNull(),
  optionLabel: text("option_label").notNull(),
  optionValue: text("option_value").notNull(),
  priceAdjustmentMonthly: decimal("price_adjustment_monthly", { precision: 10, scale: 2 }).default("0").notNull(),
  priceAdjustmentRetail: decimal("price_adjustment_retail", { precision: 10, scale: 2 }).default("0").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  available: boolean("available").default(true).notNull(),
  specsOverride: text("specs_override").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const syncRuns = pgTable("sync_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull(),
  totalProducts: integer("total_products").default(0),
  processed: integer("processed").default(0),
  succeeded: integer("succeeded").default(0),
  failed: integer("failed").default(0),
  skipped: integer("skipped").default(0),
  durationMs: integer("duration_ms"),
  errorSummary: jsonb("error_summary"),
  config: jsonb("config"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const productSyncLogs = pgTable("product_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  runId: varchar("run_id").references(() => syncRuns.id),
  productId: varchar("product_id").references(() => products.id).notNull(),
  productName: text("product_name"),
  brand: text("brand"),
  phase: text("phase"),
  action: text("action"),
  syncType: text("sync_type").notNull(),
  status: text("status").notNull(),
  sourceUrl: text("source_url"),
  imagesFound: integer("images_found").default(0),
  dataFetched: jsonb("data_fetched"),
  errorCode: text("error_code"),
  errorMessage: text("error_message"),
  httpStatus: integer("http_status"),
  attempt: integer("attempt").default(1),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const imageSyncLogs = pgTable("image_sync_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  syncType: text("sync_type").notNull(),
  status: text("status").notNull(),
  sourceUrl: text("source_url"),
  imagesFound: integer("images_found").default(0),
  errorMessage: text("error_message"),
  httpStatus: integer("http_status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productGalleryImages = pgTable("product_gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  imageUrl: text("image_url").notNull(),
  angle: text("angle").notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  source: text("source").notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false).notNull(),
  aiModel: text("ai_model"),
  aiPrompt: text("ai_prompt"),
  width: integer("width"),
  height: integer("height"),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const manufacturerGalleryAssets = pgTable("manufacturer_gallery_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  sourceUrl: text("source_url").notNull(),
  localPath: text("local_path"),
  displayOrder: integer("display_order").default(0).notNull(),
  role: text("role").default('gallery'),
  altText: text("alt_text"),
  detectedAngle: text("detected_angle"),
  cameraHeight: text("camera_height"),
  framing: text("framing"),
  lightingStyle: text("lighting_style"),
  backgroundDescription: text("background_description"),
  focalFeatures: text("focal_features").array(),
  descriptorJson: jsonb("descriptor_json"),
  dominantColor: text("dominant_color"),
  width: integer("width"),
  height: integer("height"),
  hash: text("hash"),
  analyzedAt: timestamp("analyzed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiGenerationRuns = pgTable("ai_generation_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  assetId: varchar("asset_id").references(() => manufacturerGalleryAssets.id),
  status: text("status").default('pending').notNull(),
  sourceType: text("source_type").default('manufacturer'),
  generatedImagePath: text("generated_image_path"),
  generatedImageUrl: text("generated_image_url"),
  generatedHash: text("generated_hash"),
  similarityScore: decimal("similarity_score", { precision: 5, scale: 4 }),
  promptUsed: text("prompt_used"),
  errorMessage: text("error_message"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const aiBatchRuns = pgTable("ai_batch_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  status: text("status").default('pending').notNull(),
  totalProducts: integer("total_products").default(0).notNull(),
  totalImages: integer("total_images").default(0).notNull(),
  processedImages: integer("processed_images").default(0).notNull(),
  succeededImages: integer("succeeded_images").default(0).notNull(),
  failedImages: integer("failed_images").default(0).notNull(),
  skippedImages: integer("skipped_images").default(0).notNull(),
  currentBrand: text("current_brand"),
  currentProduct: text("current_product"),
  config: jsonb("config"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const aiBatchItems = pgTable("ai_batch_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  runId: varchar("run_id").references(() => aiBatchRuns.id).notNull(),
  brand: text("brand").notNull(),
  productModel: text("product_model").notNull(),
  viewType: text("view_type").notNull(),
  viewOrder: integer("view_order").default(0).notNull(),
  status: text("status").default('pending').notNull(),
  outputDir: text("output_dir").notNull(),
  filenameBase: text("filename_base").notNull(),
  outputPath: text("output_path"),
  prompt: text("prompt"),
  errorMessage: text("error_message"),
  durationMs: integer("duration_ms"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const carts = pgTable("carts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  rentalPeriod: text("rental_period").notNull(),
  rentalDuration: text("rental_duration").default("monthly"),
  rentalMonths: integer("rental_months").default(1),
  variantConfiguration: jsonb("variant_configuration"),
  variantPriceAdjustment: decimal("variant_price_adjustment", { precision: 10, scale: 2 }).default("0"),
  selectedColor: text("selected_color"),
  hasGadgetCare: boolean("has_gadget_care").default(false),
  productName: text("product_name").notNull(),
  productPricePerMonth: decimal("product_price_per_month", { precision: 10, scale: 2 }).notNull(),
  productImageUrl: text("product_image_url"),
  productBrand: text("product_brand"),
  productSpecs: text("product_specs").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: text("status").notNull(), // 'pending', 'active', 'returned', 'cancelled'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  pricePerMonth: decimal("price_per_month", { precision: 10, scale: 2 }).notNull(),
  rentalPeriod: text("rental_period").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  author: text("author").notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productContent = pgTable("product_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull().unique(),
  howItWorks: text("how_it_works"),
  keyBenefits: text("key_benefits").array().default([]),
  considerations: text("considerations").array().default([]),
  targetAudience: jsonb("target_audience"),
  safetyGuidelines: text("safety_guidelines").array().default([]),
  maintenanceTips: text("maintenance_tips").array().default([]),
  specifications: jsonb("specifications"),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertProductVariantOptionSchema = createInsertSchema(productVariantOptions).omit({
  id: true,
  createdAt: true,
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export const insertProductContentSchema = createInsertSchema(productContent).omit({
  id: true,
  generatedAt: true,
  updatedAt: true,
});

export const insertImageSyncLogSchema = createInsertSchema(imageSyncLogs).omit({
  id: true,
  createdAt: true,
});

export const insertProductGalleryImageSchema = createInsertSchema(productGalleryImages).omit({
  id: true,
  createdAt: true,
});

export const insertManufacturerGalleryAssetSchema = createInsertSchema(manufacturerGalleryAssets).omit({
  id: true,
  createdAt: true,
});

export const insertAiGenerationRunSchema = createInsertSchema(aiGenerationRuns).omit({
  id: true,
  createdAt: true,
});

export const insertSyncRunSchema = createInsertSchema(syncRuns).omit({
  id: true,
  startedAt: true,
});

export const insertProductSyncLogSchema = createInsertSchema(productSyncLogs).omit({
  id: true,
  createdAt: true,
});

export const insertAiBatchRunSchema = createInsertSchema(aiBatchRuns).omit({
  id: true,
  createdAt: true,
});

export const insertAiBatchItemSchema = createInsertSchema(aiBatchItems).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertProductVariantOption = z.infer<typeof insertProductVariantOptionSchema>;
export type ProductVariantOption = typeof productVariantOptions.$inferSelect;

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertProductContent = z.infer<typeof insertProductContentSchema>;
export type ProductContent = typeof productContent.$inferSelect;

export type InsertImageSyncLog = z.infer<typeof insertImageSyncLogSchema>;
export type ImageSyncLog = typeof imageSyncLogs.$inferSelect;

export type InsertProductGalleryImage = z.infer<typeof insertProductGalleryImageSchema>;
export type ProductGalleryImage = typeof productGalleryImages.$inferSelect;

export type InsertManufacturerGalleryAsset = z.infer<typeof insertManufacturerGalleryAssetSchema>;
export type ManufacturerGalleryAsset = typeof manufacturerGalleryAssets.$inferSelect;

export type InsertAiGenerationRun = z.infer<typeof insertAiGenerationRunSchema>;
export type AiGenerationRun = typeof aiGenerationRuns.$inferSelect;

export type InsertSyncRun = z.infer<typeof insertSyncRunSchema>;
export type SyncRun = typeof syncRuns.$inferSelect;

export type InsertProductSyncLog = z.infer<typeof insertProductSyncLogSchema>;
export type ProductSyncLog = typeof productSyncLogs.$inferSelect;

export type InsertAiBatchRun = z.infer<typeof insertAiBatchRunSchema>;
export type AiBatchRun = typeof aiBatchRuns.$inferSelect;

export type InsertAiBatchItem = z.infer<typeof insertAiBatchItemSchema>;
export type AiBatchItem = typeof aiBatchItems.$inferSelect;
