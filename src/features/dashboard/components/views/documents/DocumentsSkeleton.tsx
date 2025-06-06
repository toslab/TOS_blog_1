//features/dashboard/components/views/documents/DocumentsSkeleton.tsx

'use client';

import React from 'react';
import { Card } from '@/components/dashboard_UI/card';

// 로컬 Skeleton 컴포넌트
const SkeletonBox = ({ className }: { className?: string }) => (
  <div 
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className || ''}`} 
  />
);

export default function DocumentsSkeleton() {
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBox className="h-8 w-32" />
          <SkeletonBox className="h-4 w-48" />
        </div>
        <SkeletonBox className="h-10 w-32" />
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b">
        <div className="flex space-x-8 px-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBox key={i} className="h-6 w-20 mb-3" />
          ))}
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SkeletonBox className="h-10 w-64" />
          <SkeletonBox className="h-10 w-32" />
          <SkeletonBox className="h-10 w-32" />
        </div>
        <SkeletonBox className="h-10 w-24" />
      </div>

      {/* Documents List Skeleton */}
      <div className="flex-1 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SkeletonBox className="h-10 w-10" />
                <div className="space-y-2">
                  <SkeletonBox className="h-5 w-64" />
                  <SkeletonBox className="h-4 w-96" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <SkeletonBox className="h-6 w-20" />
                <SkeletonBox className="h-6 w-24" />
                <SkeletonBox className="h-8 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}