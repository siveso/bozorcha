import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiService } from "./services/gemini";
import { seoService } from "./services/seo";
import { insertProductSchema, insertBlogPostSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

// Simple auth middleware for admin routes
const adminAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer Gisobot201415*") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Public API routes
  
  // Get all products with filtering
  app.get("/api/products", async (req, res) => {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        search,
        sortBy = "createdAt",
        limit = "20",
        offset = "0"
      } = req.query;

      const filters = {
        category: category as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        search: search as string,
        sortBy: sortBy as string,
        limit: Number(limit),
        offset: Number(offset),
      };

      const result = await storage.getProducts(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const { status = "published", limit = "20", offset = "0" } = req.query;
      
      const filters = {
        status: status as string,
        limit: Number(limit),
        offset: Number(offset),
      };

      const result = await storage.getBlogPosts(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post
  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Admin routes (require authentication)
  
  // Create product
  app.post("/api/admin/products", adminAuth, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product
  app.put("/api/admin/products/:id", adminAuth, async (req, res) => {
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/admin/products/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Create category
  app.post("/api/admin/categories", adminAuth, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Get all blog posts for admin
  app.get("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const { status, createdBy, limit = "20", offset = "0" } = req.query;
      
      const filters = {
        status: status as string,
        createdBy: createdBy as string,
        limit: Number(limit),
        offset: Number(offset),
      };

      const result = await storage.getBlogPosts(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Create blog post
  app.post("/api/admin/blog", adminAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Update blog post
  app.put("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Delete blog post
  app.delete("/api/admin/blog/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Generate daily blog posts with Gemini
  app.post("/api/admin/generate-posts", adminAuth, async (req, res) => {
    try {
      const result = await geminiService.generateDailyBlogPosts();
      res.json(result);
    } catch (error) {
      console.error("Error generating blog posts:", error);
      res.status(500).json({ message: "Failed to generate blog posts" });
    }
  });

  // Run trend analysis
  app.post("/api/admin/analyze-trends", adminAuth, async (req, res) => {
    try {
      const result = await geminiService.analyzeDailyTrends();
      const analysis = await storage.createTrendAnalysis({
        date: result.date,
        trends: result.trends,
        generatedPosts: 0,
        successfulPosts: 0,
        failedPosts: 0,
        errors: []
      });
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing trends:", error);
      res.status(500).json({ message: "Failed to analyze trends" });
    }
  });

  // Get latest trend analysis
  app.get("/api/admin/trends/latest", adminAuth, async (req, res) => {
    try {
      const analysis = await storage.getLatestTrendAnalysis();
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching trend analysis:", error);
      res.status(500).json({ message: "Failed to fetch trend analysis" });
    }
  });

  // SEO Routes

  // Get SEO metadata for a product
  app.get("/api/seo/product/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const seoData = seoService.generateProductSeo(product);
      res.json(seoData);
    } catch (error) {
      console.error("Error generating product SEO:", error);
      res.status(500).json({ message: "Failed to generate SEO data" });
    }
  });

  // Get SEO metadata for a blog post
  app.get("/api/seo/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      const seoData = seoService.generateBlogSeo(post);
      res.json(seoData);
    } catch (error) {
      console.error("Error generating blog SEO:", error);
      res.status(500).json({ message: "Failed to generate SEO data" });
    }
  });

  // Get SEO metadata for homepage
  app.get("/api/seo/homepage", async (req, res) => {
    try {
      const products = await storage.getProducts({ limit: 1000 });
      const categories = await storage.getCategories();
      const seoData = seoService.generateHomepageSeo(products.total, categories.length);
      res.json(seoData);
    } catch (error) {
      console.error("Error generating homepage SEO:", error);
      res.status(500).json({ message: "Failed to generate SEO data" });
    }
  });

  // Generate XML sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const products = await storage.getProducts({ limit: 10000 });
      const blogPosts = await storage.getBlogPosts({ status: "published", limit: 10000 });
      const categories = await storage.getCategories();
      
      const sitemap = seoService.generateSitemap(products.products, blogPosts.posts, categories);
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Generate robots.txt
  app.get("/robots.txt", (req, res) => {
    try {
      const robots = seoService.generateRobotsTxt();
      res.setHeader('Content-Type', 'text/plain');
      res.send(robots);
    } catch (error) {
      console.error("Error generating robots.txt:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });

  // Admin SEO analysis
  app.post("/api/admin/seo/analyze", adminAuth, async (req, res) => {
    try {
      const { content, metadata } = req.body;
      
      if (!content || !metadata) {
        return res.status(400).json({ message: "Content and metadata are required" });
      }

      const analysis = seoService.analyzePage(content, metadata);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing SEO:", error);
      res.status(500).json({ message: "Failed to analyze SEO" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
