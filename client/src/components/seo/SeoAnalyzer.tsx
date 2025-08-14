import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SeoAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
}

interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export function SeoAnalyzer() {
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<SeoMetadata>({
    title: '',
    description: '',
    keywords: []
  });
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeSeo = async () => {
    if (!content || !metadata.title || !metadata.description) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Barcha maydonlarni to'ldiring"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Get auth token from localStorage if user is authenticated
      const authToken = localStorage.getItem('admin_token') || 'admin-token-123';
      
      const response = await fetch('/api/admin/seo/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ content, metadata })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Avtorizatsiya xatosi');
        }
        throw new Error('SEO tahlil xatosi');
      }

      const result = await response.json();
      setAnalysis(result);
      
      toast({
        title: "Muvaffaqiyatli",
        description: "SEO tahlil yakunlandi"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: error instanceof Error ? error.message : "SEO tahlil qilishda xato yuz berdi"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Tahlilchisi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Sahifa Sarlavhasi</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Sahifa sarlavhasini kiriting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Meta Tavsifi</Label>
              <Input
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Meta tavsifini kiriting"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords">Kalit So'zlar (vergul bilan ajrating)</Label>
            <Input
              id="keywords"
              value={metadata.keywords.join(', ')}
              onChange={(e) => setMetadata(prev => ({ 
                ...prev, 
                keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
              }))}
              placeholder="kalit so'z 1, kalit so'z 2, kalit so'z 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Sahifa Kontenti (HTML)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Sahifa HTML kontentini kiriting..."
              rows={8}
            />
          </div>

          <Button onClick={analyzeSeo} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? 'Tahlil qilinmoqda...' : 'SEO Tahlil Qilish'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>SEO Tahlil Natijalari</span>
              <Badge variant={getScoreBadgeVariant(analysis.score)}>
                {analysis.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>SEO Reytingi</span>
                <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}%
                </span>
              </div>
              <Progress value={analysis.score} className="h-3" />
            </div>

            {analysis.issues.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <strong>Muammolar:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.issues.map((issue, index) => (
                        <li key={index} className="text-sm">{issue}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {analysis.suggestions.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <strong>Tavsiyalar:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}