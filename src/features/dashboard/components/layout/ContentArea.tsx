// features/dashboard/components/layout/ContentArea.tsx

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <main className={cn(
      "flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900",
      className
    )}>
      <div className="h-full p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
}