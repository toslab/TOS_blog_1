'use client';

import React from 'react';
import { ChevronLeft, FileText, Folder, Settings, Users } from 'lucide-react'; // 예시 아이콘
import { cn } from '@/lib/utils';
import ListItem, { SubMenuItem } from '../../../../features/dashboard/common/ListItem'; // ListItem 컴포넌트 임포트 (경로 확인 필요)

// TODO: 실제 네비게이션 아이템 데이터로 교체해야 합니다. (SidebarContext 또는 props로 전달받을 수 있음)
// 이 데이터 구조는 SidebarContext와 연동되어야 합니다.
const navigationItems: Record<string, { title: string; items: SubMenuItem[] }> = {
  home: {
    title: '홈 대시보드',
    items: [
      { id: 'home-overview', name: '개요', href: '#', type: 'link', icon: FileText, isActive: true },
      { id: 'home-stats', name: '통계', href: '#', type: 'link', icon: Folder },
    ],
  },
  projects: {
    title: '프로젝트 관리',
    items: [
      { id: 'proj-header', name: '내 프로젝트', type: 'header' }, 
      { id: 'proj-fignuts', name: 'Fignuts 앱', href: '#', icon: Folder, type: 'link', badgeCount: 3 },
      { id: 'proj-spotlight', name: 'Spotlight 개발', href: '#', icon: Folder, type: 'link', isActive: false },
      { id: 'proj-separator', type: 'separator' }, 
      { id: 'proj-all', name: '모든 프로젝트 보기', href: '#', type: 'link' },
      { id: 'proj-action-create', name: '새 프로젝트 생성', onClick: () => console.log('새 프로젝트 생성 클릭'), type: 'action' },
    ],
  },
  settings: {
    title: '설정',
    items: [
      { id: 'settings-profile', name: '프로필 설정', href: '#', icon: Users, type: 'link' },
      { id: 'settings-system', name: '시스템 설정', href: '#', icon: Settings, type: 'link' },
    ],
  },
  // 기타 panelId에 대한 메뉴 아이템들...
};

// activeIconMenu에 따라 적절한 메뉴 아이템 목록을 반환하는 헬퍼 함수
const getMenuItemsForPanel = (panelId: string): { title: string; items: SubMenuItem[] } => {
  return navigationItems[panelId] || { title: '메뉴 없음', items: [] };
};

interface MainMenuPanelProps {
  activeIconMenu: string;
  isOpen: boolean;
  onClose: () => void;
  isMobileView: boolean;
}

const MainMenuPanel: React.FC<MainMenuPanelProps> = ({
  activeIconMenu,
  isOpen,
  onClose,
  isMobileView,
}) => {
  const { title, items: currentMenuItems } = getMenuItemsForPanel(activeIconMenu);

  if (!isOpen && !isMobileView) { // 데스크탑에서는 항상 열려있도록 isOpen 조건을 제거하거나 조정 필요
    // 데스크탑에서는 activeIconMenu가 바뀔 때 항상 열려있어야 하므로 이 조건은 주로 모바일용
    // return null; // 또는 isOpen prop을 DashboardLayout에서 데스크탑일땐 항상 true로 전달
  }
  
  // 모바일에서만 패널 전체를 덮는 형태로 표시 (Sheet 사용 가능)
  if (isMobileView && !isOpen) return null;
  if (isMobileView) {
      return (
        <div className="fixed inset-0 z-[45] bg-black/50 backdrop-blur-sm animate-fadeIn">
            <nav 
                className={cn(
                "w-menu-panel bg-panel-background p-panel-padding-x py-panel-padding-y shadow-lg flex-shrink-0 overflow-y-auto h-full",
                "fixed top-0 left-0 z-sidebar", // 모바일에서는 화면 전체를 덮도록
                "transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                    <button onClick={onClose} aria-label="메뉴 닫기" className="p-2 rounded-md hover:bg-hover-bg-light">
                        <ChevronLeft className="h-6 w-6 text-icon-color" />
                    </button>
                </div>
                <ul className="space-y-1">
                {currentMenuItems.map((item) => (
                    <ListItem key={item.id} {...item} />
                ))}
                </ul>
            </nav>
        </div>
      );
  }

  // 데스크탑 뷰
  return (
    <nav 
      className={cn(
        "w-menu-panel bg-panel-background p-panel-padding-x py-panel-padding-y shadow-lg flex-shrink-0 overflow-y-auto h-screen",
        "transition-all duration-normal ease-default", // 필요시 애니메이션 추가
        // isOpen ? 'block' : 'hidden' // 이 부분은 DashboardLayout에서 이미 처리
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h2>
        {/* 데스크탑에서는 닫기 버튼이 필요 없을 수 있음, 또는 다른 기능으로 대체 */}
      </div>
      <ul className="space-y-1">
        {currentMenuItems.map((item) => (
          <ListItem key={item.id} {...item} />
        ))}
      </ul>
    </nav>
  );
};

export default MainMenuPanel; 