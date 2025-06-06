//features/dashboard/components/views/documents/DocumentsHeader.tsx
'use client';

import React from 'react';
import { Button } from '@/components/dashboard_UI/button';
import { Plus, Upload, FolderPlus, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';

interface DocumentsHeaderProps {
  totalCount: number;
  onCreate: () => void;
}

export default function DocumentsHeader({ totalCount, onCreate }: DocumentsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          문서
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {totalCount}개의 문서를 관리하고 있습니다
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          가져오기
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              새로 만들기
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCreate}>
              <FileText className="w-4 h-4 mr-2" />
              빈 문서
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileText className="w-4 h-4 mr-2" />
              회의록 템플릿
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="w-4 h-4 mr-2" />
              기술 문서 템플릿
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="w-4 h-4 mr-2" />
              제안서 템플릿
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FolderPlus className="w-4 h-4 mr-2" />
              새 폴더
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}