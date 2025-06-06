//features/dashboard/components/views/documents/DocumentsEmpty.tsx

'use client';

import React from 'react';
import { Button } from '@/components/dashboard_UI/button';
import { FileText, Search, Filter } from 'lucide-react';

interface DocumentsEmptyProps {
  onCreate: () => void;
  hasFilters?: boolean;
}

export default function DocumentsEmpty({ onCreate, hasFilters = false }: DocumentsEmptyProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            다른 검색어나 필터를 시도해보세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <FileText className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          문서가 없습니다
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          첫 번째 문서를 작성해보세요
        </p>
        <Button onClick={onCreate}>
          <FileText className="w-4 h-4 mr-2" />
          새 문서 만들기
        </Button>
      </div>
    </div>
  );
}