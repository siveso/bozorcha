import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductManagement } from "@/components/admin/product-management";
import { BlogManagement } from "@/components/admin/blog-management";
import { OrderManagement } from "@/components/admin/order-management";
import { CategoryManagement } from "@/components/admin/category-management";
import { ContactManagement } from "@/components/admin/contact-management";
import { TrendAnalysisComponent } from "@/components/admin/trend-analysis";
import { SeoAnalyzer } from "@/components/seo/SeoAnalyzer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Newspaper, TrendingUp, Search, ShoppingBag, Folder, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { t, language } = useLanguage();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check for demo - in production use proper auth
    if (password === "Gisobot201415*") {
      setIsAuthenticated(true);
    } else {
      alert(language === 'uz' ? "Noto'g'ri parol" : "Неверный пароль");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{t('admin_panel')}</CardTitle>
            <div className="flex justify-center mt-2">
              <LanguageSwitcher />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  {language === 'uz' ? 'Admin parolini kiriting' : 'Введите пароль администратора'}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'uz' ? 'Parol...' : 'Пароль...'}
                  required
                  data-testid="admin-password-input"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="admin-login-button">
                {language === 'uz' ? 'Kirish' : 'Войти'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{t('admin_panel')}</h1>
            <p className="text-gray-600">{t('dashboard')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button 
              onClick={() => setIsAuthenticated(false)} 
              variant="outline"
              data-testid="admin-logout-button"
            >
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="p-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="products" className="flex items-center gap-2" data-testid="products-tab">
              <Box className="h-4 w-4" />
              {t('products_management')}
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2" data-testid="categories-tab">
              <Folder className="h-4 w-4" />
              {t('categories_management')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2" data-testid="orders-tab">
              <ShoppingBag className="h-4 w-4" />
              {t('orders_management')}
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2" data-testid="blog-tab">
              <Newspaper className="h-4 w-4" />
              {t('blog_management')}
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2" data-testid="trends-tab">
              <TrendingUp className="h-4 w-4" />
              {t('trends_analysis')}
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2" data-testid="contact-tab">
              <MessageSquare className="h-4 w-4" />
              {language === 'ru' ? 'Сообщения' : 'Xabarlar'}
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2" data-testid="seo-tab">
              <Search className="h-4 w-4" />
              {t('seo_tools')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <TrendAnalysisComponent />
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <SeoAnalyzer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
