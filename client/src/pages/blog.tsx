import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BlogCard } from "@/components/blog-card";
import { BlogSearch } from "@/components/blog-search";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function BlogPage() {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 9;

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog?status=published&limit=100");
      return await response.json();
    },
  });

  const handleFilteredPosts = (posts: BlogPost[]) => {
    setFilteredPosts(posts);
    setCurrentPage(0);
  };

  const displayPosts = filteredPosts.length > 0 ? filteredPosts : (blogData?.posts || []);
  const paginatedPosts = displayPosts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const totalPages = Math.ceil(displayPosts.length / pageSize);

  const seoData = {
    title: "Blog - Bozorcha",
    description: "Xarid qilish, mahsulotlar va texnologiya haqida foydali maqolalar. Bozorcha blogida eng so'nggi yangiliklar va maslahatlarni o'qing.",
    keywords: ["blog", "maqolalar", "xarid maslahatlar", "mahsulot sharhlari", "texnologiya yangiliklari"],
    ogTitle: "Blog - Bozorcha",
    ogDescription: "Foydali maqolalar va maslahatlar Bozorcha blogida",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Bozorcha Blog",
      "description": "Xarid qilish va mahsulotlar haqida foydali maqolalar",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "publisher": {
        "@type": "Organization",
        "name": "Bozorcha"
      }
    }
  };

  return (
    <>
      <SeoHead metadata={seoData} />
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen className="mx-auto h-16 w-16 mb-6 opacity-90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Bozorcha Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Xarid qilish, mahsulotlar va texnologiya haqida eng foydali maqolalar
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BlogSearch 
            posts={blogData?.posts || []}
            onFilteredPosts={handleFilteredPosts}
            loading={isLoading}
          />
        </section>

        {/* Blog Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Barcha maqolalar
            </h2>
            <p className="text-gray-600">
              <span data-testid="total-posts">{displayPosts.length}</span> ta maqola topildi
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post: any) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Empty State */}
              {displayPosts.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Maqolalar topilmadi
                  </h3>
                  <p className="text-gray-600">
                    Qidiruv so'zlarini o'zgartirib ko'ring
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex space-x-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      data-testid="blog-prev-page"
                    >
                      Oldingi
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      const page = currentPage < 3 ? i : currentPage - 2 + i;
                      if (page >= totalPages) return null;
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          data-testid={`blog-page-${page + 1}`}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      data-testid="blog-next-page"
                    >
                      Keyingi
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </section>

        {/* Newsletter Subscription */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Yangiliklar uchun obuna bo'ling
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Eng so'nggi maqolalar va maslahatlardan xabardor bo'lib turing
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <Input
                type="email"
                placeholder="Email manzilingiz..."
                className="flex-1"
                data-testid="newsletter-email"
              />
              <Button className="px-8" data-testid="newsletter-subscribe">
                Obuna bo'lish
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
