'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Avatar, AvatarFallback } from '@/components/dashboard_UI/avatar';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { CheckIcon, XIcon, AlertCircleIcon } from 'lucide-react';
import { format } from 'date-fns';

interface BookingListProps {
  sessionId: string;
}

export default function BookingList({ sessionId }: BookingListProps) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['session-bookings', sessionId],
    queryFn: async () => {
      return apiClient.get(`/calendar/sessions/${sessionId}/bookings/`);
    },
  });

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (status === 'confirmed' && paymentStatus === 'paid') {
      return <Badge variant="default">확정</Badge>;
    } else if (status === 'pending') {
      return <Badge variant="secondary">대기중</Badge>;
    } else if (status === 'cancelled') {
      return <Badge variant="destructive">취소</Badge>;
    } else if (status === 'no_show') {
      return <Badge variant="destructive">노쇼</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">예약 목록</h3>
        <Button size="sm" variant="outline">
          <AlertCircleIcon className="w-4 h-4 mr-1" />
          예약 마감
        </Button>
      </div>

      <div className="space-y-2">
        {bookings?.map((booking: any) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {booking.user.fullName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{booking.user.fullName}</p>
                <p className="text-sm text-gray-500">{booking.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">인원</p>
                <p className="font-medium">{booking.participant_count}명</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">결제금액</p>
                <p className="font-medium">₩{booking.total_price.toLocaleString()}</p>
              </div>
              {getStatusBadge(booking.status, booking.payment_status)}
              <div className="flex gap-1">
                <Button size="icon" variant="ghost">
                  <CheckIcon className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!bookings || bookings.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          아직 예약이 없습니다.
        </div>
      )}
    </div>
  );
}