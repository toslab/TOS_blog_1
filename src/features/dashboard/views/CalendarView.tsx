"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from "@heroicons/react/20/solid"
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "../contexts/SidebarContext"
import ListItem from "./common/ListItem"

interface Day {
  date: string
  isCurrentMonth?: boolean
  isToday?: boolean
  isSelected?: boolean
  isInRange?: boolean
  isRangeStart?: boolean
  isRangeEnd?: boolean
  hasDocument?: boolean
}

interface Document {
  id: number
  title: string
  author: {
    name: string
    imageUrl: string
  }
  category: string
  publishDate: string
  publishDatetime: string
  status: "published" | "draft" | "scheduled"
}

const initialDays: Day[] = [
  { date: "2021-12-27" },
  { date: "2021-12-28" },
  { date: "2021-12-29" },
  { date: "2021-12-30" },
  { date: "2021-12-31" },
  { date: "2022-01-01", isCurrentMonth: true },
  { date: "2022-01-02", isCurrentMonth: true },
  { date: "2022-01-03", isCurrentMonth: true },
  { date: "2022-01-04", isCurrentMonth: true },
  { date: "2022-01-05", isCurrentMonth: true },
  { date: "2022-01-06", isCurrentMonth: true },
  { date: "2022-01-07", isCurrentMonth: true },
  { date: "2022-01-08", isCurrentMonth: true },
  { date: "2022-01-09", isCurrentMonth: true },
  { date: "2022-01-10", isCurrentMonth: true },
  { date: "2022-01-11", isCurrentMonth: true },
  { date: "2022-01-12", isCurrentMonth: true, isToday: true },
  { date: "2022-01-13", isCurrentMonth: true },
  { date: "2022-01-14", isCurrentMonth: true },
  { date: "2022-01-15", isCurrentMonth: true },
  { date: "2022-01-16", isCurrentMonth: true },
  { date: "2022-01-17", isCurrentMonth: true },
  { date: "2022-01-18", isCurrentMonth: true },
  { date: "2022-01-19", isCurrentMonth: true },
  { date: "2022-01-20", isCurrentMonth: true },
  { date: "2022-01-21", isCurrentMonth: true, isSelected: true, isRangeStart: true },
  { date: "2022-01-22", isCurrentMonth: true },
  { date: "2022-01-23", isCurrentMonth: true },
  { date: "2022-01-24", isCurrentMonth: true },
  { date: "2022-01-25", isCurrentMonth: true },
  { date: "2022-01-26", isCurrentMonth: true },
  { date: "2022-01-27", isCurrentMonth: true },
  { date: "2022-01-28", isCurrentMonth: true },
  { date: "2022-01-29", isCurrentMonth: true },
  { date: "2022-01-30", isCurrentMonth: true },
  { date: "2022-01-31", isCurrentMonth: true },
  { date: "2022-02-01" },
  { date: "2022-02-02" },
  { date: "2022-02-03" },
  { date: "2022-02-04" },
  { date: "2022-02-05" },
  { date: "2022-02-06" },
]

// 문서 데이터로 변경
const initialDocuments: Document[] = [
  {
    id: 1,
    title: "2022년 1분기 마케팅 전략",
    author: {
      name: "김민지",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    category: "마케팅",
    publishDate: "10:00 AM",
    publishDatetime: "2022-01-21T10:00",
    status: "published",
  },
  {
    id: 2,
    title: "신제품 출시 계획",
    author: {
      name: "박준호",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    category: "제품",
    publishDate: "2:00 PM",
    publishDatetime: "2022-01-21T14:00",
    status: "scheduled",
  },
  {
    id: 3,
    title: "사용자 피드백 분석 보고서",
    author: {
      name: "이지원",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    category: "연구",
    publishDate: "4:30 PM",
    publishDatetime: "2022-01-21T16:30",
    status: "draft",
  },
  {
    id: 4,
    title: "웹사이트 리디자인 제안서",
    author: {
      name: "최수진",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    category: "디자인",
    publishDate: "11:00 AM",
    publishDatetime: "2022-01-23T11:00",
    status: "published",
  },
  {
    id: 5,
    title: "2022년 예산 계획",
    author: {
      name: "정민준",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    category: "재무",
    publishDate: "3:00 PM",
    publishDatetime: "2022-01-25T15:00",
    status: "scheduled",
  },
]

// 날짜를 비교하는 유틸리티 함수
function isDateInRange(date: string, startDate: string | null, endDate: string | null): boolean {
  if (!startDate) return false
  if (!endDate) return date === startDate

  return date >= startDate && date <= endDate
}

// 날짜를 한글 형식으로 포맷팅하는 함수
function formatDateToKorean(dateString: string): string {
  return dateString.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1년 $2월 $3일")
}

interface CalendarProps {
  documents: {
    id: number
    title: string
    author: {
      name: string
      imageUrl: string
    }
    category: string
    publishDate: string
    publishDatetime: string
    status: "published" | "draft" | "scheduled"
  }[];
  onCreateDocument?: () => void
}

export default function Calendar({ documents: initialDocsFromProps, onCreateDocument }: CalendarProps) {
  const { isMobileView } = useSidebar()
  const [days, setDays] = useState<Day[]>(initialDays)
  const [documents, setDocuments] = useState<Document[]>(initialDocsFromProps || initialDocuments)
  const [startDate, setStartDate] = useState<string | null>("2022-01-21")
  const [endDate, setEndDate] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState("January 2022")
  const [selectionMode, setSelectionMode] = useState<"start" | "end">("start")
  const [documentDates, setDocumentDates] = useState<string[]>([])

  // 문서 날짜 추출 및 저장
  useEffect(() => {
    // 각 문서의 발행 날짜 추출
    const dates = documents.map((doc) => doc.publishDatetime.split("T")[0])
    // 중복 제거
    const uniqueDates = [...new Set(dates)]
    setDocumentDates(uniqueDates)

    // 초기 문서 표시 설정
    const updatedDays = days.map((day) => ({
      ...day,
      hasDocument: uniqueDates.includes(day.date),
    }))
    setDays(updatedDays)
  }, [documents, days])

  // 날짜 범위 내의 문서만 필터링
  const filteredDocuments = documents.filter((doc) => {
    if (!startDate) return false
    if (!endDate) return doc.publishDatetime.startsWith(startDate)

    const docDate = doc.publishDatetime.split("T")[0]
    return docDate >= startDate && docDate <= endDate
  })

  // 날짜 선택 처리
  const handleDateSelect = (day: Day) => {
    if (selectionMode === "start") {
      // 시작일 선택 모드
      setStartDate(day.date)
      setEndDate(null)
      setSelectionMode("end")
    } else {
      // 종료일 선택 모드
      if (startDate && day.date < startDate) {
        // 선택한 날짜가 시작일보다 이전이면 시작일로 설정하고 종료일은 null로
        setStartDate(day.date)
        setEndDate(null)
      } else {
        // 종료일 설정
        setEndDate(day.date)
        setSelectionMode("start") // 다음 선택은 새로운 시작일
      }
    }
  }

  // 날짜 범위 표시 업데이트
  useEffect(() => {
    const updatedDays = days.map((day) => {
      const isRangeStart = day.date === startDate
      const isRangeEnd = day.date === endDate
      const isInRange = isDateInRange(day.date, startDate, endDate)
      const hasDoc = documentDates.includes(day.date)

      return {
        ...day,
        isSelected: isRangeStart || isRangeEnd,
        isInRange,
        isRangeStart,
        isRangeEnd,
        hasDocument: hasDoc,
      }
    })

    setDays(updatedDays)
  }, [startDate, endDate, documentDates, days])

  // 문서 상태에 따른 배지 색상 설정
  const getStatusBadgeClass = (status: Document["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  // 문서 상태 한글 표시
  const getStatusText = (status: Document["status"]) => {
    switch (status) {
      case "published":
        return "발행됨"
      case "scheduled":
        return "예약됨"
      case "draft":
        return "임시저장"
      default:
        return ""
    }
  }

  // 선택된 날짜 범위 텍스트
  const getSelectedDateRangeText = () => {
    if (!startDate) return ""
    if (!endDate) return formatDateToKorean(startDate)
    return `${formatDateToKorean(startDate)} - ${formatDateToKorean(endDate)}`
  }

  // 날짜 범위 선택 초기화
  const resetDateRange = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectionMode("start")
  }

  // 발행 문서 목록을 ListItem으로 표시하기 위한 데이터 변환
  const documentListItems = filteredDocuments.map(doc => ({
    id: `cal-doc-${doc.id}`,
    name: doc.title,
    type: 'link' as const,
    description: `${doc.category} | ${doc.author.name} | ${doc.publishDate}`,
    badgeCount: doc.status === 'published' ? undefined : (doc.status === 'scheduled' ? 1 : 0),
    statusText: getStatusText(doc.status),
    statusClass: getStatusBadgeClass(doc.status),
    imageUrl: doc.author.imageUrl,
  }));

  return (
    <div 
      className={cn(
        "h-full overflow-y-auto bg-panel-background rounded-xl shadow-panel",
        isMobileView ? "p-4" : "p-panel-padding-x lg:p-panel-padding-y"
      )}
    >
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-border">
        <div className="md:pr-6 lg:pr-8">
          <div className="flex items-center">
            <h2 className="flex-auto text-lg font-semibold text-text-primary">{currentMonth}</h2>
            <button
              type="button"
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-icon-color hover:text-text-primary rounded-md hover:bg-hover-bg-light"
            >
              <span className="sr-only">이전 달</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="-my-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-icon-color hover:text-text-primary rounded-md hover:bg-hover-bg-light"
            >
              <span className="sr-only">다음 달</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 text-xs text-text-muted flex justify-between items-center">
            <div>{selectionMode === "start" ? "시작일을 선택하세요" : "종료일을 선택하세요"}</div>
            {(startDate || endDate) && (
              <button onClick={resetDateRange} className="text-xs text-primary hover:text-primary/80">
                선택 초기화
              </button>
            )}
          </div>

          <div className={cn("mt-4 grid grid-cols-7 text-center text-xs text-text-secondary")}>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
            <div>일</div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-sm">
            {days.map((day, dayIdx) => (
              <div key={day.date} className={cn(dayIdx > 6 && "border-t border-border", "py-1.5")}>
                <div className="relative mx-auto w-9 h-9">
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      day.isSelected && "text-active-item-foreground font-semibold",
                      !day.isSelected && day.isInRange && "bg-active-item-background/20 text-primary",
                      !day.isSelected && !day.isInRange && day.isToday && "text-primary font-semibold",
                      !day.isSelected && !day.isInRange && !day.isToday && day.isCurrentMonth && "text-text-primary",
                      !day.isSelected && !day.isInRange && !day.isToday && !day.isCurrentMonth && "text-text-muted",
                      day.isRangeStart && "bg-primary text-primary-foreground",
                      day.isRangeEnd && "bg-primary text-primary-foreground",
                      !day.isSelected && "hover:bg-hover-bg-light",
                      "w-full h-full flex items-center justify-center rounded-full transition-colors duration-150",
                      day.isRangeStart && !day.isRangeEnd && "rounded-r-none",
                      day.isRangeEnd && !day.isRangeStart && "rounded-l-none",
                      day.isInRange && !day.isRangeStart && !day.isRangeEnd && "rounded-none",
                    )}
                  >
                    <time dateTime={day.date}>{day.date.split("-").pop()?.replace(/^0/, "")}</time>
                  </button>
                  {day.hasDocument && (
                    <div
                      className={cn(
                        "absolute left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full z-10",
                        day.isSelected ? "bg-active-item-foreground" : "bg-primary",
                        isMobileView ? "top-1" : "top-0.5"
                      )}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <section className="mt-8 md:mt-0 md:pl-6 lg:pl-8">
          <h2 className="text-base font-semibold text-text-primary">
            발행 문서: <span className="text-primary">{getSelectedDateRangeText()}</span>
          </h2>
          {documentListItems.length > 0 ? (
            <ul className="mt-4 space-y-1">
              {documentListItems.map((docItem) => (
                <ListItem
                  key={docItem.id}
                  id={docItem.id}
                  name={docItem.name}
                  type={docItem.type}
                  description={docItem.description}
                  badgeCount={docItem.badgeCount}
                  statusText={docItem.statusText}
                  statusClass={docItem.statusClass}
                  imageUrl={docItem.imageUrl}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-text-muted text-center">선택한 기간에 발행된 문서가 없습니다.</p>
          )}
          
          {onCreateDocument && (
            <div className="mt-6">
              <button
                type="button"
                onClick={onCreateDocument}
                className="w-full flex items-center justify-center gap-x-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <PlusCircleIcon className="h-5 w-5" />
                새 문서 작성
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
