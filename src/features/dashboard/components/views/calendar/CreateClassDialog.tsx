'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import { CalendarIcon, ImageIcon, FileTextIcon, TagIcon, CreditCardIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
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
  { id: 'yoga', name: '요가' },
  { id: 'pilates', name: '필라테스' },
  { id: 'dance', name: '댄스' },
  { id: 'fitness', name: '피트니스' },
  { id: 'meditation', name: '명상' },
  { id: 'martial-arts', name: '무술' },
];

const mockVenues = [
  { id: 'venue1', name: '스튜디오 A', address: '서울시 강남구 테헤란로 123' },
  { id: 'venue2', name: '스튜디오 B', address: '서울시 서초구 서초대로 456' },
  { id: 'venue3', name: '스튜디오 C', address: '서울시 마포구 홍익로 789' },
  { id: 'venue4', name: '루프탑 스튜디오', address: '서울시 성동구 성수일로 101' },
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
    },
  });

  // 로컬 데이터 (useQuery 제거)
  const categories = mockCategories;
  const venues = mockVenues;

  // 클래스 생성 함수 (로컬 버전)
  const handleSubmit = async (data: ClassFormData) => {
    setIsSubmitting(true);
    
    try {
      // 실제로는 API 호출이지만, 로컬에서는 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating class with data:', { ...data, tags });
      
      // 성공 처리
      form.reset();
      setTags([]);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating class:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: ClassFormData) => {
    handleSubmit({ ...data, tags });
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
              <h3 className="text-lg font-medium">기본 정보</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>클래스명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 초보자를 위한 요가 클래스" {...field} />
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
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
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
                <h3 className="text-lg font-medium">상세 설명</h3>
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
                  <Label>수업 설명</Label>
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
              <h3 className="text-lg font-medium">일정 정보</h3>
              
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
                        {venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{venue.name}</span>
                              <span className="text-xs text-gray-500">{venue.address}</span>
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
                    <FormLabel>날짜 *</FormLabel>
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
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 태그 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">태그</h3>
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
                  placeholder="태그 입력 후 Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            {/* 결제 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">결제 설정</h3>
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
                        <SelectItem value="onsite">현장결제</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      선택한 결제 방법으로 자동 연결됩니다
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
                {isSubmitting ? '등록 중...' : '클래스 등록'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}