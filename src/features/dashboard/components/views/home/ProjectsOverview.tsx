// features/dashboard/components/views/home/ProjectsOverview.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Progress } from '@/components/dashboard_UI/progress';
import { Badge } from '@/components/dashboard_UI/badge';
import { ArrowRight, Clock, Users } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query'; // 주석 처리
// import { apiClient } from '@/lib/api/client'; // 주석 처리
import { Project } from '@/features/dashboard/types';

export default function ProjectsOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 데이터로 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      // 샘플 프로젝트 데이터
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'E-커머스 플랫폼 개발',
          code: 'ECOM-2024-001',
          status: 'active',
          progress: 75,
          memberCount: 5,
          daysRemaining: 15,
          description: '새로운 온라인 쇼핑몰 플랫폼 개발',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: '모바일 앱 리뉴얼',
          code: 'APP-2024-002',
          status: 'planning',
          progress: 25,
          memberCount: 3,
          daysRemaining: 45,
          description: '기존 모바일 앱의 UI/UX 개선',
          startDate: '2024-02-01',
          endDate: '2024-05-31',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: '3',
          name: '데이터 분석 시스템',
          code: 'DATA-2024-003',
          status: 'active',
          progress: 60,
          memberCount: 4,
          daysRemaining: 30,
          description: '고객 데이터 분석을 위한 시스템 구축',
          startDate: '2024-01-10',
          endDate: '2024-04-10',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-25T00:00:00Z'
        },
        {
          id: '4',
          name: 'API 서버 최적화',
          code: 'API-2024-004',
          status: 'on_hold',
          progress: 40,
          memberCount: 2,
          daysRemaining: null,
          description: '기존 API 서버의 성능 최적화',
          startDate: '2024-01-20',
          endDate: '2024-03-20',
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z'
        }
      ];
      
      setProjects(mockProjects.slice(0, 3)); // 최근 3개만 표시
      setIsLoading(false);
    }, 800); // 0.8초 후 로딩 완료

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'active': return '진행중';
      case 'planning': return '계획중';
      case 'on_hold': return '보류';
      case 'completed': return '완료';
      case 'archived': return '보관';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>진행중인 프로젝트</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects" className="gap-1">
            전체보기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : projects?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              진행중인 프로젝트가 없습니다.
            </p>
            <Button size="sm" asChild>
              <Link href="/dashboard/projects/new">
                새 프로젝트 만들기
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects?.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.code}
                    </p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      진행률
                    </span>
                    <span className="font-medium">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{project.memberCount}명</span>
                  </div>
                  {project.daysRemaining && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{project.daysRemaining}일 남음</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}