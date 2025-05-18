'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/dashboard_UI/dialog';
import { useSidebar } from '../../contexts/SidebarContext';
import { useSearch } from '../../contexts/SearchContext';
import DocumentViewer from '../document-viewer';
// 필요한 컴포넌트들을 dashboard.tsx로부터 가져오거나, 직접 import 합니다.
// 예시: import RichTextEditor from '../rich-text-editor';
// 예시: import SettingsComponent from '../settings';
// 예시: import CalendarComponent from '../calendar';
// 예시: import Reports from '../reports';
// 예시: import DocumentViewer from '../document-viewer';
// 예시: import { Dialog, DialogContent } from '@/components/dashboard_UI/dialog';
// 예시: import { Button } from '@/components/Button';

// 데이터 타입 (dashboard.tsx에서 가져오거나 여기서 정의)
// export interface Project { id: number; name: string; status: string; lastUpdated: string; team: string; }
// export interface Document { id: number; title: string; category: string; lastUpdated: string; author: string; content: string; }

// Document 타입 (dashboard.tsx와 동일하게 유지 또는 공유 타입 사용)
interface Document {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  author: string;
  content: string; 
}

// Project 타입 (dashboard.tsx와 동일하게 유지 또는 공유 타입 사용)
interface Project {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
  team: string; 
}

interface PanelManagerProps {
  children: ReactNode;
  documentsData: Document[];
  handleDocumentClick: (doc: Document) => void;
  onOpenDocumentEditor: () => void;
  documentArchiveOpen: boolean;
  setDocumentArchiveOpen: (open: boolean) => void;
}

// classNames 유틸리티 함수 (dashboard.tsx에서 가져오거나 여기서 직접 정의)
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PanelManager({
  children,
  documentsData,
  handleDocumentClick,
  onOpenDocumentEditor,
  documentArchiveOpen,
  setDocumentArchiveOpen,
}: PanelManagerProps) {

  const panelWidth = "18rem"; // 일관된 패널 너비
  const { 
    documentPanelOpen, 
    setDocumentPanelOpen,
    projectPanelOpen, 
    setProjectPanelOpen
  } = useSidebar();

  // 검색 관련 상태 및 로직을 Context에서 가져옴
  const {
    searchQuery,
    setSearchQuery, // Context에서 setSearchQuery 가져옴
    filteredProjects,
    filteredDocuments,
  } = useSearch();

  // selectedDocument 상태를 PanelManager 내부로 이전
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // DocumentPanel 또는 DocumentArchiveDialog에서 문서 클릭 시 호출될 함수
  const handleInternalDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
    setDocumentPanelOpen(false); // 문서 패널 닫기
    setDocumentArchiveOpen(false); // 아카이브 다이얼로그 닫기
    // activeNavItem 변경 로직은 dashboard.tsx의 handleDocumentClick에서 담당 ( setActiveNavItem("DocumentView") )
    // 필요하다면 이 함수를 dashboard.tsx로 올리고 prop으로 받거나, Context 사용 고려
  };

  const closeDocumentViewer = () => {
    setSelectedDocument(null);
    // 필요시 setActiveNavItem("Calendar") 와 같이 기본 뷰로 돌리는 로직 추가 (dashboard.tsx에서 관리 중)
  };

  // PanelManager는 주로 패널들의 렌더링 조건과 애니메이션을 담당합니다.
  // 패널 내의 실제 컨텐츠와 로직은 dashboard.tsx에서 PanelManager의 children으로 전달된
  // 메인 뷰 영역에서 관리되거나, 혹은 각 패널을 별도 컴포넌트로 만들고 PanelManager가 해당 컴포넌트들을
  // 조건부로 렌더링하면서 필요한 props를 전달하는 방식으로 구현될 수 있습니다.
  // 현재 리팩토링 규칙은 PanelManager가 children을 통해 메인 뷰를 받고,
  // DocumentPanel과 ProjectPanel의 렌더링 로직을 PanelManager로 옮기는 것을 목표로 합니다.
  // 이 단계에서는 dashboard.tsx에 남아있는 DocumentPanel과 ProjectPanel의 JSX를 여기에 가져옵니다.

  return (
    <>
      {/* Document Panel */}
      <AnimatePresence>
        {documentPanelOpen && (
          <motion.div
            key="documentPanel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 h-screen overflow-y-auto border-r border-gray-200 bg-white p-4 pt-16 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:block z-30"
            style={{ width: panelWidth, left: 'var(--sidebar-width)' }}
          >
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-semibold dark:text-white">문서</h2>
              <button onClick={() => setDocumentPanelOpen(false)} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="size-5 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Document Actions from dashboard.tsx */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={onOpenDocumentEditor} // props로 받은 핸들러 사용
                className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                새 문서 작성
              </button>
              <button
                type="button"
                onClick={() => setDocumentArchiveOpen(true)} // props로 받은 핸들러 사용
                className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-600"
              >
                아카이브
              </button>
            </div>

            {/* Recent Documents from dashboard.tsx */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">최근 문서</h3>
              <div className="grid grid-cols-1 gap-3">
                {(documentsData || []).slice(0, 3).map((doc: Document) => (
                  <div
                    key={doc.id}
                    className="group rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:hover:shadow-gray-600/50"
                    onClick={() => handleInternalDocumentClick(doc)} // props로 받은 핸들러 사용
                  >
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate dark:text-white dark:group-hover:text-indigo-400">
                      {doc.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{doc.category}</span>
                      <span>{doc.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Archive Dialog - 이 로직도 PanelManager로 이동 */}
      <Dialog open={documentArchiveOpen} onOpenChange={setDocumentArchiveOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[80vh] flex flex-col dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">문서 아카이브</h2>
            <button onClick={() => setDocumentArchiveOpen(false)} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="size-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="size-4 text-gray-400" /> {/* SearchIcon으로 변경 */}
              </div>
              <input
                type="text"
                value={searchQuery} // props로 받은 상태 사용
                onChange={(e) => setSearchQuery(e.target.value)} // props로 받은 핸들러 사용
                placeholder="문서 검색..."
                className="block w-full rounded-md border-0 py-2 pl-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 dark:ring-gray-600 dark:focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(filteredDocuments || []).length > 0 ? (
                (filteredDocuments || []).map((doc: Document) => (
                  <div
                    key={doc.id}
                    className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:hover:shadow-gray-600/50"
                    onClick={() => handleInternalDocumentClick(doc)} // props로 받은 핸들러 사용
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate dark:text-white dark:group-hover:text-indigo-400">
                        {doc.title}
                      </h3>
                      {/* <span className={classNames(...) 중략 */}
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium dark:bg-opacity-80 ${ doc.category === "계획" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : doc.category === "전략" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" : doc.category === "보고서" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : doc.category === "연구" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"}`}>
                        {doc.category}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{doc.author}</span>
                      <span>{doc.lastUpdated}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-gray-500 col-span-2 dark:text-gray-400">검색 결과가 없습니다.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Panel */}
      <AnimatePresence>
        {projectPanelOpen && (
          <motion.div
            key="projectPanel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 h-screen overflow-y-auto border-r border-gray-200 bg-white p-4 pt-16 shadow-lg dark:border-gray-700 dark:bg-gray-800 lg:block z-30"
            style={{ width: panelWidth, left: 'var(--sidebar-width)' }}
          >
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-semibold dark:text-white">프로젝트</h2>
              <button onClick={() => setProjectPanelOpen(false)} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="size-5 dark:text-gray-400" />
              </button>
            </div>
            {/* Search - 동일한 searchQuery와 onSearchQueryChange 사용 가능 */}
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="size-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery} // 문서 패널과 동일한 searchQuery 사용
                onChange={(e) => setSearchQuery(e.target.value)} // 문서 패널과 동일한 핸들러 사용
                placeholder="프로젝트 검색..."
                className="block w-full rounded-md border-0 py-2 pl-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 dark:ring-gray-600 dark:focus:ring-indigo-500"
              />
            </div>
            {/* Project Grid */}
            <div className="grid grid-cols-1 gap-4">
              {(filteredProjects || []).length > 0 ? (
                (filteredProjects || []).map((project: Project) => (
                  <div
                    key={project.id}
                    className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:hover:shadow-gray-600/50"
                    // onClick={() => onProjectClick && onProjectClick(project)} // 필요시 props로 받은 핸들러 연결
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate dark:text-white dark:group-hover:text-indigo-400">
                        {project.name}
                      </h3>
                      <span
                        className={classNames(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          project.status === "진행 중"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : project.status === "완료"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        )}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{project.team}</span>
                      <span>{project.lastUpdated}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-gray-500 col-span-2 dark:text-gray-400">검색 결과가 없습니다.</div>
              )}
            </div>
            <div className="mt-4">
              <button
                type="button"
                // onClick={onOpenNewProject} // 필요시 props로 받은 핸들러 연결
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                새 프로젝트
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* DocumentViewer를 PanelManager 내부에서 조건부 렌더링 */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <DocumentViewer document={selectedDocument} onClose={closeDocumentViewer} />
        </div>
      )}

      {/* children은 메인 뷰 영역 (DashboardLayout에 의해 이미 marginLeft가 적용됨) */}
      <div className="relative">
        {children}
      </div>
    </>
  );
} 