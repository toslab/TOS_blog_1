// features/dashboard/components/views/projects/detail/tasks/TaskKanbanView.tsx

'use client';

import React, { useState } from 'react';
import { Task } from '@/features/dashboard/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Plus, Calendar, Paperclip, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { formatDate } from 'date-fns';

interface TaskKanbanViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  projectId: string;
}

interface KanbanColumn {
  id: Task['status'];
  title: string;
  color: string;
  limit?: number;
}

const columns: KanbanColumn[] = [
  { id: 'todo', title: '할 일', color: 'border-t-gray-500', limit: 10 },
  { id: 'in_progress', title: '진행 중', color: 'border-t-blue-500', limit: 5 },
  { id: 'review', title: '검토', color: 'border-t-yellow-500', limit: 3 },
  { id: 'done', title: '완료', color: 'border-t-green-500' },
];

export default function TaskKanbanView({ tasks, onTaskClick, projectId }: TaskKanbanViewProps) {
  const queryClient = useQueryClient();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      return apiClient.patch(`/projects/${projectId}/tasks/${taskId}/`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    if (draggedTask) {
      updateTaskStatus.mutate({
        taskId: draggedTask,
        status: columnId,
      });
    }
    
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[priority];
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 min-w-max pb-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const isOverLimit = column.limit && columnTasks.length >= column.limit;
          
          return (
            <div
              key={column.id}
              className="w-80 flex-shrink-0"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="mb-3 px-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isOverLimit ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {columnTasks.length}
                      {column.limit && `/${column.limit}`}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {/* Open create task dialog */}}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {isOverLimit && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    WIP 한계 초과
                  </p>
                )}
              </div>
              
              {/* Column Content */}
              <div className={cn(
                "space-y-2 min-h-[calc(100vh-400px)] p-2 rounded-lg",
                "bg-gray-50 dark:bg-gray-800/30",
                dragOverColumn === column.id && "bg-purple-50 dark:bg-purple-900/20",
                "transition-colors"
              )}>
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onTaskClick(task)}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all",
                      "border-t-4 border-l-4",
                      column.color,
                      `border-l-${getPriorityColor(task.priority)}`,
                      draggedTask === task.id && "opacity-50",
                      task.isBlocked && "opacity-60"
                    )}
                  >
                    <div className="p-3 space-y-2">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {task.title}
                        </h4>
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                          {task.taskNumber}
                        </span>
                      </div>
                      
                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs px-1 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-1 py-0"
                            >
                              +{task.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {task.dueDate && (
                            <div className={cn(
                              "flex items-center gap-0.5",
                              task.isOverdue && "text-red-600"
                            )}>
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(new Date(task.dueDate), 'MM/dd')}</span>
                            </div>
                          )}
                          
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="flex items-center gap-0.5">
                              <Paperclip className="w-3 h-3" />
                              <span>{task.attachments.length}</span>
                            </div>
                          )}
                          
                          {task.comments && task.comments.length > 0 && (
                            <div className="flex items-center gap-0.5">
                              <MessageSquare className="w-3 h-3" />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                        </div>
                        
                        {task.assignee && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={task.assignee.profileImage} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.fullName?.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    태스크를 여기로 드래그하세요
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}