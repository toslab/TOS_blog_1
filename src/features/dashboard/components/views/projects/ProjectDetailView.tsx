// features/dashboard/components/views/projects/ProjectDetailView.tsx

'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { Project, Task } from '@/features/dashboard/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDetailHeader from './detail/ProjectDetailHeader';
import ProjectOverview from './detail/ProjectOverview';
import ProjectTasks from './detail/ProjectTasks';
import ProjectMembers from './detail/ProjectMembers';
import ProjectFiles from './detail/ProjectFiles';
import ProjectActivity from './detail/ProjectActivity';
import { useWebSocket } from '@/features/dashboard/hooks/useWebSocket';

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({ projectId }: ProjectDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // WebSocket 연결
  const { subscribe, emit } = useWebSocket(`project/${projectId}`);

  // 프로젝트 데이터 조회
  const { data: project, isLoading: projectLoading, refetch } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get<Project>(`/projects/${projectId}/`);
      return response;
    },
  });

  // 태스크 목록 조회
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const response = await apiClient.get<Task[]>(`/projects/${projectId}/tasks/`);
      return response;
    },
  });

  // WebSocket 이벤트 구독
  React.useEffect(() => {
    const unsubscribes = [
      subscribe('project.updated', (data) => {
        if (data.projectId === projectId) {
          refetch();
        }
      }),
      subscribe('task.created', (data) => {
        if (data.projectId === projectId) {
          // 태스크 목록 새로고침
        }
      }),
      subscribe('task.updated', (data) => {
        if (data.projectId === projectId) {
          // 태스크 업데이트
        }
      }),
    ];

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [projectId, subscribe, refetch]);

  if (projectLoading || !project) {
    return <ProjectDetailSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProjectDetailHeader 
        project={project} 
        onEdit={() => router.push(`/dashboard/projects/${projectId}/edit`)}
        onRefresh={refetch}
      />

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="tasks">
            태스크
            {tasks && tasks.length > 0 && (
              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                {tasks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="members">
            멤버
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              {project.memberCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="files">파일</TabsTrigger>
          <TabsTrigger value="activity">활동</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProjectOverview project={project} tasks={tasks || []} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <ProjectTasks 
            projectId={projectId} 
            tasks={tasks || []} 
            isLoading={tasksLoading}
          />
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <ProjectMembers projectId={projectId} />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <ProjectFiles projectId={projectId} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ProjectActivity projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}