'use client';

import React from 'react';
import { Task } from 'gantt-task-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronDown, Milestone, FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GanttListTableProps {
  tasks: Task[];
  selectedTaskId?: string;
  onExpanderClick?: (task: Task) => void;
}

export default function GanttListTable({ 
  tasks, 
  selectedTaskId,
  onExpanderClick 
}: GanttListTableProps) {
  const getTaskIcon = (task: Task) => {
    switch (task.type) {
      case 'project':
        return <Folder className="w-4 h-4 text-purple-600" />;
      case 'milestone':
        return <Milestone className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
        <div>작업명</div>
        <div>담당자</div>
        <div>진행률</div>
      </div>

      {/* Rows */}
      {tasks.map((task, index) => {
        const isSelected = task.id === selectedTaskId;
        const hasChildren = tasks.some(t => t.project === task.id);
        const level = task.project ? 1 : 0;

        return (
          <div
            key={task.id}
            className={cn(
              "grid grid-cols-3 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm",
              "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
              isSelected && "bg-purple-50 dark:bg-purple-900/20"
            )}
            style={{ paddingLeft: `${level * 24 + 16}px` }}
          >
            {/* Task Name */}
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => onExpanderClick?.(task)}
                  className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  {task.hideChildren ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
              {getTaskIcon(task)}
              <span className="truncate font-medium">
                {task.name}
              </span>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-2">
              {task.type === 'task' && (
                <>
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      김철
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-gray-600 dark:text-gray-400">
                    김철수
                  </span>
                </>
              )}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              {task.type !== 'milestone' && (
                <>
                  <Progress value={task.progress} className="h-2 flex-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-10 text-right">
                    {Math.round(task.progress)}%
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}