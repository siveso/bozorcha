import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Folder } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export function CategoryManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categoriesData = { categories: [] }, isLoading } = useQuery({
    queryKey: ['/api/admin/categories'],
    queryFn: () => 
      fetch('/api/admin/categories', {
        headers: { 'Authorization': 'Bearer Gisobot201415*' }
      }).then(res => res.json())
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('POST', '/api/admin/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Muvaffaqiyat",
        description: "Kategoriya yaratildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Kategoriya yaratishda xatolik",
        variant: "destructive"
      });
    }
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      apiRequest('PUT', `/api/admin/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      toast({
        title: "Muvaffaqiyat",
        description: "Kategoriya yangilandi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Kategoriya yangilashda xatolik",
        variant: "destructive"
      });
    }
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      toast({
        title: "Muvaffaqiyat",
        description: "Kategoriya o'chirildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Kategoriya o'chirishda xatolik",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    updateMutation.mutate({
      id: editingCategory.id,
      data: formData
    });
  };

  const categories: Category[] = categoriesData.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kategoriyalar boshqaruvi</h2>
          <p className="text-gray-600">Kategoriyalarni qo'shish, o'zgartirish va boshqarish</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi kategoriya
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi kategoriya yaratish</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kategoriya nomi *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Masalan: Elektronika"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="elektronika"
                  required
                />
                <p className="text-xs text-gray-500">URL da foydalanish uchun (otomatik yaratiladi)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Ta'rif</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Kategoriya haqida qisqacha ma'lumot"
                  rows={3}
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

      {/* Categories List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Yuklanmoqda...</div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Folder className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Hech qanday kategoriya topilmadi</h3>
              <p className="text-gray-500">Birinchi kategoriyangizni yarating</p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Faol" : "Nofaol"}
                </Badge>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-gray-600 mb-4">{category.description}</p>
                )}
                
                <div className="text-xs text-gray-500 mb-4">
                  Yaratilgan: {new Date(category.createdAt).toLocaleDateString('uz-UZ')}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Tahrirlash
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteMutation.mutate(category.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyani tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Kategoriya nomi *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Ta'rif</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
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