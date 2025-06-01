"use client"
import { useState, useEffect } from "react"
import {
  Settings,
  X,
  Search,
  CalendarIcon,
  FileText,
  BarChart3,
  Plus,
  Archive,
  LogOut,
  MenuIcon,
  ChevronDown,
  MoreVertical,
  PanelLeftOpen,
  PanelLeftClose,
  Bell,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent } from "../../../../components/ui/dialog"
import SettingsComponent from "./settings"
import CalendarComponent from "./calendar"
import RichTextEditor from "./rich-text-editor"

// 네비게이션 아이콘 수정
const navigation = [
  { name: "Calendar", href: "#", icon: CalendarIcon, current: true },
  { name: "Documents", href: "#", icon: FileText, current: false, hasPanel: true },
  { name: "Reports", href: "#", icon: BarChart3, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface Document {
  id: number;
  title: string;
  category: string;
  author: string;
  lastUpdated: string;
  content: string;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // 사이드바 상태 저장을 위한 로컬 스토리지 키 추가
  const SIDEBAR_STATE_KEY = "dashboard_sidebar_collapsed"

  // useState 초기값을 로컬 스토리지에서 가져오도록 수정
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(SIDEBAR_STATE_KEY)
      return savedState ? JSON.parse(savedState) : false
    }
    return false
  })
  const [activeNavItem, setActiveNavItem] = useState("Calendar")
  const [projectPanelOpen, setProjectPanelOpen] = useState(false)
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [documentEditorOpen, setDocumentEditorOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [documentArchiveOpen, setDocumentArchiveOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // 문서 데이터 정의
  const documents: Document[] = [
    {
      id: 1,
      title: "Initial Draft",
      category: "Blog Post",
      author: "John Doe",
      lastUpdated: "2023-01-15",
      content: "This is the content of the initial draft.",
    },
    {
      id: 2,
      title: "Marketing Plan",
      category: "Strategy",
      author: "Jane Smith",
      lastUpdated: "2023-02-20",
      content: "This is the content of the marketing plan.",
    },
    {
      id: 3,
      title: "Project Proposal",
      category: "Proposals",
      author: "Mike Johnson",
      lastUpdated: "2023-03-10",
      content: "This is the content of the project proposal.",
    },
  ]

  // toggleSidebar 함수 수정하여 로컬 스토리지에 상태 저장
  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(newState))
    }
  }

  // 모바일 화면에서 사이드바 자동으로 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [sidebarOpen])

  const handleNavItemClick = (item: typeof navigation[0]) => {
    setActiveNavItem(item.name)
    if (item.hasPanel) {
      if (item.name === "Documents") {
        setDocumentPanelOpen(!documentPanelOpen)
        setProjectPanelOpen(false)
      } else if (item.name === "Projects") {
        setProjectPanelOpen(!projectPanelOpen)
        setDocumentPanelOpen(false)
      }
    } else {
      setProjectPanelOpen(false)
      setDocumentPanelOpen(false)

      // 해당 메뉴에 맞는 콘텐츠 표시
      if (item.name === "Calendar") {
        setCalendarOpen(true)
        setReportsOpen(false)
        setSettingsOpen(false)
        setDocumentEditorOpen(false)
      } else if (item.name === "Reports") {
        setReportsOpen(true)
        setCalendarOpen(false)
        setSettingsOpen(false)
        setDocumentEditorOpen(false)
      }
    }
  }

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
    setDocumentArchiveOpen(false)
  }

  const filteredDocuments = documents.filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // 사이드바 너비 변수 수정
  const sidebarWidth = collapsed ? "4.5rem" : "16rem"
  const projectPanelWidth = "22.4rem"

  // 문서 에디터 대체 컴포넌트

  return (
    <>
      <div>
        {/* 모바일 사이드바 */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-1">
              <div className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                    <span className="sr-only">Close sidebar</span>
                    <X className="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pt-10 pb-4">
                  <div className="flex h-2 shrink-0 items-center">{/* 로고 제거됨, 마진 유지 */}</div>
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
                                    ? "bg-selected-item-bg text-selected-item-text"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                  item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                                    ? "bg-sidebar-accent text-sidebar-foreground"
                                    : "",
                                  "group flex items-center rounded-xl p-3 text-sm/6 font-medium transition-all duration-200 gap-x-5",
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    activeNavItem === item.name
                                      ? "text-selected-item-text"
                                      : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                                    item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                                      ? "text-sidebar-foreground"
                                      : "",
                                    "size-5 shrink-0",
                                  )}
                                />
                                <span className="truncate">{item.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <a
                          href="#"
                          className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                          onClick={(e) => {
                            e.preventDefault()
                            setSettingsOpen(true)
                            setSidebarOpen(false)
                          }}
                        >
                          <Settings
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 데스크톱 사이드바 */}
        <div
          className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300"
          style={{ width: sidebarWidth }}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-2 overflow-y-auto border-r border-gray-100 bg-sidebar-background pb-4 pt-10 rounded-r-3xl relative shadow-lg z-20">
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
                              ? "bg-selected-item-bg text-selected-item-text"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                            item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                              ? "bg-sidebar-accent text-sidebar-foreground"
                              : "",
                            "group flex items-center rounded-xl p-3 text-sm/6 font-medium transition-all duration-200",
                            collapsed ? "justify-center px-3" : "gap-x-5",
                          )}
                        >
                          <item.icon
                            className={classNames(
                              activeNavItem === item.name
                                ? "text-selected-item-text"
                                : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                              item.hasPanel && (item.name === "Documents" ? documentPanelOpen : projectPanelOpen)
                                ? "text-sidebar-foreground"
                                : "",
                              "size-5 shrink-0",
                            )}
                          />
                          {!collapsed && <span className="truncate">{item.name}</span>}
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
                      setReportsOpen(false)
                    }}
                    className={classNames(
                      "group flex items-center rounded-xl p-3 text-sm/6 font-medium text-sidebar-foreground hover:bg-sidebar-accent",
                      collapsed ? "justify-center px-3" : "gap-x-5",
                    )}
                  >
                    <Settings
                      aria-hidden="true"
                      className="size-5 shrink-0 text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                    />
                    {!collapsed && <span className="truncate">Settings</span>}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* 토글 버튼 - 대시보드와 콘텐츠 사이에 위치 */}
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] hidden lg:block transition-all duration-300"
          style={{ left: collapsed ? "3.5rem" : "15rem" }}
        >
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5 text-gray-700" />
            ) : (
              <PanelLeftClose className="size-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* 문서 패널 */}
        {documentPanelOpen && (
          <div
            className="hidden lg:block border-r border-gray-100 bg-white overflow-y-auto h-screen fixed top-0 z-50 transition-all duration-300"
            style={{ left: sidebarWidth, width: projectPanelWidth }}
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
                    setReportsOpen(false)
                    setDocumentPanelOpen(false)
                  }}
                  className="flex-1 rounded-xl bg-black px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <Plus className="size-4" />새 문서 작성
                </button>
                <button
                  type="button"
                  onClick={() => setDocumentArchiveOpen(true)}
                  className="flex-1 rounded-xl bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Archive className="size-4" />
                  아카이브
                </button>
              </div>

              {/* Recent Documents */}
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-500 mb-2">최근 문서</h3>
                <div className="grid grid-cols-1 gap-3">
                  {documents.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="group rounded-xl border border-gray-100 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedDocument(doc)
                        setDocumentPanelOpen(false)
                      }}
                    >
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-black truncate">{doc.title}</h3>
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                        <span>{doc.category}</span>
                        <span>{doc.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 문서 아카이브 다이얼로그 */}
        <Dialog open={documentArchiveOpen} onOpenChange={setDocumentArchiveOpen}>
          <DialogContent className="max-w-4xl w-full max-h-[80vh] flex flex-col rounded-2xl">
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
                  className="block w-full rounded-xl border-0 py-2 pl-10 text-sm text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black"
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
                      className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black truncate">
                          {doc.title}
                        </h3>
                        <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                          {doc.category}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{doc.author}</span>
                        <span>{doc.lastUpdated}</span>
                      </div>
                      <div className="relative opacity-0 group-hover:opacity-100 focus-within:opacity-100 mt-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                            <span className="sr-only">옵션 열기</span>
                            <MoreVertical className="size-6" aria-hidden="true" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem className="cursor-pointer">문서 보기</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">편집</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

        {/* 문서 패널이 열릴 때 나타나는 오버레이 */}
        {documentPanelOpen && (
          <div className="fixed inset-0 bg-gray-500/3 z-45 hidden lg:block" style={{ pointerEvents: "none" }} />
        )}

        {/* 메인 콘텐츠 영역 */}
        <div
          className={`flex-1 overflow-y-auto bg-background z-30 relative transition-all duration-300 ${
            documentPanelOpen ? "after:absolute after:inset-0 after:bg-gray-500/3 after:z-40" : ""
          }`}
          style={{ marginLeft: typeof window !== "undefined" && window.innerWidth > 1024 ? sidebarWidth : 0 }}
        >
          {/* 콘텐츠 영역 내 Header 추가 */}
          <header className="sticky top-0 z-30 bg-background border-b border-gray-100 shadow-xs">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon aria-hidden="true" className="size-6" />
              </button>

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form action="#" method="GET" className="relative flex items-center w-[32rem] max-w-full">
                  <input
                    name="search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    className="h-10 w-full bg-white pl-10 pr-4 text-sm text-gray-900 outline-hidden placeholder:text-gray-400 rounded-full border border-gray-200"
                  />
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                  />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto mr-2.5">
                  <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    <Bell aria-hidden="true" className="size-6" />
                  </button>

                  {/* Separator */}
                  <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                  {/* Profile dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full bg-gray-50"
                      />
                      <span className="hidden lg:flex lg:items-center pointer-events-none">
                        <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900">
                          Tom Cook
                        </span>
                        <ChevronDown aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl w-48 z-[100] shadow-lg border border-gray-200"
                    >
                      <DropdownMenuItem
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSettingsOpen(true)
                          setDocumentEditorOpen(false)
                          setCalendarOpen(false)
                          setReportsOpen(false)
                        }}
                      >
                        <Settings className="size-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <LogOut className="size-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          <div className="py-10 px-4 sm:px-6 lg:px-8">
            {settingsOpen ? (
              <div key="settings">
                <SettingsComponent onClose={() => setSettingsOpen(false)} />
              </div>
            ) : documentEditorOpen ? (
              <div key="document-editor">
                <div className="mb-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">새 문서 작성</h1>
                  <Button variant="outline" onClick={() => setDocumentEditorOpen(false)} className="rounded-xl">
                    돌아가기
                  </Button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <RichTextEditor />
                </div>
              </div>
            ) : calendarOpen ? (
              <div key="calendar">
                <div className="mb-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">문서 발행 일정</h1>
                  <Button variant="outline" onClick={() => setCalendarOpen(false)} className="rounded-xl">
                    돌아가기
                  </Button>
                </div>
                <CalendarComponent
                  documents={documents.map((doc) => ({
                    id: doc.id,
                    title: doc.title,
                    author: {
                      name: doc.author,
                      imageUrl:
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    },
                    category: doc.category,
                    publishDatetime: `${doc.lastUpdated}T12:00:00`,
                    publishDate: doc.lastUpdated,
                    status: "published",
                  }))}
                  onCreateDocument={() => {
                    setDocumentEditorOpen(true)
                    setCalendarOpen(false)
                  }}
                />
              </div>
            ) : reportsOpen ? (
              <div key="reports">
                <div className="mb-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">웹사이트 분석 보고서</h1>
                  <Button variant="outline" onClick={() => setReportsOpen(false)} className="rounded-xl">
                    돌아가기
                  </Button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <p>보고서가 여기에 표시됩니다.</p>
                </div>
              </div>
            ) : (
              <div key="dashboard">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">대시보드 콘텐츠</h1>
                  <p className="text-gray-600">
                    왼쪽 상단의 화살표 버튼을 클릭하여 사이드바를 접거나 펼칠 수 있습니다.
                  </p>
                  <p className="text-gray-600 mt-2">프로젝트 메뉴를 클릭하면 프로젝트 패널이 표시됩니다.</p>
                </div>
              </div>
            )}

            {/* 선택된 문서가 있을 때 DocumentViewer 컴포넌트 렌더링 */}
            {selectedDocument && (
              <div className="mt-4 bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{selectedDocument.title}</h2>
                  <Button variant="outline" onClick={() => setSelectedDocument(null)} className="rounded-xl">
                    닫기
                  </Button>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">작성자: {selectedDocument.author}</span>
                  <span>마지막 수정: {selectedDocument.lastUpdated}</span>
                </div>
                <div className="prose max-w-none">
                  <p>{selectedDocument.content}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 