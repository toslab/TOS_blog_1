"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Underline from "@tiptap/extension-underline"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Image from "@tiptap/extension-image"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Youtube from "@tiptap/extension-youtube"
import TextAlign from "@tiptap/extension-text-align"
import { Button } from "@/components/Button"
import {
  Bold,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  UnderlineIcon,
  Strikethrough,
  Save,
  Send,
  Code,
  Palette,
  ImageIcon,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eye,
  Edit,
} from "lucide-react"
import SlashCommands from "./slash-commands"
import { Textarea } from "@/components/dashboard_UI/textarea"
import { turndownService } from "@/app/dashboard/utils/markdown"
import { marked } from "marked"

// 색상 목록 정의 추가
const COLORS = [
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#b7b7b7",
  "#cccccc",
  "#d9d9d9",
  "#efefef",
  "#f3f3f3",
  "#ffffff",
  "#980000",
  "#ff0000",
  "#ff9900",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#4a86e8",
  "#0000ff",
  "#9900ff",
  "#ff00ff",
  "#e6b8af",
  "#f4cccc",
  "#fce5cd",
  "#fff2cc",
  "#d9ead3",
  "#d0e0e3",
  "#c9daf8",
  "#cfe2f3",
  "#d9d2e9",
  "#ead1dc",
]

export default function RichTextEditor() {
  const [title, setTitle] = useState("제목 없음")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "published">("idle")
  const [slashCommandOpen, setSlashCommandOpen] = useState(false)
  const [slashCommand, setSlashCommand] = useState("")
  const [slashCommandPosition, setSlashCommandPosition] = useState({ top: 0, left: 0 })
  const [slashCommandStartPos, setSlashCommandStartPos] = useState(0)
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [markdownContent, setMarkdownContent] = useState("")
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [markdownView, setMarkdownView] = useState<"edit" | "preview">("edit")

  const editorRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "내용을 입력하세요... 또는 '/'를 입력하여 명령어를 사용하세요",
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      TextStyle,
      Color,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      // 테이블 관련 확장 추가
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      // YouTube 비디오 확장 추가
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      // 텍스트 정렬 확장 추가
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    autofocus: true, // 자동으로 에디터에 포커스
    onUpdate: ({ editor }) => {
      // 현재 커서 위치의 텍스트 확인
      const { from, to } = editor.state.selection
      const text = editor.state.doc.textBetween(
        Math.max(0, from - 10), // 최대 10자 앞까지 확인
        from,
        " ",
      )

      // Markdown 모드가 아닐 때만 슬래시 명령어 감지
      if (!isMarkdownMode) {
        // 슬래시 명령어 감지
        const slashIndex = text.lastIndexOf("/")
        if (slashIndex > -1) {
          const command = text.slice(slashIndex)
          if (command === "/" || command.startsWith("/")) {
            // 슬래시 위치 계산
            const slashPos = from - (command.length - slashIndex)
            setSlashCommandStartPos(slashPos)

            // 슬래시 명령어 설정
            setSlashCommand(command)
            setSlashCommandOpen(true)

            // 슬래시 위치의 좌표 계산
            setTimeout(() => {
              if (editor && editorRef.current) {
                const coords = editor.view.coordsAtPos(slashPos)
                const editorRect = editorRef.current.getBoundingClientRect()

                // 에디터 컨테이너 기준으로 상대적인 위치 계산
                // top 값에 20px 추가하여 슬래시 문자 아래에 표시
                setSlashCommandPosition({
                  top: coords.top - editorRect.top + editorRef.current.scrollTop + 20,
                  left: coords.left - editorRect.left + editorRef.current.scrollLeft,
                })
              }
            }, 0)
          }
        } else {
          // 슬래시가 없는 경우 메뉴 닫기
          setSlashCommandOpen(false)
        }
      }
    },
  })

  // 에디터 내용이 변경될 때 Markdown 내용 업데이트
  useEffect(() => {
    if (editor && isMarkdownMode) {
      const html = editor.getHTML()
      const markdown = turndownService.turndown(html)
      setMarkdownContent(markdown)
    }
  }, [editor, isMarkdownMode])

  // Markdown 모드 전환
  const toggleMarkdownMode = useCallback(() => {
    if (editor) {
      if (!isMarkdownMode) {
        // Rich Text -> Markdown 모드로 전환
        const html = editor.getHTML()
        const markdown = turndownService.turndown(html)
        setMarkdownContent(markdown)
        setMarkdownView("edit")
      } else {
        // Markdown -> Rich Text 모드로 전환
        try {
          const html = marked(markdownContent)
          editor.commands.setContent(html)
        } catch (error) {
          console.error("마크다운 변환 오류:", error)
        }
      }
      setIsMarkdownMode(!isMarkdownMode)
    }
  }, [editor, isMarkdownMode, markdownContent])

  // Markdown 내용이 변경될 때 처리
  const handleMarkdownChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value)
  }, [])

  // 컴포넌트 마운트 시 에디터에 포커스
  useEffect(() => {
    if (editor && !editor.isFocused && !isMarkdownMode) {
      editor.commands.focus()
    }
  }, [editor, isMarkdownMode])

  // 에디터가 마운트될 때마다 포커스 유지
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor && !editor.isFocused && document.activeElement !== document.body && !isMarkdownMode) {
        editor.commands.focus()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [editor, isMarkdownMode])

  // 색상 선택기 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerOpen && colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setColorPickerOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [colorPickerOpen])

  // 슬래시 명령어 메뉴 닫기 이벤트
  useEffect(() => {
    const handleClickOutside = () => {
      setSlashCommandOpen(false)
    }

    if (slashCommandOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [slashCommandOpen])

  const handleSave = useCallback(() => {
    if (!editor) return

    setSaveStatus("saving")

    // 현재 에디터 내용 가져오기
    const content = isMarkdownMode ? markdownContent : editor.getHTML()

    // 저장 로직 (실제로는 API 호출 등이 들어갈 수 있음)
    setTimeout(() => {
      // 저장 완료 상태로 변경
      setSaveStatus("saved")

      // 2초 후 상태 초기화
      setTimeout(() => {
        setSaveStatus("idle")
      }, 2000)
    }, 500)
  }, [editor, isMarkdownMode, markdownContent])

  const handlePublish = useCallback(() => {
    if (!editor) return

    setPublishStatus("publishing")

    // 현재 에디터 내용 가져오기
    const content = isMarkdownMode ? markdownContent : editor.getHTML()

    // 발행 로직 (실제로는 API 호출 등이 들어갈 수 있음)
    setTimeout(() => {
      // 발행 완료 상태로 변경
      setPublishStatus("published")

      // 2초 후 상태 초기화
      setTimeout(() => {
        setPublishStatus("idle")
      }, 2000)
    }, 1000)
  }, [editor, isMarkdownMode, markdownContent])

  // 슬래시 명령어 선택 시 처리
  const handleSlashCommandSelect = useCallback(
    (command: (editor: any) => void) => {
      if (!editor) return

      // 슬래시 명령어 텍스트 제거
      if (slashCommandStartPos) {
        editor
          .chain()
          .focus()
          .deleteRange({
            from: slashCommandStartPos,
            to: slashCommandStartPos + slashCommand.length,
          })
          .run()
      }

      // 선택된 명령 실행
      command(editor)
      setSlashCommandOpen(false)

      // 명령 실행 후 에디터에 포커스 유지
      setTimeout(() => {
        editor.commands.focus()
      }, 10)
    },
    [editor, slashCommand, slashCommandStartPos],
  )

  // 에디터 클릭 시 포커스 유지
  const handleEditorClick = useCallback(() => {
    if (editor && !editor.isFocused && !isMarkdownMode) {
      editor.commands.focus()
    }
  }, [editor, isMarkdownMode])

  // 색상 선택기 토글
  const toggleColorPicker = useCallback(() => {
    setColorPickerOpen((prev) => !prev)
  }, [])

  // 색상 적용 함수
  const applyColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run()
        setColorPickerOpen(false)
      }
    },
    [editor],
  )

  // 볼드 적용 함수
  const applyBold = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleBold().run()
    }
  }, [editor])

  // 이미지 삽입 함수
  const insertImage = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (event) => {
      if (!editor) return

      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === "string") {
            editor.chain().focus().setImage({ src: result }).run()
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }, [editor])

  // 비디오 삽입 함수
  const insertVideo = useCallback(() => {
    if (!editor) return

    const url = prompt("YouTube 비디오 URL을 입력하세요:")
    if (url) {
      // YouTube URL에서 ID 추출
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      const match = url.match(youtubeRegex)

      if (match && match[1]) {
        const videoId = match[1]
        editor.chain().focus().setYoutubeVideo({ src: videoId }).run()
      } else {
        alert("유효한 YouTube URL이 아닙니다.")
      }
    }
  }, [editor])

  // 마크다운 뷰 토글
  const toggleMarkdownView = useCallback(() => {
    setMarkdownView((prev) => (prev === "edit" ? "preview" : "edit"))
  }, [])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold border-none focus:outline-none focus:ring-0"
            placeholder="제목 없음"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={toggleMarkdownMode} variant="outline" className="flex items-center gap-1">
            <Code className="w-4 h-4" />
            {isMarkdownMode ? "Rich Text" : "Markdown"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveStatus !== "idle"}
            variant="outline"
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            {saveStatus === "idle" && "임시저장"}
            {saveStatus === "saving" && "저장 중..."}
            {saveStatus === "saved" && "저장됨!"}
          </Button>
          <Button onClick={handlePublish} disabled={publishStatus !== "idle"} className="flex items-center gap-1">
            <Send className="w-4 h-4" />
            {publishStatus === "idle" && "Publish"}
            {publishStatus === "publishing" && "Publishing..."}
            {publishStatus === "published" && "Published!"}
          </Button>
        </div>
      </div>

      {!isMarkdownMode && (
        <div className="flex items-center p-2 border-b overflow-x-auto">
          <div className="flex items-center space-x-1">
            <Button
              variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="p-1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="p-1"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className="p-1"
            >
              <Heading3 className="w-4 h-4" />
            </Button>

            <Button
              variant={editor.isActive("bold") ? "secondary" : "ghost"}
              size="sm"
              onClick={applyBold}
              className="p-1"
            >
              <Bold className="w-4 h-4" />
            </Button>

            <Button
              variant={editor.isActive("italic") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="p-1"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("underline") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="p-1"
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("strike") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className="p-1"
            >
              <Strikethrough className="w-4 h-4" />
            </Button>

            {/* 색상 선택 버튼 */}
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={toggleColorPicker} className="p-1">
                <Palette className="w-4 h-4" />
              </Button>

              {colorPickerOpen && (
                <div
                  ref={colorPickerRef}
                  className="absolute z-50 top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-3 w-64"
                >
                  <h3 className="text-sm font-medium mb-2">글자 색상</h3>
                  <div className="grid grid-cols-8 gap-1">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-sm border border-gray-300 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => applyColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="p-1"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="p-1"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("link") ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                const url = window.prompt("URL 입력:")
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              className="p-1"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>

            {/* 정렬 버튼 추가 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-1 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`p-1 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-1 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              className={`p-1 ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""}`}
            >
              <AlignJustify className="w-4 h-4" />
            </Button>

            {/* 이미지 삽입 버튼 */}
            <Button variant="ghost" size="sm" onClick={insertImage} className="p-1">
              <ImageIcon className="w-4 h-4" />
            </Button>

            {/* 비디오 삽입 버튼 */}
            <Button variant="ghost" size="sm" onClick={insertVideo} className="p-1">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {isMarkdownMode && (
        <div className="flex items-center p-2 border-b">
          <div className="flex items-center space-x-2">
            <Button
              variant={markdownView === "edit" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMarkdownView("edit")}
              className="flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              편집
            </Button>
            <Button
              variant={markdownView === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMarkdownView("preview")}
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              미리보기
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 p-4 overflow-auto min-h-[400px] relative" ref={editorRef} onClick={handleEditorClick}>
        {isMarkdownMode ? (
          markdownView === "edit" ? (
            <Textarea
              value={markdownContent}
              onChange={handleMarkdownChange}
              className="w-full h-full min-h-[400px] font-mono text-sm resize-none border-none focus:ring-0"
              placeholder="Markdown 코드를 입력하세요..."
            />
          ) : (
            <div
              className="prose max-w-none h-full border-none outline-none"
              dangerouslySetInnerHTML={{ __html: marked(markdownContent) }}
            />
          )
        ) : (
          <>
            <EditorContent editor={editor} className="prose max-w-none h-full border-none outline-none" />

            {slashCommandOpen && (
              <div
                style={{
                  position: "absolute",
                  top: `${slashCommandPosition.top}px`,
                  left: `${slashCommandPosition.left}px`,
                  zIndex: 50,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <SlashCommands
                  editor={editor}
                  isOpen={slashCommandOpen}
                  setIsOpen={setSlashCommandOpen}
                  command={slashCommand}
                  onSelect={handleSlashCommandSelect}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
