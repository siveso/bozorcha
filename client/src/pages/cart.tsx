import { useState } from "react";
import { Header } from "@/components/header";
import { SeoHead } from "@/components/seo/seo-head-simple";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(Number(price.replace(/[^\d]/g, "")));
  };

  const total = getCartTotal();

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        orderNumber: `ORD${Date.now()}`,
        customerName: orderForm.name,
        customerPhone: orderForm.phone,
        customerEmail: orderForm.email || "",
        customerAddress: orderForm.address,
        notes: orderForm.notes || "",
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        totalAmount: total.toString()
      };

      // Send to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Order submission failed');
      }

      const createdOrder = await response.json();
      
      toast({
        title: "Buyurtma muvaffaqiyatli qabul qilindi!",
        description: `Buyurtma raqami: #${createdOrder.orderNumber}. Tez orada siz bilan bog'lanamiz.`,
      });

      clearCart();
      setIsOrderDialogOpen(false);
      setOrderForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: ""
      });
      
    } catch (error) {
      toast({
        title: "Xatolik yuz berdi",
        description: "Buyurtmani yuborishda xatolik. Qaytadan urinib ko'ring.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  if (cart.length === 0) {
    return (
      <>
        <SeoHead 
          title="Savat - Bozorcha"
          description="Sizning xaridlar savatingiz"
          keywords={["savat", "xarid", "to'lov", "bozorcha"]}
        />
        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-8" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Savatingiz bo'sh
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Xarid qilish uchun mahsulotlarni savatingizga qo'shing
              </p>
              <Link href="/">
                <Button className="bg-primary text-white px-8 py-3 text-lg hover:bg-blue-700">
                  Xaridni boshlash
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeoHead 
        title="Savat - Bozorcha"
        description="Sizning xaridlar savatingiz"
        keywords={["savat", "xarid", "to'lov", "bozorcha"]}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Sizning savatingiz
            </h1>
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Savatni tozalash
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.images?.[0] || "/api/placeholder/100/100"} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.category}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        {formatPrice(item.price)} so'm
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          if (newQuantity >= 1 && newQuantity <= 999) {
                            updateQuantity(item.id, newQuantity);
                          }
                        }}
                        className="w-16 h-10 text-center border border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Buyurtma xulasasi
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mahsulotlar soni:</span>
                    <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)} ta</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jami summa:</span>
                    <span className="font-semibold">{formatPrice(total.toString())} so'm</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yetkazish:</span>
                    <span className="font-semibold text-green-600">Bepul</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Umumiy summa:</span>
                    <span className="font-bold text-primary">{formatPrice(total.toString())} so'm</span>
                  </div>
                </div>

                <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary text-white py-3 text-lg hover:bg-blue-700 mb-4">
                      Buyurtma berish
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        Buyurtma berish
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">To'liq ism *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={orderForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Ismingizni kiriting"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon raqam *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={orderForm.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+998 (XX) XXX-XX-XX"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={orderForm.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Manzil *</Label>
                        <Input
                          id="address"
                          type="text"
                          value={orderForm.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Yetkazish manzili"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Qo'shimcha izoh</Label>
                        <Input
                          id="notes"
                          type="text"
                          value={orderForm.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Maxsus talablar yoki izohlar"
                        />
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                          <span>Jami summa:</span>
                          <span className="font-bold">{formatPrice(total.toString())} so'm</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsOrderDialogOpen(false)}
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          Bekor qilish
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Yuborilmoqda...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Tasdiqlash
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Xaridni davom etish
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}