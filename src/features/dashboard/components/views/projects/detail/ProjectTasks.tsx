// features/dashboard/components/views/projects/detail/ProjectTasks.tsx

'use client';

import React, { useState } from 'react';
import { Task } from '@/features/dashboard/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, LayoutGrid, List, Kanban } from 'lucide-react';
import TaskListView from './tasks/TaskListView';
import TaskKanbanView from './tasks/TaskKanbanView';
import TaskCreateDialog from './tasks/TaskCreateDialog';
import TaskDetailDialog from './tasks/TaskDetailDialog';
import TaskFilters from './tasks/TaskFilters';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useWebSocket } from '@/features/dashboard/hooks/useWebSocket';

interface ProjectTasksProps {
  projectId: string;
  tasks: Task[];
  isLoading: boolean;
}

export default function ProjectTasks({ projectId, tasks: initialTasks, isLoading }: ProjectTasksProps) {
  const queryClient = useQueryClient();
  const { subscribe, emit } = useWebSocket(`project/${projectId}`);
  
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    assignee: 'all',
  });

  // 태스크 목록 조회
  const { data: tasks = initialTasks, refetch } = useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.assignee !== 'all') {
        if (filters.assignee === 'me') {
          params.append('assignee', 'me');
        } else {
          params.append('assignee_id', filters.assignee);
        }
      }
      
      const response = await apiClient.get<Task[]>(
        `/projects/${projectId}/tasks/?${params.toString()}`
      );
      return response;
    },
    initialData: initialTasks,
  });

  // WebSocket 이벤트 구독
  React.useEffect(() => {
    const unsubscribes = [
      subscribe('task.created', (data) => {
        refetch();
      }),
      subscribe('task.updated', (data) => {
        queryClient.setQueryData(
          ['tasks', projectId, filters],
          (oldData: Task[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map(task => 
              task.id === data.task.id ? data.task : task
            );
          }
        );
      }),
      subscribe('task.deleted', (data) => {
        queryClient.setQueryData(
          ['tasks', projectId, filters],
          (oldData: Task[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.filter(task => task.id !== data.taskId);
          }
        );
      }),
    ];

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [projectId, filters, subscribe, queryClient, refetch]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = () => {
    refetch();
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="태스크 검색..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TaskFilters filters={filters} onChange={setFilters} />
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="kanban">
                <Kanban className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            새 태스크
          </Button>
        </div>
      </div>

      {/* Task Views */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            태스크가 없습니다.
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            첫 태스크 만들기
          </Button>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <TaskListView 
              tasks={tasks} 
              onTaskClick={handleTaskClick}
              projectId={projectId}
            />
          ) : (
            <TaskKanbanView 
              tasks={tasks} 
              onTaskClick={handleTaskClick}
              projectId={projectId}
            />
          )}
        </>
      )}

      {/* Dialogs */}
      <TaskCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        projectId={projectId}
        onSuccess={() => {
          refetch();
          setCreateDialogOpen(false);
        }}
      />

      {selectedTask && (
        <TaskDetailDialog
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          task={selectedTask}
          projectId={projectId}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}