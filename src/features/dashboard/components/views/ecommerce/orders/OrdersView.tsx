'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Calendar, List, Download, Upload, Filter } from 'lucide-react';
import OrdersCalendar from './OrdersCalendar';
import OrdersList from './OrdersList';
import OrdersFilter from './OrdersFilter';
import OrdersBulkActions from './OrdersBulkActions';
import { OrderFilter, Order } from '@/features/dashboard/types/ecommerce';

export default function OrdersView() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filters, setFilters] = useState<OrderFilter>({
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 30)),
      end: new Date(),
    },
  });

  // 목업 데이터
  const orders: Order[] = generateMockOrders();

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'Orders:', selectedOrders);
    // 실제 구현에서는 API 호출
  };

  const handleExport = () => {
    console.log('Exporting orders with filters:', filters);
    // CSV/Excel 내보내기 구현
  };

  const handleImport = () => {
    console.log('Importing orders');
    // 주문 가져오기 구현
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            주문 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            모든 판매 채널의 주문을 통합 관리합니다
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
        </div>
      </div>

      {/* Filters */}
      <OrdersFilter filters={filters} onFiltersChange={setFilters} />

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <OrdersBulkActions
          selectedCount={selectedOrders.length}
          onAction={handleBulkAction}
          onClear={() => setSelectedOrders([])}
        />
      )}

      {/* View Tabs */}
      <Card>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <div className="border-b px-6 pt-6">
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="w-4 h-4" />
                캘린더 보기
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="w-4 h-4" />
                목록 보기
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="p-6">
            <OrdersCalendar 
              orders={orders}
              filters={filters}
              onOrderSelect={(order) => console.log('Selected:', order)}
            />
          </TabsContent>

          <TabsContent value="list" className="p-6">
            <OrdersList
              orders={orders}
              selectedOrders={selectedOrders}
              onSelectionChange={setSelectedOrders}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

// 목업 데이터 생성 함수
function generateMockOrders(): Order[] {
  const platforms = ['shopify', 'coupang', 'naver', 'instagram'];
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `order-${i + 1}`,
    platform: platforms[Math.floor(Math.random() * platforms.length)] as any,
    platformOrderId: `PLT-${1000 + i}`,
    orderNumber: `ORD-2024-${String(1000 + i).padStart(4, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    customerId: `customer-${Math.floor(Math.random() * 20)}`,
    customer: {
      id: `customer-${Math.floor(Math.random() * 20)}`,
      email: `customer${i}@example.com`,
      firstName: '김',
      lastName: '철수',
      totalOrders: Math.floor(Math.random() * 10) + 1,
      totalSpent: Math.floor(Math.random() * 1000000) + 50000,
      averageOrderValue: Math.floor(Math.random() * 100000) + 20000,
      acceptsMarketing: Math.random() > 0.5,
      addresses: [],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    items: [],
    subtotal: Math.floor(Math.random() * 200000) + 10000,
    tax: Math.floor(Math.random() * 20000),
    shipping: 3000,
    discount: Math.floor(Math.random() * 10000),
    total: Math.floor(Math.random() * 200000) + 20000,
    currency: 'KRW',
    paymentStatus: 'paid',
    shippingAddress: {
      id: '1',
      type: 'shipping',
      firstName: '김',
      lastName: '철수',
      address1: '서울시 강남구',
      city: '서울',
      province: '서울',
      postalCode: '06000',
      country: 'KR',
    },
    shippingStatus: ['pending', 'preparing', 'ready', 'shipped'][Math.floor(Math.random() * 4)] as any,
    orderedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}