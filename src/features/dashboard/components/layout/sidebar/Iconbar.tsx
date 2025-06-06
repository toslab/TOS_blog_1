// features/dashboard/components/layout/sidebar/IconBar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, Briefcase, FileText, Calendar, ShoppingBag, 
  Package, Brain, GitBranch, BarChart3, Settings, 
  LogOut, Menu, ChevronLeft, ChevronRight, Users,
  Bell, Zap 
} from 'lucide-react';
import { useAuth } from '@/features/dashboard/contexts/AuthContext';
import { Badge } from '@/components/dashboard_UI/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/dashboard_UI/tooltip';

interface IconBarProps {
  onToggle: () => void;
  onMenuToggle: () => void;
}

const navigationItems = [
  { id: 'home', name: '홈', icon: Home, href: '/dashboard' },
  { id: 'projects', name: '프로젝트', icon: Briefcase, href: '/dashboard/projects', badge: 3 },
  { id: 'documents', name: '문서', icon: FileText, href: '/dashboard/documents' },
  { id: 'calendar', name: '예약관리', icon: Calendar, href: '/dashboard/calendar' },
  { id: 'ecommerce', name: '이커머스', icon: ShoppingBag, href: '/dashboard/ecommerce' },
  { id: 'inventory', name: '재고관리', icon: Package, href: '/dashboard/inventory' },
  { id: 'research', name: 'AI 연구', icon: Brain, href: '/dashboard/research' },
  { id: 'workflow', name: '워크플로우', icon: GitBranch, href: '/dashboard/workflow' },
  { id: 'analytics', name: '분석', icon: BarChart3, href: '/dashboard/analytics' },
];

const bottomItems = [
  { id: 'settings', name: '설정', icon: Settings, href: '/dashboard/settings' },
];

export default function IconBar({ onToggle, onMenuToggle }: IconBarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className={cn(
          "h-full bg-gray-900 text-white transition-all duration-300 flex flex-col w-16"
        )}
      >
        {/* Logo & Menu Toggle */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800">
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
         </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Link
  href={item.href}
  className={cn(
    "relative flex items-center justify-center p-3 rounded-lg transition-all",
    "hover:bg-gray-800",
    active && "bg-purple-600 hover:bg-purple-700"
  )}
>
  <div className="relative">
    <Icon className={cn(
      "w-6 h-6",
      active ? "text-white" : "text-gray-400"
    )} />
    {item.badge && (
      <div 
        className="absolute w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[13px] font-semibold"
        style={{ 
          top: '-5px', 
          right: '-7.5px' 
        }}
      >
        {item.badge}
      </div>
    )}
  </div>
</Link>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="bg-gray-800 text-white border-gray-600 shadow-xl px-3 py-2 font-medium"
                      sideOffset={9}
                    >
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-800 p-2">
          <ul className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg transition-all",
                          "hover:bg-gray-800",
                          active && "bg-purple-600 hover:bg-purple-700"
                        )}
                      >
                        <Icon className={cn(
                          "w-6 h-6",
                          active ? "text-white" : "text-gray-400"
                        )} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="bg-gray-800 text-white border-gray-600 shadow-xl px-3 py-2 font-medium"
                      sideOffset={9}
                    >
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
            
            {/* Logout Button */}
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center p-3 rounded-lg transition-all hover:bg-gray-800"
                  >
                    <LogOut className="w-6 h-6 text-gray-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="bg-gray-800 text-white border-gray-600 shadow-xl px-3 py-2 font-medium"
                  sideOffset={9}
                >
                  <p>로그아웃</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </div>


      </div>
    </TooltipProvider>
  );
}