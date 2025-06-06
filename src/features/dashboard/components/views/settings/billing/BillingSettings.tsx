'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { CreditCard, Download, Calendar } from 'lucide-react';

const billingHistory = [
  {
    id: '1',
    date: '2024-01-15',
    amount: '₩29,000',
    status: 'paid',
    invoice: 'INV-2024-001',
  },
  {
    id: '2',
    date: '2023-12-15',
    amount: '₩29,000',
    status: 'paid',
    invoice: 'INV-2023-012',
  },
  {
    id: '3',
    date: '2023-11-15',
    amount: '₩29,000',
    status: 'paid',
    invoice: 'INV-2023-011',
  },
];

export default function BillingSettings() {
  return (
    <div className="space-y-6">
      {/* 결제 방법 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            결제 방법
          </CardTitle>
          <CardDescription>
            결제에 사용할 카드를 관리하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium">**** **** **** 4242</p>
                <p className="text-sm text-gray-500">만료: 12/25</p>
              </div>
              <Badge variant="secondary">기본</Badge>
            </div>
            <Button variant="outline" size="sm">
              수정
            </Button>
          </div>
          
          <Button variant="outline" className="w-full">
            새 결제 방법 추가
          </Button>
        </CardContent>
      </Card>

      {/* 다음 결제 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            다음 결제
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <p className="font-medium">Pro 플랜</p>
              <p className="text-sm text-gray-500">2024년 2월 15일 결제 예정</p>
            </div>
            <p className="text-lg font-semibold">₩29,000</p>
          </div>
        </CardContent>
      </Card>

      {/* 결제 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>결제 내역</CardTitle>
          <CardDescription>
            최근 결제 내역을 확인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{payment.invoice}</p>
                  <p className="text-sm text-gray-500">{payment.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{payment.amount}</p>
                  <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                    {payment.status === 'paid' ? '결제완료' : '대기중'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
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