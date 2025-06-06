// features/dashboard/components/views/projects/ProjectsView.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query'; // 주석 처리
// import { apiClient } from '@/lib/api/client'; // 주석 처리
import { Project } from '@/features/dashboard/types';
import ProjectsHeader from './ProjectsHeader';
import ProjectsFilters from './ProjectsFilters';
import ProjectsList from './ProjectsList';
import ProjectsGrid from './ProjectsGrid';
import ProjectsEmpty from './ProjectsEmpty';
import ProjectsSkeleton from './ProjectsSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { LayoutGrid, List, Kanban, GanttChart } from 'lucide-react';

type ViewMode = 'list' | 'grid' | 'kanban' | 'gantt';

// 로컬 샘플 프로젝트 데이터
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-커머스 플랫폼 개발',
    code: 'ECOM-2024-001',
    description: '새로운 온라인 쇼핑몰 플랫폼을 개발하는 프로젝트입니다. React, Node.js, PostgreSQL을 사용하여 확장 가능한 아키텍처를 구축합니다.',
    status: 'active',
    progress: 75,
    memberCount: 8,
    daysRemaining: 15,
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    priority: 85, // 긴급
    myRole: 'owner',
    isOverdue: false,
    owner: {
      id: '1',
      fullName: '김철수',
      profileImage: '/avatars/kim.jpg'
    }
  },
  {
    id: '2',
    name: '모바일 앱 리뉴얼',
    code: 'APP-2024-002',
    description: '기존 모바일 앱의 UI/UX를 개선하고 새로운 기능을 추가하는 프로젝트입니다.',
    status: 'planning',
    progress: 25,
    memberCount: 5,
    daysRemaining: 45,
    startDate: '2024-02-01',
    endDate: '2024-06-01',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
    priority: 65, // 높음
    myRole: 'member',
    isOverdue: false,
    owner: {
      id: '2',
      fullName: '이영희',
      profileImage: '/avatars/lee.jpg'
    }
  },
  {
    id: '3',
    name: '데이터 분석 시스템',
    code: 'DATA-2024-003',
    description: '고객 데이터를 분석하고 인사이트를 제공하는 시스템을 구축합니다.',
    status: 'active',
    progress: 60,
    memberCount: 6,
    daysRemaining: 30,
    startDate: '2024-01-10',
    endDate: '2024-05-10',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-02-12T00:00:00Z',
    priority: 45, // 보통
    myRole: 'approver',
    isOverdue: false,
    owner: {
      id: '3',
      fullName: '박민수',
      profileImage: '/avatars/park.jpg'
    }
  },
  {
    id: '4',
    name: 'API 서버 최적화',
    code: 'API-2024-004',
    description: '기존 API 서버의 성능을 최적화하고 확장성을 개선합니다.',
    status: 'on_hold',
    progress: 40,
    memberCount: 3,
    daysRemaining: null,
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-08T00:00:00Z',
    priority: 30, // 낮음
    myRole: 'member',
    isOverdue: true,
    owner: {
      id: '4',
      fullName: '정하늘',
      profileImage: '/avatars/jung.jpg'
    }
  },
  {
    id: '5',
    name: '고객 지원 시스템',
    code: 'CS-2024-005',
    description: '고객 지원팀을 위한 티켓 관리 시스템을 개발합니다.',
    status: 'completed',
    progress: 100,
    memberCount: 4,
    daysRemaining: null,
    startDate: '2023-10-01',
    endDate: '2024-01-31',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-01-31T00:00:00Z',
    priority: 55, // 보통
    myRole: 'viewer',
    isOverdue: false,
    owner: {
      id: '5',
      fullName: '윤서연',
      profileImage: '/avatars/yoon.jpg'
    }
  },
  {
    id: '6',
    name: '보안 감사 및 개선',
    code: 'SEC-2024-006',
    description: '시스템 보안을 감사하고 취약점을 개선하는 프로젝트입니다.',
    status: 'planning',
    progress: 10,
    memberCount: 2,
    daysRemaining: 60,
    startDate: '2024-03-01',
    endDate: '2024-07-01',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    priority: 75, // 높음
    myRole: 'owner',
    isOverdue: false,
    owner: {
      id: '6',
      fullName: '최준호',
      profileImage: '/avatars/choi.jpg'
    }
  }
];

export default function ProjectsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    myProjects: searchParams.get('filter') === 'mine',
    search: '',
  });

  const [projectsData, setProjectsData] = useState<{
    results: Project[];
    count: number;
    next: string | null;
    previous: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 데이터 필터링 및 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let filteredProjects = [...mockProjects];
      
      // 상태 필터링
      if (filters.status !== 'all') {
        filteredProjects = filteredProjects.filter(p => p.status === filters.status);
      }
      
      // 내 프로젝트 필터링 (예시: 짝수 ID만 내 프로젝트로 가정)
      if (filters.myProjects) {
        filteredProjects = filteredProjects.filter(p => parseInt(p.id) % 2 === 0);
      }
      
      // 검색 필터링
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProjects = filteredProjects.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.code.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      setProjectsData({
        results: filteredProjects,
        count: filteredProjects.length,
        next: null,
        previous: null
      });
      setIsLoading(false);
    }, 800); // 0.8초 딜레이

    return () => clearTimeout(timer);
  }, [filters]);

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

  const handleRefresh = () => {
    setIsLoading(true);
    // 새로고침 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
              <ProjectsList projects={projects} onRefresh={handleRefresh} />
            </TabsContent>
            
            <TabsContent value="grid" className="mt-6">
              <ProjectsGrid projects={projects} onRefresh={handleRefresh} />
            </TabsContent>
            
            <TabsContent value="kanban" className="mt-6">
              {/* <ProjectsKanban projects={projects} onRefresh={handleRefresh} /> */}
              <div className="text-center py-8 text-gray-500">
                칸반 뷰는 곧 추가될 예정입니다.
              </div>
            </TabsContent>
            
            <TabsContent value="gantt" className="mt-6">
              {/* <ProjectsGantt projects={projects} /> */}
              <div className="text-center py-8 text-gray-500">
                간트 차트는 곧 추가될 예정입니다.
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}