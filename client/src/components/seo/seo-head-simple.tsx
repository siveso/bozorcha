import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export function SeoHead({ title, description, keywords, ogImage }: SeoHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
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

    updateMeta("description", description);
    updateMeta("keywords", keywords.join(", "));
    
    // Open Graph tags
    updateProperty("og:title", title);
    updateProperty("og:description", description);
    updateProperty("og:type", "website");
    updateProperty("og:url", window.location.href);
    
    if (ogImage) {
      updateProperty("og:image", ogImage);
    }

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    
    if (ogImage) {
      updateMeta("twitter:image", ogImage);
    }
  }, [title, description, keywords, ogImage]);

  return null;
}