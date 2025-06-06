// features/dashboard/components/views/home/UpcomingEvents.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Calendar, Clock, MapPin, Users, Video } from 'lucide-react';
// import { formatDate } from '@/lib/utils'; // 제거
// import { useQuery } from '@tanstack/react-query'; // 주석 처리
// import { apiClient } from '@/lib/api/client'; // 주석 처리

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

// 로컬 formatDate 함수 정의
const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date))
};

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 데이터로 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'E-커머스 플랫폼 프로젝트 킥오프',
          type: 'meeting',
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2시간 후
          duration: 60,
          isOnline: true,
          attendees: 8,
          color: 'bg-blue-500',
        },
        {
          id: '2',
          title: '마케팅 전략 워크샵',
          type: 'workshop',
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 내일
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
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 이틀 후
          duration: 90,
          isOnline: true,
          attendees: 25,
          color: 'bg-green-500',
        },
        {
          id: '4',
          title: '팀 빌딩 미팅',
          type: 'meeting',
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(), // 3일 후
          duration: 45,
          location: '회의실 B',
          isOnline: false,
          attendees: 6,
          color: 'bg-orange-500',
        },
        {
          id: '5',
          title: '데이터 분석 리뷰',
          type: 'meeting',
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(), // 4일 후
          duration: 75,
          isOnline: true,
          attendees: 10,
          color: 'bg-red-500',
        },
      ];
      
      setEvents(mockEvents.slice(0, 4)); // 최근 4개만 표시
      setIsLoading(false);
    }, 500); // 0.5초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

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
                  <div className={`w-1 rounded-full flex-shrink-0 ${event.color}`} />
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
                      <span className="text-gray-500">
                        ({formatDuration(event.duration)})
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