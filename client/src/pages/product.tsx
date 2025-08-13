import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SeoHead } from "@/components/seo/seo-head-simple";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Share2, Star, Play } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/components/cart-context";
import { useWishlist } from "@/components/wishlist-context";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

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
    }).format(Number(price.replace(/[^\d]/g, "")));
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
    if (product) {
      addToCart(product);
      toast({
        title: "Savatchaga qo'shildi",
        description: `${product.name} savatchaga qo'shildi`
      });
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
      toast({
        title: "Sevimlilarga qo'shildi",
        description: `${product.name} sevimlilar ro'yxatiga qo'shildi`
      });
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
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
      toast({
        title: "Link nusxalandi",
        description: "Mahsulot linki vaqtinchalik xotiraga nusxalandi"
      });
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

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

  if (!product) return null;

  const videoId = product.youtubeUrl ? getYouTubeVideoId(product.youtubeUrl) : null;

  return (
    <>
      <SeoHead 
        title={product.metaTitle || `${product.name} - Bozorcha`}
        description={product.metaDescription || product.description || ""}
        keywords={product.keywords || []}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-primary">Bosh sahifa</Link></li>
              <li className="flex items-center"><span className="mx-2">/</span></li>
              <li><Link href={`/?category=${product.category}`} className="hover:text-primary">{product.category}</Link></li>
              <li className="flex items-center"><span className="mx-2">/</span></li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images and Video */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={product.images?.[selectedImageIndex] || "/api/placeholder/400/400"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* YouTube Video */}
              {videoId && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Play className="h-5 w-5 mr-2 text-red-600" />
                    Mahsulot videosi
                  </h3>
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating || "0")}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviewCount} baho)
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Ulashish
                  </Button>
                </div>
                <p className="text-3xl font-bold text-primary mb-6">
                  {formatPrice(product.price || "0")} so'm
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-green-600 mb-4">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Omborda mavjud ({product.stock} dona)
                </p>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white px-6 py-3 text-lg hover:bg-blue-700"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Savatga qo'shish
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleAddToWishlist}
                    className={`px-6 py-3 text-lg ${
                      isInWishlist(product.id || '') 
                        ? 'bg-red-50 text-red-600 border-red-300' 
                        : ''
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${
                      isInWishlist(product.id || '') ? 'fill-current' : ''
                    }`} />
                  </Button>
                </div>
              </div>

              {/* Product Benefits */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Bizning afzalliklar
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Tez va bepul yetkazish
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Sifat kafolati
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    24/7 qo'llab-quvvatlash
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}