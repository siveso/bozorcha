import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const renderStars = (rating: string) => {
    const ratingNum = Math.floor(Number(rating));
    return '⭐'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist?.(product);
  };

  return (
    <Link href={`/product/${product.slug || product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" data-testid={`product-card-${product.id}`}>
        <div className="aspect-square overflow-hidden">
          {product.images.length > 0 && !imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={() => setImageError(true)}
              data-testid={`product-image-${product.id}`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Rasm yo'q</span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-2" data-testid={`product-description-${product.id}`}>
            {product.description}
          </p>
          
          <div className="flex items-center mb-2">
            <span className="text-yellow-400 text-sm" data-testid={`product-rating-${product.id}`}>
              {renderStars(product.rating)}
            </span>
            <span className="text-gray-500 text-sm ml-1">
              ({product.reviewCount})
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary" data-testid={`product-price-${product.id}`}>
              {formatPrice(product.price)} so'm
            </span>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddToWishlist}
                className="hover:text-red-500"
                data-testid={`wishlist-button-${product.id}`}
              >
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handleAddToCart}
                className="bg-accent text-white hover:bg-yellow-500"
                size="icon"
                disabled={product.stock === 0}
                data-testid={`add-to-cart-${product.id}`}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {product.stock === 0 && (
            <div className="mt-2">
              <span className="text-sm text-red-600 font-medium">Omborda yo'q</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
