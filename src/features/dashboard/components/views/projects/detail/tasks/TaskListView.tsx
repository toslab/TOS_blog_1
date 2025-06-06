// features/dashboard/components/views/projects/detail/tasks/TaskListView.tsx
'use client';

import React from 'react';
import { Task } from '@/features/dashboard/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Clock, AlertCircle, CheckCircle2, 
  MessageSquare, Paperclip, GitBranch, MoreVertical 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  projectId: string;
}

export default function TaskListView({ tasks, onTaskClick, projectId }: TaskListViewProps) {
  const queryClient = useQueryClient();

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      return apiClient.patch(`/projects/${projectId}/tasks/${taskId}/`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
    return colors[priority];
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'review':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleStatusToggle = (task: Task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    updateTaskStatus.mutate({ taskId: task.id, status: newStatus });
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "group bg-white dark:bg-gray-800 rounded-lg border",
            "hover:shadow-md transition-all duration-200",
            task.isOverdue && "border-red-200 dark:border-red-900",
            task.isBlocked && "opacity-60"
          )}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <Checkbox
                checked={task.status === 'done'}
                onCheckedChange={() => handleStatusToggle(task)}
                className="mt-1"
              />

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Title Row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTaskClick(task)}
                      className="text-left font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      <span className={cn(
                        task.status === 'done' && "line-through text-gray-500"
                      )}>
                        {task.title}
                      </span>
                    </button>
                    
                    <span className="text-xs text-gray-500 font-mono">
                      {task.taskNumber}
                    </span>
                    
                    {getStatusIcon(task.status)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'urgent' ? '긴급' :
                       task.priority === 'high' ? '높음' :
                       task.priority === 'medium' ? '보통' : '낮음'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTaskClick(task)}>
                          상세보기
                        </DropdownMenuItem>
                        <DropdownMenuItem>복사</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Progress Bar */}
                {task.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>진행률</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {/* Due Date */}
                    {task.dueDate && (
                      <div className={cn(
                        "flex items-center gap-1",
                        task.isOverdue && "text-red-600 dark:text-red-400"
                      )}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(new Date(task.dueDate), 'MM/dd')}</span>
                        {task.isOverdue && (
                          <span className="text-xs">(초과)</span>
                        )}
                      </div>
                    )}

                    {/* Comments */}
                    {task.comments && task.comments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{task.comments.length}</span>
                      </div>
                    )}

                    {/* Attachments */}
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{task.attachments.length}</span>
                      </div>
                    )}

                    {/* Dependencies */}
                    {task.dependencies && task.dependencies.length > 0 && (
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>{task.dependencies.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Assignee */}
                  {task.assignee && (
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={task.assignee.profileImage} />
                      <AvatarFallback className="text-xs">
                        {task.assignee.fullName?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}