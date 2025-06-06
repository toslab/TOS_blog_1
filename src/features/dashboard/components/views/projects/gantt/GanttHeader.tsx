'use client';

import React from 'react';

export default function GanttHeader() {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
      <div>작업명</div>
      <div>담당자</div>
      <div>진행률</div>
    </div>
  );
}