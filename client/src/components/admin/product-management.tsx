import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  youtubeUrl?: string;
  stock: number;
  rating?: string;
  reviewCount?: number;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export function ProductManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: ["", "", ""],
    youtubeUrl: "",
    stock: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: productsData = { products: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['/api/admin/products'],
    queryFn: () => 
      fetch('/api/admin/products', {
        headers: { 'Authorization': 'Bearer Gisobot201415*' }
      }).then(res => res.json())
  });

  // Fetch categories
  const { data: categoriesData = { categories: [] } } = useQuery({
    queryKey: ['/api/admin/categories'],
    queryFn: () => 
      fetch('/api/admin/categories', {
        headers: { 'Authorization': 'Bearer Gisobot201415*' }
      }).then(res => res.json())
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('POST', '/api/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Muvaffaqiyat",
        description: "Mahsulot yaratildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulot yaratishda xatolik",
        variant: "destructive"
      });
    }
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      apiRequest('PUT', `/api/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      toast({
        title: "Muvaffaqiyat",
        description: "Mahsulot yangilandi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulot yangilashda xatolik",
        variant: "destructive"
      });
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      toast({
        title: "Muvaffaqiyat",
        description: "Mahsulot o'chirildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulot o'chirishda xatolik",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      images: ["", "", ""],
      youtubeUrl: "",
      stock: 0,
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      images: formData.images.filter(img => img.trim() !== ""),
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: [...product.images, "", ""].slice(0, 3),
      youtubeUrl: product.youtubeUrl || "",
      stock: product.stock,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    updateMutation.mutate({
      id: editingProduct.id,
      data: {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ""),
      }
    });
  };

  const categories: Category[] = categoriesData.categories || [];
  const products: Product[] = productsData.products || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mahsulotlar boshqaruvi</h2>
          <p className="text-gray-600">Mahsulotlarni qo'shish, o'zgartirish va boshqarish</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi mahsulot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yangi mahsulot yaratish</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Mahsulot nomi *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Narxi *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="999000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Ta'rif *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategoriya *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategoriya tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Miqdor *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rasmlar URL (3 ta)</Label>
                {formData.images.map((img, index) => (
                  <Input
                    key={index}
                    value={img}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    placeholder={`Rasm ${index + 1} URL`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
                <Input
                  id="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Yaratilmoqda..." : "Yaratish"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Bekor qilish
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products List */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-8">Yuklanmoqda...</div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Hech qanday mahsulot topilmadi</h3>
              <p className="text-gray-500">Birinchi mahsulotingizni yarating</p>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Faol" : "Nofaol"}
                  </Badge>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Narxi:</span>
                    <p>{Number(product.price).toLocaleString()} so'm</p>
                  </div>
                  <div>
                    <span className="font-medium">Miqdor:</span>
                    <p>{product.stock} ta</p>
                  </div>
                  <div>
                    <span className="font-medium">Reyting:</span>
                    <p>{product.rating || "0"}/5 ({product.reviewCount || 0})</p>
                  </div>
                  <div>
                    <span className="font-medium">Rasmlar:</span>
                    <p>{product.images.length} ta</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(product.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    O'chirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Mahsulot nomi *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-price">Narxi *</Label>
                <Input
                  id="edit-price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Ta'rif *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategoriya *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategoriya tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-stock">Miqdor *</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rasmlar URL (3 ta)</Label>
              {formData.images.map((img, index) => (
                <Input
                  key={index}
                  value={img}
                  onChange={(e) => {
                    const newImages = [...formData.images];
                    newImages[index] = e.target.value;
                    setFormData(prev => ({ ...prev, images: newImages }));
                  }}
                  placeholder={`Rasm ${index + 1} URL`}
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-youtubeUrl">YouTube Video URL</Label>
              <Input
                id="edit-youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Bekor qilish
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}