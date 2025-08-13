import { useEffect } from "react";
import type { SEOData } from "@/lib/seo";

interface SEOHeadProps {
  seo: SEOData;
}

export function SEOHead({ seo }: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = seo.title;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMeta("description", seo.description);
    updateMeta("keywords", seo.keywords);
    
    updateProperty("og:title", seo.ogTitle);
    updateProperty("og:description", seo.ogDescription);
    updateProperty("og:type", "website");
    updateProperty("og:url", window.location.href);
    
    if (seo.ogImage) {
      updateProperty("og:image", seo.ogImage);
    }

    // Add structured data
    if (seo.structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(seo.structuredData);
    }
  }, [seo]);

  return null;
}
