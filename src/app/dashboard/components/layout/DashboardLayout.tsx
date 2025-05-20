'use client';

import { ReactNode, useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // motion은 새 레이아웃에서 일단 제거, 필요시 다시 추가
// import { Sheet, SheetContent } from '@/components/dashboard_UI/sheet'; // Sheet는 모바일 메뉴 패널에 사용될 수 있음
import DashboardHeader from './DashboardHeader'; // 헤더는 여전히 사용될 수 있음
// import Sidebar from './Sidebar'; // 기존 Sidebar는 IconSidebar와 MainMenuPanel로 대체됨
import IconSidebar from './IconSidebar'; // 새로운 컴포넌트
import MainMenuPanel from './MainMenuPanel'; // 새로운 컴포넌트
import { SidebarProvider, useSidebar } from '../../contexts/SidebarContext';
import { SearchProvider } from '../../contexts/SearchContext';
import PanelManager from '../panels/PanelManager';
// import { useMediaQuery } from '@/hooks/use-media-query'; // 필요시 추가 (예시)

// 임시 더미 데이터 정의 (실제로는 API나 데이터 소스에서 가져올 것)
const initialDocumentsData = [
  { id: 1, title: '2025 마케팅 전략', category: '전략', lastUpdated: '1시간 전', author: '김민준', content: '# 2025 마케팅 전략\n\n## 개요\n이 문서는 2025년도 마케팅 전략의 주요 방향성을 설명합니다.' },
  { id: 2, title: '분기별 성과 보고서', category: '보고서', lastUpdated: '어제', author: '이지현', content: '# 분기별 성과 보고서\n\n## 주요 지표\n- 신규 고객 획득: 전년 대비 15% 증가\n- 고객 유지율: 78%' },
  { id: 3, title: '신제품 출시 계획', category: '계획', lastUpdated: '2일 전', author: '박준호', content: '# 신제품 출시 계획\n\n## 타임라인\n- 7월: 프로토타입 완성\n- 8월: 내부 테스트' },
];

// 임시 프로젝트 더미 데이터
const initialProjectsData = [
  { id: 1, name: '웹사이트 리뉴얼', status: '진행 중', lastUpdated: '3시간 전', team: '디자인팀' },
  { id: 2, name: '모바일 앱 개발', status: '계획', lastUpdated: '어제', team: '개발팀' },
  { id: 3, name: '마케팅 캠페인', status: '완료', lastUpdated: '1주일 전', team: '마케팅팀' },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

function InnerDashboardLayout({ children }: DashboardLayoutProps) {
  const {
    // sidebarOpen, // 기존 sidebarOpen은 isMainMenuPanelOpen 등으로 대체될 수 있음
    // setSidebarOpen,
    // collapsed, // 기존 collapsed는 IconSidebar 고정, MainMenuPanel 토글 방식으로 변경
    // documentPanelOpen, // 패널 매니저 관련 상태는 유지될 수 있음
    // projectPanelOpen,
    isMobileView: isMobile, // useSidebar에서 가져오거나 여기서 useMediaQuery로 정의
  } = useSidebar(); 
  
  // TODO: useMediaQuery 훅을 사용하여 실제 isMobileView 상태를 구현하세요.
  // const isMobileView = useMediaQuery('(max-width: 768px)');
  const [isMobileView, setIsMobileView] = useState(false); // 임시 상태
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const [activeIconMenu, setActiveIconMenu] = useState<string>('home'); // 기본 활성 아이콘 메뉴 (예: 'home')
  const [isMainMenuPanelOpen, setIsMainMenuPanelOpen] = useState<boolean>(!isMobileView); // 모바일에서는 기본 닫힘, 데스크탑에서는 기본 열림

  // 아이콘 바에서 아이콘 클릭 시 주 메뉴 패널 토글 (모바일)
  const handleIconMenuClick = (panelId: string) => {
    setActiveIconMenu(panelId);
    if (isMobileView) {
      setIsMainMenuPanelOpen(true); // 모바일에서는 아이콘 클릭 시 항상 메뉴 패널을 염
    }
  };
  
  // 주 메뉴 패널 닫기 (모바일용)
  const closeMainMenuPanel = () => {
    if (isMobileView) {
        setIsMainMenuPanelOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-page-background text-text-primary">
      <IconSidebar 
        activeIconMenu={activeIconMenu} 
        setActiveIconMenu={handleIconMenuClick} 
        isMainMenuPanelOpen={isMainMenuPanelOpen} // 모바일에서 아이콘바가 메뉴 상태를 알아야 할 경우
        toggleMainMenuPanel={() => setIsMainMenuPanelOpen(!isMainMenuPanelOpen)} // 모바일 햄버거 버튼용
      />
      
      { /* 주 메뉴 패널: 데스크탑에서는 항상 표시, 모바일에서는 isMainMenuPanelOpen 상태에 따라 표시 */}
      { ((!isMobileView || (isMobileView && isMainMenuPanelOpen))) && (
        <MainMenuPanel 
          activeIconMenu={activeIconMenu} 
          isOpen={isMainMenuPanelOpen} 
          onClose={closeMainMenuPanel} // 모바일에서 닫기 버튼용
          isMobileView={isMobileView}
        />
      )}

      {/* 메인 콘텐츠 영역: 헤더와 패널 매니저 포함 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* DashboardHeader는 PanelManager 내부 또는 외부에 위치할 수 있음. 디자인에 따라 조정 */}
        {/* <DashboardHeader /> -- PanelManager 내부로 이동시키거나, 여기서 marginLeft 등을 조정해야 함 */}
        
        <PanelManager 
          documentsData={initialDocumentsData}
          onOpenDocumentEditor={() => console.log("새 문서 에디터 열기")}
        >
          {/* 메인 콘텐츠 내부 (children이 렌더링되는 곳) */}
          <main className="flex-1 overflow-y-auto">
            {/* Header를 여기에 둘 경우 PanelManager와 독립적인 스크롤 가능 */}
            <DashboardHeader />
            <div className="p-panel-padding-x lg:p-panel-padding-y">
              {children}
            </div>
          </main>
        </PanelManager>
      </div>
    </div>
  );
}

export default function DashboardLayoutWithProvider(props: DashboardLayoutProps) {
  return (
    <SidebarProvider> { /* SidebarProvider는 activeIconMenu, isMainMenuPanelOpen 등 새로운 상태를 관리하도록 업데이트 필요 */}
      <SearchProvider 
        projectsData={initialProjectsData}
        documentsData={initialDocumentsData}
      >
        <InnerDashboardLayout {...props} />
      </SearchProvider>
    </SidebarProvider>
  );
} 