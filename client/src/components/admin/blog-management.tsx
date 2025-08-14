import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost } from "@/types";

const ADMIN_TOKEN = "Bearer Gisobot201415*";

export function BlogManagement() {
  const [statusFilter, setStatusFilter] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    readTime: 5,
    status: "draft"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["/api/admin/blog", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      
      const response = await fetch(`/api/admin/blog?${params}`, {
        headers: { Authorization: ADMIN_TOKEN }
      });
      return await response.json();
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("POST", "/api/admin/blog", {
        ...postData,
        tags: postData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        publishedAt: postData.status === "published" ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Muvaffaqiyat", description: "Blog post yaratildi" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/admin/blog/${id}`, {
        ...data,
        tags: data.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        publishedAt: data.status === "published" && !editingPost?.publishedAt 
          ? new Date().toISOString() 
          : editingPost?.publishedAt,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Muvaffaqiyat", description: "Blog post yangilandi" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Muvaffaqiyat", description: "Blog post o'chirildi" });
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const generatePostsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/generate-posts", {
        method: "POST",
        headers: { 
          Authorization: ADMIN_TOKEN,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error("Generation failed");
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ 
        title: "Muvaffaqiyat", 
        description: `${data.success} ta post yaratildi, ${data.failed} ta muvaffaqiyatsiz` 
      });
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      metaTitle: "",
      metaDescription: "",
      readTime: 5,
      status: "draft"
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(", "),
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      readTime: post.readTime,
      status: post.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu blog postni o'chirishni xohlaysizmi?")) {
      deletePostMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog postlari</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => generatePostsMutation.mutate()}
            disabled={generatePostsMutation.isPending}
            variant="outline"
            data-testid="generate-posts-button"
          >
            <Bot className="h-4 w-4 mr-2" />
            {generatePostsMutation.isPending ? "Yaratilmoqda..." : "Avtomatik yaratish"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} data-testid="add-post-button">
                <Plus className="h-4 w-4 mr-2" />
                Post yaratish
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Blog postni tahrirlash" : "Yangi blog post"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Sarlavha</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      data-testid="post-title-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Holat</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger data-testid="post-status-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Qoralama</SelectItem>
                        <SelectItem value="published">Nashr qilingan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Qisqacha tavsif</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    required
                    data-testid="post-excerpt-input"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Kontent</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={8}
                    data-testid="post-content-input"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Teglar (vergul bilan ajrating)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="texnologiya, smartfon, maslahat"
                      data-testid="post-tags-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">O'qish vaqti (daqiqa)</label>
                    <Input
                      type="number"
                      value={formData.readTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, readTime: Number(e.target.value) }))}
                      min="1"
                      data-testid="post-read-time-input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">SEO Title</label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    data-testid="post-meta-title-input"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">SEO Description</label>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    data-testid="post-meta-description-input"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" data-testid="save-post-button">
                    {editingPost ? "Yangilash" : "Saqlash"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Filter */}
      <Card>
        <CardContent className="p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Barcha holatlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha holatlar</SelectItem>
              <SelectItem value="draft">Qoralama</SelectItem>
              <SelectItem value="published">Nashr qilingan</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog postlari ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Yuklanmoqda...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2">Sarlavha</th>
                    <th className="pb-2">Holat</th>
                    <th className="pb-2">Yaratuvchi</th>
                    <th className="pb-2">Sana</th>
                    <th className="pb-2">O'qish vaqti</th>
                    <th className="pb-2">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {postsData?.posts?.map((post: BlogPost) => (
                    <tr key={post.id} data-testid={`post-row-${post.id}`}>
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "Nashr qilingan" : "Qoralama"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline">
                          {post.createdBy === "auto" ? "Avtomatik" : "Admin"}
                        </Badge>
                      </td>
                      <td className="py-4">{formatDate(post.createdAt)}</td>
                      <td className="py-4">{post.readTime} min</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                            data-testid={`edit-post-${post.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDelete(post.id)}
                            data-testid={`delete-post-${post.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {postsData?.posts?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Blog postlar topilmadi
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
