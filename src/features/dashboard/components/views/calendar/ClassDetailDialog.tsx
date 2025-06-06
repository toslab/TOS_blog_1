'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dashboard_UI/dialog';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { Progress } from '@/components/dashboard_UI/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  CreditCardIcon,
  StarIcon,
  TagIcon,
  EditIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from 'lucide-react';
import { ClassSession } from '@/features/dashboard/types/calendar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import BookingList from './BookingList';
import ClassAnalytics from './ClassAnalytics';
import EditSessionDialog from './EditSessionDialog';

interface ClassDetailDialogProps {
  session: ClassSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function ClassDetailDialog({
  session,
  open,
  onOpenChange,
  onUpdate,
}: ClassDetailDialogProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditDialog, setShowEditDialog] = useState(false);

  // 예약 목록 조회
  const { data: bookings } = useQuery({
    queryKey: ['session-bookings', session.id],
    queryFn: async () => {
      return apiClient.get(`/calendar/sessions/${session.id}/bookings/`);
    },
    enabled: open && activeTab === 'bookings',
  });

  // 리뷰 목록 조회
  const { data: reviews } = useQuery({
    queryKey: ['class-reviews', session.meetup_class.id],
    queryFn: async () => {
      return apiClient.get(`/calendar/classes/${session.meetup_class.id}/reviews/`);
    },
    enabled: open && activeTab === 'reviews',
  });

  // 세션 취소
  const cancelSession = useMutation({
    mutationFn: async () => {
      return apiClient.patch(`/calendar/sessions/${session.id}/`, {
        status: 'cancelled',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-sessions'] });
      onUpdate();
      onOpenChange(false);
    },
  });

  const occupancyRate = (session.current_participants / session.meetup_class.max_participants) * 100;
  const availableSeats = session.meetup_class.max_participants - session.current_participants;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl">
                  {session.meetup_class.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
                    {session.status === 'scheduled' && '예정'}
                    {session.status === 'ongoing' && '진행중'}
                    {session.status === 'completed' && '완료'}
                    {session.status === 'cancelled' && '취소됨'}
                  </Badge>
                  {session.meetup_class.category && (
                    <Badge variant="outline">
                      {session.meetup_class.category.name}
                    </Badge>
                  )}
                  {occupancyRate >= 90 && (
                    <Badge variant="destructive">마감임박</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditDialog(true)}
                  disabled={session.status !== 'scheduled'}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('정말 이 세션을 취소하시겠습니까?')) {
                      cancelSession.mutate();
                    }
                  }}
                  disabled={session.status !== 'scheduled'}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircleIcon className="w-4 h-4 mr-1" />
                  취소
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="bookings">
                예약 현황 ({session.current_participants})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                리뷰 ({session.meetup_class.rating_count})
              </TabsTrigger>
              <TabsTrigger value="analytics">분석</TabsTrigger>
            </TabsList>

            <div className="mt-6 overflow-y-auto max-h-[calc(90vh-250px)]">
              <TabsContent value="overview" className="space-y-6">
                {/* 일정 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">일정 정보</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">날짜</p>
                          <p className="font-medium">
                            {format(new Date(session.start_datetime), 'yyyy년 M월 d일 EEEE', { locale: ko })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">시간</p>
                          <p className="font-medium">
                            {format(new Date(session.start_datetime), 'HH:mm')} - 
                            {format(new Date(session.end_datetime), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">장소</p>
                          <p className="font-medium">{session.venue.name}</p>
                          <p className="text-sm text-gray-600">{session.venue.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">예약 현황</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">참가자</span>
                          <span className="text-sm font-medium">
                            {session.current_participants} / {session.meetup_class.max_participants}명
                          </span>
                        </div>
                        <Progress value={occupancyRate} className="h-2" />
                      </div>
                      <div className="flex items-center gap-3">
                        <UsersIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">남은 자리</p>
                          <p className="font-medium">
                            {availableSeats > 0 ? `${availableSeats}명` : '마감'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCardIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">가격</p>
                          <p className="font-medium">
                            ₩{session.meetup_class.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 강사 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">강사 정보</h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session.meetup_class.instructor.profileImage} />
                      <AvatarFallback>
                        {session.meetup_class.instructor.fullName?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.meetup_class.instructor.fullName}</p>
                      <p className="text-sm text-gray-500">@{session.meetup_class.instructor.username}</p>
                    </div>
                  </div>
                </div>

                {/* 클래스 설명 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">클래스 소개</h3>
                  {session.meetup_class.featured_image && (
                    <img
                      src={session.meetup_class.featured_image}
                      alt={session.meetup_class.title}
                      className="w-full rounded-lg"
                    />
                  )}
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: session.meetup_class.description_html || session.meetup_class.description 
                    }} />
                  </div>
                  {session.meetup_class.detail_images?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {session.meetup_class.detail_images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${session.meetup_class.title} ${index + 1}`}
                          className="w-full rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 태그 */}
                {session.meetup_class.tags?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">태그</h3>
                    <div className="flex flex-wrap gap-2">
                      {session.meetup_class.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 평점 */}
                {session.meetup_class.rating_average && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">평점</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={cn(
                              "w-5 h-5",
                              star <= Math.round(session.meetup_class.rating_average!)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {session.meetup_class.rating_average.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({session.meetup_class.rating_count}개 리뷰)
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookings">
                <BookingList sessionId={session.id} />
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  {reviews?.map((review: any) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {review.user.fullName?.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{review.user.fullName}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={cn(
                                    "w-4 h-4",
                                    star <= review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.created_at), 'yyyy.MM.dd')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{review.content}</p>
                      {review.images?.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((image: string, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt=""
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                      {review.is_verified && (
                        <Badge variant="secondary" className="mt-2">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          인증된 리뷰
                        </Badge>
                      )}
                    </div>
                  ))}
                  {(!reviews || reviews.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      아직 리뷰가 없습니다.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <ClassAnalytics classId={session.meetup_class.id} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <EditSessionDialog
          session={session}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={() => {
            setShowEditDialog(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}