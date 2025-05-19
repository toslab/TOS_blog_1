'use client';

import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent } from '@/components/dashboard_UI/sheet';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebar } from '../../contexts/SidebarContext';
import { SearchProvider } from '../../contexts/SearchContext';
import PanelManager from '../panels/PanelManager';

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
    sidebarOpen,
    setSidebarOpen,
    collapsed,
    documentPanelOpen,
    projectPanelOpen,
    isMobileView,
  } = useSidebar();

  // 사이드바와 패널 상태에 따라 메인 콘텐츠 마진 계산
  let mainContentMarginLeft = '0px';
  if (!isMobileView) {
    mainContentMarginLeft = collapsed 
      ? 'var(--sidebar-width-collapsed, 5rem)' 
      : 'var(--sidebar-width)';
  }

  // 문서 에디터 열기 핸들러 (실제 구현은 여기에 추가)
  const handleOpenDocumentEditor = () => {
    console.log("새 문서 에디터 열기");
  };

  return (
    <div className="flex h-screen bg-[hsl(var(--background))]">
      {/* 모바일 사이드바 (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[var(--sidebar-width)] bg-[hsl(var(--sidebar-background))]">
          <Sidebar isMobile />
        </SheetContent>
      </Sheet>

      {/* 데스크탑 사이드바 */}
      <motion.div
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-[hsl(var(--border))] bg-[hsl(var(--sidebar-background))] transition-all duration-300 ease-in-out"
        style={{ width: collapsed ? 'var(--sidebar-width-collapsed, 5rem)' : 'var(--sidebar-width)' }}
        animate={{ 
          width: collapsed ? 'var(--sidebar-width-collapsed, 5rem)' : 'var(--sidebar-width)',
          transition: { duration: 0.3, ease: 'easeInOut' } 
        }}
      >
        <Sidebar />
      </motion.div>

      {/* 고정된 헤더 */}
      <div className="fixed top-0 right-0 left-0 z-20 lg:left-[var(--sidebar-width)]">
        <DashboardHeader />
      </div>

      {/* 패널 매니저 */}
      <PanelManager 
        documentsData={initialDocumentsData}
        onOpenDocumentEditor={handleOpenDocumentEditor}
      >
        {/* 메인 콘텐츠 영역 */}
        <div
          className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            paddingTop: 'var(--header-height, 4rem)',
            marginLeft: mainContentMarginLeft,
          }}
        >
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </PanelManager>
    </div>
  );
}

export default function DashboardLayoutWithProvider(props: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <SearchProvider 
        projectsData={initialProjectsData}
        documentsData={initialDocumentsData}
      >
        <InnerDashboardLayout {...props} />
      </SearchProvider>
    </SidebarProvider>
  );
} 