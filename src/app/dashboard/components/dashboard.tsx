"use client"

import { useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, FileText, BarChart3, Settings, Search, X } from "lucide-react"
import { Button } from "@/components/Button"
import DashboardLayoutWithProvider from "./layout/DashboardLayout"
import { IconNavItem } from "../contexts/SidebarContext"
import PanelManager from "./panels/PanelManager"
import { useSidebar } from "../contexts/SidebarContext"
import { SearchProvider } from "../contexts/SearchContext"

// 새로 분리된 뷰 컴포넌트들 import
import SettingsView from "./views/SettingsView"
import RichTextEditorView from "./views/RichTextEditorView"
import CalendarView from "./views/CalendarView"
import ReportsView from "./views/ReportsView"
import DocumentViewer from "./document-viewer"

// 프로젝트 목록 데이터
const projectsData = [
  { id: 1, name: "웹사이트 리디자인", status: "진행 중", lastUpdated: "2시간 전", team: "디자인" },
  { id: 2, name: "모바일 앱 개발", status: "완료", lastUpdated: "1일 전", team: "개발" },
  { id: 3, name: "마케팅 캠페인", status: "계획", lastUpdated: "3일 전", team: "마케팅" },
  { id: 4, name: "대시보드 UI 개선", status: "진행 중", lastUpdated: "5시간 전", team: "디자인" },
  { id: 5, name: "API 통합", status: "진행 중", lastUpdated: "1일 전", team: "개발" },
  { id: 6, name: "사용자 연구", status: "완료", lastUpdated: "1주일 전", team: "연구" },
  { id: 7, name: "콘텐츠 전략", status: "계획", lastUpdated: "2일 전", team: "마케팅" },
  { id: 8, name: "성능 최적화", status: "진행 중", lastUpdated: "3일 전", team: "개발" },
]

// Document 아카이브 데이터 추가
const documentsData = [
  {
    id: 1,
    title: "프로젝트 계획서",
    category: "계획",
    lastUpdated: "2시간 전",
    author: "김철수",
    content: `# 프로젝트 계획서: 웹사이트 리디자인

## 1. 프로젝트 개요

본 프로젝트는 회사의 기존 웹사이트를 현대적인 디자인과 기술로 리디자인하는 것을 목표로 합니다. 현재 웹사이트는 5년 전에 개발되었으며, 모바일 대응이 미흡하고 사용자 경험이 최적화되어 있지 않습니다.

## 2. 프로젝트 목표

- 반응형 디자인으로 모든 디바이스에서 최적의 사용자 경험 제공
- 웹사이트 로딩 속도 개선 (현재 평균 5초에서 2초 이하로 단축)
- 검색 엔진 최적화(SEO) 개선
- 사용자 인터페이스 현대화 및 브랜드 아이덴티티 강화
- 콘텐츠 관리 시스템 도입으로 비개발자도 쉽게 콘텐츠 업데이트 가능하도록 개선

## 3. 프로젝트 범위

### 포함 사항
- 메인 페이지 리디자인
- 제품/서비스 소개 페이지 개발
- 회사 소개 및 연혁 페이지 개발
- 고객 지원 및 FAQ 섹션 개발
- 반응형 디자인 구현
- 콘텐츠 관리 시스템 구축

### 제외 사항
- 온라인 결제 시스템 구축
- 회원 관리 시스템 고도화 (2차 프로젝트로 진행 예정)
- 다국어 지원 (추후 확장 계획)

## 4. 일정 계획

- 기획 및 요구사항 분석: 2주
- 디자인 시안 개발: 3주
- 프론트엔드 개발: 4주
- 백엔드 개발 및 CMS 구축: 3주
- 테스트 및 품질 보증: 2주
- 콘텐츠 마이그레이션: 1주
- 최종 검수 및 출시 준비: 1주

총 프로젝트 기간: 16주 (약 4개월)

## 5. 예산 계획

- 인건비: 8,000만원
- 디자인 및 에셋: 1,500만원
- 서버 및 인프라: 500만원
- 라이센스 및 외부 서비스: 1,000만원
- 예비비: 1,000만원

총 예산: 1억 2,000만원

## 6. 팀 구성

- 프로젝트 매니저: 1명
- UI/UX 디자이너: 2명
- 프론트엔드 개발자: 3명
- 백엔드 개발자: 2명
- QA 엔지니어: 1명
- 콘텐츠 전문가: 1명

## 7. 위험 요소 및 대응 방안

1. **일정 지연 위험**
   - 대응: 주간 진행 상황 점검 및 이슈 조기 발견 시스템 구축
   - 대응: 핵심 기능 우선 개발 후 부가 기능은 단계적 출시

2. **기술적 어려움**
   - 대응: 사전 기술 검증 및 프로토타입 개발
   - 대응: 외부 전문가 자문 필요시 즉시 활용

3. **이해관계자 요구사항 변경**
   - 대응: 초기 요구사항 명확화 및 문서화
   - 대응: 변경 관리 프로세스 수립

## 8. 성공 기준

- 웹사이트 방문자 수 30% 증가
- 페이지 체류 시간 25% 증가
- 모바일 사용자 이탈률 40% 감소
- 검색 엔진 순위 상위 10위 내 진입 (주요 키워드 기준)
- 고객 문의 및 리드 생성 35% 증가

## 9. 승인

본 프로젝트 계획서는 관련 부서 및 경영진의 검토와 승인을 거쳐 실행됩니다.`,
  },
  {
    id: 2,
    title: "마케팅 전략",
    category: "전략",
    lastUpdated: "1일 전",
    author: "이영희",
    content: "마케팅 전략에 대한 상세 내용입니다...",
  },
  {
    id: 3,
    title: "분기별 보고서",
    category: "보고서",
    lastUpdated: "3일 전",
    author: "박지민",
    content: "분기별 보고서에 대한 상세 내용입니다...",
  },
  {
    id: 4,
    title: "사용자 연구 결과",
    category: "연구",
    lastUpdated: "5시간 전",
    author: "최수진",
    content: "사용자 연구 결과에 대한 상세 내용입니다...",
  },
  {
    id: 5,
    title: "제품 명세서",
    category: "명세",
    lastUpdated: "1일 전",
    author: "정민준",
    content: "제품 명세서에 대한 상세 내용입니다...",
  },
  {
    id: 6,
    title: "회의록 - 개발팀",
    category: "회의록",
    lastUpdated: "1주일 전",
    author: "강다희",
    content: "개발팀 회의록에 대한 상세 내용입니다...",
  },
  {
    id: 7,
    title: "디자인 가이드라인",
    category: "가이드",
    lastUpdated: "2일 전",
    author: "윤서연",
    content: "디자인 가이드라인에 대한 상세 내용입니다...",
  },
  {
    id: 8,
    title: "API 문서",
    category: "문서",
    lastUpdated: "3일 전",
    author: "임재현",
    content: "API 문서에 대한 상세 내용입니다...",
  },
]

// 실제 UI 및 로직을 담당하는 내부 컴포넌트
function InnerDashboard() {
  const { activeIconMenu, setActiveIconMenu } = useSidebar();
  
  const [documentEditorOpen, setDocumentEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<(typeof documentsData)[0] | null>(null);

  useEffect(() => {
    // --- 테스트를 위해 다음 라인 활성화 ---
    // setActiveIconMenu("Editor"); 
    // --- 테스트가 끝나면 원래 로직으로 돌려놓거나 아래 로직과 병합 ---

    const isEditorActive = activeIconMenu === 'Editor';
    const isSettingsActive = activeIconMenu === 'Settings';
    const isReportsActive = activeIconMenu === 'Reports';
    const isDocumentViewActive = activeIconMenu === 'DocumentView';

    setDocumentEditorOpen(isEditorActive);
    setSettingsOpen(isSettingsActive);
    setReportsOpen(isReportsActive);
    
    if (!isDocumentViewActive && activeIconMenu !== "Documents" && activeIconMenu !== "Projects") { 
      setSelectedDocument(null);
    }

    // --- 테스트 중에는 이 기본 뷰 설정 로직을 주석 처리하거나 비활성화 ---
    /*
    const noSpecificViewActive = !isEditorActive && !isSettingsActive && !isReportsActive && !isDocumentViewActive && !selectedDocument;
    if (noSpecificViewActive) {
      if (activeIconMenu !== 'Calendar' && activeIconMenu) {
      } else if (!activeIconMenu || activeIconMenu !== 'Calendar') {
        setActiveIconMenu("Calendar");
      }
    }
    */
  }, [activeIconMenu, settingsOpen, documentEditorOpen, reportsOpen, selectedDocument, setActiveIconMenu]);

  const handleDocumentClick = (doc: (typeof documentsData)[0]) => {
    setSelectedDocument(doc);
    setActiveIconMenu("DocumentView");
  };

  const handleOpenDocumentEditor = () => {
    setActiveIconMenu("Editor");
  };
  
  const closeViewAndGoToCalendar = () => {
    setActiveIconMenu("Calendar");
  };

  return (
    <PanelManager
      documentsData={documentsData} 
      handleDocumentClick={handleDocumentClick}
      onOpenDocumentEditor={handleOpenDocumentEditor} 
    >
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        {settingsOpen ? (
          <SettingsView onClose={closeViewAndGoToCalendar} />
        ) : documentEditorOpen ? (
          <RichTextEditorView onClose={closeViewAndGoToCalendar} />
        ) : activeIconMenu === 'Calendar' ? (
          <CalendarView onCreateDocument={handleOpenDocumentEditor} />
        ) : reportsOpen ? (
          <ReportsView onClose={closeViewAndGoToCalendar} />
        ) : activeIconMenu === "DocumentView" && selectedDocument ? (
           <DocumentViewer document={selectedDocument} onClose={closeViewAndGoToCalendar} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">대시보드 홈</h1>
            <p className="text-gray-600 dark:text-gray-300">
              왼쪽 메뉴를 통해 기능을 선택해주세요. (현재 활성: {activeIconMenu || '없음'})
            </p>
          </div>
        )}
      </div>
    </PanelManager>
  );
}

// 최상위 Dashboard 컴포넌트는 Provider들로 감싸는 역할만 수행
export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // 서버 사이드 렌더링 시에는 Context를 사용할 수 없으므로 로딩 상태나 null 반환
    return null; 
  }

  return (
    <DashboardLayoutWithProvider>
      <SearchProvider projectsData={projectsData} documentsData={documentsData}>
        <InnerDashboard />
      </SearchProvider>
    </DashboardLayoutWithProvider>
  );
}
