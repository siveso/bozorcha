import type { Product, BlogPost, Category } from "@/../../shared/schema";

export class SeoService {
  // Generate structured data for products
  generateProductStructuredData(product: Product) {
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.images,
      "offers": {
        "@type": "Offer",
        "url": `https://bozorcha.uz/product/${product.id}`,
        "priceCurrency": "UZS",
        "price": product.price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Bozorcha"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || "4.5",
        "reviewCount": product.reviewCount || 1
      },
      "brand": {
        "@type": "Brand",
        "name": product.name.split(' ')[0] // First word as brand
      },
      "category": product.category
    };
  }

  // Generate structured data for blog posts
  generateBlogStructuredData(post: BlogPost) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": "Bozorcha Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bozorcha",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bozorcha.uz/logo.png"
        }
      },
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://bozorcha.uz/blog/${post.id}`
      }
    };
  }

  // Generate SEO metadata for product pages
  generateProductSeo(product: Product) {
    const title = `${product.name} | Bozorcha - Онлайн магазин Узбекистана`;
    const description = `${product.description.substring(0, 140)}... Купить с бесплатной доставкой по Узбекистану.`;
    
    return {
      title,
      description,
      keywords: product.keywords,
      openGraph: {
        title,
        description,
        type: 'product',
        images: product.images,
        url: `https://bozorcha.uz/product/${product.id}`
      },
      structuredData: this.generateProductStructuredData(product)
    };
  }

  // Generate SEO metadata for blog posts
  generateBlogSeo(post: BlogPost) {
    const title = `${post.title} | Bozorcha Blog`;
    const description = post.excerpt || `${post.content.substring(0, 140)}...`;
    
    return {
      title,
      description,
      keywords: post.keywords,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `https://bozorcha.uz/blog/${post.id}`,
        publishedTime: post.publishedAt
      },
      structuredData: this.generateBlogStructuredData(post)
    };
  }

  // Generate homepage SEO
  generateHomepageSeo(productsCount: number, categoriesCount: number) {
    return {
      title: "Bozorcha - Лучший интернет-магазин Узбекистана | Энг яхши онлайн дўкон",
      description: `Покупайте качественные товары в Узбекистане. Более ${productsCount} товаров в ${categoriesCount} категориях. Бесплатная доставка по всему Узбекистану. Sifatli mahsulotlar, tez yetkazish.`,
      keywords: [
        "интернет магазин узбекистан",
        "онлайн дўкон",
        "bozorcha",
        "купить онлайн",
        "sotib olish",
        "доставка ташкент",
        "yetkazish",
        "электроника",
        "elektronika",
        "одежда",
        "kiyim"
      ],
      openGraph: {
        title: "Bozorcha - Интернет-магазин №1 в Узбекистане",
        description: "Лучшие товары по доступным ценам. Быстрая доставка по всему Узбекистану.",
        type: 'website',
        url: 'https://bozorcha.uz',
        locale: 'uz_UZ',
        alternateLocales: ['ru_UZ']
      },
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Bozorcha",
        "alternateName": "Бозорча",
        "url": "https://bozorcha.uz",
        "description": "Интернет-магазин №1 в Узбекистане",
        "inLanguage": ["uz", "ru"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://bozorcha.uz/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    };
  }

  // Generate XML sitemap
  generateSitemap(products: Product[], blogPosts: BlogPost[], categories: Category[]) {
    const baseUrl = 'https://bozorcha.uz';
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <xhtml:link rel="alternate" hreflang="uz" href="${baseUrl}/?lang=uz"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/?lang=ru"/>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Categories -->`;
    
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/?category=${category.slug}</loc>
    <xhtml:link rel="alternate" hreflang="uz" href="${baseUrl}/?category=${category.slug}&amp;lang=uz"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/?category=${category.slug}&amp;lang=ru"/>
    <lastmod>${category.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    // Products
    sitemap += `\n  <!-- Products -->`;
    products.forEach(product => {
      if (product.isActive) {
        sitemap += `
  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <xhtml:link rel="alternate" hreflang="uz" href="${baseUrl}/product/${product.id}?lang=uz"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/product/${product.id}?lang=ru"/>
    <lastmod>${product.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    });
    
    // Blog posts
    sitemap += `\n  <!-- Blog Posts -->`;
    blogPosts.forEach(post => {
      if (post.status === 'published') {
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <xhtml:link rel="alternate" hreflang="uz" href="${baseUrl}/blog/${post.id}?lang=uz"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/blog/${post.id}?lang=ru"/>
    <lastmod>${post.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    });
    
    sitemap += `\n</urlset>`;
    return sitemap;
  }

  // Generate robots.txt
  generateRobotsTxt() {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://bozorcha.uz/sitemap.xml

# Crawl delay for better server performance
Crawl-delay: 1

# Block admin areas
Disallow: /admin
Disallow: /api/admin

# Block temporary/test files
Disallow: /*?test=
Disallow: /*?debug=

# Allow all other content
Allow: /product/
Allow: /blog/
Allow: /api/placeholder/`;
  }

  // Analyze page SEO
  analyzePage(content: string, metadata: any) {
    const analysis = {
      score: 0,
      issues: [] as string[],
      suggestions: [] as string[]
    };

    // Title analysis
    if (!metadata.title) {
      analysis.issues.push("Sarlavha (title) yo'q");
    } else {
      if (metadata.title.length < 20) {
        analysis.issues.push("Sarlavha juda qisqa (20 belgidan kam)");
      } else if (metadata.title.length > 70) {
        analysis.issues.push("Sarlavha juda uzun (70 belgidan ko'p)");
      } else {
        analysis.score += 20;
      }
    }

    // Description analysis
    if (!metadata.description) {
      analysis.issues.push("Meta tavsif yo'q");
    } else {
      if (metadata.description.length < 120) {
        analysis.issues.push("Meta tavsif juda qisqa (120 belgidan kam)");
      } else if (metadata.description.length > 160) {
        analysis.issues.push("Meta tavsif juda uzun (160 belgidan ko'p)");
      } else {
        analysis.score += 20;
      }
    }

    // Content analysis
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      analysis.issues.push(`Kontent juda qisqa (${wordCount} so'z, kamida 300 kerak)`);
    } else {
      analysis.score += 20;
    }

    // Keywords analysis
    if (!metadata.keywords || metadata.keywords.length === 0) {
      analysis.issues.push("Kalit so'zlar ko'rsatilmagan");
    } else {
      analysis.score += 15;
      
      // Check if keywords are in title and description
      const hasKeywordInTitle = metadata.keywords.some((kw: string) => 
        metadata.title?.toLowerCase().includes(kw.toLowerCase())
      );
      
      const hasKeywordInDescription = metadata.keywords.some((kw: string) => 
        metadata.description?.toLowerCase().includes(kw.toLowerCase())
      );
      
      if (hasKeywordInTitle) analysis.score += 10;
      if (hasKeywordInDescription) analysis.score += 10;
    }

    // Generate suggestions
    if (analysis.score < 40) {
      analysis.suggestions.push("Sarlavha va meta tavsifni kalit so'zlar bilan boyiting");
    }
    
    if (analysis.score < 60) {
      analysis.suggestions.push("Kontentga ko'proq kalit so'zlarni tabiiy ravishda qo'shing");
    }
    
    analysis.suggestions.push("H1, H2, H3 teglarini to'g'ri ishlating");
    analysis.suggestions.push("Ichki havolalar (internal links) qo'shing");
    analysis.suggestions.push("Rasmlar uchun alt atributlarini qo'shing");
    analysis.suggestions.push("Sahifa yuklanish tezligini yaxshilang");

    return analysis;
  }
}

// Export singleton instance
export const seoService = new SeoService();