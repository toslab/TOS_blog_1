'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { LucideIcon, Home, Briefcase, Settings, Users, FileText, Folder, LogOut, BarChart3, Calendar } from 'lucide-react';
import { SubMenuItem } from '../components/common/ListItem';

export interface IconNavItem {
  name: string;
  icon: LucideIcon;
  panelId: string;
}

interface NavigationData {
  iconNavItems: IconNavItem[];
  mainMenuItems: Record<string, { title: string; items: SubMenuItem[] }>;
}

const defaultNavigationData: NavigationData = {
  iconNavItems: [
    { name: '홈', icon: Home, panelId: 'home' },
    { name: '캘린더', icon: Calendar, panelId: 'calendar' },
    { name: '문서', icon: FileText, panelId: 'documents' },
    { name: '프로젝트', icon: Briefcase, panelId: 'projects' }, 
    { name: '보고서', icon: BarChart3, panelId: 'reports' },
  ],
  mainMenuItems: {
    home: {
      title: '홈 대시보드',
      items: [
        { id: 'home-overview', name: '개요', href: '/', type: 'link', icon: FileText, isActive: true },
        { id: 'home-activity', name: '최근 활동', href: '#', type: 'link', icon: Folder },
      ],
    },
    calendar: {
        title: '캘린더 관리',
        items: [
            { id: 'cal-month', name: '월간 보기', href: '#', type: 'link', icon: Calendar },
            { id: 'cal-week', name: '주간 보기', href: '#', type: 'link', icon: Calendar },
        ]
    },
    documents: {
      title: '문서 관리',
      items: [
        { id: 'doc-all', name: '모든 문서', href: '#', type: 'link', icon: FileText, badgeCount: 12 },
        { id: 'doc-my', name: '내 문서', href: '#', type: 'link', icon: FileText },
        { id: 'doc-shared', name: '공유된 문서', href: '#', type: 'link', icon: Users },
        { id: 'doc-separator', name: 'doc-separator', type: 'separator' },
        { id: 'doc-action-create', name: '새 문서 만들기', onClick: () => console.log('새 문서'), type: 'action' },
      ],
    },
    projects: {
      title: '프로젝트 보드',
      items: [
        { id: 'proj-all', name: '모든 프로젝트', href: '#', type: 'link', icon: Briefcase },
        { id: 'proj-active', name: '진행중인 프로젝트', href: '#', type: 'link', icon: Folder, badgeCount: 5 },
      ],
    },
    reports: {
        title: '보고서 보기',
        items: [
            { id: 'report-sales', name: '매출 보고서', href: '#', type: 'link', icon: BarChart3 },
            { id: 'report-ux', name: '사용자 경험 분석', href: '#', type: 'link', icon: BarChart3 },
        ]
    },
    settings: {
        title: '애플리케이션 설정',
        items: [
            { id: 'settings-profile', name: '프로필', href: '#', type: 'link', icon: Users },
            { id: 'settings-app', name: '앱 설정', href: '#', type: 'link', icon: Settings },
        ]
    }
  },
};

export const bottomIconNavItemsData: IconNavItem[] = [
    { name: '설정', icon: Settings, panelId: 'settings' },
    { name: '로그아웃', icon: LogOut, panelId: 'logout_action' }, 
];

interface SidebarContextType {
  activeIconMenu: string;
  setActiveIconMenu: (panelId: string) => void;
  isMainMenuOpenOnMobile: boolean;
  toggleMainMenuOnMobile: () => void;
  openMainMenuOnMobile: () => void;
  closeMainMenuOnMobile: () => void;
  iconNavItems: IconNavItem[];
  bottomIconNavItems: IconNavItem[];
  getMainMenuItems: (panelId: string) => { title: string; items: SubMenuItem[] };
  activeSubNavItem?: string;
  setActiveSubNavItem: (itemId: string) => void;
  projectPanelOpen: boolean;
  setProjectPanelOpen: Dispatch<SetStateAction<boolean>>;
  documentPanelOpen: boolean;
  setDocumentPanelOpen: Dispatch<SetStateAction<boolean>>;
  handlePanelToggle: (panelName: 'documents' | 'projects') => void;
  isMobileView: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [activeIconMenu, setActiveIconMenuInternal] = useState<string>(defaultNavigationData.iconNavItems[0]?.panelId || 'home');
  const [isMainMenuOpenOnMobile, setIsMainMenuOpenOnMobile] = useState(false);
  const [activeSubNavItem, setActiveSubNavItem] = useState<string | undefined>(
    defaultNavigationData.mainMenuItems[activeIconMenu]?.items.find(item => item.type === 'link' && item.href)?.id
  );

  const [projectPanelOpen, setProjectPanelOpen] = useState(false);
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false);
  
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
    const checkMobileView = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setIsMainMenuOpenOnMobile(false);
      }
    };
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const setActiveIconMenu = (panelId: string) => {
    setActiveIconMenuInternal(panelId);
    const firstItem = defaultNavigationData.mainMenuItems[panelId]?.items.find(item => item.type === 'link' && item.href);
    setActiveSubNavItem(firstItem?.id);
    if (isMobileView) {
      setIsMainMenuOpenOnMobile(true);
    }
  };

  const toggleMainMenuOnMobile = () => setIsMainMenuOpenOnMobile(prev => !prev);
  const openMainMenuOnMobile = () => setIsMainMenuOpenOnMobile(true);
  const closeMainMenuOnMobile = () => setIsMainMenuOpenOnMobile(false);

  const getMainMenuItems = (panelId: string): { title: string; items: SubMenuItem[] } => {
    const menuData = defaultNavigationData.mainMenuItems[panelId];
    if (!menuData) return { title: '메뉴 없음', items: [] };
    
    const itemsWithActiveState = menuData.items.map(item => ({
      ...item,
      isActive: item.id === activeSubNavItem
    }));
    return { ...menuData, items: itemsWithActiveState };
  };

  const handlePanelToggle = (panelName: 'documents' | 'projects') => {
    if (panelName === 'documents') {
      setDocumentPanelOpen(prev => !prev);
      setProjectPanelOpen(false);
    } else if (panelName === 'projects') {
      setProjectPanelOpen(prev => !prev);
      setDocumentPanelOpen(false);
    }
  };

  return (
    <SidebarContext.Provider 
      value={{
        activeIconMenu,
        setActiveIconMenu,
        isMainMenuOpenOnMobile,
        toggleMainMenuOnMobile,
        openMainMenuOnMobile,
        closeMainMenuOnMobile,
        iconNavItems: defaultNavigationData.iconNavItems,
        bottomIconNavItems: bottomIconNavItemsData,
        getMainMenuItems,
        activeSubNavItem,
        setActiveSubNavItem,
        projectPanelOpen,
        setProjectPanelOpen,
        documentPanelOpen,
        setDocumentPanelOpen,
        handlePanelToggle,
        isMobileView,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
} 