import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/components/cart-context";
import { useWishlist } from "@/components/wishlist-context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { t, language } = useLanguage();
  
  const cartCount = getCartItemsCount();
  const wishlistCount = wishlist.length;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: t('categories'), href: "/" },
    { name: t('electronics'), href: "/?category=elektronika" },
    { name: t('clothing'), href: "/?category=kiyim" },
    { name: t('appliances'), href: "/?category=uy-jihozlari" },
    { name: t('books'), href: "/?category=kitoblar" },
    { name: t('sports'), href: "/?category=sport" },
    { name: t('beauty'), href: "/?category=gozallik" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" data-testid="logo-link">
                <h1 className="text-2xl font-bold text-primary">Bozorcha</h1>
              </Link>
              <span className="ml-2 text-xs bg-secondary text-white px-2 py-1 rounded-full">
                {language.toUpperCase()}
              </span>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-20"
                  data-testid="search-input"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1 bg-primary text-white px-4 py-1 text-sm hover:bg-blue-700"
                  data-testid="search-button"
                >
                  {language === 'uz' ? 'Qidirish' : 'Поиск'}
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="relative" data-testid="wishlist-button">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" data-testid="cart-button">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" data-testid="user-button">
                <User className="h-5 w-5" />
              </Button>
              
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu-button">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full"
                        data-testid="mobile-search-input"
                      />
                      <Button
                        onClick={handleSearch}
                        className="mt-2 w-full"
                        data-testid="mobile-search-button"
                      >
                        {language === 'uz' ? 'Qidirish' : 'Поиск'}
                      </Button>
                    </div>
                    {categories.map((category) => (
                      <Link key={category.name} href={category.href}>
                        <Button variant="ghost" className="w-full justify-start">
                          {category.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation - Desktop */}
      <nav className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex space-x-8">
              {categories.map((category) => (
                <Link key={category.name} href={category.href}>
                  <span className="text-gray-600 hover:text-primary font-medium transition-colors cursor-pointer">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/blog">
                <span className="text-gray-600 hover:text-primary cursor-pointer">{t('blog')}</span>
              </Link>
              <Link href="/contact">
                <span className="text-gray-600 hover:text-primary cursor-pointer">{t('about')}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
