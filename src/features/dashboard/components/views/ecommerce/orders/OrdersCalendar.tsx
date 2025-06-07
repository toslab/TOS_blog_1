'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/dashboard_UI/card';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  getDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Order, OrderFilter, SalesPlatform } from '@/features/dashboard/types/ecommerce';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dashboard_UI/popover';

interface OrdersCalendarProps {
  orders: Order[];
  filters: OrderFilter;
  onOrderSelect: (order: Order) => void;
}

interface DayData {
  date: Date;
  orders: Order[];
  totalAmount: number;
  platformCounts: Record<SalesPlatform, number>;
}

export default function OrdersCalendar({ orders, filters, onOrderSelect }: OrdersCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  // 캘린더 데이터 생성
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    return days.map(date => {
      const dayOrders = orders.filter(order => 
        isSameDay(new Date(order.orderedAt), date)
      );
      
      const platformCounts = dayOrders.reduce((acc, order) => {
        acc[order.platform] = (acc[order.platform] || 0) + 1;
        return acc;
      }, {} as Record<SalesPlatform, number>);
      
      return {
        date,
        orders: dayOrders,
        totalAmount: dayOrders.reduce((sum, order) => sum + order.total, 0),
        platformCounts,
      };
    });
  }, [currentMonth, orders]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const DayCell = ({ dayData }: { dayData: DayData }) => {
    const isCurrentMonth = isSameMonth(dayData.date, currentMonth);
    const hasOrders = dayData.orders.length > 0;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "relative min-h-[100px] p-2 border-r border-b cursor-pointer transition-colors",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              !isCurrentMonth && "bg-gray-50 dark:bg-gray-900/50 text-gray-400",
              isToday(dayData.date) && "bg-purple-50 dark:bg-purple-900/20",
              selectedDate && isSameDay(dayData.date, selectedDate) && "ring-2 ring-purple-500"
            )}
            onClick={() => setSelectedDate(dayData.date)}
          >
            {/* 날짜 */}
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-sm font-medium",
                isToday(dayData.date) && "text-purple-600 dark:text-purple-400"
              )}>
                {format(dayData.date, 'd')}
              </span>
              {hasOrders && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {dayData.orders.length}
                </Badge>
              )}
            </div>

            {/* 주문 정보 */}
            {hasOrders && (
              <div className="space-y-1">
                {/* 플랫폼별 주문 수 */}
                <div className="flex flex-wrap gap-1">
                  {Object.entries(dayData.platformCounts)
                    .slice(0, 3)
                    .map(([platform, count]) => (
                      <div
                        key={platform}
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs",
                          platformColors[platform]
                        )}
                      >
                        {count}
                      </div>
                    ))}
                  {Object.keys(dayData.platformCounts).length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                      +
                    </div>
                  )}
                </div>

                {/* 총 매출 */}
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  ₩{(dayData.totalAmount / 1000).toFixed(0)}k
                </div>
              </div>
            )}
          </div>
        </PopoverTrigger>
        
        {/* 팝오버 상세 정보 */}
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {format(dayData.date, 'yyyy년 M월 d일', { locale: ko })}
              </h4>
              <Badge>{dayData.orders.length}건</Badge>
            </div>

            {hasOrders ? (
              <>
                {/* 플랫폼별 통계 */}
                <div className="space-y-2">
                  {Object.entries(dayData.platformCounts).map(([platform, count]) => (
                    <div key={platform} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", platformColors[platform])} />
                        <span>{platform}</span>
                      </div>
                      <span className="font-medium">{count}건</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">총 매출</span>
                    <span className="font-medium">₩{dayData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => {
                    // 해당 날짜의 주문만 필터링하여 목록 보기로 전환
                    console.log('View orders for', dayData.date);
                  }}
                >
                  주문 상세 보기
                </Button>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">주문이 없습니다</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-4">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            오늘
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 캘린더 본체 */}
      <div className="border rounded-lg overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={cn(
                "py-2 text-center text-sm font-medium",
                index === 0 && "text-red-600",
                index === 6 && "text-blue-600"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {calendarData.map((dayData) => (
            <DayCell key={dayData.date.toString()} dayData={dayData} />
          ))}
        </div>
      </div>

      {/* 범례 */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">플랫폼 색상</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(platformColors).map(([platform, color]) => (
            <div key={platform} className="flex items-center gap-2 text-sm">
              <div className={cn("w-4 h-4 rounded-full", color)} />
              <span className="text-gray-600 dark:text-gray-400">{platform}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}