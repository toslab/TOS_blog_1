//features/dashboard/components/views/calendar/CalendarView.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
         eachDayOfInterval, isSameMonth, isToday, isSameDay,
         addMonths, subMonths, startOfDay, endOfDay, getHours,
         addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  EllipsisHorizontalIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Button } from '@/components/dashboard_UI/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { Badge } from '@/components/dashboard_UI/badge';
import CreateClassDialog from './CreateClassDialog';
import ClassDetailDialog from './ClassDetailDialog';

// Types
interface Venue {
  id: string;
  name: string;
  address: string;
}

interface Instructor {
  id: string;
  username: string;
  fullName: string;
  profileImage?: string;
}

interface MeetupClass {
  id: string;
  title: string;
  description: string;
  description_html?: string;
  featured_image?: string;
  detail_images?: string[];
  price: number;
  max_participants: number;
  min_participants: number;
  instructor: Instructor;
  category?: {
    id: string;
    name: string;
  };
  tags?: string[];
  rating_average?: number;
  rating_count: number;
}

interface ClassSession {
  id: string;
  meetup_class: MeetupClass;
  venue: Venue;
  start_datetime: string;
  end_datetime: string;
  current_participants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
}

interface Payment {
  id: string;
  sessionId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  paymentMethod: string;
}

// Mock Data
const mockSessions: ClassSession[] = [
  {
    id: '1',
    meetup_class: {
      id: 'class1',
      title: '모닝 요가 클래스',
      description: '하루를 시작하는 편안한 요가 수업',
      price: 30000,
      max_participants: 15,
      min_participants: 3,
      instructor: {
        id: 'instructor1',
        username: 'yogakim',
        fullName: '김요가',
        profileImage: '/avatars/instructor1.jpg'
      },
      category: {
        id: 'yoga',
        name: '요가'
      },
      tags: ['초보자환영', '모닝클래스', '명상'],
      rating_average: 4.8,
      rating_count: 42
    },
    venue: {
      id: 'venue1',
      name: '강남 스튜디오',
      address: '서울시 강남구 테헤란로 123'
    },
    start_datetime: new Date(2024, 11, 20, 9, 0).toISOString(),
    end_datetime: new Date(2024, 11, 20, 10, 30).toISOString(),
    current_participants: 12,
    status: 'scheduled'
  },
  {
    id: '2', 
    meetup_class: {
      id: 'class2',
      title: '코어 강화 필라테스',
      description: '체형 교정과 코어 강화를 위한 필라테스',
      price: 45000,
      max_participants: 10,
      min_participants: 2,
      instructor: {
        id: 'instructor2',
        username: 'pilateslee',
        fullName: '이필라',
        profileImage: '/avatars/instructor2.jpg'
      },
      category: {
        id: 'pilates',
        name: '필라테스'
      },
      tags: ['중급', '코어운동', '체형교정'],
      rating_average: 4.9,
      rating_count: 38
    },
    venue: {
      id: 'venue2',
      name: '서초 스튜디오',
      address: '서울시 서초구 서초대로 456'
    },
    start_datetime: new Date(2024, 11, 20, 14, 0).toISOString(),
    end_datetime: new Date(2024, 11, 20, 15, 0).toISOString(),
    current_participants: 8,
    status: 'scheduled'
  }
];

const mockPayments: Payment[] = [
  {
    id: 'payment1',
    sessionId: '1',
    userId: 'user1',
    amount: 30000,
    status: 'completed',
    createdAt: '2024-12-15T10:00:00Z',
    paymentMethod: '신용카드'
  },
  {
    id: 'payment2',
    sessionId: '2',
    userId: 'user2',
    amount: 45000,
    status: 'completed',
    createdAt: '2024-12-16T14:30:00Z',
    paymentMethod: '계좌이체'
  }
];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [sessions, setSessions] = useState<ClassSession[]>(mockSessions);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [showTwoMonths, setShowTwoMonths] = useState(false);
  
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  // 현재 시간으로 스크롤
  useEffect(() => {
    if (container.current) {
      const currentHour = new Date().getHours();
      const hourHeight = container.current.scrollHeight / 24;
      container.current.scrollTop = currentHour * hourHeight - 100;
    }
  }, [selectedDate]);

  // 날짜별 세션 필터링
  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.start_datetime);
      return isSameDay(sessionDate, date) && 
        (selectedInstructor === 'all' || session.meetup_class.instructor.id === selectedInstructor);
    });
  };

  // 강사 목록 가져오기
  const instructors = Array.from(new Set(sessions.map(s => s.meetup_class.instructor.id)))
    .map(id => sessions.find(s => s.meetup_class.instructor.id === id)?.meetup_class.instructor)
    .filter(Boolean) as Instructor[];

  // 월간 캘린더 렌더링
  const renderMonthCalendar = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            {format(monthDate, 'yyyy년 M월', { locale: ko })}
          </h3>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
              <div key={day} className="py-1.5">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg isolate">
            {days.map((day) => {
              const sessionCount = getSessionsForDate(day).length;
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = isSameDay(day, selectedDate);
              
              return (
                <button
                  key={day.toString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'py-2 hover:bg-gray-100 focus:z-10 relative',
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                    isSelected && 'font-semibold',
                    isToday(day) && !isSelected && 'text-purple-600',
                    !isSelected && !isCurrentMonth && 'text-gray-400'
                  )}
                >
                  <time
                    dateTime={format(day, 'yyyy-MM-dd')}
                    className={cn(
                      'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                      isSelected && isToday(day) && 'bg-purple-600 text-white',
                      isSelected && !isToday(day) && 'bg-gray-900 text-white'
                    )}
                  >
                    {format(day, 'd')}
                  </time>
                  {sessionCount > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {Array.from({ length: Math.min(sessionCount, 3) }).map((_, i) => (
                        <div key={i} className="h-1 w-1 rounded-full bg-purple-400" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 일일 스케줄 렌더링
  const renderDaySchedule = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const daySessions = getSessionsForDate(selectedDate);

    return (
      <div className="flex h-full flex-col bg-white rounded-lg shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {format(selectedDate, 'M월 d일 EEEE', { locale: ko })}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {daySessions.length}개의 클래스
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            클래스 추가
          </Button>
        </div>

        <div ref={container} className="flex-1 overflow-auto">
          <div className="relative">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white" />
            <div className="grid flex-auto grid-cols-1">
              <div
                className="col-start-1 col-end-2 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7" />
                {hours.map((hour) => (
                  <React.Fragment key={hour}>
                    <div>
                      <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {hour === 0 ? '12AM' : hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`}
                      </div>
                    </div>
                    <div />
                  </React.Fragment>
                ))}
              </div>

              {/* 세션 렌더링 */}
              <div className="col-start-1 col-end-2">
                {daySessions.map((session) => {
                  const startHour = getHours(new Date(session.start_datetime));
                  const startMinute = new Date(session.start_datetime).getMinutes();
                  const endHour = getHours(new Date(session.end_datetime));
                  const endMinute = new Date(session.end_datetime).getMinutes();
                  
                  const startRow = (startHour * 2) + (startMinute >= 30 ? 1 : 0) + 2;
                  const endRow = (endHour * 2) + (endMinute > 30 ? 2 : endMinute > 0 ? 1 : 0) + 2;

                  return (
                    <div
                      key={session.id}
                      className="relative mt-px ml-14 mr-6 cursor-pointer"
                      style={{
                        gridRow: `${startRow} / ${endRow}`,
                        marginTop: `${((startRow - 2) * 3.5)}rem`
                      }}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className={cn(
                        "group absolute inset-0 flex flex-col overflow-hidden rounded-lg p-3 text-xs",
                        session.meetup_class.category?.id === 'yoga' && "bg-blue-50 hover:bg-blue-100",
                        session.meetup_class.category?.id === 'pilates' && "bg-pink-50 hover:bg-pink-100",
                        session.meetup_class.category?.id === 'dance' && "bg-purple-50 hover:bg-purple-100",
                        !session.meetup_class.category && "bg-gray-50 hover:bg-gray-100"
                      )}>
                        <p className="font-semibold text-gray-900">
                          {session.meetup_class.title}
                        </p>
                        <p className="text-gray-600 mt-1">
                          <time dateTime={session.start_datetime}>
                            {format(new Date(session.start_datetime), 'HH:mm')}
                          </time>
                          {' - '}
                          <time dateTime={session.end_datetime}>
                            {format(new Date(session.end_datetime), 'HH:mm')}
                          </time>
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-gray-500">
                          <div className="flex items-center gap-1">
                            <UserGroupIcon className="h-4 w-4" />
                            <span>{session.current_participants}/{session.meetup_class.max_participants}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{session.venue.name}</span>
                          </div>
                        </div>
                        {session.meetup_class.instructor && (
                          <p className="mt-2 text-gray-600">
                            강사: {session.meetup_class.instructor.fullName}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 결제 내역 탭
  const renderPaymentHistory = () => {
    const dayPayments = mockPayments.filter(payment => {
      const session = sessions.find(s => s.id === payment.sessionId);
      return session && isSameDay(new Date(session.start_datetime), selectedDate);
    });

    return (
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">결제 내역</h3>
        <div className="space-y-4">
          {dayPayments.map((payment) => {
            const session = sessions.find(s => s.id === payment.sessionId);
            return (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{session?.meetup_class.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(payment.createdAt), 'yyyy-MM-dd HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₩{payment.amount.toLocaleString()}</p>
                    <Badge
                      variant={payment.status === 'completed' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {payment.status === 'completed' && '완료'}
                      {payment.status === 'pending' && '대기중'}
                      {payment.status === 'failed' && '실패'}
                      {payment.status === 'refunded' && '환불'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  결제 방법: {payment.paymentMethod}
                </div>
              </div>
            );
          })}
          {dayPayments.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              선택한 날짜의 결제 내역이 없습니다.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* 왼쪽 사이드바 - 월간 캘린더 */}
      <div className="w-80 flex-none border-r border-gray-200 bg-white px-4 py-6 overflow-auto">
        <div className="space-y-6">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">캘린더</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 강사 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              강사별 필터
            </label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="all">전체 강사</option>
              {instructors.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* 월간 캘린더 */}
          <div className="space-y-4">
            {renderMonthCalendar(currentDate)}
            {showTwoMonths && renderMonthCalendar(addMonths(currentDate, 1))}
          </div>

          {/* 2개월 보기 토글 */}
          <button
            onClick={() => setShowTwoMonths(!showTwoMonths)}
            className="w-full text-sm text-purple-600 hover:text-purple-700"
          >
            {showTwoMonths ? '1개월 보기' : '2개월 보기'}
          </button>

          {/* 선택된 날짜 요약 */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              {format(selectedDate, 'M월 d일', { locale: ko })} 요약
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">총 클래스</span>
                <span className="font-medium">{getSessionsForDate(selectedDate).length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">예약 가능</span>
                <span className="font-medium">
                  {getSessionsForDate(selectedDate).filter(s => 
                    s.current_participants < s.meetup_class.max_participants
                  ).length}개
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">총 수익</span>
                <span className="font-medium">
                  ₩{getSessionsForDate(selectedDate).reduce((sum, session) => 
                    sum + (session.current_participants * session.meetup_class.price), 0
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-md"
            >
              오늘
            </button>
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="schedule" className="h-full">
            <TabsList className="mb-4">
              <TabsTrigger value="schedule">일정</TabsTrigger>
              <TabsTrigger value="payments">결제 내역</TabsTrigger>
              <TabsTrigger value="reviews">리뷰</TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule" className="h-full">
              {renderDaySchedule()}
            </TabsContent>
            
            <TabsContent value="payments">
              {renderPaymentHistory()}
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">리뷰 관리</h3>
                <p className="text-gray-500">선택한 날짜의 클래스 리뷰를 확인하세요.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 다이얼로그 */}
      <CreateClassDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          // 새로고침 로직
          setShowCreateDialog(false);
        }}
        defaultDate={selectedDate}
      />
      
      {selectedSession && (
        <ClassDetailDialog
          session={selectedSession}
          open={!!selectedSession}
          onOpenChange={(open) => !open && setSelectedSession(null)}
          onUpdate={() => {
            // 업데이트 로직
          }}
        />
      )}
    </div>
  );
}