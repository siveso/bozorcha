import { GoogleGenAI } from "@google/genai";
import { storage } from "../storage";
import type { InsertBlogPost, InsertTrendAnalysis } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "" 
});

export interface TrendKeyword {
  keyword: string;
  score: number;
}

export interface TrendAnalysisResult {
  date: string;
  trends: TrendKeyword[];
}

export interface BlogGenerationResult {
  generated: number;
  success: number;
  failed: number;
  errors: string[];
}

export class GeminiService {
  async analyzeDailyTrends(): Promise<TrendAnalysisResult> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const prompt = `
O'zbekistonda bugungi kunda eng mashhur va trendda bo'lgan mahsulot kategoriyalari va kalit so'zlarni tahlil qiling.
Elektron savdo, texnologiya, kiyim, uy jihozlari, kitoblar, sport tovarlari va go'zallik mahsulotlari bo'yicha 
eng qizg'in mavzularni aniqlang.

Javobni JSON formatida bering:
{
  "trends": [
    {"keyword": "kalit so'z", "score": 0-100 orasida reyting},
    ...
  ]
}

Kamida 10 ta kalit so'z bering va ularni O'zbek tilida yozing.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              trends: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    keyword: { type: "string" },
                    score: { type: "number" }
                  },
                  required: ["keyword", "score"]
                }
              }
            },
            required: ["trends"]
          }
        },
        contents: prompt,
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from Gemini API");
      }

      const data = JSON.parse(rawJson);
      return {
        date: today,
        trends: data.trends || []
      };

    } catch (error) {
      console.error("Error analyzing trends:", error);
      throw new Error(`Failed to analyze trends: ${error}`);
    }
  }

  async generateBlogPost(keyword: string, trends: TrendKeyword[]): Promise<InsertBlogPost> {
    try {
      const prompt = `
"${keyword}" mavzusi bo'yicha O'zbek tilida qiziqarli va foydali blog maqolasi yozing.
Maqola e-commerce platformasi uchun bo'lib, o'quvchilarga mahsulot tanlash va xarid qilishda yordam berishi kerak.

Maqola tuzilishi:
- Qiziqarli sarlavha
- Qisqacha tavsif (excerpt) 
- To'liq kontent (kamida 500 so'z)
- SEO uchun meta title va description
- 3-5 ta teglar

Javobni JSON formatida bering:
{
  "title": "Maqola sarlavhasi",
  "excerpt": "Qisqacha tavsif (150 so'z ichida)",
  "content": "To'liq maqola matni",
  "metaTitle": "SEO title",
  "metaDescription": "SEO description", 
  "tags": ["teg1", "teg2", "teg3"],
  "readTime": 5
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              excerpt: { type: "string" },
              content: { type: "string" },
              metaTitle: { type: "string" },
              metaDescription: { type: "string" },
              tags: { 
                type: "array",
                items: { type: "string" }
              },
              readTime: { type: "number" }
            },
            required: ["title", "excerpt", "content", "metaTitle", "metaDescription", "tags", "readTime"]
          }
        },
        contents: prompt,
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from Gemini API");
      }

      const data = JSON.parse(rawJson);
      
      return {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags,
        trendingKeywords: trends.map(t => t.keyword),
        readTime: data.readTime,
        createdBy: "auto",
        status: "published",
        publishedAt: new Date(),
      };

    } catch (error) {
      console.error("Error generating blog post:", error);
      throw new Error(`Failed to generate blog post for "${keyword}": ${error}`);
    }
  }

  async generateDailyBlogPosts(): Promise<BlogGenerationResult> {
    try {
      // Get today's trend analysis
      const today = new Date().toISOString().split('T')[0];
      let trendAnalysis = await storage.getTrendAnalysis(today);
      
      // If no analysis exists for today, create one
      if (!trendAnalysis) {
        const analysisResult = await this.analyzeDailyTrends();
        const analysis: InsertTrendAnalysis = {
          date: today,
          trends: analysisResult.trends,
          generatedPosts: 0,
          successfulPosts: 0,
          failedPosts: 0,
          errors: []
        };
        trendAnalysis = await storage.createTrendAnalysis(analysis);
      }

      // Generate 10-12 blog posts based on trends
      const targetPosts = Math.floor(Math.random() * 3) + 10; // 10-12 posts
      const topTrends = trendAnalysis.trends
        .sort((a, b) => b.score - a.score)
        .slice(0, targetPosts);

      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const trend of topTrends) {
        try {
          const blogPost = await this.generateBlogPost(trend.keyword, trendAnalysis.trends);
          await storage.createBlogPost(blogPost);
          success++;
        } catch (error) {
          failed++;
          errors.push(`Failed to generate post for "${trend.keyword}": ${error}`);
        }
      }

      // Update trend analysis with results
      await storage.createTrendAnalysis({
        date: today,
        trends: trendAnalysis.trends,
        generatedPosts: targetPosts,
        successfulPosts: success,
        failedPosts: failed,
        errors
      });

      return {
        generated: targetPosts,
        success,
        failed,
        errors
      };

    } catch (error) {
      console.error("Error generating daily blog posts:", error);
      throw new Error(`Failed to generate daily blog posts: ${error}`);
    }
  }
}

export const geminiService = new GeminiService();
