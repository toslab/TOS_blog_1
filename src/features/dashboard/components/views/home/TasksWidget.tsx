// features/dashboard/components/views/home/TasksWidget.tsx

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Task } from '@/features/dashboard/types';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export default function TasksWidget() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: async () => {
      // TODO: API 호출 - 내가 담당한 태스크
      return [
        {
          id: '1',
          title: '제품 기획서 검토',
          project: 'K-Tea 프로젝트',
          priority: 'high',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          isOverdue: false,
          status: 'todo',
        },
        {
          id: '2',
          title: '마케팅 전략 수립',
          project: 'K-Tea 프로젝트',
          priority: 'medium',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
          isOverdue: false,
          status: 'in_progress',
        },
        {
          id: '3',
          title: '재고 현황 보고서',
          project: '월간 보고',
          priority: 'urgent',
          dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          isOverdue: true,
          status: 'todo',
        },
      ] as Partial<Task>[];
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      // TODO: API 호출
      return apiClient.patch(`/tasks/${taskId}/`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return '긴급';
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return priority;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>내 태스크</CardTitle>
        <Button size="sm" variant="ghost">
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              할당된 태스크가 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks?.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                <Checkbox
                  checked={task.status === 'done'}
                  onCheckedChange={(checked) => {
                    updateTaskMutation.mutate({
                      taskId: task.id!,
                      status: checked ? 'done' : 'todo',
                    });
                  }}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium",
                      task.status === 'done' && "line-through text-gray-500"
                    )}>
                      {task.title}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getPriorityColor(task.priority!))}
                    >
                      {getPriorityLabel(task.priority!)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {task.project}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    {task.isOverdue ? (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        기한 초과
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.dueDate!)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}