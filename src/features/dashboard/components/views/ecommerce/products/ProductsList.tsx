'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard_UI/table';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { Checkbox } from '@/components/dashboard_UI/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { MoreVertical, Edit, Copy, Archive, Package } from 'lucide-react';
import { Product } from '@/features/dashboard/types/ecommerce';
import { cn } from '@/lib/utils';

interface ProductsListProps {
  products: Product[];
  onEdit: (productId: string) => void;
}

export default function ProductsList({ products, onEdit }: ProductsListProps) {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: '품절', color: 'destructive' };
    }
    if (product.stock <= (product.lowStockThreshold || 10)) {
      return { label: '재고 부족', color: 'warning' };
    }
    return { label: '재고 있음', color: 'success' };
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[80px]">이미지</TableHead>
            <TableHead>상품명</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>가격</TableHead>
            <TableHead>재고</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product);
            
            return (
              <TableRow 
                key={product.id}
                className={cn(
                  selectedProducts.includes(product.id) && "bg-purple-50 dark:bg-purple-900/20"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {product.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">₩{product.price.toLocaleString()}</div>
                    {product.compareAtPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        ₩{product.compareAtPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-medium",
                      product.stock === 0 && "text-red-600",
                      product.stock <= (product.lowStockThreshold || 10) && product.stock > 0 && "text-yellow-600"
                    )}>
                      {product.stock}개
                    </span>
                    <Badge variant={stockStatus.color as any} className="text-xs">
                      {stockStatus.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={product.status === 'active' ? 'default' : 'secondary'}
                  >
                    {product.status === 'active' ? '판매중' : 
                     product.status === 'draft' ? '임시저장' : '보관'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(product.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        복제
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="w-4 h-4 mr-2" />
                        보관
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}