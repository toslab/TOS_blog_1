'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { Calendar, FileText, BarChart3, FolderKanban } from 'lucide-react';
import { NavigationItem } from '../types';

const mainNavigationData: NavigationItem[] = [
  { name: 'Calendar', href: '#', icon: Calendar },
  { name: 'Documents', href: '#', icon: FileText, hasPanel: true }, 
  { name: 'Projects', href: '#', icon: FolderKanban, hasPanel: true }, 
  { name: 'Reports', href: '#', icon: BarChart3 },
  // Settings는 별도 버튼으로 처리되므로 여기서는 제외 가능, 또는 추가 타입 정의 필요
];

interface SidebarContextType {
  // 사이드바 상태
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleSidebarCollapse: () => void;
  
  // 네비게이션 상태
  activeNavItem: string;
  setActiveNavItem: Dispatch<SetStateAction<string>>;
  navigationItems: NavigationItem[];
  
  // 패널 상태
  projectPanelOpen: boolean;
  setProjectPanelOpen: Dispatch<SetStateAction<boolean>>;
  documentPanelOpen: boolean;
  setDocumentPanelOpen: Dispatch<SetStateAction<boolean>>;
  
  // 네비게이션 핸들러
  handleNavItemClick: (item: NavigationItem) => void;
  
  // 모바일 관련 상태
  isMobileView: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  // 기본 상태들
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Calendar');
  
  // 패널 상태
  const [projectPanelOpen, setProjectPanelOpen] = useState(false);
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false);
  
  // 모바일 상태 감지
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
    const checkMobileView = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileView(isMobile);
      
      // 모바일 환경에서는 사이드바를 기본적으로 접힌 상태로 설정
      if (isMobile && !collapsed) {
        setCollapsed(true);
      }
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, [collapsed]);

  const toggleSidebarCollapse = () => setCollapsed(!collapsed);

  // 네비게이션 아이템 클릭 핸들러
  const handleNavItemClick = (item: NavigationItem) => {
    setActiveNavItem(item.name);

    // 패널 토글 로직
    if (item.name === 'Documents') {
      // 같은 항목 재클릭 시 패널 닫기, 아니면 열기
      const newDocPanelOpen = item.name === activeNavItem ? !documentPanelOpen : true;
      setDocumentPanelOpen(newDocPanelOpen);
      setProjectPanelOpen(false); // 다른 패널 닫기
    } else if (item.name === 'Projects') {
      const newProjPanelOpen = item.name === activeNavItem ? !projectPanelOpen : true;
      setProjectPanelOpen(newProjPanelOpen);
      setDocumentPanelOpen(false); // 다른 패널 닫기
    } else {
      // 패널이 없는 항목 클릭 시 모든 패널 닫기
      setDocumentPanelOpen(false);
      setProjectPanelOpen(false);
    }
    
    // 모바일 환경에서는 네비게이션 클릭 후 사이드바 닫기
    if (isMobileView) {
      setSidebarOpen(false);
    }
  };

  return (
    <SidebarContext.Provider 
      value={{
        sidebarOpen,
        setSidebarOpen,
        collapsed,
        setCollapsed,
        toggleSidebarCollapse,
        activeNavItem,
        setActiveNavItem,
        navigationItems: mainNavigationData,
        handleNavItemClick,
        projectPanelOpen,
        setProjectPanelOpen,
        documentPanelOpen,
        setDocumentPanelOpen,
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