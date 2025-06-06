// features/dashboard/components/views/projects/ProjectsView.tsx

'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Project } from '@/features/dashboard/types';
import ProjectsHeader from './ProjectsHeader';
import ProjectsFilters from './ProjectsFilters';
import ProjectsList from './ProjectsList';
import ProjectsGrid from './ProjectsGrid';
import ProjectsEmpty from './ProjectsEmpty';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List, Kanban, GanttChart } from 'lucide-react';

type ViewMode = 'list' | 'grid' | 'kanban' | 'gantt';

export default function ProjectsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    myProjects: searchParams.get('filter') === 'mine',
    search: '',
  });

  const { data: projectsData, isLoading, refetch } = useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.myProjects) params.append('my_projects', 'true');
      if (filters.search) params.append('search', filters.search);
      
      const response = await apiClient.get<{
        results: Project[];
        count: number;
        next: string | null;
        previous: string | null;
      }>(`/projects/?${params.toString()}`);
      
      return response;
    },
  });

  const projects = projectsData?.results || [];

  const handleCreateProject = () => {
    router.push('/dashboard/projects/new');
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // URL 업데이트
    const params = new URLSearchParams();
    if (newFilters.status !== 'all') params.set('status', newFilters.status);
    if (newFilters.myProjects) params.set('filter', 'mine');
    
    router.push(`/dashboard/projects?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProjectsHeader 
        totalCount={projectsData?.count || 0}
        onCreate={handleCreateProject}
      />

      {/* Filters */}
      <ProjectsFilters 
        filters={filters}
        onChange={handleFilterChange}
      />

      {/* View Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <List className="w-4 h-4" />
            목록
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-2">
            <LayoutGrid className="w-4 h-4" />
            그리드
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <Kanban className="w-4 h-4" />
            칸반
          </TabsTrigger>
          <TabsTrigger value="gantt" className="gap-2">
            <GanttChart className="w-4 h-4" />
            간트
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <ProjectsSkeleton viewMode={viewMode} />
        ) : projects.length === 0 ? (
          <ProjectsEmpty onCreate={handleCreateProject} />
        ) : (
          <>
            <TabsContent value="list" className="mt-6">
              <ProjectsList projects={projects} onRefresh={refetch} />
            </TabsContent>
            
            <TabsContent value="grid" className="mt-6">
              <ProjectsGrid projects={projects} onRefresh={refetch} />
            </TabsContent>
            
            <TabsContent value="kanban" className="mt-6">
              <ProjectsKanban projects={projects} onRefresh={refetch} />
            </TabsContent>
            
            <TabsContent value="gantt" className="mt-6">
              <ProjectsGantt projects={projects} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}