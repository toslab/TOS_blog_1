// src/features/dashboard/components/views/settings/shared/SettingRow.tsx

import React from 'react';
import { Button } from '@/components/dashboard_UI/button';

interface SettingRowProps {
  label: string;
  value: string | React.ReactNode;
  onUpdate?: () => void;
  canRemove?: boolean;
  onRemove?: () => void;
}

export default function SettingRow({ 
  label, 
  value, 
  onUpdate, 
  canRemove, 
  onRemove 
}: SettingRowProps) {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 flex text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
        <span className="flex-grow">{value}</span>
        <span className="ml-4 flex-shrink-0 flex items-center gap-4">
          {onUpdate && (
            <Button
              variant="link"
              size="sm"
              onClick={onUpdate}
              className="text-purple-600 hover:text-purple-700"
            >
              수정
            </Button>
          )}
          {canRemove && onRemove && (
            <>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Button
                variant="link"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </Button>
            </>
          )}
        </span>
      </dd>
    </div>
  );
}