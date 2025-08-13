import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  youtubeUrl: text("youtube_url"),
  stock: integer("stock").notNull().default(0),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_products_category").on(table.category),
  index("idx_products_price").on(table.price),
  index("idx_products_active").on(table.isActive),
]);

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  trendingKeywords: jsonb("trending_keywords").$type<string[]>().default([]),
  createdBy: varchar("created_by").notNull().default("admin"), // "admin" | "auto"
  status: varchar("status").notNull().default("draft"), // "draft" | "published" | "error"
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  readTime: integer("read_time").default(5), // minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
}, (table) => [
  index("idx_blog_posts_status").on(table.status),
  index("idx_blog_posts_created_by").on(table.createdBy),
  index("idx_blog_posts_published").on(table.publishedAt),
]);

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trend analysis results table
export const trendAnalysis = pgTable("trend_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  trends: jsonb("trends").$type<Array<{ keyword: string; score: number }>>().notNull(),
  generatedPosts: integer("generated_posts").default(0),
  successfulPosts: integer("successful_posts").default(0),
  failedPosts: integer("failed_posts").default(0),
  errors: jsonb("errors").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_trend_analysis_date").on(table.date),
]);

// Users table for admin auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role").notNull().default("admin"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.category],
    references: [categories.slug],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Insert schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertTrendAnalysisSchema = createInsertSchema(trendAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type TrendAnalysis = typeof trendAnalysis.$inferSelect;
export type InsertTrendAnalysis = z.infer<typeof insertTrendAnalysisSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
