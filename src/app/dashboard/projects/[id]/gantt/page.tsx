'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import ProjectGanttView from '@/features/dashboard/components/views/projects/gantt/ProjectGanttView';
import { Card } from '@/components/dashboard_UI/card';

// 간트 차트 전용 로딩 스켈레톤
function GanttSkeleton() {
  return (
    <div className="space-y-4">
      {/* 헤더 스켈레톤 */}
      <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      
      {/* 간트 차트 스켈레톤 */}
      <Card className="p-8">
        <div className="space-y-4">
          {/* 타임라인 헤더 */}
          <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          
          {/* 태스크 행들 */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex space-x-4">
              {/* 태스크 이름 */}
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {/* 간트 바 */}
              <div className="h-6 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ProjectGanttPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { data: ganttData, isLoading } = useQuery({
    queryKey: ['project-gantt', params.id],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${params.id}/gantt_data/`);
      return response;
    },
  });

  if (isLoading) {
    return <GanttSkeleton />;
  }

  return <ProjectGanttView data={ganttData} projectId={params.id} />;
}