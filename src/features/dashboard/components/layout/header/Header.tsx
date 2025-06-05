// features/dashboard/components/layout/header/Header.tsx

'use client';

import React from 'react';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import NotificationButton from './NotificationButton';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { useWebSocket } from '@/features/dashboard/hooks/useWebSocket';

export default function Header() {
  const { onlineUsers } = useWebSocket();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8">
      <div className="h-full flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-4">
          {/* Quick Create Button */}
          <Button
            variant="default"
            size="sm"
            className="hidden sm:flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">새로 만들기</span>
          </Button>

          {/* Online Users Indicator */}
          <div className="hidden lg:flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {onlineUsers}명 온라인
          </div>

          {/* Notifications */}
          <NotificationButton />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}