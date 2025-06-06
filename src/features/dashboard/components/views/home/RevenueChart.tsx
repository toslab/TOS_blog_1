// features/dashboard/components/views/home/RevenueChart.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
// import { useQuery } from '@tanstack/react-query'; // 주석 처리
// import { apiClient } from '@/lib/api/client'; // 주석 처리

type ChartPeriod = 'week' | 'month' | 'year';

export default function RevenueChart() {
  const [period, setPeriod] = React.useState<ChartPeriod>('month');
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 데이터로 시뮬레이션
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const mockData = {
        week: [
          { name: '월', revenue: 4200000, orders: 120 },
          { name: '화', revenue: 3800000, orders: 98 },
          { name: '수', revenue: 5100000, orders: 140 },
          { name: '목', revenue: 4700000, orders: 132 },
          { name: '금', revenue: 6200000, orders: 170 },
          { name: '토', revenue: 7500000, orders: 200 },
          { name: '일', revenue: 6800000, orders: 185 },
        ],
        month: [
          { name: '1주', revenue: 25000000, orders: 680 },
          { name: '2주', revenue: 28000000, orders: 750 },
          { name: '3주', revenue: 32000000, orders: 820 },
          { name: '4주', revenue: 29500000, orders: 790 },
        ],
        year: [
          { name: '1월', revenue: 95000000, orders: 2500 },
          { name: '2월', revenue: 88000000, orders: 2300 },
          { name: '3월', revenue: 102000000, orders: 2700 },
          { name: '4월', revenue: 98000000, orders: 2600 },
          { name: '5월', revenue: 110000000, orders: 2900 },
          { name: '6월', revenue: 125000000, orders: 3200 },
        ],
      };
      
      setChartData(mockData[period]);
      setIsLoading(false);
    }, 500); // 0.5초 후 로딩 완료

    return () => clearTimeout(timer);
  }, [period]); // period가 변경될 때마다 데이터 다시 로드

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            매출: ₩{payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            주문: {payload[1]?.value || 0}건
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>매출 현황</CardTitle>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as ChartPeriod)}>
          <TabsList>
            <TabsTrigger value="week">주간</TabsTrigger>
            <TabsTrigger value="month">월간</TabsTrigger>
            <TabsTrigger value="year">연간</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">차트 로딩중...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: '#6b7280' }}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}