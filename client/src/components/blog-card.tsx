import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" data-testid={`blog-card-${post.id}`}>
        <div className="h-48 bg-gradient-to-r from-primary to-blue-700 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm opacity-90">{post.tags[0] || 'Blog'}</p>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span data-testid={`blog-date-${post.id}`}>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span className="mx-2">•</span>
            <span data-testid={`blog-category-${post.id}`}>
              {post.tags[0] || 'Umumiy'}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2" data-testid={`blog-title-${post.id}`}>
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3" data-testid={`blog-excerpt-${post.id}`}>
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span data-testid={`blog-author-${post.id}`}>
                {post.createdBy === 'auto' ? 'Avtomatik' : 'Admin'}
              </span>
              <span className="mx-2">•</span>
              <span data-testid={`blog-read-time-${post.id}`}>
                {post.readTime} min o'qish
              </span>
            </div>
            
            <span className="text-primary hover:text-blue-700 font-medium">
              Batafsil →
            </span>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  data-testid={`blog-tag-${post.id}-${index}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
