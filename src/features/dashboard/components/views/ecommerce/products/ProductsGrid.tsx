'use client';

import React from 'react';
import { Card, CardContent } from '@/components/dashboard_UI/card';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { Star, Edit, Trash2, Eye } from 'lucide-react';
import { Product } from '@/features/dashboard/types/ecommerce';

interface ProductsGridProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onView?: (product: Product) => void;
}

export default function ProductsGrid({ products, onEdit, onDelete, onView }: ProductsGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">품절</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviewCount})</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">{formatPrice(product.price)}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                </div>
                <Badge variant="outline">{product.category.name}</Badge>
              </div>
              
              <div className="text-sm text-gray-600">
                재고: {product.stockQuantity}개
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onView?.(product)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  보기
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}