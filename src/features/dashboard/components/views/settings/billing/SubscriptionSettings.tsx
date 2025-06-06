'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Shield, Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '무료',
    description: '개인 사용자를 위한 기본 플랜',
    features: ['5개 프로젝트', '1GB 저장공간', '기본 지원'],
    current: false,
  },
  {
    name: 'Pro',
    price: '₩29,000/월',
    description: '전문가를 위한 고급 플랜',
    features: ['무제한 프로젝트', '50GB 저장공간', '우선 지원', 'AI 기능'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: '₩99,000/월',
    description: '팀과 기업을 위한 플랜',
    features: ['무제한 모든 기능', '500GB 저장공간', '24/7 지원', '고급 분석'],
    current: false,
  },
];

export default function SubscriptionSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            구독 관리
          </CardTitle>
          <CardDescription>
            현재 플랜을 확인하고 업그레이드하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg border p-6 ${
                  plan.current
                    ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {plan.current && (
                  <Badge className="absolute -top-2 left-4 bg-purple-600">
                    현재 플랜
                  </Badge>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-2xl font-bold text-purple-600">{plan.price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={plan.current ? "outline" : "default"}
                    className="w-full"
                  >
                    {plan.current ? '현재 플랜' : '업그레이드'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}