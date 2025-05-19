"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef, useMemo, memo } from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react"
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
import { Button } from "@/components/dashboard_UI/button"
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
  Heading
} from "lucide-react"
import SlashCommands from "./slash-commands"
import { Textarea } from "@/components/dashboard_UI/textarea"
import { turndownService } from "@/app/dashboard/utils/markdown"
import { marked } from "marked"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/dashboard_UI/popover"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/dashboard_UI/dropdown-menu"

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

// SlashCommandMenu 인터페이스 정의
interface SlashCommandMenuProps {
  editor: Editor | null;
  command: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (command: (editor: any) => void) => void;
  position: { top: number; left: number };
}

// SlashCommandMenu 컴포넌트 분리 - 상태 관리를 분리하여 안정성 향상
const SlashCommandMenu = memo(({ 
  editor, 
  command, 
  isOpen, 
  setIsOpen, 
  onSelect, 
  position 
}: SlashCommandMenuProps) => {
  if (!isOpen || !command || !editor) return null;
  
  return (
    <div
      className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-1 slash-command-menu"
      style={{ top: position.top, left: position.left }}
    >
      <SlashCommands
        key={`slash-${command}-${Date.now()}`}
        editor={editor}
        command={command}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSelect={onSelect}
      />
    </div>
  );
});

SlashCommandMenu.displayName = 'SlashCommandMenu';

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
  // 애니메이션 프레임 참조 저장
  const animationFrameRef = useRef<number | null>(null)

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
      // Markdown 모드가 아닐 때만 슬래시 명령어 감지
      if (isMarkdownMode) return;
      
      try {
        // 이전 애니메이션 프레임 취소
        if (animationFrameRef.current) {
          window.cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        
        // 현재 커서 위치의 텍스트 확인
        const { from, to } = editor.state.selection
        const text = editor.state.doc.textBetween(
          Math.max(0, from - 10), // 최대 10자 앞까지 확인
          from,
          " ",
        )

        // 슬래시 명령어 감지
        const slashIndex = text.lastIndexOf("/")
        
        if (slashIndex > -1) {
          const command = text.slice(slashIndex)
          if (command === "/" || command.startsWith("/")) {
            // 슬래시 위치 계산
            const slashPos = from - (command.length - slashIndex)
            
            // 상태 업데이트를 배치 처리하여 여러 번의 리렌더링 방지
            const updateSlashCommand = () => {
              setSlashCommandStartPos(slashPos)
              setSlashCommand(command)
              setSlashCommandOpen(true)
              
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
            }
            
            // RAF를 사용하여 브라우저 렌더링 사이클에 맞춤
            animationFrameRef.current = window.requestAnimationFrame(updateSlashCommand)
          }
        } else {
          // 슬래시가 없는 경우 메뉴 닫기
          if (slashCommandOpen) {
            animationFrameRef.current = window.requestAnimationFrame(() => {
              setSlashCommandOpen(false)
            })
          }
        }
      } catch (error) {
        console.error("텍스트 분석 중 오류:", error)
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
    const handleClickOutside = (event: MouseEvent) => {
      // 클릭된 요소가 슬래시 명령어 메뉴의 자식이 아닌 경우에만 닫기
      if (slashCommandOpen) {
        const slashCommandMenuElement = document.querySelector('.slash-command-menu');
        if (slashCommandMenuElement && !slashCommandMenuElement.contains(event.target as Node)) {
          setSlashCommandOpen(false);
        }
      }
    }

    // 메뉴가 열렸을 때만 이벤트 리스너 추가
    if (slashCommandOpen) {
      // 이벤트 리스너를 즉시 추가하지 않고 다음 렌더링 사이클에서 추가
      const timerId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timerId);
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }
    
    return undefined;
  }, [slashCommandOpen]);

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
  const handleSlashCommand = useCallback(
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

  // 링크 삽입 함수
  const handleLinkClick = useCallback(() => {
    const url = window.prompt("URL 입력:")
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  // YouTube 비디오 삽입 함수
  const handleYoutubeClick = useCallback(() => {
    const url = window.prompt("YouTube URL 입력:")
    if (url && editor) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }, [editor])

  // 마크다운 뷰 토글
  const toggleMarkdownView = useCallback(() => {
    setMarkdownView((prev) => (prev === "edit" ? "preview" : "edit"))
  }, [])

  // 에디터 렌더링 부분 추가
  const renderEditor = () => {
    // 마크다운 모드일 때 에디터 렌더링
    if (isMarkdownMode) {
      return (
        <div>
          {markdownView === "edit" ? (
            <Textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              className="w-full h-[calc(100vh-300px)] resize-none font-mono text-sm p-4 dark:bg-gray-800 dark:text-gray-100"
            />
          ) : (
            <div
              className="w-full h-[calc(100vh-300px)] overflow-y-auto border rounded p-4 prose dark:prose-invert max-w-none dark:bg-gray-800 dark:text-gray-100"
              dangerouslySetInnerHTML={{ __html: marked.parse(markdownContent) }}
            ></div>
          )}
        </div>
      )
    }

    // 표준 모드일 때 에디터 렌더링
    return (
      <div ref={editorRef} className="relative">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none min-h-[calc(100vh-300px)]" />
        <SlashCommandMenu
          editor={editor}
          command={slashCommand}
          isOpen={slashCommandOpen}
          setIsOpen={setSlashCommandOpen}
          onSelect={handleSlashCommand}
          position={slashCommandPosition}
        />
      </div>
    )
  }

  // 툴바 렌더링 부분 수정
  const renderToolbar = () => {
    if (!editor) return null

    return (
      <div className="flex flex-wrap items-center gap-0.5 border-b dark:border-gray-700 p-1 bg-white dark:bg-gray-800 overflow-x-auto">
        {/* 서식 버튼들 - 아이콘 중심으로 변경하고 툴팁 추가 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="p-1.5 w-8 h-8" 
            >
              <Bold className="w-4 h-4" />
              <span className="sr-only">굵게</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            굵게 (Ctrl+B)
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="p-1.5 w-8 h-8"
            >
              <Italic className="w-4 h-4" />
              <span className="sr-only">이탤릭</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            이탤릭 (Ctrl+I)
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="p-1.5 w-8 h-8"
            >
              <UnderlineIcon className="w-4 h-4" />
              <span className="sr-only">밑줄</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            밑줄 (Ctrl+U)
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className="p-1.5 w-8 h-8"
            >
              <Strikethrough className="w-4 h-4" />
              <span className="sr-only">취소선</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            취소선
          </PopoverContent>
        </Popover>

        {/* 구분선 */}
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* 헤딩 스타일 드롭다운 메뉴로 그룹화 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-1.5 w-8 h-8" title="헤딩 스타일">
              <Heading className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="w-4 h-4 mr-2" /> 제목 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="w-4 h-4 mr-2" /> 제목 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="w-4 h-4 mr-2" /> 제목 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 텍스트 정렬 드롭다운 메뉴로 그룹화 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="p-1.5 w-8 h-8" title="텍스트 정렬">
              <AlignLeft className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('left').run()}>
              <AlignLeft className="w-4 h-4 mr-2" /> 왼쪽 정렬
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('center').run()}>
              <AlignCenter className="w-4 h-4 mr-2" /> 가운데 정렬
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('right').run()}>
              <AlignRight className="w-4 h-4 mr-2" /> 오른쪽 정렬
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
              <AlignJustify className="w-4 h-4 mr-2" /> 양쪽 정렬
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* 목록 버튼 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="p-1.5 w-8 h-8"
            >
              <List className="w-4 h-4" />
              <span className="sr-only">글머리 기호 목록</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            글머리 기호 목록
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="p-1.5 w-8 h-8"
            >
              <ListOrdered className="w-4 h-4" />
              <span className="sr-only">번호 매기기 목록</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            번호 매기기 목록
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* 링크 버튼 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('link') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={handleLinkClick}
              className="p-1.5 w-8 h-8"
            >
              <LinkIcon className="w-4 h-4" />
              <span className="sr-only">링크</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            링크 추가
          </PopoverContent>
        </Popover>

        {/* 코드 버튼 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={editor.isActive('codeBlock') ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="p-1.5 w-8 h-8"
            >
              <Code className="w-4 h-4" />
              <span className="sr-only">코드 블록</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            코드 블록
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* 색상 선택 버튼 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              className="p-1.5 w-8 h-8"
            >
              <Palette className="w-4 h-4" />
              <span className="sr-only">글자 색상</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1.5 shadow-md rounded-md bg-white dark:bg-gray-800 border dark:border-gray-700">
            <div className="grid grid-cols-10 gap-1 p-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  style={{ backgroundColor: color }}
                  className="w-4 h-4 border dark:border-gray-600 rounded-sm"
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setColorPickerOpen(false);
                  }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* 이미지 버튼 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={insertImage}
              className="p-1.5 w-8 h-8"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="sr-only">이미지 추가</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            이미지 추가
          </PopoverContent>
        </Popover>

        {/* YouTube 비디오 버튼 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleYoutubeClick}
              className="p-1.5 w-8 h-8"
            >
              <Video className="w-4 h-4" />
              <span className="sr-only">유튜브 동영상</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-xs p-1.5 shadow-md rounded-md bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 w-auto">
            유튜브 동영상 추가
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex">
          {/* 마크다운 모드 전환 버튼 */}
          <Button
            variant="ghost"
            onClick={toggleMarkdownMode}
            className="text-xs p-1.5 h-8"
          >
            {isMarkdownMode ? "에디터 모드" : "마크다운 모드"}
          </Button>

          {/* 마크다운 모드일 때 보기/편집 전환 버튼 */}
          {isMarkdownMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMarkdownView(markdownView === "edit" ? "preview" : "edit")}
              className="p-1.5 w-8 h-8 ml-1"
              title={markdownView === "edit" ? "미리보기" : "편집"}
            >
              {markdownView === "edit" ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </Button>
          )}

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {/* 저장 및 게시 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="p-1.5 w-8 h-8"
            disabled={saveStatus === "saving"}
          >
            <Save className="w-4 h-4" />
            <span className="sr-only">저장</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handlePublish}
            className="p-1.5 w-8 h-8 ml-1"
            disabled={publishStatus === "publishing"}
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">게시</span>
          </Button>
        </div>
      </div>
    )
  }

  // 컴포넌트가 언마운트될 때 모든 애니메이션 프레임 취소
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden dark:bg-gray-900">
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full text-3xl font-bold mb-6 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-gray-400 dark:text-white dark:placeholder-gray-500"
        />

        {renderToolbar()}

        <div className="mt-4">
          {renderEditor()}
        </div>
      </div>
    </div>
  )
}
