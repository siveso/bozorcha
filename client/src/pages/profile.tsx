import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Settings, ShoppingBag, Heart, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SeoHead } from "@/components/seo/seo-head-simple";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Ali Valiyev",
    email: "ali.valiyev@email.com",
    phone: "+998 90 123 45 67",
    address: "Toshkent sh., Yunusobod t.",
    avatar: ""
  });

  const { toast } = useToast();

  // Mock data for demo
  const orderHistory = [
    {
      id: "ORD-001",
      date: "2024-08-10",
      total: "750,000 so'm",
      status: "Yetkazildi",
      items: 3
    },
    {
      id: "ORD-002", 
      date: "2024-08-05",
      total: "1,200,000 so'm",
      status: "Yo'lda",
      items: 2
    },
    {
      id: "ORD-003",
      date: "2024-07-28",
      total: "450,000 so'm", 
      status: "Yetkazildi",
      items: 1
    }
  ];

  const wishlistItems = [
    {
      id: "wish-1",
      name: "MacBook Pro M3",
      price: "25,000,000 so'm",
      image: "/api/placeholder/150/150"
    },
    {
      id: "wish-2", 
      name: "iPhone 15 Pro",
      price: "12,500,000 so'm",
      image: "/api/placeholder/150/150"
    }
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profil yangilandi",
      description: "Sizning ma'lumotlaringiz muvaffaqiyatli yangilandi."
    });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Yetkazildi": return "bg-green-100 text-green-800";
      case "Yo'lda": return "bg-blue-100 text-blue-800";
      case "Kutilmoqda": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SeoHead
        title="Profil - Bozorcha"
        description="Shaxsiy profilingiz va buyurtma tarixingiz. Ma'lumotlarni boshqaring va sevimli mahsulotlaringizni ko'ring."
        keywords={["profil", "buyurtma tarixi", "sevimlilar", "sozlamalar"]}
        ogImage="/api/placeholder/1200/630"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="text-2xl bg-white text-blue-600">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
              <p className="text-blue-100">{profileData.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Buyurtmalar
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Sevimlilar
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sozlamalar
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shaxsiy Ma'lumotlar</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Bekor qilish" : "Tahrirlash"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To'liq Ism
                    </label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manzil
                    </label>
                    {isEditing ? (
                      <Input
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.address}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Bekor qilish
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Saqlash
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Buyurtma Tarixi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">#{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.date}</p>
                          <p className="text-sm text-gray-600">{order.items} ta mahsulot</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{order.total}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Sevimli Mahsulotlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <p className="text-lg font-bold text-blue-600">{item.price}</p>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            Savatchaga
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Sozlamalar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Xabarnoma Sozlamalari</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Email orqali xabarlar olish</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Yangi mahsulotlar haqida bildirishnoma</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span>Promokod va chegirmalar haqida</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Xavfsizlik</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Parolni o'zgartirish
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Ikki bosqichli autentifikatsiya
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Hisobni boshqarish</h3>
                  <Button variant="destructive" className="w-full">
                    Hisobni o'chirish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}