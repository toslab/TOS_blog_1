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
  collapsed: boolean;
  onToggle: () => void;
  onMenuToggle: () => void;
}

const navigationItems = [
  { id: 'home', name: '홈', icon: Home, href: '/dashboard' },
  { id: 'projects', name: '프로젝트', icon: Briefcase, href: '/dashboard/projects', badge: 3 },
  { id: 'documents', name: '문서', icon: FileText, href: '/dashboard/documents' },
  { id: 'calendar', name: '캘린더', icon: Calendar, href: '/dashboard/calendar' },
  { id: 'ecommerce', name: '이커머스', icon: ShoppingBag, href: '/dashboard/ecommerce' },
  { id: 'inventory', name: '재고관리', icon: Package, href: '/dashboard/inventory' },
  { id: 'research', name: 'AI 연구', icon: Brain, href: '/dashboard/research' },
  { id: 'workflow', name: '워크플로우', icon: GitBranch, href: '/dashboard/workflow' },
  { id: 'analytics', name: '분석', icon: BarChart3, href: '/dashboard/analytics' },
];

const bottomItems = [
  { id: 'settings', name: '설정', icon: Settings, href: '/dashboard/settings' },
];

export default function IconBar({ collapsed, onToggle, onMenuToggle }: IconBarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "h-full bg-gray-900 text-white transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-20"
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
                        <Icon className={cn(
                          "w-6 h-6",
                          active ? "text-white" : "text-gray-400"
                        )} />
                        {item.badge && (
                          <Badge 
                            className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 text-xs"
                            variant={active ? "secondary" : "destructive"}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
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
                    <TooltipContent side="right">
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
                <TooltipContent side="right">
                  <p>로그아웃</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </div>

        {/* Collapse Toggle */}
        <div className="p-2">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}