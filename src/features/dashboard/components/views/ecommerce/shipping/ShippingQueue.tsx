'use client';

import React, { useState } from 'react';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Checkbox } from '@/components/dashboard_UI/checkbox';
import { Input } from '@/components/dashboard_UI/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard_UI/table';
import { 
  Package, Truck, AlertCircle, CheckCircle, 
  Search, Filter, MoreVertical 
} from 'lucide-react';
import { ShippingCarrier, Order } from '@/features/dashboard/types/ecommerce';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ShippingQueueProps {
  carrier: ShippingCarrier | 'all';
  selectedOrders: string[];
  onSelectionChange: (orders: string[]) => void;
}

export default function ShippingQueue({ 
  carrier, 
  selectedOrders, 
  onSelectionChange 
}: ShippingQueueProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  // 목업 데이터
  const orders = generateMockShippingOrders();

  const filteredOrders = orders.filter(order => {
    if (carrier !== 'all' && order.shippingCarrier !== carrier) return false;
    if (statusFilter !== 'all' && order.shippingStatus !== statusFilter) return false;
    if (searchQuery && !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredOrders.map(order => order.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedOrders, orderId]);
    } else {
      onSelectionChange(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'Orders:', selectedOrders);
    // 실제 구현에서는 API 호출
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="주문번호 검색..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              전체
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              배송대기
            </Button>
            <Button
              variant={statusFilter === 'preparing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('preparing')}
            >
              준비중
            </Button>
            <Button
              variant={statusFilter === 'ready' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('ready')}
            >
              준비완료
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-base">
                {selectedOrders.length}개 선택
              </Badge>
              <Button 
                size="sm"
                onClick={() => handleBulkAction('prepare')}
              >
                발송 준비
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('print')}
              >
                송장 출력
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('register')}
              >
                송장 등록
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
            >
              선택 해제
            </Button>
          </div>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>주문번호</TableHead>
              <TableHead>주문일시</TableHead>
              <TableHead>고객정보</TableHead>
              <TableHead>배송지</TableHead>
              <TableHead>상품</TableHead>
              <TableHead>택배사</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>송장번호</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow 
                key={order.id}
                className={cn(
                  selectedOrders.includes(order.id) && "bg-purple-50 dark:bg-purple-900/20"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-mono text-sm">{order.orderNumber}</div>
                    <div className="text-xs text-gray-500">{order.platform}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(order.orderedAt), 'MM/dd HH:mm', { locale: ko })}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium">
                      {order.customer.firstName}{order.customer.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{order.customer.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{order.shippingAddress.address1}</div>
                    <div className="text-xs text-gray-500">
                      {order.shippingAddress.city} {order.shippingAddress.postalCode}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.length}개 상품
                  </div>
                </TableCell>
                <TableCell>
                  {order.shippingCarrier && (
                    <Badge variant="outline">
                      {order.shippingCarrier === 'korea_post' ? '우체국' :
                       order.shippingCarrier === 'cj_logistics' ? 'CJ' :
                       order.shippingCarrier === 'hanjin' ? '한진' :
                       order.shippingCarrier === 'lotte' ? '롯데' : '로젠'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      order.shippingStatus === 'ready' ? 'default' :
                      order.shippingStatus === 'preparing' ? 'secondary' : 'outline'
                    }
                  >
                    {order.shippingStatus === 'pending' ? '대기' :
                     order.shippingStatus === 'preparing' ? '준비중' : '준비완료'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.trackingNumber ? (
                    <div className="font-mono text-sm">{order.trackingNumber}</div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// 목업 데이터 생성
function generateMockShippingOrders(): any[] {
  const platforms = ['shopify', 'coupang', 'naver'];
  const carriers = ['korea_post', 'cj_logistics', 'hanjin', 'lotte', 'logen'];
  const statuses = ['pending', 'preparing', 'ready'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `order-${i + 1}`,
    orderNumber: `ORD-2024-${String(1000 + i).padStart(4, '0')}`,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    orderedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      firstName: '김',
      lastName: '철수',
      phone: '010-1234-5678',
    },
    shippingAddress: {
      address1: '서울시 강남구 테헤란로 123',
      city: '서울',
      postalCode: '06234',
    },
    items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({})),
    shippingCarrier: Math.random() > 0.3 ? carriers[Math.floor(Math.random() * carriers.length)] : null,
    shippingStatus: statuses[Math.floor(Math.random() * statuses.length)],
    trackingNumber: Math.random() > 0.5 ? `${Math.floor(Math.random() * 900000000) + 100000000}` : null,
  }));
}