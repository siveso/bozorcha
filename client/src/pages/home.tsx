import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { ProductFilters } from "@/components/product-filters";
import { ProductCard } from "@/components/product-card";
import { BlogCard } from "@/components/blog-card";
import { Testimonials } from "@/components/testimonials";
import { Newsletter } from "@/components/newsletter";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Truck, Shield, Award, Headphones } from "lucide-react";
import { Link } from "wouter";
import type { Product, BlogPost } from "@shared/schema";
import type { ProductFilters as ProductFiltersType } from "@/types/filters";

export default function Home() {
  const [location] = useLocation();
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;
  const { toast } = useToast();

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newFilters: ProductFiltersType = {};
    
    if (params.get('search')) newFilters.search = params.get('search')!;
    if (params.get('category')) newFilters.category = params.get('category')!;
    if (params.get('minPrice')) newFilters.minPrice = Number(params.get('minPrice'));
    if (params.get('maxPrice')) newFilters.maxPrice = Number(params.get('maxPrice'));
    
    setFilters(newFilters);
  }, [location]);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", filters, sortBy, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
      params.append("sortBy", sortBy);
      params.append("limit", pageSize.toString());
      params.append("offset", (currentPage * pageSize).toString());
      
      const response = await fetch(`/api/products?${params}`);
      return await response.json();
    },
  });

  const { data: blogData, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog?status=published&limit=6");
      return await response.json();
    },
  });

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleApplyFilters = () => {
    // Filters are already applied through handleFiltersChange
  };

  const handleAddToCart = (product: any) => {
    console.log("Added to cart:", product.name);
    toast({
      title: "Savatchaga qo'shildi",
      description: `${product.name} savatchaga qo'shildi`
    });
  };

  const handleAddToWishlist = (product: any) => {
    console.log("Added to wishlist:", product.name);
    toast({
      title: "Sevimlilarga qo'shildi",
      description: `${product.name} sevimlilar ro'yxatiga qo'shildi`
    });
  };

  const totalPages = Math.ceil((productsData?.total || 0) / pageSize);

  // Get SEO data for homepage
  const { data: seoData } = useQuery({
    queryKey: ["/api/seo/homepage"],
    queryFn: async () => {
      const response = await fetch("/api/seo/homepage");
      return await response.json();
    },
  });

  return (
    <>
      {seoData && <SeoHead metadata={seoData} />}
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Bozorcha bilan oson xarid qiling
                </h1>
                <p className="text-xl mb-6 text-blue-100">
                  Minglab mahsulotlar, eng yaxshi narxlar va tez yetkazish xizmati
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                    Xaridni boshlash
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                  >
                    Batafsil ma'lumot
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                  <ShoppingBag className="mx-auto text-8xl text-accent mb-4" />
                  <p className="text-lg">10,000+ mahsulotlar</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
              />
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              {/* Sort Options */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  <span data-testid="total-products">{productsData?.total || 0}</span> ta mahsulot topildi
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-64" data-testid="sort-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Mos kelishi bo'yicha</SelectItem>
                    <SelectItem value="price_low">Narx: Arzondan qimmatlarga</SelectItem>
                    <SelectItem value="price_high">Narx: Qimmatdan arzonlarga</SelectItem>
                    <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                    <SelectItem value="newest">Yangidan eskiga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productsData?.products?.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <nav className="flex space-x-2">
                        <Button
                          variant="outline"
                          disabled={currentPage === 0}
                          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                          data-testid="prev-page"
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
                              data-testid={`page-${page + 1}`}
                            >
                              {page + 1}
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline"
                          disabled={currentPage >= totalPages - 1}
                          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                          data-testid="next-page"
                        >
                          Keyingi
                        </Button>
                      </nav>
                    </div>
                  )}
                </>
              )}

              {productsData?.products?.length === 0 && !productsLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <ShoppingBag className="mx-auto h-16 w-16" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Mahsulotlar topilmadi
                  </h3>
                  <p className="text-gray-600">
                    Boshqa filtr parametrlarini sinab ko'ring
                  </p>
                </div>
              )}
            </main>
          </div>
        </section>

        {/* Blog Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Foydali maqolalar</h2>
              <p className="text-xl text-gray-600">
                Xarid qilish va mahsulotlar haqida eng so'nggi ma'lumotlar
              </p>
            </div>

            {blogLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
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
                  {blogData?.posts?.slice(0, 6).map((post: any) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link href="/blog">
                    <Button variant="outline" className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                      Barcha maqolalarni ko'rish
                      <span className="ml-2">→</span>
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nima uchun Bozorcha?</h2>
              <p className="text-xl text-gray-600">Bizning platformamizning afzalliklari</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tez yetkazish</h3>
                <p className="text-gray-600">24 soat ichida barcha buyurtmalarni yetkazib beramiz</p>
              </div>

              <div className="text-center">
                <div className="bg-secondary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Xavfsiz to'lov</h3>
                <p className="text-gray-600">Barcha to'lovlar himoyalangan va xavfsiz</p>
              </div>

              <div className="text-center">
                <div className="bg-accent bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sifat kafolati</h3>
                <p className="text-gray-600">Faqat sifatli va asl mahsulotlarni sotamiz</p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 yordam</h3>
                <p className="text-gray-600">Har doim mijozlar xizmatimiz tayyor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Newsletter Section */}
        <Newsletter />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-xl font-bold mb-4">Bozorcha</h3>
                <p className="text-gray-300 mb-4">
                  O'zbekistondagi eng ishonchli elektron savdo platformasi. 
                  Sifatli mahsulotlar va professional xizmat.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Facebook</span>📘
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Instagram</span>📷
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Telegram</span>📱
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Tezkor havolalar</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Biz haqimizda</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Yetkazish shartlari</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">To'lov usullari</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Qaytarish siyosati</a></li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-semibold mb-4">Kategoriyalar</h4>
                <ul className="space-y-2">
                  <li><a href="/?category=elektronika" className="text-gray-300 hover:text-white">Elektronika</a></li>
                  <li><a href="/?category=kiyim" className="text-gray-300 hover:text-white">Kiyim va moda</a></li>
                  <li><a href="/?category=uy-jihozlari" className="text-gray-300 hover:text-white">Uy jihozlari</a></li>
                  <li><a href="/?category=sport" className="text-gray-300 hover:text-white">Sport tovarlari</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4">Aloqa</h4>
                <div className="space-y-2">
                  <p className="text-gray-300">📞 +998 90 123 45 67</p>
                  <p className="text-gray-300">✉️ info@bozorcha.uz</p>
                  <p className="text-gray-300">📍 Toshkent, O'zbekiston</p>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 Bozorcha. Barcha huquqlar himoyalangan.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Foydalanish shartlari</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Maxfiylik siyosati</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
