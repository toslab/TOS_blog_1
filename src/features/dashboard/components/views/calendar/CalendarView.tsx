'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
         eachDayOfInterval, isSameMonth, isToday, isSameDay,
         addMonths, subMonths, addWeeks, subWeeks, addDays, subDays,
         startOfDay, endOfDay, eachHourOfInterval, setHours, getHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, EllipsisHorizontalIcon,
         CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Button } from '@/components/dashboard_UI/button';
import { cn } from '@/lib/utils';
import CreateClassDialog from './CreateClassDialog';
import ClassDetailDialog from './ClassDetailDialog';

// 로컬 타입 정의
interface Venue {
  id: string;
  name: string;
  address: string;
}

interface MeetupClass {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    profile_image?: string;
  };
}

interface ClassSession {
  id: string;
  meetup_class: MeetupClass;
  venue: Venue;
  start_datetime: string;
  end_datetime: string;
  max_participants: number;
  current_participants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

// 로컬 목업 데이터
const mockSessions: ClassSession[] = [
  {
    id: '1',
    meetup_class: {
      id: 'class1',
      title: '요가 클래스',
      description: '초보자를 위한 요가 수업',
      instructor: {
        id: 'instructor1',
        name: '김요가',
        profile_image: '/avatars/instructor1.jpg'
      }
    },
    venue: {
      id: 'venue1',
      name: '스튜디오 A',
      address: '서울시 강남구'
    },
    start_datetime: new Date(2024, 11, 20, 9, 0).toISOString(),
    end_datetime: new Date(2024, 11, 20, 10, 30).toISOString(),
    max_participants: 15,
    current_participants: 12,
    status: 'scheduled'
  },
  {
    id: '2', 
    meetup_class: {
      id: 'class2',
      title: '필라테스',
      description: '코어 강화를 위한 필라테스',
      instructor: {
        id: 'instructor2',
        name: '이필라',
        profile_image: '/avatars/instructor2.jpg'
      }
    },
    venue: {
      id: 'venue2',
      name: '스튜디오 B',
      address: '서울시 서초구'
    },
    start_datetime: new Date(2024, 11, 20, 14, 0).toISOString(),
    end_datetime: new Date(2024, 11, 20, 15, 0).toISOString(),
    max_participants: 10,
    current_participants: 8,
    status: 'scheduled'
  },
  {
    id: '3',
    meetup_class: {
      id: 'class3',
      title: '댄스 클래스',
      description: 'K-pop 댄스 배우기',
      instructor: {
        id: 'instructor3',
        name: '박댄스',
        profile_image: '/avatars/instructor3.jpg'
      }
    },
    venue: {
      id: 'venue1',
      name: '스튜디오 A',
      address: '서울시 강남구'
    },
    start_datetime: new Date(2024, 11, 21, 19, 0).toISOString(),
    end_datetime: new Date(2024, 11, 21, 20, 30).toISOString(),
    max_participants: 20,
    current_participants: 15,
    status: 'scheduled'
  }
];

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>((searchParams.get('view') as ViewMode) || 'month');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  
  // 로컬 상태로 세션 데이터 관리
  const [sessions, setSessions] = useState<ClassSession[]>(mockSessions);
  const [isLoading, setIsLoading] = useState(false);
  
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  // 현재 시간으로 스크롤 (Day View)
  useEffect(() => {
    if (viewMode === 'day' && container.current) {
      const currentHour = new Date().getHours();
      const hourHeight = container.current.scrollHeight / 24;
      container.current.scrollTop = currentHour * hourHeight - 100;
    }
  }, [viewMode]);

  // 세션 데이터 필터링 함수
  const getFilteredSessions = () => {
    let startDate, endDate;
    
    if (viewMode === 'month') {
      startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
      endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    } else if (viewMode === 'week') {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      startDate = startOfDay(currentDate);
      endDate = endOfDay(currentDate);
    }
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.start_datetime);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  const filteredSessions = getFilteredSessions();

  // 새로고침 함수
  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSessions([...mockSessions]);
      setIsLoading(false);
    }, 500);
  };

  // 장소별 세션 그룹핑
  const sessionsByVenue = React.useMemo(() => {
    const grouped = new Map<string, ClassSession[]>();
    filteredSessions.forEach(session => {
      const venueId = session.venue.id;
      if (!grouped.has(venueId)) {
        grouped.set(venueId, []);
      }
      grouped.get(venueId)!.push(session);
    });
    
    return grouped;
  }, [filteredSessions]);

  // 날짜별 세션 수 계산
  const getSessionCountForDate = (date: Date) => {
    return filteredSessions.filter(session => 
      isSameDay(new Date(session.start_datetime), date)
    ).length;
  };

  // 네비게이션 핸들러
  const navigatePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setViewMode('day');
    router.push(`/dashboard/calendar?view=day&date=${format(date, 'yyyy-MM-dd')}`);
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="flex h-full flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700">
          {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
            <div key={day} className="bg-white py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
            {days.map((day) => {
              const sessionCount = getSessionCountForDate(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    'relative bg-white px-3 py-2 cursor-pointer hover:bg-gray-50',
                    !isCurrentMonth && 'bg-gray-50 text-gray-500',
                    isToday(day) && 'font-semibold',
                    isSelected && 'bg-purple-50'
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <time
                    dateTime={format(day, 'yyyy-MM-dd')}
                    className={cn(
                      isToday(day) && 'flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 font-semibold text-white'
                    )}
                  >
                    {format(day, 'd')}
                  </time>
                  
                  {sessionCount > 0 && (
                    <div className="mt-1">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                        <span className="text-xs text-gray-600">{sessionCount}개 클래스</span>
                      </div>
                    </div>
                  )}
                  
                  {/* 해당 날짜의 세션 미리보기 (최대 3개) */}
                  <div className="mt-1 space-y-1">
                    {filteredSessions.filter(s => isSameDay(new Date(s.start_datetime), day))
                      .slice(0, 3)
                      .map((session) => (
                        <div
                          key={session.id}
                          className="truncate text-xs text-gray-700 hover:text-purple-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSession(session);
                          }}
                        >
                          <span className="font-medium">
                            {format(new Date(session.start_datetime), 'HH:mm')}
                          </span>
                          {' '}
                          {session.meetup_class.title}
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayStart = startOfDay(currentDate);
    const daySessions = filteredSessions.filter(session => 
      isSameDay(new Date(session.start_datetime), currentDate)
    );

    // 장소별로 세션 그룹화
    const venues = Array.from(new Set(daySessions.map(s => s.venue.id)));
    const venueColumns = venues.map(venueId => {
      const venue = daySessions.find(s => s.venue.id === venueId)?.venue;
      return {
        id: venueId,
        name: venue?.name || '',
        sessions: daySessions.filter(s => s.venue.id === venueId)
      };
    });

    return (
      <div className="flex h-full flex-col">
        <div
          ref={containerNav}
          className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5"
        >
          <div className="grid grid-cols-1 text-sm">
            <div className="col-start-1 col-end-2 grid grid-cols-[60px_1fr]">
              <div className="bg-white" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-px bg-gray-200">
                {venueColumns.length > 0 ? (
                  venueColumns.map((venue) => (
                    <div key={venue.id} className="bg-white px-3 py-2 text-center">
                      <div className="font-semibold">{venue.name}</div>
                      <div className="text-xs text-gray-500">{venue.sessions.length}개 클래스</div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white px-3 py-2 text-center col-span-full">
                    <div className="text-gray-500">예약된 클래스가 없습니다</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div ref={container} className="flex flex-auto flex-col overflow-auto bg-white">
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1">
              <div
                className="col-start-1 col-end-2 grid"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7" />
                
                {/* 시간 라인 */}
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
              <div className="col-start-1 col-end-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-px bg-gray-200">
                {venueColumns.length > 0 ? (
                  venueColumns.map((venue) => (
                    <div key={venue.id} className="relative bg-white">
                      {venue.sessions.map((session) => {
                        const startHour = getHours(new Date(session.start_datetime));
                        const startMinute = new Date(session.start_datetime).getMinutes();
                        const endHour = getHours(new Date(session.end_datetime));
                        const endMinute = new Date(session.end_datetime).getMinutes();
                        
                        const startRow = (startHour * 2) + (startMinute >= 30 ? 1 : 0) + 2;
                        const endRow = (endHour * 2) + (endMinute > 30 ? 2 : endMinute > 0 ? 1 : 0) + 2;
                        const spanRows = endRow - startRow;

                        return (
                          <div
                            key={session.id}
                            className="absolute inset-x-0 mx-2 cursor-pointer"
                            style={{
                              gridRow: `${startRow} / span ${spanRows}`,
                              top: `${((startRow - 2) / 48) * 100}%`,
                              height: `${(spanRows / 48) * 100}%`
                            }}
                            onClick={() => setSelectedSession(session)}
                          >
                            <div className={cn(
                              "group flex h-full flex-col overflow-hidden rounded-lg p-2 text-xs leading-5",
                              "bg-purple-50 hover:bg-purple-100",
                              session.current_participants >= session.meetup_class.max_participants && "bg-red-50 hover:bg-red-100"
                            )}>
                              <p className="font-semibold text-purple-700">
                                {session.meetup_class.title}
                              </p>
                              <p className="text-purple-600">
                                <time dateTime={session.start_datetime}>
                                  {format(new Date(session.start_datetime), 'HH:mm')}
                                </time>
                                {' - '}
                                <time dateTime={session.end_datetime}>
                                  {format(new Date(session.end_datetime), 'HH:mm')}
                                </time>
                              </p>
                              <p className="mt-auto text-purple-600">
                                {session.current_participants}/{session.meetup_class.max_participants}명
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="flex h-full flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700">
          {days.map((day) => (
            <div key={day.toString()} className="bg-white py-2">
              <div>{format(day, 'E', { locale: ko })}</div>
              <div className={cn(
                "mt-1",
                isToday(day) && "text-purple-600 font-bold"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => {
            const daySessions = filteredSessions.filter(session => 
              isSameDay(new Date(session.start_datetime), day)
            );
            
            return (
              <div key={day.toString()} className="bg-white p-2 overflow-y-auto">
                <div className="space-y-1">
                  {daySessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-2 rounded bg-purple-50 hover:bg-purple-100 cursor-pointer text-xs"
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="font-semibold text-purple-700">
                        {format(new Date(session.start_datetime), 'HH:mm')}
                      </div>
                      <div className="text-purple-600 truncate">
                        {session.meetup_class.title}
                      </div>
                      <div className="text-purple-500">
                        {session.venue.name}
                      </div>
                      <div className="text-purple-500">
                        {session.current_participants}/{session.meetup_class.max_participants}명
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            <time dateTime={format(currentDate, 'yyyy-MM')}>
              {format(currentDate, 'yyyy년 MM월', { locale: ko })}
            </time>
          </h1>
          <p className="mt-1 text-sm text-gray-500">예약 관리</p>
        </div>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={navigatePrevious}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              onClick={navigateToday}
            >
              오늘
            </button>
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={navigateNext}
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {viewMode === 'month' ? '월간' : viewMode === 'week' ? '주간' : '일간'}
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left"
                    onClick={() => setViewMode('day')}
                  >
                    일간 보기
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left"
                    onClick={() => setViewMode('week')}
                  >
                    주간 보기
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 w-full text-left"
                    onClick={() => setViewMode('month')}
                  >
                    월간 보기
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              onClick={() => setShowCreateDialog(true)}
            >
              수업 추가
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  <button className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                    수업 생성
                  </button>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <button className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                    오늘로 이동
                  </button>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <button className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                    일간 보기
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                    주간 보기
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900">
                    월간 보기
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>

      {/* Calendar Content */}
      <div className="flex flex-auto flex-col">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Dialogs */}
      {showCreateDialog && (
        <CreateClassDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={refetch}
        />
      )}
      
      {selectedSession && (
        <ClassDetailDialog
          session={selectedSession}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          onEdit={(session) => {
            // Handle edit
          }}
          onDelete={() => {
            // Handle delete
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
}