'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dashboard_UI/dialog';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Input } from '@/components/dashboard_UI/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/dashboard_UI/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/dashboard_UI/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CreditCardIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  SearchIcon,
  DownloadIcon,
  FilterIcon,
} from 'lucide-react';

interface Payment {
  id: string;
  sessionId: string;
  classTitle: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  transactionId?: string;
  refundReason?: string;
}

interface PaymentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock Data
const mockPayments: Payment[] = [
  {
    id: '1',
    sessionId: 'session1',
    classTitle: '모닝 요가 클래스',
    userName: '김민수',
    userEmail: 'minsu@example.com',
    amount: 30000,
    status: 'completed',
    paymentMethod: '신용카드',
    createdAt: '2024-12-15T10:00:00Z',
    transactionId: 'TXN-2024-001',
  },
  {
    id: '2',
    sessionId: 'session2',
    classTitle: '코어 강화 필라테스',
    userName: '이수진',
    userEmail: 'sujin@example.com',
    amount: 45000,
    status: 'completed',
    paymentMethod: '계좌이체',
    createdAt: '2024-12-16T14:30:00Z',
    transactionId: 'TXN-2024-002',
  },
  {
    id: '3',
    sessionId: 'session3',
    classTitle: 'K-POP 댄스',
    userName: '박지영',
    userEmail: 'jiyoung@example.com',
    amount: 35000,
    status: 'refunded',
    paymentMethod: '신용카드',
    createdAt: '2024-12-17T18:00:00Z',
    transactionId: 'TXN-2024-003',
    refundReason: '개인 사정',
  },
  {
    id: '4',
    sessionId: 'session1',
    classTitle: '모닝 요가 클래스',
    userName: '최현우',
    userEmail: 'hyunwoo@example.com',
    amount: 30000,
    status: 'pending',
    paymentMethod: '신용카드',
    createdAt: '2024-12-18T09:00:00Z',
  },
];

// 차트 데이터
const monthlyRevenueData = [
  { month: '10월', revenue: 1200000, count: 32 },
  { month: '11월', revenue: 1450000, count: 38 },
  { month: '12월', revenue: 1680000, count: 42 },
];

const paymentMethodData = [
  { name: '신용카드', value: 65, amount: 2340000 },
  { name: '계좌이체', value: 25, amount: 900000 },
  { name: '현장결제', value: 10, amount: 360000 },
];

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b'];

export default function PaymentHistoryDialog({
  open,
  onOpenChange,
}: PaymentHistoryDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // 필터링된 결제 내역
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.classTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return format(paymentDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return paymentDate >= weekAgo;
        case 'month':
          return paymentDate >= startOfMonth(now) && paymentDate <= endOfMonth(now);
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // 통계 계산
  const stats = {
    totalRevenue: filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalRefunded: filteredPayments
      .filter(p => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: filteredPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    transactionCount: filteredPayments.length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">완료</Badge>;
      case 'pending':
        return <Badge variant="secondary">대기중</Badge>;
      case 'failed':
        return <Badge variant="destructive">실패</Badge>;
      case 'refunded':
        return <Badge variant="outline">환불</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleExport = () => {
    // CSV 내보내기 로직
    const csv = [
      ['날짜', '클래스명', '참가자', '금액', '결제방법', '상태', '거래번호'],
      ...filteredPayments.map(p => [
        format(new Date(p.createdAt), 'yyyy-MM-dd HH:mm'),
        p.classTitle,
        p.userName,
        p.amount,
        p.paymentMethod,
        p.status,
        p.transactionId || '-',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>결제 내역 관리</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="list" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">결제 목록</TabsTrigger>
            <TabsTrigger value="analytics">통계 분석</TabsTrigger>
            <TabsTrigger value="refunds">환불 관리</TabsTrigger>
          </TabsList>

          <div className="mt-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="list" className="space-y-4">
              {/* 필터 및 검색 */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="클래스명, 참가자, 이메일, 거래번호 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="failed">실패</SelectItem>
                    <SelectItem value="refunded">환불</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="기간 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 기간</SelectItem>
                    <SelectItem value="today">오늘</SelectItem>
                    <SelectItem value="week">최근 7일</SelectItem>
                    <SelectItem value="month">이번 달</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  내보내기
                </Button>
              </div>

              {/* 요약 카드 */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      총 수익
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        ₩{stats.totalRevenue.toLocaleString()}
                      </span>
                      <TrendingUpIcon className="h-5 w-5 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      환불 금액
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        ₩{stats.totalRefunded.toLocaleString()}
                      </span>
                      <TrendingDownIcon className="h-5 w-5 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      대기 금액
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        ₩{stats.pendingAmount.toLocaleString()}
                      </span>
                      <CreditCardIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      거래 건수
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {stats.transactionCount}건
                      </span>
                      <ReceiptRefundIcon className="h-5 w-5 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 결제 목록 테이블 */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>날짜/시간</TableHead>
                      <TableHead>클래스</TableHead>
                      <TableHead>참가자</TableHead>
                      <TableHead>금액</TableHead>
                      <TableHead>결제방법</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>거래번호</TableHead>
                      <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(new Date(payment.createdAt), 'MM/dd HH:mm')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.classTitle}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.userName}</p>
                            <p className="text-xs text-gray-500">{payment.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>₩{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {payment.transactionId || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            상세
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* 월별 수익 차트 */}
              <Card>
                <CardHeader>
                  <CardTitle>월별 수익 추이</CardTitle>
                  <CardDescription>최근 3개월간 수익 및 거래 건수</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: string) => {
                          if (name === 'revenue') return `₩${value.toLocaleString()}`;
                          return `${value}건`;
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="수익"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="거래 건수"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 결제 방법 분석 */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>결제 방법별 비율</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>결제 방법별 금액</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={paymentMethodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => `₩${value.toLocaleString()}`} />
                        <Bar dataKey="amount" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="refunds" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>환불 요청 관리</CardTitle>
                  <CardDescription>환불 요청 및 처리 현황</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPayments
                      .filter(p => p.status === 'refunded' || p.status === 'pending')
                      .map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{payment.classTitle}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                참가자: {payment.userName} ({payment.userEmail})
                              </p>
                              <p className="text-sm text-gray-500">
                                결제일: {format(new Date(payment.createdAt), 'yyyy-MM-dd HH:mm')}
                              </p>
                              {payment.refundReason && (
                                <p className="text-sm mt-2">
                                  환불 사유: {payment.refundReason}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-lg">
                                ₩{payment.amount.toLocaleString()}
                              </p>
                              {getStatusBadge(payment.status)}
                              {payment.status === 'pending' && (
                                <div className="mt-2 space-x-2">
                                  <Button size="sm" variant="destructive">
                                    환불 승인
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    거절
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* 결제 상세 다이얼로그 */}
        {selectedPayment && (
          <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>결제 상세 정보</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">거래 번호</p>
                  <p className="font-medium">{selectedPayment.transactionId || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">클래스</p>
                  <p className="font-medium">{selectedPayment.classTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">참가자</p>
                  <p className="font-medium">
                    {selectedPayment.userName} ({selectedPayment.userEmail})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">결제 금액</p>
                  <p className="font-medium text-lg">
                    ₩{selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">결제 방법</p>
                  <p className="font-medium">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">결제 일시</p>
                  <p className="font-medium">
                    {format(new Date(selectedPayment.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                {selectedPayment.refundReason && (
                  <div>
                    <p className="text-sm text-gray-500">환불 사유</p>
                    <p className="font-medium">{selectedPayment.refundReason}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}