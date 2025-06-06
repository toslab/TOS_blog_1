// features/dashboard/components/views/projects/ProjectsHeader.tsx

'use client';

import React from 'react';
import { Button } from '@/components/dashboard_UI/button';
import { Plus, Download, Upload } from 'lucide-react';
import { Badge } from '@/components/dashboard_UI/badge';

interface ProjectsHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function ProjectsHeader({ totalCount, onCreate }: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          프로젝트
          <Badge variant="secondary" className="text-base">
            {totalCount}
          </Badge>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          팀과 함께 프로젝트를 관리하고 협업하세요
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          가져오기
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          내보내기
        </Button>
        <Button onClick={onCreate} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          새 프로젝트
        </Button>
      </div>
    </div>
  );
}