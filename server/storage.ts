import {
  products,
  blogPosts,
  categories,
  trendAnalysis,
  users,
  type Product,
  type InsertProduct,
  type BlogPost,
  type InsertBlogPost,
  type Category,
  type InsertCategory,
  type TrendAnalysis,
  type InsertTrendAnalysis,
  type User,
  type InsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, ilike, and, gte, lte, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Blog Posts
  getBlogPosts(filters?: {
    status?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ posts: BlogPost[]; total: number }>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  bulkCreateBlogPosts(posts: InsertBlogPost[]): Promise<{ success: number; failed: number; errors: string[] }>;

  // Trend Analysis
  getTrendAnalysis(date: string): Promise<TrendAnalysis | undefined>;
  createTrendAnalysis(analysis: InsertTrendAnalysis): Promise<TrendAnalysis>;
  getLatestTrendAnalysis(): Promise<TrendAnalysis | undefined>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ products: Product[]; total: number }> {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      limit = 20,
      offset = 0,
    } = filters;

    let query = db.select().from(products);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(products);

    const conditions = [];

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (minPrice !== undefined) {
      conditions.push(gte(products.price, minPrice.toString()));
    }

    if (maxPrice !== undefined) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    // Apply base condition for active products
    conditions.push(eq(products.isActive, true));
    
    if (conditions.length > 0) {
      const whereClause = and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }

    // Build the final queries
    let orderBy;
    switch (sortBy) {
      case "price_low":
        orderBy = asc(products.price);
        break;
      case "price_high":
        orderBy = desc(products.price);
        break;
      case "rating":
        orderBy = desc(products.rating);
        break;
      case "newest":
        orderBy = desc(products.createdAt);
        break;
      default:
        orderBy = desc(products.createdAt);
    }

    const [productsResult, countResult] = await Promise.all([
      query.orderBy(orderBy).limit(limit).offset(offset),
      countQuery,
    ]);

    return {
      products: productsResult,
      total: countResult[0]?.count || 0,
    };
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db
      .insert(products)
      .values(product)
      .returning();
    return created;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  // Blog Posts
  async getBlogPosts(filters: {
    status?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ posts: BlogPost[]; total: number }> {
    const { status, createdBy, limit = 20, offset = 0 } = filters;

    let query = db.select().from(blogPosts);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(blogPosts);

    const conditions = [];

    if (status) {
      conditions.push(eq(blogPosts.status, status));
    }

    if (createdBy) {
      conditions.push(eq(blogPosts.createdBy, createdBy));
    }

    if (conditions.length > 0) {
      const whereClause = and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }

    const [postsResult, countResult] = await Promise.all([
      query.orderBy(desc(blogPosts.createdAt)).limit(limit).offset(offset),
      countQuery,
    ]);

    return {
      posts: postsResult,
      total: countResult[0]?.count || 0,
    };
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async bulkCreateBlogPosts(posts: InsertBlogPost[]): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const post of posts) {
      try {
        await this.createBlogPost(post);
        success++;
      } catch (error) {
        failed++;
        errors.push(`Failed to create post "${post.title}": ${error}`);
      }
    }

    return { success, failed, errors };
  }

  // Trend Analysis
  async getTrendAnalysis(date: string): Promise<TrendAnalysis | undefined> {
    const [analysis] = await db.select().from(trendAnalysis).where(eq(trendAnalysis.date, date));
    return analysis;
  }

  async createTrendAnalysis(analysis: InsertTrendAnalysis): Promise<TrendAnalysis> {
    const [created] = await db.insert(trendAnalysis).values(analysis).returning();
    return created;
  }

  async getLatestTrendAnalysis(): Promise<TrendAnalysis | undefined> {
    const [latest] = await db
      .select()
      .from(trendAnalysis)
      .orderBy(desc(trendAnalysis.createdAt))
      .limit(1);
    return latest;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
