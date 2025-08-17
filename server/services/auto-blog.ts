import { storage } from "../storage";
import { geminiService } from "./gemini";
import { type InsertBlogPost } from "@shared/schema";

export class AutoBlogService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Start automatic blog post generation
  start() {
    if (this.isRunning) {
      console.log("Auto blog service already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting auto blog post generation service...");

    // Run immediately
    this.generateDailyPosts();

    // Run every 24 hours (86400000 ms)
    this.intervalId = setInterval(() => {
      this.generateDailyPosts();
    }, 86400000);
  }

  // Stop the service
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("Auto blog service stopped");
  }

  // Generate daily blog posts
  async generateDailyPosts() {
    try {
      console.log("Generating daily blog posts...");
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already generated posts today
      const existingAnalysis = await storage.getTrendAnalysis(today);
      if (existingAnalysis && existingAnalysis.generatedPosts >= 10) {
        console.log("Daily posts already generated for today");
        return;
      }

      // Get trend analysis
      let trendAnalysis = existingAnalysis;
      if (!trendAnalysis) {
        console.log("Generating trend analysis...");
        const analysisResult = await geminiService.analyzeDailyTrends();
        const analysis = {
          date: today,
          trends: analysisResult.trends,
          generatedPosts: 0,
          successfulPosts: 0,
          failedPosts: 0,
          errors: []
        };
        trendAnalysis = await storage.createTrendAnalysis(analysis);
      }

      const targetPosts = 12;
      const currentPosts = trendAnalysis.generatedPosts || 0;
      const postsToGenerate = targetPosts - currentPosts;

      if (postsToGenerate <= 0) {
        console.log("Target number of posts already reached");
        return;
      }

      console.log(`Generating ${postsToGenerate} blog posts...`);
      
      const topics = [
        "Uzbekistonda onlayn xaridlar",
        "Eng yaxshi smartfon modellari",
        "Moda tendentsiyalari 2025",
        "Uy jihozlari tanlash bo'yicha maslahatlar",
        "Texnologiya yangiliklari",
        "Kiyim-kechak saqlash qoidalari",
        "Sport kiyimlari tanlash",
        "Kosmetika mahsulotlari haqida",
        "Bolalar kiyimlari",
        "Ofis jihozlari",
        "Oshxona anjomlar",
        "Go'zallik maslahatlari"
      ];

      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < postsToGenerate; i++) {
        try {
          const topic = topics[Math.floor(Math.random() * topics.length)];
          const randomKeywords = Array.isArray(trendAnalysis.trends) ? 
            trendAnalysis.trends
              .sort(() => 0.5 - Math.random())
              .slice(0, 3)
              .map(t => t.keyword) : [];

          console.log(`Generating post ${i + 1}: ${topic}`);
          
          const blogPost = await geminiService.generateBlogPost(topic, trendAnalysis.trends || []);

          const postData: InsertBlogPost = {
            title: blogPost.title,
            content: blogPost.content,
            excerpt: blogPost.excerpt,
            tags: blogPost.tags,
            trendingKeywords: randomKeywords,
            createdBy: "auto",
            status: "published",
            metaTitle: blogPost.metaTitle,
            metaDescription: blogPost.metaDescription,
            readTime: Math.floor(blogPost.content.length / 200), // Estimate read time
            publishedAt: new Date(),
          };

          await storage.createBlogPost(postData);
          successCount++;
          
          // Wait 2 seconds between posts to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error: any) {
          console.error(`Error generating post ${i + 1}:`, error);
          failCount++;
          errors.push(error.message || "Unknown error");
        }
      }

      // Update trend analysis with results
      const updatedAnalysis = await storage.getTrendAnalysis(today);
      if (updatedAnalysis) {
        await storage.createTrendAnalysis({
          date: today,
          trends: updatedAnalysis.trends,
          generatedPosts: (updatedAnalysis.generatedPosts || 0) + successCount,
          successfulPosts: (updatedAnalysis.successfulPosts || 0) + successCount,
          failedPosts: (updatedAnalysis.failedPosts || 0) + failCount,
          errors: [...(updatedAnalysis.errors || []), ...errors]
        });
      }

      console.log(`Blog generation completed. Success: ${successCount}, Failed: ${failCount}`);
      
    } catch (error) {
      console.error("Error in daily blog generation:", error);
    }
  }

  // Manual trigger for generating posts
  async generatePosts(count = 5): Promise<{ success: number; failed: number; errors: string[] }> {
    console.log(`Manually generating ${count} blog posts...`);
    
    try {
      // Get or create trend analysis for today
      const today = new Date().toISOString().split('T')[0];
      let trendAnalysis = await storage.getTrendAnalysis(today);
      
      if (!trendAnalysis) {
        console.log("Generating trend analysis...");
        trendAnalysis = await geminiService.generateTrendAnalysis();
        await storage.createTrendAnalysis(trendAnalysis);
      }

      const topics = [
        "Uzbekistonda onlayn xaridlar",
        "Eng yaxshi smartfon modellari", 
        "Moda tendentsiyalari 2025",
        "Uy jihozlari tanlash bo'yicha maslahatlar",
        "Texnologiya yangiliklari"
      ];

      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < count; i++) {
        try {
          const topic = topics[Math.floor(Math.random() * topics.length)];
          const randomKeywords = trendAnalysis.trends
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(t => t.keyword);

          const blogPost = await geminiService.generateBlogPost({
            topic,
            keywords: randomKeywords,
            trends: trendAnalysis.trends
          });

          const postData: InsertBlogPost = {
            title: blogPost.title,
            content: blogPost.content,
            excerpt: blogPost.excerpt,
            tags: blogPost.tags,
            trendingKeywords: randomKeywords,
            createdBy: "auto",
            status: "published",
            metaTitle: blogPost.metaTitle,
            metaDescription: blogPost.metaDescription,
            readTime: Math.floor(blogPost.content.length / 200),
            publishedAt: new Date(),
          };

          await storage.createBlogPost(postData);
          successCount++;
          
          // Wait between posts
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error: any) {
          console.error(`Error generating post ${i + 1}:`, error);
          failCount++;
          errors.push(error.message || "Unknown error");
        }
      }

      return { success: successCount, failed: failCount, errors };
      
    } catch (error: any) {
      console.error("Error in manual blog generation:", error);
      return { success: 0, failed: count, errors: [error.message] };
    }
  }

  // Get service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      startTime: this.intervalId ? new Date() : null
    };
  }
}

export const autoBlogService = new AutoBlogService();