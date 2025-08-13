import { useEffect } from 'react';

interface SeoMetadata {
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

interface SeoHeadProps {
  metadata: SeoMetadata;
}

export function SeoHead({ metadata }: SeoHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = metadata.title;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo]');
    existingMetas.forEach(meta => meta.remove());

    // Remove existing structured data
    const existingStructuredData = document.querySelectorAll('script[type="application/ld+json"][data-seo]');
    existingStructuredData.forEach(script => script.remove());

    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"][data-seo]');
    if (existingCanonical) existingCanonical.remove();

    // Create meta tags
    const metaTags = [
      { name: 'description', content: metadata.description },
      { name: 'keywords', content: metadata.keywords.join(', ') },
      { property: 'og:title', content: metadata.ogTitle || metadata.title },
      { property: 'og:description', content: metadata.ogDescription || metadata.description },
      { property: 'og:type', content: metadata.ogType || 'website' },
      { name: 'twitter:card', content: metadata.twitterCard || 'summary' },
      { name: 'twitter:title', content: metadata.twitterTitle || metadata.title },
      { name: 'twitter:description', content: metadata.twitterDescription || metadata.description },
    ];

    // Add optional meta tags
    if (metadata.ogImage) {
      metaTags.push({ property: 'og:image', content: metadata.ogImage });
    }
    if (metadata.twitterImage) {
      metaTags.push({ name: 'twitter:image', content: metadata.twitterImage });
    }

    // Append meta tags to head
    metaTags.forEach(({ name, property, content }) => {
      const meta = document.createElement('meta');
      if (name) meta.setAttribute('name', name);
      if (property) meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });

    // Add canonical URL
    if (metadata.canonicalUrl) {
      const canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', metadata.canonicalUrl);
      canonical.setAttribute('data-seo', 'true');
      document.head.appendChild(canonical);
    }

    // Add structured data
    if (metadata.structuredData) {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(metadata.structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      const seoElements = document.querySelectorAll('[data-seo]');
      seoElements.forEach(element => element.remove());
    };
  }, [metadata]);

  return null;
}