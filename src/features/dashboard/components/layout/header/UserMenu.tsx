// features/dashboard/components/layout/header/UserMenu.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, Settings, User, HelpCircle, 
  CreditCard, Bell 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { useAuth } from '@/features/dashboard/contexts/AuthContext';

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.profileImage} 
              alt={user.fullName} 
            />
            <AvatarFallback className="bg-purple-600 text-white text-sm">
              {getInitials(user.fullName || user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.fullName || user.username}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {user.role === 'admin' ? '관리자' : 
               user.role === 'approver' ? '승인자' :
               user.role === 'member' ? '멤버' : '뷰어'}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <div className="font-medium">{user.fullName || user.username}</div>
            <div className="text-sm font-normal text-gray-500">{user.email}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" />
          프로필
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          설정
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings/notifications')}>
          <Bell className="mr-2 h-4 w-4" />
          알림 설정
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
          <CreditCard className="mr-2 h-4 w-4" />
          요금제
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => router.push('/help')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          도움말
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}