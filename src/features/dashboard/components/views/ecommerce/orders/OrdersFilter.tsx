'use client';

import React from 'react';
import { Card } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Label } from '@/components/dashboard_UI/label';
import { Badge } from '@/components/dashboard_UI/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dashboard_UI/popover';
import { Calendar } from '@/components/dashboard_UI/calendar';
import { 
  CalendarIcon, Filter, X, ShoppingBag, 
  Truck, CreditCard, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { OrderFilter, SalesPlatform } from '@/features/dashboard/types/ecommerce';

interface OrdersFilterProps {
  filters: OrderFilter;
  onFiltersChange: (filters: OrderFilter) => void;
}

export default function OrdersFilter({ filters, onFiltersChange }: OrdersFilterProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const platformOptions: { value: SalesPlatform; label: string; color: string }[] = [
    { value: 'shopify', label: 'Shopify', color: 'bg-green-500' },
    { value: 'coupang', label: '쿠팡', color: 'bg-yellow-500' },
    { value: 'naver', label: '네이버', color: 'bg-green-600' },
    { value: 'gmarket', label: 'G마켓', color: 'bg-pink-500' },
    { value: 'auction', label: '옥션', color: 'bg-blue-500' },
    { value: '11st', label: '11번가', color: 'bg-red-500' },
    { value: 'instagram', label: '인스타그램', color: 'bg-purple-500' },
    { value: 'own_mall', label: '자사몰', color: 'bg-gray-500' },
  ];

  const handleDateRangeChange = (type: 'start' | 'end', date: Date | undefined) => {
    if (date) {
      onFiltersChange({
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [type]: date,
        },
      });
    }
  };

  const handlePlatformToggle = (platform: SalesPlatform) => {
    const platforms = filters.platforms || [];
    const updated = platforms.includes(platform)
      ? platforms.filter(p => p !== platform)
      : [...platforms, platform];
    
    onFiltersChange({
      ...filters,
      platforms: updated.length > 0 ? updated : undefined,
    });
  };

  const activeFiltersCount = [
    filters.platforms?.length || 0,
    filters.status?.length || 0,
    filters.shippingStatus?.length || 0,
    filters.paymentStatus?.length || 0,
    filters.csStatus?.length || 0,
    filters.search ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    onFiltersChange({
      dateRange: filters.dateRange, // 날짜는 유지
      platforms: undefined,
      status: undefined,
      shippingStatus: undefined,
      paymentStatus: undefined,
      csStatus: undefined,
      search: undefined,
      tags: undefined,
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* 기본 필터 */}
        <div className="flex flex-wrap items-end gap-4">
          {/* 날짜 범위 */}
          <div className="flex gap-2">
            <div>
              <Label className="text-xs">시작일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left font-normal",
                      !filters.dateRange.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(filters.dateRange.start, "MM/dd", { locale: ko })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.start}
                    onSelect={(date) => handleDateRangeChange('start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label className="text-xs">종료일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left font-normal",
                      !filters.dateRange.end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(filters.dateRange.end, "MM/dd", { locale: ko })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.end}
                    onSelect={(date) => handleDateRangeChange('end', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 빠른 날짜 선택 */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                onFiltersChange({
                  ...filters,
                  dateRange: { start: today, end: today },
                });
              }}
            >
              오늘
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 7);
                onFiltersChange({
                  ...filters,
                  dateRange: { start, end },
                });
              }}
            >
              7일
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(start.getDate() - 30);
                onFiltersChange({
                  ...filters,
                  dateRange: { start, end },
                });
              }}
            >
              30일
            </Button>
          </div>

          {/* 플랫폼 필터 */}
          <div className="flex-1">
            <Label className="text-xs">판매 채널</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {platformOptions.map((platform) => (
                <Badge
                  key={platform.value}
                  variant={filters.platforms?.includes(platform.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handlePlatformToggle(platform.value)}
                >
                  <div className={cn("w-2 h-2 rounded-full mr-1", platform.color)} />
                  {platform.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* 고급 필터 토글 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="w-4 h-4 mr-2" />
              고급 필터
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="ml-2 rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs font-medium"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 고급 필터 */}
        {showAdvanced && (
          <div className="pt-4 border-t space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 주문 상태 */}
              <div>
                <Label className="text-xs flex items-center gap-1 mb-2">
                  <ShoppingBag className="w-3 h-3" />
                  주문 상태
                </Label>
                <Select
                  value={filters.status?.[0] || 'all'}
                  onValueChange={(value) => {
                    onFiltersChange({
                      ...filters,
                      status: value === 'all' ? undefined : [value as any],
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="processing">처리중</SelectItem>
                    <SelectItem value="shipped">배송중</SelectItem>
                    <SelectItem value="delivered">배송완료</SelectItem>
                    <SelectItem value="cancelled">취소</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 배송 상태 */}
              <div>
                <Label className="text-xs flex items-center gap-1 mb-2">
                  <Truck className="w-3 h-3" />
                  배송 상태
                </Label>
                <Select
                  value={filters.shippingStatus?.[0] || 'all'}
                  onValueChange={(value) => {
                    onFiltersChange({
                      ...filters,
                      shippingStatus: value === 'all' ? undefined : [value as any],
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="pending">배송대기</SelectItem>
                    <SelectItem value="preparing">상품준비중</SelectItem>
                    <SelectItem value="ready">발송준비완료</SelectItem>
                    <SelectItem value="shipped">발송완료</SelectItem>
                    <SelectItem value="delivered">배송완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 결제 상태 */}
              <div>
                <Label className="text-xs flex items-center gap-1 mb-2">
                  <CreditCard className="w-3 h-3" />
                  결제 상태
                </Label>
                <Select
                  value={filters.paymentStatus?.[0] || 'all'}
                  onValueChange={(value) => {
                    onFiltersChange({
                      ...filters,
                      paymentStatus: value === 'all' ? undefined : [value as any],
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="pending">결제대기</SelectItem>
                    <SelectItem value="paid">결제완료</SelectItem>
                    <SelectItem value="failed">결제실패</SelectItem>
                    <SelectItem value="refunded">환불완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CS 상태 */}
              <div>
                <Label className="text-xs flex items-center gap-1 mb-2">
                  <AlertCircle className="w-3 h-3" />
                  CS 상태
                </Label>
                <Select
                  value={filters.csStatus?.[0] || 'all'}
                  onValueChange={(value) => {
                    onFiltersChange({
                      ...filters,
                      csStatus: value === 'all' ? undefined : [value as any],
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="none">없음</SelectItem>
                    <SelectItem value="in_progress">진행중</SelectItem>
                    <SelectItem value="resolved">해결됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}