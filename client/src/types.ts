// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  youtubeUrl?: string;
  stock: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  rating: string;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Blog types
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
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  notes?: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    category: string;
  }>;
  totalAmount: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cart item type
export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  category: string;
}

// API Response types
export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
}