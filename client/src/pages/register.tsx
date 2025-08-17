import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, User, Phone, Lock, CheckCircle } from "lucide-react";

// Registration form schema with Uzbek validation messages
const registerSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 ta harf bo'lishi kerak"),
  email: z.string().email("Email manzil noto'g'ri kiritilgan"),
  phone: z.string().min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parollar bir xil emas",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...registerData } = data;
      
      await apiRequest("/api/auth/register", "POST", registerData);

      setIsSuccess(true);
      toast({
        title: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
        description: "Email manzilingizga tasdiqlash havolasi yuborildi.",
      });
      
      // Clear form
      reset();
    } catch (error: any) {
      toast({
        title: "Xatolik yuz berdi",
        description: error.message || "Ro'yxatdan o'tishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">
              Email tasdiqlash
            </CardTitle>
            <CardDescription>
              Email manzilingizga tasdiqlash havolasi yuborildi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Email manzilingizni tekshiring va tasdiqlash havolasiga bosing. 
                Agar xat ko'rinmasa, spam papkasini ham tekshiring.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Kirish sahifasiga qaytish
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Ro'yxatdan o'tish</CardTitle>
          <CardDescription className="text-center">
            Bozorcha platformasiga xush kelibsiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                To'liq ism *
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Ismingizni kiriting"
                data-testid="input-fullname"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email manzil *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="email@example.com"
                data-testid="input-email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefon raqam *
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+998 90 123 45 67"
                data-testid="input-phone"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Parol *
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Kamida 6 ta belgi"
                data-testid="input-password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Parolni tasdiqlang *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Parolni qayta kiriting"
                data-testid="input-confirm-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="button-register"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ro'yxatdan o'tmoqda...
                </div>
              ) : (
                "Ro'yxatdan o'tish"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Allaqachon hisobingiz bormi?{" "}
              </span>
              <Link href="/login" data-testid="link-login">
                <span className="text-blue-600 hover:underline">Kirish</span>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}