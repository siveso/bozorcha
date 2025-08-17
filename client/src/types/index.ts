export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  stock: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  rating: string;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  trendingKeywords: string[];
  createdBy: string;
  status: string;
  metaTitle?: string;
  metaDescription?: string;
  readTime: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface TrendAnalysis {
  id: string;
  date: string;
  trends: Array<{ keyword: string; score: number }>;
  generatedPosts: number;
  successfulPosts: number;
  failedPosts: number;
  errors: string[];
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}
