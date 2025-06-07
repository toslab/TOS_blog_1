'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { 
  Truck, Package, Printer, CheckCircle, 
  AlertCircle, Clock, Download, Upload 
} from 'lucide-react';
import ShippingQueue from './ShippingQueue';
import LabelPrinter from './LabelPrinter';
import ShippingStats from './ShippingStats';
import { ShippingCarrier } from '@/features/dashboard/types/ecommerce';

export default function ShippingView() {
  const [selectedCarrier, setSelectedCarrier] = useState<ShippingCarrier | 'all'>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // 목업 통계 데이터
  const stats = {
    pending: 23,
    preparing: 15,
    ready: 8,
    shipped: 156,
    todayShipped: 12,
  };

  const carriers = [
    { id: 'korea_post', name: '우체국택배', color: 'bg-red-500' },
    { id: 'cj_logistics', name: 'CJ대한통운', color: 'bg-blue-500' },
    { id: 'hanjin', name: '한진택배', color: 'bg-yellow-500' },
    { id: 'lotte', name: '롯데택배', color: 'bg-orange-500' },
    { id: 'logen', name: '로젠택배', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            배송 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            주문 상품의 배송을 관리하고 송장을 출력합니다
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            송장 일괄 등록
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            배송 현황 다운로드
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">배송 대기</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">상품 준비중</p>
                <p className="text-2xl font-bold">{stats.preparing}</p>
              </div>
              <Package className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">발송 준비완료</p>
                <p className="text-2xl font-bold">{stats.ready}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">오늘 발송</p>
                <p className="text-2xl font-bold">{stats.todayShipped}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">이번달 발송</p>
                <p className="text-2xl font-bold">{stats.shipped}</p>
              </div>
              <Truck className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carrier Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button
            variant={selectedCarrier === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCarrier('all')}
          >
            전체
          </Button>
          {carriers.map((carrier) => (
            <Button
              key={carrier.id}
              variant={selectedCarrier === carrier.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCarrier(carrier.id as ShippingCarrier)}
              className="gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${carrier.color}`} />
              {carrier.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue" className="gap-2">
            <Package className="w-4 h-4" />
            배송 대기열
          </TabsTrigger>
          <TabsTrigger value="print" className="gap-2">
            <Printer className="w-4 h-4" />
            송장 출력
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            배송 현황
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <ShippingQueue 
            carrier={selectedCarrier}
            selectedOrders={selectedOrders}
            onSelectionChange={setSelectedOrders}
          />
        </TabsContent>

        <TabsContent value="print">
          <LabelPrinter 
            selectedOrders={selectedOrders}
            onPrintComplete={() => setSelectedOrders([])}
          />
        </TabsContent>

        <TabsContent value="stats">
          <ShippingStats carrier={selectedCarrier} />
        </TabsContent>
      </Tabs>
    </div>
  );
}