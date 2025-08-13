import type { Product, BlogPost, Category } from "@shared/schema";

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SeoService {
  private baseUrl = process.env.BASE_URL || 'https://bozorcha.uz';

  // Generate SEO metadata for products
  generateProductSeo(product: Product): SeoMetadata {
    const title = product.metaTitle || `${product.name} - Arzon Narx | Bozorcha`;
    const description = product.metaDescription || 
      `${product.name} mahsulotini eng yaxshi narxda sotib oling. ${product.description.substring(0, 120)}...`;
    
    const keywords = product.keywords || [];
    const enhancedKeywords = [
      ...keywords,
      product.name.toLowerCase(),
      product.category,
      'arzon narx',
      'onlayn xarid',
      'bozorcha',
      'o\'zbekiston'
    ];

    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.images?.[0] || '',
      "brand": {
        "@type": "Brand",
        "name": "Bozorcha"
      },
      "offers": {
        "@type": "Offer",
        "url": `${this.baseUrl}/product/${product.id}`,
        "priceCurrency": "UZS",
        "price": product.price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Bozorcha"
        }
      },
      "aggregateRating": product.rating && product.reviewCount ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      } : undefined,
      "category": product.category
    };

    return {
      title,
      description,
      keywords: enhancedKeywords,
      canonicalUrl: `${this.baseUrl}/product/${product.id}`,
      ogTitle: title,
      ogDescription: description,
      ogImage: product.images?.[0] || `${this.baseUrl}/api/placeholder/800/600`,
      ogType: 'product',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: product.images?.[0] || `${this.baseUrl}/api/placeholder/800/600`,
      structuredData
    };
  }

  // Generate SEO metadata for blog posts
  generateBlogSeo(post: BlogPost): SeoMetadata {
    const title = post.metaTitle || `${post.title} | Bozorcha Blog`;
    const description = post.metaDescription || post.excerpt;
    
    const keywords = [
      ...(post.tags || []),
      ...(post.trendingKeywords || []),
      'blog',
      'maslahat',
      'bozorcha'
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Organization",
        "name": "Bozorcha"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bozorcha",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`
        }
      },
      "datePublished": post.publishedAt?.toISOString(),
      "dateModified": post.updatedAt?.toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/blog/${post.id}`
      },
      "wordCount": post.content.split(' ').length,
      "keywords": keywords.join(', ')
    };

    return {
      title,
      description,
      keywords,
      canonicalUrl: `${this.baseUrl}/blog/${post.id}`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'article',
      twitterCard: 'summary',
      twitterTitle: title,
      twitterDescription: description,
      structuredData
    };
  }

  // Generate SEO metadata for category pages
  generateCategorySeo(category: Category, productCount: number): SeoMetadata {
    const title = `${category.name} - ${productCount} ta mahsulot | Bozorcha`;
    const description = category.description || 
      `${category.name} kategoriyasidagi ${productCount} ta mahsulotni ko'ring. Eng yaxshi narxlar va sifatli xizmat.`;
    
    const keywords = [
      category.name.toLowerCase(),
      category.slug,
      'kategoriya',
      'mahsulotlar',
      'bozorcha',
      'onlayn xarid'
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": category.name,
      "description": description,
      "url": `${this.baseUrl}/category/${category.slug}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": productCount
      }
    };

    return {
      title,
      description,
      keywords,
      canonicalUrl: `${this.baseUrl}/category/${category.slug}`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website',
      twitterCard: 'summary',
      twitterTitle: title,
      twitterDescription: description,
      structuredData
    };
  }

  // Generate homepage SEO
  generateHomepageSeo(totalProducts: number, totalCategories: number): SeoMetadata {
    const title = "Bozorcha - O'zbekistonning Eng Yaxshi Onlayn Do'koni";
    const description = `${totalProducts} ta mahsulot, ${totalCategories} ta kategoriya. Eng yaxshi narxlar va tezkor yetkazib berish. Bozorcha bilan xarid qiling!`;
    
    const keywords = [
      'onlayn dokon',
      'elektronika',
      'kiyim',
      'uy jihozlari',
      'arzon narx',
      'tezkor yetkazib berish',
      'o\'zbekiston',
      'bozorcha'
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Bozorcha",
      "url": this.baseUrl,
      "description": description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${this.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bozorcha",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`
        }
      }
    };

    return {
      title,
      description,
      keywords,
      canonicalUrl: this.baseUrl,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      structuredData
    };
  }

  // Generate XML sitemap
  generateSitemap(products: Product[], blogPosts: BlogPost[], categories: Category[]): string {
    const entries: SitemapEntry[] = [
      // Homepage
      {
        url: this.baseUrl,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 1.0
      },
      // Categories
      ...categories.map(category => ({
        url: `${this.baseUrl}/category/${category.slug}`,
        lastmod: category.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        changefreq: 'weekly' as const,
        priority: 0.8
      })),
      // Products
      ...products.filter(p => p.isActive).map(product => ({
        url: `${this.baseUrl}/product/${product.id}`,
        lastmod: product.updatedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        changefreq: 'weekly' as const,
        priority: 0.7
      })),
      // Blog posts
      ...blogPosts.filter(p => p.status === 'published').map(post => ({
        url: `${this.baseUrl}/blog/${post.id}`,
        lastmod: post.updatedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        changefreq: 'monthly' as const,
        priority: 0.6
      })),
      // Blog index
      {
        url: `${this.baseUrl}/blog`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.8
      }
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/admin/

# Block placeholder images
Disallow: /api/placeholder/

# Crawl delay
Crawl-delay: 1`;
  }

  // Analyze page performance for SEO
  analyzePage(content: string, metadata: SeoMetadata): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Title length check
    if (metadata.title.length < 30) {
      issues.push("Sarlavha juda qisqa (30 belgidan kam)");
      score -= 10;
    } else if (metadata.title.length > 60) {
      issues.push("Sarlavha juda uzun (60 belgidan ko'p)");
      score -= 10;
    }

    // Description length check
    if (metadata.description.length < 120) {
      issues.push("Meta tavsif juda qisqa (120 belgidan kam)");
      score -= 10;
    } else if (metadata.description.length > 160) {
      issues.push("Meta tavsif juda uzun (160 belgidan ko'p)");
      score -= 10;
    }

    // Keywords check
    if (metadata.keywords.length < 3) {
      issues.push("Kalit so'zlar etarli emas (3 tadan kam)");
      score -= 5;
    }

    // Content length check
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      issues.push("Kontent juda qisqa (300 so'zdan kam)");
      score -= 15;
    }

    // H1 tag check
    if (!content.includes('<h1>')) {
      issues.push("H1 tegi yo'q");
      score -= 10;
    }

    // Image alt text check
    const imgTags = content.match(/<img[^>]*>/g) || [];
    const imagesWithoutAlt = imgTags.filter(img => !img.includes('alt='));
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} ta rasmda alt matn yo'q`);
      score -= 5 * imagesWithoutAlt.length;
    }

    // Suggestions
    if (score > 90) {
      suggestions.push("SEO optimizatsiya ajoyib!");
    } else if (score > 70) {
      suggestions.push("Yaxshi natija, kichik yaxshilanishlar mumkin");
    } else {
      suggestions.push("SEO ni yaxshilash talab qilinadi");
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }
}

export const seoService = new SeoService();