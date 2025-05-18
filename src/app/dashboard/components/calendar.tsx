"use client"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

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
  onCreateDocument?: () => void
}

export default function Calendar({ onCreateDocument }: CalendarProps) {
  const [days, setDays] = useState<Day[]>(initialDays)
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
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
  }, [documents])

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
  }, [startDate, endDate, documentDates])

  // 문서 상태에 따른 배지 색상 설정
  const getStatusBadgeClass = (status: Document["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="md:pr-14">
          <div className="flex items-center">
            <h2 className="flex-auto text-sm font-semibold text-gray-900">{currentMonth}</h2>
            <button
              type="button"
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">이전 달</span>
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">다음 달</span>
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* 날짜 범위 선택 안내 */}
          <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
            <div>{selectionMode === "start" ? "시작일을 선택하세요" : "종료일을 선택하세요"}</div>
            {(startDate || endDate) && (
              <button onClick={resetDateRange} className="text-xs text-indigo-600 hover:text-indigo-800">
                선택 초기화
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-7 text-center text-xs/6 text-gray-500">
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
              <div key={day.date} className={classNames(dayIdx > 6 && "border-t border-gray-200", "py-2")}>
                <div className="relative mx-auto w-8 h-8">
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={classNames(
                      // 시작일 또는 종료일인 경우
                      day.isSelected && "text-white font-semibold",
                      // 범위 내 날짜인 경우 (시작일과 종료일 제외)
                      !day.isSelected && day.isInRange && "bg-indigo-100 text-indigo-800",
                      // 오늘 날짜인 경우
                      !day.isSelected && !day.isInRange && day.isToday && "text-indigo-600 font-semibold",
                      // 현재 월의 날짜인 경우
                      !day.isSelected && !day.isInRange && !day.isToday && day.isCurrentMonth && "text-gray-900",
                      // 다른 월의 날짜인 경우
                      !day.isSelected && !day.isInRange && !day.isToday && !day.isCurrentMonth && "text-gray-400",
                      // 시작일 배경색
                      day.isRangeStart && "bg-indigo-600",
                      // 종료일 배경색
                      day.isRangeEnd && "bg-indigo-600",
                      // 호버 효과
                      !day.isSelected && "hover:bg-gray-200",
                      "w-full h-full flex items-center justify-center rounded-full",
                      // 범위 내 날짜의 좌우 모서리 처리
                      day.isRangeStart && !day.isRangeEnd && "rounded-r-none",
                      day.isRangeEnd && !day.isRangeStart && "rounded-l-none",
                      day.isInRange && !day.isRangeStart && !day.isRangeEnd && "rounded-none",
                    )}
                  >
                    <time dateTime={day.date}>{day.date.split("-").pop().replace(/^0/, "")}</time>
                  </button>
                  {day.hasDocument && (
                    <div
                      style={{ top: "0.12rem" }}
                      className={classNames(
                        "absolute left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full z-10",
                        day.isSelected ? "bg-white" : "bg-indigo-600",
                      )}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <section className="mt-12 md:mt-0 md:pl-14">
          <h2 className="text-base font-semibold text-gray-900">
            발행 문서: <span className="text-indigo-600">{getSelectedDateRangeText()}</span>
          </h2>
          <ol className="mt-4 flex flex-col gap-y-1 text-sm/6 text-gray-500">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <li
                  key={doc.id}
                  className="group flex items-center gap-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100"
                >
                  <img
                    src={doc.author.imageUrl || "/placeholder.svg"}
                    alt=""
                    className="size-10 flex-none rounded-full"
                  />
                  <div className="flex-auto">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900">{doc.title}</p>
                      <span
                        className={classNames(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          getStatusBadgeClass(doc.status),
                        )}
                      >
                        {getStatusText(doc.status)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs text-gray-500">{doc.category}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <time dateTime={doc.publishDatetime} className="text-xs text-gray-500">
                        {doc.publishDatetime.split("T")[0].replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")}{" "}
                        {doc.publishDate}
                      </time>
                    </div>
                  </div>
                  <Menu as="div" className="relative opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                    <div>
                      <MenuButton className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">옵션 열기</span>
                        <EllipsisVerticalIcon className="size-6" aria-hidden="true" />
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900"
                          >
                            문서 보기
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900"
                          >
                            편집
                          </a>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </li>
              ))
            ) : (
              <li className="py-4 text-center text-gray-500">선택한 기간에 발행된 문서가 없습니다.</li>
            )}
          </ol>
          <div className="mt-6">
            <button
              type="button"
              onClick={onCreateDocument}
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              새 문서 작성
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
