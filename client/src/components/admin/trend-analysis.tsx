import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TrendAnalysis } from "@/types";
import { formatDateTime } from "@/lib/date-utils";
import { useLanguage } from "@/contexts/LanguageContext";

const ADMIN_TOKEN = "Bearer Gisobot201415*";

export function TrendAnalysisComponent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const { data: latestAnalysis, isLoading } = useQuery({
    queryKey: ["/api/admin/trends/latest"],
    queryFn: async () => {
      const response = await fetch("/api/admin/trends/latest", {
        headers: { Authorization: ADMIN_TOKEN }
      });
      return await response.json();
    },
  });

  const analyzeTrendsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/analyze-trends", {
        method: "POST",
        headers: { 
          Authorization: ADMIN_TOKEN,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error("Analysis failed");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trends/latest"] });
      toast({ title: "Muvaffaqiyat", description: "Trend tahlili yangilandi" });
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
      toast({ 
        title: "Muvaffaqiyat", 
        description: `${data.success} ta post yaratildi, ${data.failed} ta muvaffaqiyatsiz` 
      });
    },
    onError: (error) => {
      toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    },
  });

  // Date formatting moved to shared utility

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gemini 1.5 Flash - Trend tahlil</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => analyzeTrendsMutation.mutate()}
            disabled={analyzeTrendsMutation.isPending}
            data-testid="analyze-trends-button"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${analyzeTrendsMutation.isPending ? 'animate-spin' : ''}`} />
            {analyzeTrendsMutation.isPending ? "Tahlil qilinmoqda..." : "Tahlilni yangilash"}
          </Button>
          <Button
            onClick={() => generatePostsMutation.mutate()}
            disabled={generatePostsMutation.isPending}
            variant="outline"
            data-testid="generate-posts-from-trends-button"
          >
            <Bot className="h-4 w-4 mr-2" />
            {generatePostsMutation.isPending ? "Yaratilmoqda..." : "Postlar yaratish"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Yuklanmoqda...</div>
      ) : latestAnalysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Analysis Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Oxirgi tahlil ma'lumotlari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tahlil sanasi:</span>
                <span className="font-medium">{latestAnalysis.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Yaratilgan postlar:</span>
                <span className="font-medium">{latestAnalysis.generatedPosts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Muvaffaqiyatli:</span>
                <span className="font-medium text-green-600">{latestAnalysis.successfulPosts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Muvaffaqiyatsiz:</span>
                <span className="font-medium text-red-600">{latestAnalysis.failedPosts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Oxirgi yangilanish:</span>
                <span className="font-medium text-xs">{formatDateTime(latestAnalysis.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Muvaffaqiyat darajasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestAnalysis.generatedPosts > 0 ? (
                <>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Muvaffaqiyatli postlar</span>
                      <span className="text-sm font-medium">
                        {Math.round((latestAnalysis.successfulPosts / latestAnalysis.generatedPosts) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(latestAnalysis.successfulPosts / latestAnalysis.generatedPosts) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="text-center py-4">
                    <div className="text-2xl font-bold text-primary">
                      {latestAnalysis.successfulPosts}/{latestAnalysis.generatedPosts}
                    </div>
                    <p className="text-sm text-gray-600">Post yaratish natijalari</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Hali postlar yaratilmagan</p>
                  <p className="text-xs">Trend tahlilidan keyin postlar yaratishni boshlang</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trending Keywords */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bugungi trendlar</CardTitle>
            </CardHeader>
            <CardContent>
              {latestAnalysis.trends && latestAnalysis.trends.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {latestAnalysis.trends
                      .sort((a: any, b: any) => b.score - a.score)
                      .slice(0, 12)
                      .map((trend: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        data-testid={`trend-item-${index}`}
                      >
                        <span className="text-sm font-medium truncate">{trend.keyword}</span>
                        <Badge className={`ml-2 ${getScoreColor(trend.score)}`}>
                          {trend.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Gemini AI tavsiyalari:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Eng yuqori skorli trendlardan blog postlari yaratiladi</li>
                      <li>• Kunlik 10-12 ta avtomatik post generatsiya qilinadi</li>
                      <li>• SEO uchun optimallashtirilgan kontent yaratiladi</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Trend ma'lumotlari topilmadi</p>
                  <p className="text-xs">Tahlilni yangilash uchun yuqoridagi tugmani bosing</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Errors (if any) */}
          {latestAnalysis.errors && latestAnalysis.errors.length > 0 && (
            <Card className="lg:col-span-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Xatolar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {latestAnalysis.errors.map((error: any, index: number) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trend tahlili mavjud emas</h3>
            <p className="text-gray-600 mb-4">
              Gemini 1.5 Flash API yordamida bugungi trendlarni tahlil qilish uchun tugmani bosing
            </p>
            <Button onClick={() => analyzeTrendsMutation.mutate()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Birinchi tahlilni boshlash
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
