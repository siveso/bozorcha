import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductFilters } from "@/types";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onApplyFilters: () => void;
}

export function ProductFilters({ filters, onFiltersChange, onApplyFilters }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  const categories = [
    { value: "elektronika", label: "Elektronika" },
    { value: "kiyim", label: "Kiyim" },
    { value: "uy-jihozlari", label: "Uy jihozlari" },
    { value: "kitoblar", label: "Kitoblar" },
    { value: "sport", label: "Sport" },
    { value: "gozallik", label: "Go'zallik" },
  ];

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setLocalFilters(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setLocalFilters(prev => ({ ...prev, category }));
    } else {
      setLocalFilters(prev => ({ ...prev, category: undefined }));
    }
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
  };

  const clearFilters = () => {
    const clearedFilters: ProductFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onApplyFilters();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Filtrlash</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Narx oralig'i (so'm)</h4>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              data-testid="price-min-input"
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              data-testid="price-max-input"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h4 className="font-medium mb-3">Kategoriya</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={localFilters.category === category.value}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.value, checked as boolean)
                  }
                  data-testid={`category-${category.value}`}
                />
                <Label htmlFor={`category-${category.value}`} className="text-sm">
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={applyFilters} 
            className="w-full bg-primary text-white hover:bg-blue-700"
            data-testid="apply-filters-button"
          >
            Filtrlarni qo'llash
          </Button>
          <Button 
            onClick={clearFilters} 
            variant="outline" 
            className="w-full"
            data-testid="clear-filters-button"
          >
            Tozalash
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
