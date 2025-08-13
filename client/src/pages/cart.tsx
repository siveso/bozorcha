import { useState } from "react";
import { Header } from "@/components/header";
import { SeoHead } from "@/components/seo/seo-head-simple";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-context";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(Number(price.replace(/[^\d]/g, "")));
  };

  const total = getCartTotal();

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
                      
                      <span className="text-lg font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      
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

                <Button className="w-full bg-primary text-white py-3 text-lg hover:bg-blue-700 mb-4">
                  Buyurtma berish
                </Button>
                
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