// features/dashboard/components/views/projects/ProjectsKanban.tsx

'use client';

import React, { useState } from 'react';
import { Project } from '@/features/dashboard/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Users, Calendar, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface ProjectsKanbanProps {
  projects: Project[];
  onRefresh: () => void;
}

interface KanbanColumn {
  id: Project['status'];
  title: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: 'planning', title: '계획중', color: 'border-t-blue-500' },
  { id: 'active', title: '진행중', color: 'border-t-green-500' },
  { id: 'on_hold', title: '보류', color: 'border-t-yellow-500' },
  { id: 'completed', title: '완료', color: 'border-t-gray-500' },
];

export default function ProjectsKanban({ projects, onRefresh }: ProjectsKanbanProps) {
  const queryClient = useQueryClient();
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const updateProjectStatus = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: string }) => {
      return apiClient.patch(`/projects/${projectId}/`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
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
    
    if (draggedProject) {
      updateProjectStatus.mutate({
        projectId: draggedProject,
        status: columnId,
      });
    }
    
    setDraggedProject(null);
    setDragOverColumn(null);
  };

  const getProjectsByStatus = (status: string) => {
    return projects.filter(project => project.status === status);
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-6 min-w-max pb-4">
        {columns.map((column) => {
          const columnProjects = getProjectsByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className="w-80 flex-shrink-0"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                  {column.title}
                  <Badge variant="secondary">{columnProjects.length}</Badge>
                </h3>
              </div>
              
              {/* Column Content */}
              <div className={cn(
                "space-y-3 min-h-[calc(100vh-300px)] p-3 rounded-lg",
                "bg-gray-50 dark:bg-gray-800/50",
                dragOverColumn === column.id && "bg-purple-50 dark:bg-purple-900/20",
                "transition-colors"
              )}>
                {columnProjects.map((project) => (
                  <Card
                    key={project.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project.id)}
                    className={cn(
                      "cursor-move hover:shadow-md transition-all",
                      "border-t-4",
                      column.color,
                      draggedProject === project.id && "opacity-50"
                    )}
                  >
                    <div className="p-4 space-y-3">
                      {/* Title */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {project.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.code}
                        </p>
                      </div>
                      
                      {/* Description */}
                      {project.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-purple-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project.memberCount}
                          </span>
                          {project.daysRemaining && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {project.daysRemaining}일
                            </span>
                          )}
                        </div>
                        
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={project.owner.profileImage} />
                          <AvatarFallback className="text-xs">
                            {project.owner.fullName?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {columnProjects.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    프로젝트가 없습니다
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