'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
} from '@/components/dashboard_UI/form';
import { Input } from '@/components/dashboard_UI/input';
import { Button } from '@/components/dashboard_UI/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { Textarea } from '@/components/dashboard_UI/textarea';
import { ClassSession } from '@/features/dashboard/types/calendar';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

const editSessionSchema = z.object({
  venue: z.string().min(1, '장소를 선택해주세요'),
  start_time: z.string(),
  end_time: z.string(),
  max_participants: z.number().min(1),
  notes: z.string().optional(),
});

type EditSessionFormData = z.infer<typeof editSessionSchema>;

interface EditSessionDialogProps {
  session: ClassSession;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditSessionDialog({
  session,
  open,
  onOpenChange,
  onSuccess,
}: EditSessionDialogProps) {
  const form = useForm<EditSessionFormData>({
    resolver: zodResolver(editSessionSchema),
    defaultValues: {
      venue: session.venue.id,
      start_time: format(new Date(session.start_datetime), 'HH:mm'),
      end_time: format(new Date(session.end_datetime), 'HH:mm'),
      max_participants: session.meetup_class.max_participants,
      notes: session.notes || '',
    },
  });

  // 장소 조회
  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      return apiClient.get('/calendar/venues/');
    },
  });

  // 세션 수정
  const updateSession = useMutation({
    mutationFn: async (data: EditSessionFormData) => {
      const sessionDate = format(new Date(session.start_datetime), 'yyyy-MM-dd');
      return apiClient.patch(`/calendar/sessions/${session.id}/`, {
        venue: data.venue,
        start_datetime: `${sessionDate}T${data.start_time}:00`,
        end_datetime: `${sessionDate}T${data.end_time}:00`,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  const onSubmit = (data: EditSessionFormData) => {
    updateSession.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>세션 정보 수정</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>장소</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues?.map((venue: any) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <FormLabel>시작 시간</FormLabel>
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
                    <FormLabel>종료 시간</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메모</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="세션에 대한 메모를 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={updateSession.isPending}>
                {updateSession.isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}