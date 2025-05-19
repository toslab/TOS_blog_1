"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Editor } from "@tiptap/react"
import {
  Heading1,
  Heading2,
  Heading3,
  Code,
  ListOrdered,
  List,
  Quote,
  Table,
  ImageIcon,
  ActivityIcon as Function,
  CheckSquare,
  Minus,
} from "lucide-react"

type CommandItem = {
  title: string
  description: string
  icon: React.ReactNode
  command: (editor: Editor) => void
}

type SlashCommandsProps = {
  editor: Editor
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  command: string
  onSelect?: (command: (editor: Editor) => void) => void
}

export default function SlashCommands({ editor, isOpen, setIsOpen, command, onSelect }: SlashCommandsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const commandListRef = useRef<HTMLDivElement>(null)
  const selectedItemRef = useRef<HTMLDivElement>(null)

  const filteredCommands = commands.filter((item) =>
    item.title.toLowerCase().includes(command.toLowerCase().replace("/", "")),
  )

  const selectItem = useCallback(
    (index: number) => {
      const item = filteredCommands[index]
      if (item) {
        if (onSelect) {
          onSelect(item.command)
        } else {
          item.command(editor)
        }
        setIsOpen(false)
      }
    },
    [filteredCommands, editor, setIsOpen, onSelect],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Prevent default behavior for arrow keys and enter
      if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault()
      }

      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1))
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0))
      } else if (e.key === "Enter") {
        selectItem(selectedIndex)
      } else if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, selectedIndex, filteredCommands.length, selectItem, setIsOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current && commandListRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [selectedIndex])

  // 명령어 목록 초기화 시 선택 인덱스 리셋
  useEffect(() => {
    setSelectedIndex(0)
  }, [command])

  if (!isOpen) return null

  return (
    <div
      role="menu"
      aria-label="슬래시 명령어 메뉴"
      aria-orientation="vertical"
      className="w-full"
    >
      <div className="p-2 border-b border-[hsl(var(--border))]">
        <h3 className="text-xs font-medium text-[hsl(var(--foreground))]">기본 블록</h3>
      </div>
      <div className="max-h-60 overflow-y-auto py-1" ref={commandListRef}>
        {filteredCommands.length > 0 ? (
          filteredCommands.map((item, index) => (
            <div
              key={item.title}
              ref={index === selectedIndex ? selectedItemRef : null}
              role="menuitem"
              tabIndex={index === selectedIndex ? 0 : -1}
              className={`slash-command-item ${
                index === selectedIndex ? "is-selected" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation()
                selectItem(index)
              }}
            >
              <div className="icon">
                {item.icon}
              </div>
              <div className="text">
                <div className="title">{item.title}</div>
                <div className="description">{item.description}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))]">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  )
}

const commands: CommandItem[] = [
  {
    title: "제목 1",
    description: "문서의 주요 제목으로 사용",
    icon: <Heading1 className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run()
    },
  },
  {
    title: "제목 2",
    description: "섹션 제목으로 사용",
    icon: <Heading2 className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
  },
  {
    title: "제목 3",
    description: "하위 섹션 제목으로 사용",
    icon: <Heading3 className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run()
    },
  },
  {
    title: "글머리 기호 목록",
    description: "순서가 없는 항목 목록",
    icon: <List className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleBulletList().run()
    },
  },
  {
    title: "번호 매기기 목록",
    description: "순서가 있는 항목 목록",
    icon: <ListOrdered className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run()
    },
  },
  {
    title: "코드 블록",
    description: "프로그래밍 코드 표시",
    icon: <Code className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleCodeBlock().run()
    },
  },
  {
    title: "인용구",
    description: "다른 출처의 텍스트 인용",
    icon: <Quote className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleBlockquote().run()
    },
  },
  {
    title: "표",
    description: "행과 열이 있는 데이터 표",
    icon: <Table className="w-4 h-4" />,
    command: (editor: Editor) => {
      // 테이블 삽입 명령 수정
      editor
        .chain()
        .focus()
        .insertContent({
          type: "table",
          content: [
            {
              type: "tableRow",
              content: [
                {
                  type: "tableHeader",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "제목 1" }] }],
                },
                {
                  type: "tableHeader",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "제목 2" }] }],
                },
                {
                  type: "tableHeader",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "제목 3" }] }],
                },
              ],
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "내용 1" }] }],
                },
                {
                  type: "tableCell",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "내용 2" }] }],
                },
                {
                  type: "tableCell",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "내용 3" }] }],
                },
              ],
            },
            {
              type: "tableRow",
              content: [
                {
                  type: "tableCell",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "내용 4" }] }],
                },
                {
                  type: "tableCell",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "내용 5" }] }],
                },
                {
                  type: "tableCell",
                  content: [{ type: "paragraph", content: [{ type: "text", text: "내용 6" }] }],
                },
              ],
            },
          ],
        })
        .run()
    },
  },
  {
    title: "이미지",
    description: "문서에 이미지 추가",
    icon: <ImageIcon className="w-4 h-4" />,
    command: (editor: Editor) => {
      const url = prompt("이미지 URL을 입력하세요:")
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },
  {
    title: "수식",
    description: "수학 수식 입력",
    icon: <Function className="w-4 h-4" />,
    command: (editor: Editor) => {
      // 실제로는 수식 입력을 위한 별도의 처리가 필요합니다
      editor.chain().focus().insertContent("$$수식을 입력하세요$$").run()
    },
  },
  {
    title: "체크리스트",
    description: "할 일 목록 만들기",
    icon: <CheckSquare className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().toggleTaskList().run()
    },
  },
  {
    title: "구분선",
    description: "내용 사이에 가로선 추가",
    icon: <Minus className="w-4 h-4" />,
    command: (editor: Editor) => {
      editor.chain().focus().setHorizontalRule().run()
    },
  },
]
