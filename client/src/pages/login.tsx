import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email manzil noto'g'ri kiritilgan"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("/api/auth/login", "POST", data);

      if ((response as any).token) {
        localStorage.setItem("auth-token", (response as any).token);
        toast({
          title: "Muvaffaqiyatli kirdingiz!",
          description: "Xush kelibsiz!",
        });
        setLocation("/profile");
      }
    } catch (error: any) {
      toast({
        title: "Kirish xatoligi",
        description: error.message || "Email yoki parol noto'g'ri",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <LogIn className="w-6 h-6" />
            Kirish
          </CardTitle>
          <CardDescription className="text-center">
            Hisobingizga kiring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email manzil
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
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Parol
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Parolingizni kiriting"
                data-testid="input-password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="button-login"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kirilmoqda...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Kirish
                </div>
              )}
            </Button>

            <div className="text-center text-sm space-y-2">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Hisobingiz yo'qmi?{" "}
                </span>
                <Link href="/register" data-testid="link-register">
                  <span className="text-blue-600 hover:underline">Ro'yxatdan o'tish</span>
                </Link>
              </div>
              <div>
                <Link href="/forgot-password" data-testid="link-forgot-password">
                  <span className="text-blue-600 hover:underline text-sm">
                    Parolni unutdingizmi?
                  </span>
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}