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

// In-memory storage implementation for fallback
export class MemoryStorage implements IStorage {
  private products: Product[] = [];
  private blogPosts: BlogPost[] = [];
  private categories: Category[] = [];
  private trendAnalyses: TrendAnalysis[] = [];
  private users: User[] = [];
  private nextId = 1;

  constructor() {
    this.initializeWithSampleData();
  }

  private initializeWithSampleData() {
    // Add sample categories
    const electronics = {
      id: "mem_cat_1",
      name: "Elektronika",
      slug: "elektronika",
      description: "Zamonaviy elektronika mahsulotlari",
      isActive: true,
      createdAt: new Date(),
    };

    const fashion = {
      id: "mem_cat_2", 
      name: "Kiyim-kechak",
      slug: "kiyim-kechak",
      description: "Zamonaviy kiyim va aksessuarlar",
      isActive: true,
      createdAt: new Date(),
    };

    this.categories.push(electronics, fashion);

    // Add sample products
    const sampleProducts: Product[] = [
      {
        id: "mem_prod_1",
        name: "Samsung Galaxy S24",
        description: "Zamonaviy smartfon yuqori sifat va tezkor ishlash bilan",
        price: "8999000",
        category: "elektronika",
        images: [
          "/api/placeholder/400/400",
          "/api/placeholder/400/300", 
          "/api/placeholder/300/400"
        ],
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        stock: 15,
        metaTitle: "Samsung Galaxy S24 - Zamonaviy Smartfon | Bozorcha",
        metaDescription: "Samsung Galaxy S24 smartfonini arzon narxda sotib oling. Yuqori sifat, tezkor ishlash va zamonaviy dizayn.",
        keywords: ["smartfon", "samsung", "galaxy", "telefon"],
        rating: "4.8",
        reviewCount: 124,
        isActive: true,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
      },
      {
        id: "mem_prod_2",
        name: "Zamonaviy Ko'ylak",
        description: "Yumshoq va qulay mato bilan tayyorlangan erkaklar uchun zamonaviy ko'ylak",
        price: "189000",
        category: "kiyim-kechak",
        images: [
          "/api/placeholder/400/400",
          "/api/placeholder/400/300",
          "/api/placeholder/300/400"
        ],
        youtubeUrl: "https://www.youtube.com/watch?v=example123",
        stock: 25,
        metaTitle: "Erkaklar Zamonaviy Ko'ylagi | Bozorcha",
        metaDescription: "Sifatli va zamonaviy erkaklar ko'ylagini arzon narxda sotib oling.",
        keywords: ["koylak", "erkaklar", "kiyim", "moda"],
        rating: "4.5",
        reviewCount: 67,
        isActive: true,
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
      },
      {
        id: "mem_prod_3",
        name: "Noutbuk HP Pavilion",
        description: "Ishchi va o'quvchilar uchun mukammal noutbuk - tezkor ishlash va uzun batareya umri",
        price: "5499000",
        category: "elektronika",
        images: [
          "/api/placeholder/400/400",
          "/api/placeholder/400/300",
          "/api/placeholder/300/400"
        ],
        youtubeUrl: "https://www.youtube.com/watch?v=tech_demo",
        stock: 8,
        metaTitle: "HP Pavilion Noutbuki - Arzon Narx | Bozorcha",
        metaDescription: "HP Pavilion noutbuklarini eng yaxshi narxda sotib oling. Ishchi va talabalar uchun ideal.",
        keywords: ["noutbuk", "hp", "kompyuter", "laptop"],
        rating: "4.6",
        reviewCount: 89,
        isActive: true,
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 259200000),
      }
    ];

    this.products.push(...sampleProducts);

    // Add sample blog posts
    const sampleBlogPosts: BlogPost[] = [
      {
        id: "mem_blog_1",
        title: "2024-yilda Eng Yaxshi Smartfonlar",
        content: "Ushbu maqolada 2024-yilning eng yaxshi smartfonlari haqida batafsil ma'lumot beramiz. Samsung Galaxy S24, iPhone 15 va boshqa zamonaviy telefonlar tahlili.",
        excerpt: "2024-yilning eng yaxshi smartfonlari va ularning afzalliklari haqida.",
        tags: ["smartfon", "texnologiya", "2024", "tahlil"],
        trendingKeywords: ["galaxy s24", "iphone 15", "xiaomi"],
        createdBy: "admin",
        status: "published",
        metaTitle: "2024-yilda Eng Yaxshi Smartfonlar - Bozorcha Blog",
        metaDescription: "2024-yilning eng yaxshi smartfonlari haqida to'liq tahlil va tavsiyalar.",
        readTime: 5,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        publishedAt: new Date(Date.now() - 86400000),
      },
      {
        id: "mem_blog_2",
        title: "Moda Tendentsiyalari - 2024 Bahor",
        content: "2024-yil bahorida eng mashhur moda tendentsiyalari. Ranglar, stillar va aksessuarlar haqida batafsil ma'lumot.",
        excerpt: "2024 bahor mavsumining eng so'nggi moda tendentsiyalari.",
        tags: ["moda", "bahor", "tendentsiya", "stil"],
        trendingKeywords: ["bahor moda", "2024 stil", "rang tendentsiya"],
        createdBy: "admin", 
        status: "published",
        metaTitle: "2024 Bahor Moda Tendentsiyalari - Bozorcha",
        metaDescription: "2024-yil bahorining eng so'nggi moda tendentsiyalari va stil maslahatlari.",
        readTime: 4,
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        publishedAt: new Date(Date.now() - 172800000),
      }
    ];

    this.blogPosts.push(...sampleBlogPosts);

    // Create admin user
    this.users.push({
      id: "mem_user_1",
      username: "admin",
      password: "admin123", // In production, this should be hashed
      role: "admin",
      isActive: true,
      createdAt: new Date(),
    });

    this.nextId = 10; // Start IDs from 10 to avoid conflicts
  }

  private generateId(): string {
    return `mem_${this.nextId++}`;
  }

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

    let filtered = this.products.filter(p => p.isActive);

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter(p => parseFloat(p.price) >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => parseFloat(p.price) <= maxPrice);
    }

    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price_high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating":
          return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
        case "newest":
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        default:
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      }
    });

    const total = filtered.length;
    const products = filtered.slice(offset, offset + limit);

    return { products, total };
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      rating: product.rating || "0.0",
      reviewCount: product.reviewCount || 0,
      isActive: product.isActive ?? true,
      images: Array.isArray(product.images) ? product.images : [],
      keywords: Array.isArray(product.keywords) ? product.keywords : [],
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    this.products[index] = {
      ...this.products[index],
      ...product,
      updatedAt: new Date(),
      images: Array.isArray(product.images) ? product.images : this.products[index].images,
      keywords: Array.isArray(product.keywords) ? product.keywords : this.products[index].keywords,
    };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products[index].isActive = false;
    return true;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.categories.filter(c => c.isActive);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const now = new Date();
    const newCategory: Category = {
      ...category,
      id: this.generateId(),
      createdAt: now,
      isActive: category.isActive ?? true,
      description: category.description || null,
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  // Blog Posts
  async getBlogPosts(filters: {
    status?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ posts: BlogPost[]; total: number }> {
    const { status, createdBy, limit = 20, offset = 0 } = filters;

    let filtered = [...this.blogPosts];

    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }

    if (createdBy) {
      filtered = filtered.filter(p => p.createdBy === createdBy);
    }

    filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    const total = filtered.length;
    const posts = filtered.slice(offset, offset + limit);

    return { posts, total };
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.find(p => p.id === id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const now = new Date();
    const newPost: BlogPost = {
      ...post,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      tags: Array.isArray(post.tags) ? post.tags : [],
      trendingKeywords: Array.isArray(post.trendingKeywords) ? post.trendingKeywords : [],
      status: post.status || "draft",
      createdBy: post.createdBy || "admin",
      readTime: post.readTime || 5,
      publishedAt: post.publishedAt || null,
    };
    this.blogPosts.push(newPost);
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    this.blogPosts[index] = {
      ...this.blogPosts[index],
      ...post,
      updatedAt: new Date(),
      tags: Array.isArray(post.tags) ? post.tags : this.blogPosts[index].tags,
      trendingKeywords: Array.isArray(post.trendingKeywords) ? post.trendingKeywords : this.blogPosts[index].trendingKeywords,
    };
    return this.blogPosts[index];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const index = this.blogPosts.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.blogPosts.splice(index, 1);
    return true;
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
    return this.trendAnalyses.find(t => t.date === date);
  }

  async createTrendAnalysis(analysis: InsertTrendAnalysis): Promise<TrendAnalysis> {
    const now = new Date();
    const newAnalysis: TrendAnalysis = {
      ...analysis,
      id: this.generateId(),
      createdAt: now,
      generatedPosts: analysis.generatedPosts || 0,
      successfulPosts: analysis.successfulPosts || 0,
      failedPosts: analysis.failedPosts || 0,
      errors: Array.isArray(analysis.errors) ? analysis.errors : [],
    };
    this.trendAnalyses.push(newAnalysis);
    return newAnalysis;
  }

  async getLatestTrendAnalysis(): Promise<TrendAnalysis | undefined> {
    return this.trendAnalyses
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())[0];
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const now = new Date();
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: now,
      role: user.role || "admin",
      isActive: user.isActive ?? true,
    };
    this.users.push(newUser);
    return newUser;
  }
}

// Try to use database storage, fall back to memory storage if no database URL
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemoryStorage();
