// features/dashboard/components/views/home/UpcomingEvents.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Video } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface Event {
  id: string;
  title: string;
  type: 'meeting' | 'workshop' | 'webinar';
  startTime: string;
  duration: number; // minutes
  location?: string;
  isOnline: boolean;
  attendees: number;
  color: string;
}

export default function UpcomingEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      // TODO: API 호출
      return [
        {
          id: '1',
          title: 'K-Tea 프로젝트 킥오프',
          type: 'meeting',
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          duration: 60,
          isOnline: true,
          attendees: 8,
          color: 'bg-blue-500',
        },
        {
          id: '2',
          title: '마케팅 전략 워크샵',
          type: 'workshop',
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          duration: 120,
          location: '회의실 A',
          isOnline: false,
          attendees: 12,
          color: 'bg-purple-500',
        },
        {
          id: '3',
          title: 'AI 활용 세미나',
          type: 'webinar',
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
          duration: 90,
          isOnline: true,
          attendees: 25,
          color: 'bg-green-500',
        },
      ] as Event[];
    },
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins > 0 ? `${mins}분` : ''}`;
    }
    return `${mins}분`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>예정된 일정</CardTitle>
        <Button size="sm" variant="ghost" asChild>
          <Link href="/dashboard/calendar">
            전체보기
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              예정된 일정이 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events?.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/calendar/event/${event.id}`}
                className="block p-3 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "w-1 rounded-full flex-shrink-0",
                    event.color
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.startTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        {event.isOnline ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        {event.isOnline ? '온라인' : event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees}명
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}