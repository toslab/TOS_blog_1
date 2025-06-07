//features/dashboard/components/views/calendar/CreateClassDialog.tsx

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addWeeks, addMonths, addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/dashboard_UI/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/dashboard_UI/form';
import { Input } from '@/components/dashboard_UI/input';
import { Textarea } from '@/components/dashboard_UI/textarea';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Switch } from '@/components/dashboard_UI/switch';
import { Checkbox } from '@/components/dashboard_UI/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { Calendar } from '@/components/dashboard_UI/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dashboard_UI/popover';
import { 
  CalendarIcon, 
  ImageIcon, 
  FileTextIcon, 
  TagIcon, 
  CreditCardIcon,
  RepeatIcon,
  ClockIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/features/dashboard/components/views/documents/editor/RichTextEditor';
import ImageUpload from '@/components/dashboard_UI/ImageUpload';
import { Label } from '@/components/dashboard_UI/label';

const classSchema = z.object({
  title: z.string().min(1, '클래스명을 입력해주세요'),
  description: z.string().min(10, '최소 10자 이상 입력해주세요'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  price: z.number().min(0, '가격은 0원 이상이어야 합니다'),
  max_participants: z.number().min(1, '최소 1명 이상이어야 합니다'),
  min_participants: z.number().min(1, '최소 1명 이상이어야 합니다'),
  venue: z.string().min(1, '장소를 선택해주세요'),
  session_date: z.date(),
  start_time: z.string(),
  end_time: z.string(),
  tags: z.array(z.string()).optional(),
  featured_image: z.string().optional(),
  detail_images: z.array(z.string()).optional(),
  payment_method: z.string().optional(),
  // 반복 설정
  is_recurring: z.boolean().default(false),
  recurrence_type: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurrence_days: z.array(z.number()).optional(), // 요일 (0-6)
  recurrence_end: z.date().optional(),
  recurrence_count: z.number().optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultDate?: Date;
}

// 로컬 목업 데이터
const mockCategories = [
  { id: 'yoga', name: '요가', color: 'blue' },
  { id: 'pilates', name: '필라테스', color: 'pink' },
  { id: 'dance', name: '댄스', color: 'purple' },
  { id: 'fitness', name: '피트니스', color: 'green' },
  { id: 'meditation', name: '명상', color: 'indigo' },
  { id: 'martial-arts', name: '무술', color: 'red' },
];

const mockVenues = [
  { id: 'venue1', name: '강남 스튜디오', address: '서울시 강남구 테헤란로 123', capacity: 20 },
  { id: 'venue2', name: '서초 스튜디오', address: '서울시 서초구 서초대로 456', capacity: 15 },
  { id: 'venue3', name: '홍대 스튜디오', address: '서울시 마포구 홍익로 789', capacity: 25 },
  { id: 'venue4', name: '성수 루프탑', address: '서울시 성동구 성수일로 101', capacity: 30 },
];

const weekDays = [
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
  { value: 0, label: '일' },
];

export default function CreateClassDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultDate,
}: CreateClassDialogProps) {
  const [descriptionType, setDescriptionType] = useState<'markdown' | 'image'>('markdown');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [previewSessions, setPreviewSessions] = useState<Date[]>([]);

  const form = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      max_participants: 10,
      min_participants: 1,
      session_date: defaultDate || new Date(),
      start_time: '10:00',
      end_time: '11:00',
      tags: [],
      detail_images: [],
      is_recurring: false,
      recurrence_type: 'weekly',
      recurrence_days: [],
      recurrence_count: 4,
    },
  });

  const isRecurring = form.watch('is_recurring');
  const recurrenceType = form.watch('recurrence_type');
  const sessionDate = form.watch('session_date');
  const recurrenceCount = form.watch('recurrence_count');

  // 반복 일정 미리보기 생성
  React.useEffect(() => {
    if (!isRecurring || !sessionDate) {
      setPreviewSessions([sessionDate]);
      return;
    }

    const sessions: Date[] = [sessionDate];
    const count = recurrenceCount || 4;

    if (recurrenceType === 'daily') {
      for (let i = 1; i < count; i++) {
        sessions.push(addDays(sessionDate, i));
      }
    } else if (recurrenceType === 'weekly' && selectedDays.length > 0) {
      let currentDate = sessionDate;
      let sessionCount = 1;
      
      while (sessionCount < count) {
        currentDate = addDays(currentDate, 1);
        if (selectedDays.includes(currentDate.getDay())) {
          sessions.push(currentDate);
          sessionCount++;
        }
      }
    } else if (recurrenceType === 'monthly') {
      for (let i = 1; i < count; i++) {
        sessions.push(addMonths(sessionDate, i));
      }
    }

    setPreviewSessions(sessions);
  }, [isRecurring, recurrenceType, sessionDate, selectedDays, recurrenceCount]);

  // 클래스 생성 함수
  const handleSubmit = async (data: ClassFormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const classData = {
        ...data,
        tags,
        recurrence_days: selectedDays,
        sessions: previewSessions,
      };
      
      console.log('Creating class with data:', classData);
      
      form.reset();
      setTags([]);
      setSelectedDays([]);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating class:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: ClassFormData) => {
    handleSubmit(data);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const selectedVenue = mockVenues.find(v => v.id === form.watch('venue'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 클래스 등록</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">1</span>
                기본 정보
              </h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>클래스명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 초보자를 위한 모닝 요가" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-3 h-3 rounded-full",
                                  category.color === 'blue' && "bg-blue-500",
                                  category.color === 'pink' && "bg-pink-500",
                                  category.color === 'purple' && "bg-purple-500",
                                  category.color === 'green' && "bg-green-500",
                                  category.color === 'indigo' && "bg-indigo-500",
                                  category.color === 'red' && "bg-red-500"
                                )} />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>가격 (원) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">2</span>
                  상세 설명
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={descriptionType === 'markdown' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDescriptionType('markdown')}
                  >
                    <FileTextIcon className="w-4 h-4 mr-1" />
                    텍스트
                  </Button>
                  <Button
                    type="button"
                    variant={descriptionType === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDescriptionType('image')}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    이미지
                  </Button>
                </div>
              </div>

              {descriptionType === 'markdown' ? (
                <div className="space-y-2">
                  <Label>수업 설명 *</Label>
                  <div className="border rounded-lg h-64">
                    <RichTextEditor
                      content={form.watch('description')}
                      onChange={(value) => form.setValue('description', value)}
                      placeholder="수업에 대한 상세한 설명을 입력하세요..."
                    />
                  </div>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="detail_images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value || []}
                          onChange={field.onChange}
                          multiple
                          maxFiles={5}
                        />
                      </FormControl>
                      <FormDescription>
                        최대 5개까지 업로드 가능합니다
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* 일정 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">3</span>
                일정 정보
              </h3>
              
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>장소 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="장소 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockVenues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{venue.name}</span>
                              <span className="text-xs text-gray-500">
                                {venue.address} (최대 {venue.capacity}명)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="session_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시작 날짜 *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ko })
                            ) : (
                              <span>날짜 선택</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시작 시간 *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>종료 시간 *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최소 인원 *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max={selectedVenue?.capacity}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>최대 인원 *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max={selectedVenue?.capacity}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      {selectedVenue && (
                        <FormDescription>
                          선택한 장소의 최대 수용 인원: {selectedVenue.capacity}명
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 반복 설정 */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <RepeatIcon className="w-5 h-5" />
                  반복 설정
                </h3>
                <FormField
                  control={form.control}
                  name="is_recurring"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {isRecurring && (
                <div className="space-y-4 pl-4">
                  <FormField
                    control={form.control}
                    name="recurrence_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반복 유형</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">매일</SelectItem>
                            <SelectItem value="weekly">매주</SelectItem>
                            <SelectItem value="monthly">매월</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {recurrenceType === 'weekly' && (
                    <div>
                      <Label className="mb-2 block">반복 요일</Label>
                      <div className="flex gap-2">
                        {weekDays.map((day) => (
                          <label
                            key={day.value}
                            className="flex items-center gap-1"
                          >
                            <Checkbox
                              checked={selectedDays.includes(day.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedDays([...selectedDays, day.value]);
                                } else {
                                  setSelectedDays(selectedDays.filter(d => d !== day.value));
                                }
                              }}
                            />
                            <span className="text-sm">{day.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="recurrence_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반복 횟수</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="52"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          총 {field.value || 0}회 반복됩니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 반복 일정 미리보기 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">일정 미리보기</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {previewSessions.map((date, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {index + 1}회차: {format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 태그 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <TagIcon className="w-5 h-5" />
                태그
              </h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="태그 입력 후 Enter (예: 초보자환영, 소규모클래스)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            {/* 결제 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                결제 설정
              </h3>
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>결제 방법</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="결제 방법 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="card">신용카드</SelectItem>
                        <SelectItem value="bank">계좌이체</SelectItem>
                        <SelectItem value="both">신용카드 + 계좌이체</SelectItem>
                        <SelectItem value="onsite">현장결제</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      참가자가 사용할 수 있는 결제 방법을 선택하세요
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  <>
                    {isRecurring ? `${previewSessions.length}개 클래스 등록` : '클래스 등록'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}