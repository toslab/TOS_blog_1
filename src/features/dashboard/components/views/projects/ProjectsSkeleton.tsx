//features/dashboard/components/views/projects/ProjectsSkeleton.tsx

'use client';

import React from 'react';
import { Card } from '@/components/dashboard_UI/card';
// import { Skeleton } from '@/components/dashboard_UI/skeleton'; // 제거

interface ProjectsSkeletonProps {
  viewMode?: 'list' | 'grid' | 'kanban' | 'gantt';
}

// 로컬 Skeleton 컴포넌트 정의
const SkeletonBox = ({ className }: { className?: string }) => (
  <div 
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className || ''}`} 
  />
);

export default function ProjectsSkeleton({ viewMode = 'list' }: ProjectsSkeletonProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-6">
            <SkeletonBox className="h-6 w-3/4 mb-2" />
            <SkeletonBox className="h-4 w-1/2 mb-4" />
            <SkeletonBox className="h-20 w-full mb-4" />
            <div className="space-y-2">
              <SkeletonBox className="h-2 w-full" />
              <div className="flex justify-between">
                <SkeletonBox className="h-4 w-16" />
                <SkeletonBox className="h-4 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (viewMode === 'kanban') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(4)].map((_, colIndex) => (
          <div key={colIndex} className="w-80 flex-shrink-0">
            <SkeletonBox className="h-8 w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, cardIndex) => (
                <Card key={cardIndex} className="p-4">
                  <SkeletonBox className="h-5 w-full mb-2" />
                  <SkeletonBox className="h-4 w-3/4 mb-3" />
                  <div className="flex items-center justify-between">
                    <SkeletonBox className="h-4 w-20" />
                    <SkeletonBox className="h-6 w-6 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'gantt') {
    return (
      <div className="space-y-4">
        {/* Gantt 헤더 */}
        <div className="flex gap-4 p-4 border-b">
          <SkeletonBox className="h-6 w-32" />
          <SkeletonBox className="h-6 w-24" />
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-6 w-28" />
        </div>
        
        {/* Gantt 항목들 */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <SkeletonBox className="h-8 w-48" />
            <div className="flex-1 flex items-center gap-2">
              <SkeletonBox className="h-6 w-32" />
              <SkeletonBox className="h-4 w-64" />
              <SkeletonBox className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default list view skeleton
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <SkeletonBox className="h-3 w-3 rounded-full" />
                <div className="flex-1">
                  <SkeletonBox className="h-6 w-1/3 mb-2" />
                  <SkeletonBox className="h-4 w-3/4 mb-3" />
                  <div className="space-y-2 mb-4">
                    <SkeletonBox className="h-2 w-full" />
                  </div>
                  <div className="flex items-center gap-6">
                    <SkeletonBox className="h-4 w-16" />
                    <SkeletonBox className="h-4 w-24" />
                    <SkeletonBox className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SkeletonBox className="h-8 w-8 rounded-full" />
              <SkeletonBox className="h-8 w-8" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}