'use client';

import React from 'react';
import { Task } from 'gantt-task-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Badge } from '@/components/dashboard_UI/badge';
import { Progress } from '@/components/dashboard_UI/progress';
import { Calendar, User, AlertCircle } from 'lucide-react';

interface GanttTooltipProps {
  task: Task;
  fontSize: string;
  fontFamily: string;
}

export default function GanttTooltip({ task }: GanttTooltipProps) {
  const startDate = format(task.start, 'yyyy년 MM월 dd일', { locale: ko });
  const endDate = format(task.end, 'yyyy년 MM월 dd일', { locale: ko });
  
  const duration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = task.end < new Date() && task.progress < 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {task.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={task.type === 'milestone' ? 'secondary' : 'default'}>
              {task.type === 'project' ? '프로젝트' : 
               task.type === 'milestone' ? '마일스톤' : '태스크'}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                지연
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Date Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{startDate} - {endDate}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          기간: {duration}일
        </div>
      </div>

      {/* Progress */}
      {task.type !== 'milestone' && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">진행률</span>
            <span className="font-medium">{Math.round(task.progress)}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>
      )}

      {/* Dependencies */}
      {task.dependencies && task.dependencies.length > 0 && (
        <div className="pt-3 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            선행 작업: {task.dependencies.length}개
          </p>
        </div>
      )}
    </div>
  );
}