// features/dashboard/components/views/home/StatsCards.tsx

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, TrendingDown, Users, ShoppingBag, 
  FileText, Package, DollarSign, Activity 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // TODO: API 호출
      return {
        revenue: { value: '₩124.5M', change: 12.5 },
        orders: { value: 326, change: 8.2 },
        customers: { value: 1234, change: -2.1 },
        inventory: { value: '89%', change: 5.3 },
      };
    },
  });

  const cards: StatCard[] = [
    {
      id: 'revenue',
      title: '총 매출',
      value: stats?.revenue.value || '₩0',
      change: stats?.revenue.change || 0,
      changeType: 'increase',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    },
    {
      id: 'orders',
      title: '신규 주문',
      value: stats?.orders.value || 0,
      change: stats?.orders.change || 0,
      changeType: 'increase',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    },
    {
      id: 'customers',
      title: '활성 사용자',
      value: stats?.customers.value || 0,
      change: stats?.customers.change || 0,
      changeType: 'decrease',
      icon: <Users className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    },
    {
      id: 'inventory',
      title: '재고 현황',
      value: stats?.inventory.value || '0%',
      change: stats?.inventory.change || 0,
      changeType: 'increase',
      icon: <Package className="w-5 h-5" />,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", card.color)}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-sm">
                {card.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={cn(
                  "font-medium",
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {Math.abs(card.change)}%
                </span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}