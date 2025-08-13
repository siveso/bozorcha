import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@/types";

const ADMIN_TOKEN = "Bearer admin-token-123";

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    images: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["/api/products", searchQuery, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter) params.append("category", categoryFilter);
      
      const response = await fetch(`/api/products?${params}`, {
        headers: { Authorization: ADMIN_TOKEN }
      });
      return await response.json();
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return await apiRequest("POST", "/api/admin/products", {
        ...productData,
        keywords: productData.keywords.split(",").map((k: string) => k.trim()).filter(Boolean),
        images: productData.images.split(",").map((img: string) => img.trim()).filter(Boolean),
        price: productData.price.toString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Muvaffaqiyat", description: "Mahsulot yaratildi" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/admin/products/${id}`, {
        ...data,
        keywords: data.keywords.split(",").map((k: string) => k.trim()).filter(Boolean),
        images: data.images.split(",").map((img: string) => img.trim()).filter(Boolean),
        price: data.price.toString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Muvaffaqiyat", description: "Mahsulot yangilandi" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Muvaffaqiyat", description: "Mahsulot o'chirildi" });
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: 0,
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      images: ""
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      keywords: product.keywords.join(", "),
      images: product.images.join(", ")
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu mahsulotni o'chirishni xohlaysizmi?")) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mahsulotlar boshqaruvi</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="add-product-button">
              <Plus className="h-4 w-4 mr-2" />
              Mahsulot qo'shish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mahsulot nomi</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    data-testid="product-name-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Kategoriya</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger data-testid="product-category-select">
                      <SelectValue placeholder="Kategoriya tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elektronika">Elektronika</SelectItem>
                      <SelectItem value="kiyim">Kiyim</SelectItem>
                      <SelectItem value="uy-jihozlari">Uy jihozlari</SelectItem>
                      <SelectItem value="kitoblar">Kitoblar</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                      <SelectItem value="gozallik">Go'zallik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tavsif</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  data-testid="product-description-input"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Narx (so'm)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    data-testid="product-price-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ombor</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    required
                    data-testid="product-stock-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Rasmlar (vergul bilan ajrating)</label>
                <Input
                  value={formData.images}
                  onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  data-testid="product-images-input"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">SEO Title</label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  data-testid="product-meta-title-input"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">SEO Description</label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  data-testid="product-meta-description-input"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Kalit so'zlar (vergul bilan ajrating)</label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="smartphone, telefon, samsung"
                  data-testid="product-keywords-input"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" data-testid="save-product-button">
                  {editingProduct ? "Yangilash" : "Saqlash"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Mahsulot qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="product-search-input"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Barcha kategoriyalar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Barcha kategoriyalar</SelectItem>
                <SelectItem value="elektronika">Elektronika</SelectItem>
                <SelectItem value="kiyim">Kiyim</SelectItem>
                <SelectItem value="uy-jihozlari">Uy jihozlari</SelectItem>
                <SelectItem value="kitoblar">Kitoblar</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="gozallik">Go'zallik</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mahsulotlar ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Yuklanmoqda...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2">Mahsulot</th>
                    <th className="pb-2">Kategoriya</th>
                    <th className="pb-2">Narx</th>
                    <th className="pb-2">Ombor</th>
                    <th className="pb-2">Holat</th>
                    <th className="pb-2">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {productsData?.products?.map((product: Product) => (
                    <tr key={product.id} data-testid={`product-row-${product.id}`}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                              Rasm yo'q
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">#{product.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="py-4">{Number(product.price).toLocaleString()} so'm</td>
                      <td className="py-4">{product.stock}</td>
                      <td className="py-4">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Faol" : "Nofaol"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            data-testid={`edit-product-${product.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDelete(product.id)}
                            data-testid={`delete-product-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {productsData?.products?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Mahsulotlar topilmadi
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
