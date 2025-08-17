import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiService } from "./services/gemini";
import { seoService } from "./services/seo";
import { autoBlogService } from "./services/auto-blog";
import { sendEmail } from "./email";
import { insertContactMessageSchema, insertUserSchema } from "@shared/schema";
import { insertProductSchema, insertBlogPostSchema, insertCategorySchema, insertOrderSchema } from "@shared/schema";
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
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email allaqachon ro'yxatdan o'tgan" });
      }
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        emailVerified: false,
        verificationToken: Math.random().toString(36).substring(2, 15),
      });
      
      // Send verification email (simulated)
      console.log(`Verification email sent to ${user.email}`);
      
      res.json({ 
        message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi",
        userId: user.id,
        emailSent: true
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Ro'yxatdan o'tishda xatolik" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email va parol kiritilishi shart" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
      }
      
      if (!user.isActive) {
        return res.status(401).json({ message: "Hisob bloklangan" });
      }
      
      // Generate simple token (in production, use JWT)
      const token = `user_${user.id}_${Date.now()}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Kirish xatoligi" });
    }
  });

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

  // Get single product by ID (for admin)
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

  // Get single product by slug (for public)
  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product by slug:", error);
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

  // Admin Products Management
  app.get("/api/admin/products", adminAuth, async (req, res) => {
    try {
      const { category, search, sortBy = "createdAt", limit = "50", offset = "0" } = req.query;
      
      const filters = {
        category: category as string,
        search: search as string,
        sortBy: sortBy as string,
        limit: Number(limit),
        offset: Number(offset),
      };

      const result = await storage.getProducts(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

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

  // Admin Categories Management
  app.get("/api/admin/categories", adminAuth, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

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

  app.put("/api/admin/categories/:id", adminAuth, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Admin Orders Management
  app.get("/api/admin/orders", adminAuth, async (req, res) => {
    try {
      const { status, limit = "50", offset = "0" } = req.query;
      
      const filters = {
        status: status as string,
        limit: Number(limit),
        offset: Number(offset),
      };

      const result = await storage.getOrders(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", adminAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.put("/api/admin/orders/:id/status", adminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
      }

      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Create order (public endpoint for cart)
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
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

  // Admin SEO Analysis endpoint
  app.post("/api/admin/seo/analyze", adminAuth, async (req, res) => {
    try {
      const { content, metadata } = req.body;
      
      if (!content || !metadata?.title || !metadata?.description) {
        return res.status(400).json({ message: "Content va metadata kerak" });
      }

      // Simple SEO analysis
      const analysis = {
        score: calculateSeoScore(content, metadata),
        issues: findSeoIssues(content, metadata),
        suggestions: generateSeoSuggestions(content, metadata)
      };

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing SEO:", error);
      res.status(500).json({ message: "SEO tahlil xatosi" });
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

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "Barcha maydonlar to'ldirilishi shart" });
      }

      // Save contact message to database
      const contactMessage = await storage.createContactMessage({
        name,
        email,
        subject,
        message,
        status: "unread"
      });
      
      console.log("=== ALOQA FORMASI XABARI SAQLANDI ===");
      console.log(`ID: ${contactMessage.id}`);
      console.log(`Ism: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Mavzu: ${subject}`);
      console.log(`Xabar: ${message}`);
      console.log("=====================================");
      
      // Try to send email if configured, but don't fail if not
      try {
        await sendEmail({
          to: "akramfarmonov1@gmail.com",
          from: "noreply@bozorcha.uz",
          subject: `Contact Form: ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        });
        console.log("Email ham yuborildi!");
      } catch (emailError) {
        console.log("Email yuborilmadi, lekin xabar saqlandi");
      }
      
      res.json({ message: "Rahmat! Xabaringiz qabul qilindi. Tez orada javob beramiz." });
      
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Xatolik yuz berdi. Qayta urinib ko'ring." });
    }
  });

  // Contact Messages Admin Routes
  app.get("/api/admin/contact-messages", adminAuth, async (req, res) => {
    try {
      const { status, limit, offset } = req.query;
      const result = await storage.getContactMessages({
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.get("/api/admin/contact-messages/:id", adminAuth, async (req, res) => {
    try {
      const message = await storage.getContactMessage(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error fetching contact message:", error);
      res.status(500).json({ message: "Failed to fetch contact message" });
    }
  });

  app.put("/api/admin/contact-messages/:id", adminAuth, async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const message = await storage.updateContactMessage(req.params.id, {
        status,
        adminNotes,
      });
      if (!message) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error updating contact message:", error);
      res.status(500).json({ message: "Failed to update contact message" });
    }
  });

  app.delete("/api/admin/contact-messages/:id", adminAuth, async (req, res) => {
    try {
      const success = await storage.deleteContactMessage(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      res.json({ message: "Contact message deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact message:", error);
      res.status(500).json({ message: "Failed to delete contact message" });
    }
  });

  // Auto-blog service routes
  app.post("/api/admin/auto-blog/start", adminAuth, async (req, res) => {
    try {
      autoBlogService.start();
      res.json({ message: "Avtomatik blog yaratish tizimi ishga tushirildi" });
    } catch (error) {
      console.error("Error starting auto-blog service:", error);
      res.status(500).json({ message: "Tizimni ishga tushirishda xatolik" });
    }
  });

  app.post("/api/admin/auto-blog/stop", adminAuth, async (req, res) => {
    try {
      autoBlogService.stop();
      res.json({ message: "Avtomatik blog yaratish tizimi to'xtatildi" });
    } catch (error) {
      console.error("Error stopping auto-blog service:", error);
      res.status(500).json({ message: "Tizimni to'xtatishda xatolik" });
    }
  });

  app.get("/api/admin/auto-blog/status", adminAuth, async (req, res) => {
    try {
      const status = autoBlogService.getStatus();
      res.json(status);
    } catch (error) {
      console.error("Error getting auto-blog status:", error);
      res.status(500).json({ message: "Status olishda xatolik" });
    }
  });

  app.post("/api/admin/auto-blog/generate", adminAuth, async (req, res) => {
    try {
      const { count = 5 } = req.body;
      const result = await autoBlogService.generatePosts(count);
      res.json({
        message: `${result.success} ta post yaratildi, ${result.failed} ta xatolik`,
        ...result
      });
    } catch (error) {
      console.error("Error generating posts:", error);
      res.status(500).json({ message: "Post yaratishda xatolik" });
    }
  });

  // Start auto-blog service automatically
  console.log("Starting auto-blog service...");
  autoBlogService.start();

  const httpServer = createServer(app);
  return httpServer;
}

// SEO helper functions
function calculateSeoScore(content: string, metadata: any): number {
  let score = 0;
  
  // Title length check (20-60 characters)
  if (metadata.title.length >= 20 && metadata.title.length <= 60) score += 20;
  
  // Description length check (120-160 characters)
  if (metadata.description.length >= 120 && metadata.description.length <= 160) score += 20;
  
  // Content length check (minimum 300 words)
  const wordCount = content.split(/\s+/).length;
  if (wordCount >= 300) score += 20;
  
  // Keywords in title
  if (metadata.keywords && metadata.keywords.some((kw: string) => 
    metadata.title.toLowerCase().includes(kw.toLowerCase()))) score += 15;
  
  // Keywords in description
  if (metadata.keywords && metadata.keywords.some((kw: string) => 
    metadata.description.toLowerCase().includes(kw.toLowerCase()))) score += 15;
  
  // Keywords in content
  if (metadata.keywords && metadata.keywords.some((kw: string) => 
    content.toLowerCase().includes(kw.toLowerCase()))) score += 10;
  
  return score;
}

function findSeoIssues(content: string, metadata: any): string[] {
  const issues = [];
  
  if (metadata.title.length < 20) issues.push("Sarlavha juda qisqa (20 ta belgidan kam)");
  if (metadata.title.length > 60) issues.push("Sarlavha juda uzun (60 ta belgidan ko'p)");
  if (metadata.description.length < 120) issues.push("Meta tavsif juda qisqa (120 ta belgidan kam)");
  if (metadata.description.length > 160) issues.push("Meta tavsif juda uzun (160 ta belgidan ko'p)");
  
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) issues.push(`Kontent juda qisqa (${wordCount} so'z, kamida 300 kerak)`);
  
  if (!metadata.keywords || metadata.keywords.length === 0) {
    issues.push("Kalit so'zlar ko'rsatilmagan");
  }
  
  return issues;
}

function generateSeoSuggestions(content: string, metadata: any): string[] {
  const suggestions = [];
  
  suggestions.push("Sarlavhaga asosiy kalit so'zni qo'shing");
  suggestions.push("Meta tavsifni yanada jozibali qilib yozing");
  suggestions.push("Kontentga ko'proq kalit so'zlarni tabiiy ravishda qo'shing");
  suggestions.push("Sarlavha teglarini (H1, H2, H3) to'g'ri ishlating");
  suggestions.push("Ichki va tashqi havolalar qo'shing");
  
  return suggestions;
}
