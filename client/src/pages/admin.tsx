import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductManagement } from "@/components/admin/product-management";
import { BlogManagement } from "@/components/admin/blog-management";
import { TrendAnalysisComponent } from "@/components/admin/trend-analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Box, Newspaper, TrendingUp, Settings } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check for demo - in production use proper auth
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Noto'g'ri parol");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Bozorcha Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  Admin parolini kiriting
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol..."
                  required
                  data-testid="admin-password-input"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="admin-login-button">
                Kirish
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
            <h1 className="text-2xl font-semibold text-gray-900">Bozorcha Admin Panel</h1>
            <p className="text-gray-600">Boshqaruv paneli</p>
          </div>
          <Button 
            onClick={() => setIsAuthenticated(false)} 
            variant="outline"
            data-testid="admin-logout-button"
          >
            Chiqish
          </Button>
        </div>
      </header>

      {/* Admin Content */}
      <div className="p-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2" data-testid="products-tab">
              <Box className="h-4 w-4" />
              Mahsulotlar
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2" data-testid="blog-tab">
              <Newspaper className="h-4 w-4" />
              Blog postlari
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2" data-testid="trends-tab">
              <TrendingUp className="h-4 w-4" />
              Trend tahlil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <TrendAnalysisComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
