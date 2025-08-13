import type { Product, BlogPost } from "@/types";

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  structuredData?: object;
}

export function generateProductSEO(product: Product): SEOData {
  const title = product.metaTitle || `${product.name} - Bozorcha`;
  const description = product.metaDescription || 
    `${product.name} - ${product.description.substring(0, 150)}... Eng yaxshi narxlarda Bozorcha'da xarid qiling.`;
  
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `${window.location.origin}/product/${product.id}`,
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
      "ratingValue": product.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": product.reviewCount
    }
  };

  return {
    title,
    description,
    keywords: product.keywords.join(", "),
    ogTitle: title,
    ogDescription: description,
    ogImage: product.images[0],
    structuredData
  };
}

export function generateBlogPostSEO(post: BlogPost): SEOData {
  const title = post.metaTitle || `${post.title} - Bozorcha Blog`;
  const description = post.metaDescription || post.excerpt;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Organization",
      "name": "Bozorcha"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bozorcha"
    },
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt,
    "keywords": [...post.tags, ...post.trendingKeywords].join(", ")
  };

  return {
    title,
    description,
    keywords: [...post.tags, ...post.trendingKeywords].join(", "),
    ogTitle: title,
    ogDescription: description,
    structuredData
  };
}

export function generateHomeSEO(): SEOData {
  return {
    title: "Bozorcha - O'zbekiston Elektron Savdo Platformasi",
    description: "Bozorcha - O'zbekistondagi eng yirik elektron savdo platformasi. Sifatli mahsulotlar, tez yetkazish va ishonchli xizmat. Minglab mahsulotlar eng yaxshi narxlarda.",
    keywords: "elektron savdo, onlayn xarid, O'zbekiston, mahsulotlar, bozor, elektron do'kon",
    ogTitle: "Bozorcha - O'zbekiston Elektron Savdo Platformasi",
    ogDescription: "Minglab sifatli mahsulotlar, tez yetkazish va ishonchli xizmat. O'zbekistondagi eng yaxshi elektron savdo platformasi.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Bozorcha",
      "url": window.location.origin,
      "description": "O'zbekistondagi eng yirik elektron savdo platformasi",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  };
}
