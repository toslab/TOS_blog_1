'use client';

import React from 'react';
import { Home, Settings, Briefcase, LogOut, Menu } from 'lucide-react'; // 예시 아이콘
import { cn } from '@/lib/utils'; // cn 유틸리티 임포트 (경로 확인 필요)

// TODO: 실제 아이콘 네비게이션 아이템 데이터로 교체해야 합니다.
const iconNavItems = [
  { name: '홈', icon: Home, panelId: 'home' },
  { name: '프로젝트', icon: Briefcase, panelId: 'projects' },
  // 추가 아이콘 메뉴...
];

const bottomIconNavItems = [
  { name: '설정', icon: Settings, panelId: 'settings' },
  { name: '로그아웃', icon: LogOut, panelId: 'logout' }, // 로그아웃은 panelId 대신 onClick 액션 필요할 수 있음
];

interface IconSidebarProps {
  activeIconMenu: string;
  setActiveIconMenu: (panelId: string) => void;
  isMainMenuPanelOpen: boolean;
  toggleMainMenuPanel: () => void;
  // isMobileView: boolean; // 모바일뷰 상태가 필요하면 추가
}

const IconSidebar: React.FC<IconSidebarProps> = ({
  activeIconMenu,
  setActiveIconMenu,
  isMainMenuPanelOpen, 
  toggleMainMenuPanel,
  // isMobileView
}) => {
  // TODO: isMobileView를 DashboardLayout으로부터 받거나 여기서 useMediaQuery로 정의
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768; // 임시

  return (
    <aside className={cn(
      "bg-sidebar-icon-bar-background text-text-primary flex-shrink-0 flex flex-col items-center shadow-md",
      isMobileView ? "w-full h-header-height flex-row justify-between px-4 fixed top-0 left-0 z-sidebar" : "w-icon-bar h-screen py-5 z-sidebar"
    )}>
      {/* 모바일: 햄버거 아이콘 & 로고 */} 
      {isMobileView && (
        <>
          <button 
            type="button"
            onClick={toggleMainMenuPanel}
            aria-label={isMainMenuPanelOpen ? "메인 메뉴 닫기" : "메인 메뉴 열기"}
            className="p-2 rounded-md hover:bg-hover-bg-light transition-colors"
          >
            <Menu className="h-6 w-6 text-icon-color" />
          </button>
          <div className="text-lg font-semibold">Logo</div> {/* 모바일용 로고 */} 
          <div className="w-6"></div> {/* 오른쪽 정렬을 위한 더미 div */} 
        </>
      )}

      {/* 데스크탑: 로고 */} 
      {!isMobileView && (
         <div className="mb-10">
           {/* TODO: 로고 컴포넌트 또는 이미지로 교체 */}
           <div className="bg-primary text-primary-foreground w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold">
             L
           </div>
         </div>
      )}
      
      {/* 데스크탑: 네비게이션 아이콘 */}
      {!isMobileView && (
        <nav className="flex flex-col items-center gap-y-4 flex-1">
          {iconNavItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveIconMenu(item.panelId)}
              aria-label={item.name}
              aria-current={activeIconMenu === item.panelId ? 'page' : undefined}
              className={cn(
                'p-3 rounded-lg w-full max-w-[48px] flex justify-center items-center transition-all duration-200 ease-in-out group',
                activeIconMenu === item.panelId 
                  ? 'bg-sidebar-icon-active-bg shadow-icon-active' 
                  : 'hover:bg-hover-bg-light'
              )}
            >
              <item.icon
                className={cn(
                  'h-icon-size w-icon-size',
                  activeIconMenu === item.panelId 
                    ? 'text-icon-color-active' 
                    : 'text-icon-color group-hover:text-text-primary'
                )}
                strokeWidth={activeIconMenu === item.panelId ? 'var(--icon-stroke-width-active)' : 'var(--icon-stroke-width)'}
              />
            </button>
          ))}
        </nav>
      )}

      {/* 데스크탑: 하단 아이콘 메뉴 (설정, 로그아웃 등) */}
      {!isMobileView && (
        <div className="mt-auto flex flex-col items-center gap-y-4">
          {bottomIconNavItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                if (item.panelId === 'logout') {
                  // TODO: 로그아웃 로직 구현
                  console.log('Logout clicked');
                } else {
                  setActiveIconMenu(item.panelId);
                }
              }}
              aria-label={item.name}
              aria-current={activeIconMenu === item.panelId ? 'page' : undefined}
              className={cn(
                'p-3 rounded-lg w-full max-w-[48px] flex justify-center items-center transition-all duration-200 ease-in-out group',
                activeIconMenu === item.panelId 
                  ? 'bg-sidebar-icon-active-bg shadow-icon-active' 
                  : 'hover:bg-hover-bg-light'
              )}
            >
              <item.icon
                className={cn(
                  'h-icon-size w-icon-size',
                  activeIconMenu === item.panelId 
                    ? 'text-icon-color-active' 
                    : 'text-icon-color group-hover:text-text-primary'
                )}
                strokeWidth={activeIconMenu === item.panelId ? 'var(--icon-stroke-width-active)' : 'var(--icon-stroke-width)'}
              />
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};

export default IconSidebar; 