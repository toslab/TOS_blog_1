'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
// import { NavigationItem } from '../components/layout/Sidebar'; // 이제 여기서 직접 정의하고 export
import { Calendar, FileText, BarChart3, FolderKanban } from 'lucide-react'; // Icon 타입은 React.ElementType으로 대체

// 네비게이션 타입 정의 및 export
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType; // LucideIcon 대신 React.ElementType 사용
  current?: boolean; 
  hasPanel?: boolean;
}

const mainNavigationData: NavigationItem[] = [
  { name: 'Calendar', href: '#', icon: Calendar },
  { name: 'Documents', href: '#', icon: FileText, hasPanel: true }, 
  { name: 'Projects', href: '#', icon: FolderKanban, hasPanel: true }, 
  { name: 'Reports', href: '#', icon: BarChart3 },
  // Settings는 별도 버튼으로 처리되므로 여기서는 제외 가능, 또는 추가 타입 정의 필요
];

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleSidebarCollapse: () => void; // 편의 함수
  activeNavItem: string;
  setActiveNavItem: Dispatch<SetStateAction<string>>;
  navigationItems: NavigationItem[]; // 네비게이션 데이터 추가
  handleNavItemClick: (item: NavigationItem) => void; // 강화된 핸들러

  // 패널 상태 추가
  projectPanelOpen: boolean;
  setProjectPanelOpen: Dispatch<SetStateAction<boolean>>;
  documentPanelOpen: boolean;
  setDocumentPanelOpen: Dispatch<SetStateAction<boolean>>;
  // toggleDocumentPanel, toggleProjectPanel은 handleNavItemClick으로 통합되거나 필요시 유지
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Calendar'); // 기본값 설정
  
  // 패널 상태 추가
  const [projectPanelOpen, setProjectPanelOpen] = useState(false);
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false);

  const toggleSidebarCollapse = () => setCollapsed(!collapsed);

  // 강화된 네비게이션 아이템 클릭 핸들러
  const handleNavItemClick = (item: NavigationItem) => {
    setActiveNavItem(item.name);

    if (item.name === 'Documents') {
      const newDocPanelOpen = !documentPanelOpen;
      setDocumentPanelOpen(newDocPanelOpen);
      setProjectPanelOpen(false); // 다른 패널은 닫음
    } else if (item.name === 'Projects') {
      const newProjPanelOpen = !projectPanelOpen;
      setProjectPanelOpen(newProjPanelOpen);
      setDocumentPanelOpen(false); // 다른 패널은 닫음
    } else {
      // Calendar, Reports 등 일반 아이템 클릭 시 모든 패널 닫기
      setDocumentPanelOpen(false);
      setProjectPanelOpen(false);
    }
    // 모바일 환경에서 사이드바를 닫는 로직은 Sidebar 컴포넌트에서 setSidebarOpen(false) 호출로 처리
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
        navigationItems: mainNavigationData, // 네비게이션 데이터 제공
        handleNavItemClick, // 강화된 핸들러 제공
        projectPanelOpen,
        setProjectPanelOpen,
        documentPanelOpen,
        setDocumentPanelOpen,
        // toggleDocumentPanel, // handleNavItemClick으로 통합 또는 필요시 개별 제공
        // toggleProjectPanel,
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