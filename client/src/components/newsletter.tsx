import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Check, Gift, Zap, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email manzil kiritilmagan",
        description: "Iltimos, email manzilingizni kiriting",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Noto'g'ri email format",
        description: "Iltimos, to'g'ri email manzil kiriting",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast({
        title: "Muvaffaqiyatli obuna bo'ldingiz!",
        description: "Eng so'nggi yangiliklar va chegirmalardan birinchi bo'lib xabar olasiz",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Xatolik yuz berdi",
        description: "Keyinroq qayta urinib ko'ring",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Gift className="h-5 w-5 text-purple-600" />,
      title: "Maxsus chegirmalar",
      description: "Faqat obunachilarga mo'ljallangan chegirmalar"
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      title: "Birinchi yangiliklar",
      description: "Yangi mahsulotlar haqida birinchi bo'lib bilib oling"
    },
    {
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      title: "Weekly newsletter",
      description: "Haftalik eng yaxshi takliflar va maslahatlar"
    }
  ];

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" data-testid="section-newsletter-success">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Muvaffaqiyatli obuna bo'ldingiz!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Eng so'nggi yangiliklar va chegirmalardan birinchi bo'lib xabar olasiz
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                ✨ Welcome to Bozorcha Family!
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" data-testid="section-newsletter">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="heading-newsletter">
                  Newsletter ga obuna bo'ling
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto" data-testid="text-newsletter-description">
                  Eng so'nggi mahsulotlar, chegirmalar va texnologiya yangiliklari haqida birinchi bo'lib bilib oling
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center" data-testid={`benefit-${index}`}>
                    <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      {benefit.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subscription Form */}
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto" data-testid="form-newsletter">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Email manzilingizni kiriting"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                    data-testid="input-email"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    data-testid="button-subscribe"
                  >
                    {isLoading ? "Yuborilmoqda..." : "Obuna bo'lish"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Obuna bo'lish orqali siz bizning{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    maxfiylik siyosati
                  </a>
                  mizga rozilik bildirasiz
                </p>
              </form>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15,000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Obunachi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Mamnunlik darajasi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Weekly</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Newsletter</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}