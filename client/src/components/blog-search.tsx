import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Calendar, Tag } from "lucide-react";
import { BlogPost } from "@shared/schema";

interface BlogSearchProps {
  posts: BlogPost[];
  onFilteredPosts: (posts: BlogPost[]) => void;
  loading?: boolean;
}

export function BlogSearch({ posts, onFilteredPosts, loading }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  
  // Extract all unique tags from posts
  const allTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags || [])
    )
  ).filter(Boolean);

  // Filter and sort posts based on search criteria
  useEffect(() => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags?.includes(tag))
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        case "oldest":
          return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
        case "popular":
          // Assuming we have a views or likes field, for now use created date
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        default:
          return 0;
      }
    });

    onFilteredPosts(filtered);
  }, [searchTerm, selectedTags, sortBy, posts, onFilteredPosts]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSortBy("newest");
  };

  const hasActiveFilters = searchTerm.trim() || selectedTags.length > 0 || sortBy !== "newest";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8" data-testid="blog-search">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Maqolalar, kalit so'zlar yoki mavzular bo'yicha qidiring..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
          disabled={loading}
          data-testid="input-blog-search"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tartiblash:</span>
          <div className="flex gap-2">
            {[
              { value: "newest", label: "Yangi" },
              { value: "oldest", label: "Eski" },
              { value: "popular", label: "Mashhur" }
            ].map(option => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.value as any)}
                disabled={loading}
                data-testid={`button-sort-${option.value}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto"
            disabled={loading}
            data-testid="button-clear-filters"
          >
            <X className="h-4 w-4 mr-1" />
            Filtrlarni tozalash
          </Button>
        )}
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Teglar:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => handleTagToggle(tag)}
                data-testid={`tag-${tag}`}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Info */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400" data-testid="search-results-info">
          {loading ? (
            "Qidirilmoqda..."
          ) : (
            <>
              {posts.length} ta maqola topildi
              {hasActiveFilters && " (filtrlangan)"}
            </>
          )}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Tanlangan teglar:</span>
            <div className="flex gap-1">
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}