import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Share2, Star } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      return await response.json();
    },
    enabled: !!productId,
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const renderStars = (rating: string) => {
    const ratingNum = Math.floor(Number(rating));
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= ratingNum ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", product?.name);
    // TODO: Implement cart functionality
  };

  const handleAddToWishlist = () => {
    console.log("Added to wishlist:", product?.name);
    // TODO: Implement wishlist functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mahsulot topilmadi</h2>
              <p className="text-gray-600 mb-6">Izlayotgan mahsulotingiz mavjud emas yoki o'chirilgan.</p>
              <Link href="/">
                <Button>Bosh sahifaga qaytish</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Get SEO data - always call this hook before conditional returns
  const { data: seoData } = useQuery({
    queryKey: ["/api/seo/product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/seo/product/${productId}`);
      return await response.json();
    },
    enabled: !!productId && !!product,
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {seoData && <SeoHead metadata={seoData} />}
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Bosh sahifa
              </Link>
              <span className="text-gray-400">/</span>
              <Link href={`/?category=${product.category}`} className="text-gray-500 hover:text-gray-700">
                {product.category}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {product.images.length > 0 ? (
                <div className="aspect-square rounded-lg overflow-hidden bg-white">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid="product-main-image"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Rasm yo'q</span>
                </div>
              )}

              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        data-testid={`product-thumb-${index}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="product-title">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviewCount} baho)
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleShare} data-testid="share-button">
                    <Share2 className="h-4 w-4 mr-1" />
                    Ulashish
                  </Button>
                </div>
                <div className="text-4xl font-bold text-primary mb-4" data-testid="product-price">
                  {formatPrice(product.price)} so'm
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mahsulot haqida</h3>
                <p className="text-gray-600 leading-relaxed" data-testid="product-description">
                  {product.description}
                </p>
              </div>

              {/* Stock status */}
              <div>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">
                      Omborda mavjud ({product.stock} dona)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-medium">Omborda yo'q</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-primary hover:bg-blue-700 text-white py-3 text-lg"
                  data-testid="add-to-cart-button"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock > 0 ? "Savatga qo'shish" : "Omborda yo'q"}
                </Button>

                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full py-3"
                  data-testid="add-to-wishlist-button"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Sevimlilar ro'yxatiga qo'shish
                </Button>
              </div>

              {/* Product Features */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Bizning afzalliklar</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Tez va bepul yetkazish</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Sifat kafolati</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">14 kun qaytarish imkoniyati</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">24/7 mijozlar xizmati</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keywords */}
              {product.keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Teglar</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
