import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BlogCard } from "@/components/blog-card";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { generateBlogPostSEO } from "@/lib/seo";
import { Link } from "wouter";
import type { BlogPost } from "@/types";

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["/api/blog", postId],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${postId}`);
      if (!response.ok) {
        throw new Error("Blog post not found");
      }
      return await response.json();
    },
    enabled: !!postId,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["/api/blog", "related"],
    queryFn: async () => {
      const response = await fetch("/api/blog?status=published&limit=3");
      return await response.json();
    },
    enabled: !!post,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Maqola topilmadi</h2>
              <p className="text-gray-600 mb-6">Izlayotgan maqolangiz mavjud emas yoki o'chirilgan.</p>
              <Link href="/blog">
                <Button>Blogga qaytish</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  const seoData = generateBlogPostSEO(post as BlogPost);

  return (
    <>
      <SEOHead seo={seoData} />
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" className="mb-6" data-testid="back-to-blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Blogga qaytish
            </Button>
          </Link>

          {/* Article */}
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" data-testid={`tag-${index}`}>
                    #{tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="post-title">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6" data-testid="post-excerpt">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span data-testid="post-author">
                    {post.createdBy === 'auto' ? 'Avtomatik' : 'Admin'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="post-date">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span data-testid="post-read-time">{post.readTime} min o'qish</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  data-testid="share-post-button"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Ulashish
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                data-testid="post-content"
              />
            </div>

            {/* Trending Keywords */}
            {post.trendingKeywords.length > 0 && (
              <div className="p-8 border-t border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">Trend mavzular</h3>
                <div className="flex flex-wrap gap-2">
                  {post.trendingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-white" data-testid={`trend-keyword-${index}`}>
                      🔥 {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Related Posts */}
          {relatedPosts?.posts?.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">O'xshash maqolalar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.posts
                  .filter((relatedPost: BlogPost) => relatedPost.id !== post.id)
                  .slice(0, 3)
                  .map((relatedPost: BlogPost) => (
                    <BlogCard key={relatedPost.id} post={relatedPost} />
                  ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="mt-16">
            <Card className="bg-gradient-to-r from-primary to-blue-700 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Ko'proq foydali maqolalar
                </h2>
                <p className="text-blue-100 mb-6">
                  Xarid qilish va mahsulotlar haqida yangi maslahatlarni bilib oling
                </p>
                <Link href="/blog">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    Blogni ko'rish
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
