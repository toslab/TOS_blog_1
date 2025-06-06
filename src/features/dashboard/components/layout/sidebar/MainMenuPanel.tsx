// features/dashboard/components/layout/sidebar/MainMenuPanel.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import NavigationItem from './NavigationItem';
import { useAuth } from '@/features/dashboard/contexts/AuthContext';
import { getMenuItemsForPath, handleMenuAction } from '@/features/dashboard/utils/navigation';

interface MainMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export default function MainMenuPanel({ isOpen, onClose, isMobile = false }: MainMenuPanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [menuData, setMenuData] = useState<any>(null);

  useEffect(() => {
    const data = getMenuItemsForPath(pathname, user);
    setMenuData(data);
  }, [pathname, user]);

  // 액션 핸들러 추가
  const handleItemAction = (actionId: string) => {
    handleMenuAction(actionId, router);
    // 모바일에서는 액션 후 메뉴 닫기
    if (isMobile) {
      onClose();
    }
  };

  // 메뉴 아이템 처리 (액션 핸들러 추가)
  const processedItems = menuData?.items.map((item: any) => ({
    ...item,
    onClick: item.type === 'action' ? () => handleItemAction(item.id) : item.onClick,
  })) || [];

  if (!isOpen || !menuData) return null;

  return (
    <div className={cn(
      "h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
      "transition-all duration-300 flex flex-col",
      isMobile ? "w-80" : "w-64",
      !isOpen && "w-0 overflow-hidden"
    )}>
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {menuData.title}
        </h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {processedItems.map((item: any) => (
            <EnhancedNavigationItem 
              key={item.id} 
              item={item} 
              onClose={isMobile ? onClose : undefined}
            />
          ))}
        </ul>
      </nav>

      {/* Footer Info */}
      {menuData.footer && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {menuData.footer}
          </div>
        </div>
      )}
    </div>
  );
}

// NavigationItem을 감싸서 클릭 시 모바일 메뉴 닫기 처리
interface EnhancedNavigationItemProps {
  item: any;
  onClose?: () => void;
  level?: number;
}

function EnhancedNavigationItem({ item, onClose, level = 0 }: EnhancedNavigationItemProps) {
  // 링크 클릭 시 모바일에서 메뉴 닫기
  const enhancedItem = {
    ...item,
    onClick: item.onClick || (item.type === 'link' && onClose ? () => {
      // 링크의 경우 약간의 딜레이 후 메뉴 닫기 (라우팅 완료 후)
      setTimeout(() => onClose(), 100);
    } : undefined)
  };

  return <NavigationItem item={enhancedItem} level={level} />;
}