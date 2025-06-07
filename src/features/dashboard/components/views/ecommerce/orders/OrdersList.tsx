'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard_UI/table';
import { Checkbox } from '@/components/dashboard_UI/checkbox';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { 
  MoreVertical, Eye, Copy, MessageSquare, 
  Package, Truck, ArrowUpDown, ChevronLeft, 
  ChevronRight, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Order } from '@/features/dashboard/types/ecommerce';

interface OrdersListProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectionChange: (selected: string[]) => void;
}

type SortField = 'orderedAt' | 'total' | 'platform' | 'status';
type SortDirection = 'asc' | 'desc';

export default function OrdersList({ 
  orders, 
  selectedOrders, 
  onSelectionChange 
}: OrdersListProps) {
  const [sortField, setSortField] = useState<SortField>('orderedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 플랫폼별 색상
  const platformColors: Record<string, string> = {
    shopify: 'bg-green-500',
    coupang: 'bg-yellow-500',
    naver: 'bg-green-600',
    gmarket: 'bg-pink-500',
    auction: 'bg-blue-500',
    '11st': 'bg-red-500',
    instagram: 'bg-purple-500',
    own_mall: 'bg-gray-500',
  };

  // 정렬
  const sortedOrders = [...orders].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'orderedAt':
        return modifier * (new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime());
      case 'total':
        return modifier * (a.total - b.total);
      case 'platform':
        return modifier * a.platform.localeCompare(b.platform);
      case 'status':
        return modifier * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(paginatedOrders.map(order => order.id));
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getShippingStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('orderedAt')}
                  className="gap-1"
                >
                  주문일시
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead>주문번호</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('platform')}
                  className="gap-1"
                >
                  플랫폼
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead>고객</TableHead>
              <TableHead>상품</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('total')}
                  className="gap-1"
                >
                  금액
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('status')}
                  className="gap-1"
                >
                  상태
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead>배송</TableHead>
              <TableHead>CS</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow 
                key={order.id}
                className={cn(
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  selectedOrders.includes(order.id) && "bg-purple-50 dark:bg-purple-900/20"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div>{format(new Date(order.orderedAt), 'MM/dd', { locale: ko })}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(order.orderedAt), 'HH:mm')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-mono text-sm">{order.orderNumber}</div>
                    <div className="text-xs text-gray-500">{order.platformOrderId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", platformColors[order.platform])} />
                    <span className="text-sm">{order.platform}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {order.customer.firstName[0]}{order.customer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">
                        {order.customer.firstName}{order.customer.lastName}
                      </div>
                      {order.customer.totalOrders > 1 && (
                        <div className="text-xs text-gray-500">
                          {order.customer.totalOrders}번째 구매
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.length}개 상품
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  ₩{order.total.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status === 'pending' ? '대기' :
                     order.status === 'processing' ? '처리중' :
                     order.status === 'shipped' ? '배송중' :
                     order.status === 'delivered' ? '완료' : '취소'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.shippingStatus && (
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getShippingStatusColor(order.shippingStatus))}
                    >
                      {order.shippingStatus === 'pending' ? '대기' :
                       order.shippingStatus === 'preparing' ? '준비중' :
                       order.shippingStatus === 'ready' ? '준비완료' :
                       order.shippingStatus === 'shipped' ? '발송' : '완료'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {order.csStatus && order.csStatus !== 'none' && (
                    <Badge 
                      variant={order.csStatus === 'in_progress' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      CS
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        상세 보기
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        주문번호 복사
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Package className="w-4 h-4 mr-2" />
                        발송 준비
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Truck className="w-4 h-4 mr-2" />
                        송장 입력
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        고객 메시지
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          총 {orders.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, orders.length)}개 표시
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={i}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="w-8"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}