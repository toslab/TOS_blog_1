// features/dashboard/components/views/projects/detail/tasks/TaskDetailDialog.tsx

'use client';

import React, { useState } from 'react';
import { Task } from '@/features/dashboard/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, Clock, User, Tag, Paperclip, 
  MessageSquare, Activity, Edit, Trash2, 
  CheckSquare, Square, MoreVertical 
} from 'lucide-react';
import TaskDetailInfo from './detail/TaskDetailInfo';
import TaskComments from './detail/TaskComments';
import TaskActivity from './detail/TaskActivity';
import TaskChecklist from './detail/TaskChecklist';
import TaskAttachments from './detail/TaskAttachments';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { formatDate } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  projectId: string;
  onUpdate: () => void;
}

export default function TaskDetailDialog({
  open,
  onOpenChange,
  task,
  projectId,
  onUpdate,
}: TaskDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  // 태스크 상세 정보 조회
  const { data: taskDetail, refetch } = useQuery({
    queryKey: ['task-detail', task.id],
    queryFn: async () => {
      const response = await apiClient.get<Task>(
        `/projects/${projectId}/tasks/${task.id}/`
      );
      return response;
    },
    initialData: task,
    enabled: open,
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

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      done: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
    return colors[status];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-xl">
                  {taskDetail?.title}
                </DialogTitle>
                <span className="text-sm text-gray-500 font-mono">
                  {taskDetail?.taskNumber}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(taskDetail?.status || 'todo')}>
                  {taskDetail?.status === 'todo' ? '할 일' :
                   taskDetail?.status === 'in_progress' ? '진행 중' :
                   taskDetail?.status === 'review' ? '검토' : '완료'}
                </Badge>
                <Badge className={getPriorityColor(taskDetail?.priority || 'medium')}>
                  {taskDetail?.priority === 'urgent' ? '긴급' :
                   taskDetail?.priority === 'high' ? '높음' :
                   taskDetail?.priority === 'medium' ? '보통' : '낮음'}
                </Badge>
                {taskDetail?.isOverdue && (
                  <Badge variant="destructive">마감 초과</Badge>
                )}
                {taskDetail?.isBlocked && (
                  <Badge variant="secondary">차단됨</Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="details">상세정보</TabsTrigger>
              <TabsTrigger value="comments">
                댓글
                {taskDetail?.comments && taskDetail.comments.length > 0 && (
                  <span className="ml-1">({taskDetail.comments.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="attachments">
                첨부파일
                {taskDetail?.attachments && taskDetail.attachments.length > 0 && (
                  <span className="ml-1">({taskDetail.attachments.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="activity">활동</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="details" className="mt-6">
              <TaskDetailInfo 
                task={taskDetail!} 
                isEditing={isEditing}
                onSave={() => {
                  setIsEditing(false);
                  refetch();
                  onUpdate();
                }}
                projectId={projectId}
              />
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <TaskComments 
                taskId={task.id} 
                projectId={projectId}
              />
            </TabsContent>

            <TabsContent value="attachments" className="mt-6">
              <TaskAttachments 
                taskId={task.id} 
                projectId={projectId}
                attachments={taskDetail?.attachments || []}
              />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <TaskActivity 
                taskId={task.id} 
                projectId={projectId}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}