// features/dashboard/components/views/home/TasksWidget.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Checkbox } from '@/components/dashboard_UI/checkbox';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // 주석 처리
// import { apiClient } from '@/lib/api/client'; // 주석 처리
import { Task } from '@/features/dashboard/types';
// import { cn } from '@/lib/utils'; // 주석 처리
import { formatDate } from '@/lib/utils';

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Partial<Task>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // 로컬 데이터로 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockTasks: Partial<Task>[] = [
        {
          id: '1',
          title: '제품 기획서 검토',
          project: 'E-커머스 플랫폼 개발',
          priority: 'high',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 내일
          isOverdue: false,
          status: 'todo',
        },
        {
          id: '2',
          title: 'UI/UX 디자인 피드백',
          project: '모바일 앱 리뉴얼',
          priority: 'medium',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3일 후
          isOverdue: false,
          status: 'in_progress',
        },
        {
          id: '3',
          title: '재고 현황 보고서 작성',
          project: '월간 보고',
          priority: 'urgent',
          dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 어제 (기한 초과)
          isOverdue: true,
          status: 'todo',
        },
        {
          id: '4',
          title: '고객 피드백 분석',
          project: '데이터 분석 시스템',
          priority: 'low',
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 일주일 후
          isOverdue: false,
          status: 'todo',
        },
      ];
      
      setTasks(mockTasks.slice(0, 3)); // 최근 3개만 표시
      setIsLoading(false);
    }, 700); // 0.7초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  // 태스크 상태 업데이트 함수
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    setIsUpdating(true);
    
    // 로컬 상태 업데이트 시뮬레이션
    setTimeout(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus as any }
            : task
        )
      );
      setIsUpdating(false);
    }, 300); // 0.3초 딜레이
  };

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
                    updateTaskStatus(
                      task.id!,
                      checked ? 'done' : 'todo'
                    );
                  }}
                  className="mt-0.5"
                  disabled={isUpdating}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${
                      task.status === 'done' ? "line-through text-gray-500" : ""
                    }`}>
                      {task.title}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getPriorityColor(task.priority!)}`}
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