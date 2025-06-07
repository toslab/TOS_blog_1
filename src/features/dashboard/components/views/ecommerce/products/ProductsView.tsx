'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { Badge } from '@/components/dashboard_UI/badge';
import { 
  Plus, Search, Filter, LayoutGrid, List, 
  Download, Upload, Package, AlertCircle 
} from 'lucide-react';
import ProductsList from './ProductsList';
import ProductsGrid from './ProductsGrid';
import ProductsFilter from './ProductsFilter';
import { Product } from '@/features/dashboard/types/ecommerce';

export default function ProductsView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    stock: 'all',
  });

  // 목업 통계
  const stats = {
    total: 156,
    active: 142,
    lowStock: 12,
    outOfStock: 4,
  };

  // 목업 상품 데이터
  const products: Product[] = generateMockProducts();

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.status !== 'all' && product.status !== filters.status) return false;
    
    if (filters.stock === 'low' && product.stock > (product.lowStockThreshold || 10)) return false;
    if (filters.stock === 'out' && product.stock > 0) return false;
    
    return true;
  });

  const handleCreateProduct = () => {
    router.push('/dashboard/ecommerce/products/new');
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/dashboard/ecommerce/products/${productId}/edit`);
  };

  const handleExport = () => {
    console.log('Exporting products...');
    // CSV/Excel 내보내기 구현
  };

  const handleImport = () => {
    console.log('Importing products...');
    // CSV/Excel 가져오기 구현
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            상품 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            판매 상품을 등록하고 재고를 관리합니다
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            가져오기
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
          <Button onClick={handleCreateProduct}>
            <Plus className="w-4 h-4 mr-2" />
            상품 등록
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">전체 상품</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">판매중</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">재고 부족</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">품절</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품명, SKU로 검색..."
                className="pl-10"
              />
            </div>
          </div>
          
          <ProductsFilter filters={filters} onFiltersChange={setFilters} />
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGrid className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Products View */}
      <div>
        {viewMode === 'grid' ? (
          <ProductsGrid 
            products={filteredProducts}
            onEdit={handleEditProduct}
          />
        ) : (
          <ProductsList 
            products={filteredProducts}
            onEdit={handleEditProduct}
          />
        )}
      </div>
    </div>
  );
}

// 목업 데이터 생성
function generateMockProducts(): Product[] {
  const categories = ['전자제품', '의류', '식품', '화장품', '도서'];
  const statuses = ['active', 'draft', 'archived'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `상품 ${i + 1}`,
    description: `이것은 상품 ${i + 1}의 설명입니다.`,
    sku: `SKU-${String(1000 + i).padStart(4, '0')}`,
    barcode: `880${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
    category: {
      id: `cat-${Math.floor(Math.random() * 5)}`,
      name: categories[Math.floor(Math.random() * categories.length)],
      slug: categories[Math.floor(Math.random() * categories.length)].toLowerCase(),
    },
    price: Math.floor(Math.random() * 100000) + 10000,
    compareAtPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 150000) + 20000 : undefined,
    cost: Math.floor(Math.random() * 50000) + 5000,
    currency: 'KRW',
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    stock: Math.floor(Math.random() * 100),
    lowStockThreshold: 10,
    images: [
      {
        id: '1',
        url: `https://via.placeholder.com/300x300?text=Product+${i + 1}`,
        position: 0,
      }
    ],
    tags: ['신상품', '인기', '세일'].slice(0, Math.floor(Math.random() * 3) + 1),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}