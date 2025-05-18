"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BellIcon, Bars3Icon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Calendar, FileText, BarChart3, Settings, Search, X } from "lucide-react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import RichTextEditor from "./rich-text-editor"
import SettingsComponent from "./settings"
import CalendarComponent from "./calendar"
import { Button } from "@/components/Button"
import Reports from "./reports"
import DocumentViewer from "./document-viewer"
import { Sheet, SheetContent } from "@/components/dashboard_UI/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dashboard_UI/dropdown-menu"
import { Dialog, DialogContent } from "@/components/dashboard_UI/dialog"

// 프로젝트 목록 데이터
const projects = [
  { id: 1, name: "웹사이트 리디자인", status: "진행 중", lastUpdated: "2시간 전", team: "디자인" },
  { id: 2, name: "모바일 앱 개발", status: "완료", lastUpdated: "1일 전", team: "개발" },
  { id: 3, name: "마케팅 캠페인", status: "계획", lastUpdated: "3일 전", team: "마케팅" },
  { id: 4, name: "대시보드 UI 개선", status: "진행 중", lastUpdated: "5시간 전", team: "디자인" },
  { id: 5, name: "API 통합", status: "진행 중", lastUpdated: "1일 전", team: "개발" },
  { id: 6, name: "사용자 연구", status: "완료", lastUpdated: "1주일 전", team: "연구" },
  { id: 7, name: "콘텐츠 전략", status: "계획", lastUpdated: "2일 전", team: "마케팅" },
  { id: 8, name: "성능 최적화", status: "진행 중", lastUpdated: "3일 전", team: "개발" },
]

// 네비게이션 메뉴 수정 - Calendar, Document, Report만 남기기
const navigation = [
  { name: "Calendar", href: "#", icon: Calendar, current: true },
  { name: "Documents", href: "#", icon: FileText, current: false, hasPanel: true },
  { name: "Reports", href: "#", icon: BarChart3, current: false },
]

// Document 아카이브 데이터 추가
const documents = [
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

const userNavigation = [
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

// Dashboard 컴포넌트 내부에 상태 추가
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [projectPanelOpen, setProjectPanelOpen] = useState(false)
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false)
  const [documentArchiveOpen, setDocumentArchiveOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [filteredDocuments, setFilteredDocuments] = useState(documents)
  const [documentEditorOpen, setDocumentEditorOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("Calendar")
  const [reportsOpen, setReportsOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<(typeof documents)[0] | null>(null)

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  // Filter projects based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects)
      setFilteredDocuments(documents)
    } else {
      const query = searchQuery.toLowerCase()
      const filteredProj = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.status.toLowerCase().includes(query) ||
          project.team.toLowerCase().includes(query),
      )
      setFilteredProjects(filteredProj)

      const filteredDocs = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.category.toLowerCase().includes(query) ||
          doc.author.toLowerCase().includes(query),
      )
      setFilteredDocuments(filteredDocs)
    }
  }, [searchQuery])

  // Handle navigation item click
  const handleNavItemClick = (item: (typeof navigation)[0]) => {
    setActiveNavItem(item.name)

    if (item.name === "Calendar") {
      setCalendarOpen(true)
      setDocumentEditorOpen(false)
      setSettingsOpen(false)
      setDocumentPanelOpen(false)
    } else if (item.hasPanel && item.name === "Documents") {
      setDocumentPanelOpen(!documentPanelOpen)
      setCalendarOpen(false)
    } else if (item.hasPanel) {
      setProjectPanelOpen(!projectPanelOpen)
      setCalendarOpen(false)
    } else if (item.name === "Reports") {
      setReportsOpen(true)
      setDocumentEditorOpen(false)
      setSettingsOpen(false)
      setCalendarOpen(false)
    }
  }

  // Calculate sidebar width based on state
  const sidebarWidth = collapsed ? "5rem" : "18rem"

  // Calculate project panel width
  const projectPanelWidth = "18rem"

  // 문서 클릭 핸들러 함수 추가
  const handleDocumentClick = (document: (typeof documents)[0]) => {
    setSelectedDocument(document)
    // 아카이브는 열린 상태로 유지
  }

  return (
    <>
      <div className="flex h-screen">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 pt-4">
              <div className="flex justify-end">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  {collapsed ? (
                    <PanelLeftOpen className="size-5 text-indigo-600" />
                  ) : (
                    <PanelLeftClose className="size-5 text-indigo-600" />
                  )}
                </button>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault()
                              handleNavItemClick(item)
                              setSidebarOpen(false)
                            }}
                            className={classNames(
                              activeNavItem === item.name
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                                ? "bg-gray-100 text-indigo-600"
                                : "",
                              "group flex gap-x-5 rounded-md p-3 text-sm/6 font-semibold",
                            )}
                          >
                            <item.icon
                              className={classNames(
                                activeNavItem === item.name
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-indigo-600",
                                item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                                  ? "text-indigo-600"
                                  : "",
                                "size-6 shrink-0",
                              )}
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setSettingsOpen(true)
                        setDocumentEditorOpen(false)
                        setCalendarOpen(false)
                        setSidebarOpen(false)
                      }}
                      className="group flex gap-x-5 rounded-md p-3 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Settings
                        aria-hidden="true"
                        className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1">
          {/* Static sidebar for desktop */}
          <motion.div
            className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40"
            animate={{
              width: sidebarWidth,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
          >
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-2 overflow-y-auto border-r border-gray-200 bg-white pb-4 pt-4">
              <div className="flex justify-end px-3 mb-2">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  {collapsed ? (
                    <PanelLeftOpen className="size-5 text-indigo-600" />
                  ) : (
                    <PanelLeftClose className="size-5 text-indigo-600" />
                  )}
                </button>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7 px-2">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault()
                              handleNavItemClick(item)
                            }}
                            className={classNames(
                              activeNavItem === item.name
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                                ? "bg-gray-100 text-indigo-600"
                                : "",
                              "group flex gap-x-5 rounded-md p-3 text-sm/6 font-semibold",
                              collapsed ? "justify-center" : "",
                            )}
                          >
                            <item.icon
                              className={classNames(
                                activeNavItem === item.name
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-indigo-600",
                                item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                                  ? "text-indigo-600"
                                  : "",
                                "size-6 shrink-0",
                              )}
                            />
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {item.name}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setSettingsOpen(true)
                        setDocumentEditorOpen(false)
                        setCalendarOpen(false)
                      }}
                      className={classNames(
                        "group flex gap-x-5 rounded-md p-3 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                        collapsed ? "justify-center" : "",
                      )}
                    >
                      <Settings
                        aria-hidden="true"
                        className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            Settings
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>

          {/* Document panel - positioned right after sidebar */}
          <AnimatePresence>
            {documentPanelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: projectPanelWidth, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:block border-r border-gray-200 bg-white overflow-y-auto h-screen fixed top-0 z-30"
                style={{ left: sidebarWidth }}
              >
                <div className="p-4 pt-16">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">문서</h2>
                    <button onClick={() => setDocumentPanelOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
                      <X className="size-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Document Actions */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDocumentEditorOpen(true)
                        setSettingsOpen(false)
                        setCalendarOpen(false)
                        setDocumentPanelOpen(false)
                      }}
                      className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      새 문서 작성
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocumentArchiveOpen(true)}
                      className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      아카이브
                    </button>
                  </div>

                  {/* Recent Documents */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">최근 문서</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {documents.slice(0, 3).map((doc) => (
                        <div
                          key={doc.id}
                          className="group rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedDocument(doc)
                            setDocumentPanelOpen(false)
                          }}
                        >
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">
                            {doc.title}
                          </h3>
                          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                            <span>{doc.category}</span>
                            <span>{doc.lastUpdated}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Document Archive Dialog */}
          <Dialog open={documentArchiveOpen} onOpenChange={setDocumentArchiveOpen}>
            <DialogContent className="max-w-4xl w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">문서 아카이브</h2>
                <button onClick={() => setDocumentArchiveOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
                  <X className="size-5 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="size-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="문서 검색..."
                    className="block w-full rounded-md border-0 py-2 pl-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Document List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleDocumentClick(doc)}
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">
                            {doc.title}
                          </h3>
                          <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                            {doc.category}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>{doc.author}</span>
                          <span>{doc.lastUpdated}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500 col-span-2">검색 결과가 없습니다.</div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Project panel - positioned right after sidebar */}
          <AnimatePresence>
            {projectPanelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: projectPanelWidth, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:block border-r border-gray-200 bg-white overflow-y-auto h-screen fixed top-0 z-30"
                style={{ left: sidebarWidth }}
              >
                <div className="p-4 pt-16">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">프로젝트</h2>
                    <button onClick={() => setProjectPanelOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
                      <X className="size-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="size-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="프로젝트 검색..."
                      className="block w-full rounded-md border-0 py-2 pl-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                  </div>

                  {/* Project Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">
                              {project.name}
                            </h3>
                            <span
                              className={classNames(
                                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                project.status === "진행 중"
                                  ? "bg-blue-100 text-blue-800"
                                  : project.status === "완료"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800",
                              )}
                            >
                              {project.status}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>{project.team}</span>
                            <span>{project.lastUpdated}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      새 프로젝트
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile project panel */}
          <Sheet
            open={projectPanelOpen && window.innerWidth < 1024}
            onOpenChange={(open) => {
              if (window.innerWidth < 1024) {
                setProjectPanelOpen(open)
              }
            }}
          >
            <SheetContent side="left" className="p-0 w-full max-w-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">프로젝트</h2>
                  <button onClick={() => setProjectPanelOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
                    <X className="size-5 text-gray-500" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="size-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="프로젝트 검색..."
                    className="block w-full rounded-md border-0 py-2 pl-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">
                            {project.name}
                          </h3>
                          <span
                            className={classNames(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              project.status === "진행 중"
                                ? "bg-blue-100 text-blue-800"
                                : project.status === "완료"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800",
                            )}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span>{project.team}</span>
                          <span>{project.lastUpdated}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    새 프로젝트
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Main content area */}
          <div
            className="flex-1 flex flex-col"
            style={{
              marginLeft: documentPanelOpen ? `calc(${sidebarWidth} + ${projectPanelWidth})` : sidebarWidth,
              transition: "margin-left 0.3s ease-in-out",
            }}
          >
            {/* Top navigation */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                  <input
                    name="search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                  />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Separator */}
                  <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                  {/* Profile dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="-m-1.5 flex items-center p-1.5">
                        <span className="sr-only">Open user menu</span>
                        <img
                          alt=""
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          className="size-8 rounded-full bg-gray-50"
                        />
                        <span className="hidden lg:flex lg:items-center">
                          <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900">
                            Tom Cook
                          </span>
                          <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {userNavigation.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <a
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault()
                              if (item.name === "Settings") {
                                setSettingsOpen(true)
                                setDocumentEditorOpen(false)
                                setCalendarOpen(false)
                              }
                            }}
                          >
                            {item.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Main dashboard content */}
            <main className="flex-1 overflow-y-auto">
              <div className="py-10 px-4 sm:px-6 lg:px-8">
                {settingsOpen ? (
                  <SettingsComponent onClose={() => setSettingsOpen(false)} />
                ) : documentEditorOpen ? (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <h1 className="text-2xl font-bold text-gray-900">새 문서 작성</h1>
                      <Button variant="outline" onClick={() => setDocumentEditorOpen(false)}>
                        돌아가기
                      </Button>
                    </div>
                    <RichTextEditor />
                  </div>
                ) : calendarOpen ? (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <h1 className="text-2xl font-bold text-gray-900">문서 발행 일정</h1>
                    </div>
                    <CalendarComponent
                      onCreateDocument={() => {
                        setDocumentEditorOpen(true)
                        setCalendarOpen(false)
                      }}
                    />
                  </div>
                ) : reportsOpen ? (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <h1 className="text-2xl font-bold text-gray-900">웹사이트 분석 보고서</h1>
                      <Button variant="outline" onClick={() => setReportsOpen(false)}>
                        돌아가기
                      </Button>
                    </div>
                    <Reports />
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">대시보드 콘텐츠</h1>
                    <p className="text-gray-600">
                      왼쪽 상단의 화살표 버튼을 클릭하여 사이드바를 접거나 펼칠 수 있습니다.
                    </p>
                    <p className="text-gray-600 mt-2">프로젝트 메뉴를 클릭하면 프로젝트 패널이 표시됩니다.</p>
                  </div>
                )}
                {/* 선택된 문서가 있을 때 DocumentViewer 컴포넌트 렌더링 */}
                {selectedDocument && (
                  <DocumentViewer document={selectedDocument} onClose={() => setSelectedDocument(null)} />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
