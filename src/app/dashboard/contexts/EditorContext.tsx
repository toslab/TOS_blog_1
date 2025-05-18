'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import { turndownService } from "@/app/dashboard/utils/markdown";
import { marked } from "marked";

type EditorMode = 'richtext' | 'markdown';
type MarkdownView = 'edit' | 'preview';
type SaveStatus = 'idle' | 'saving' | 'saved';
type PublishStatus = 'idle' | 'publishing' | 'published';

interface SlashCommandPosition {
  top: number;
  left: number;
}

interface EditorContextType {
  editor: Editor | null;
  title: string;
  setTitle: (title: string) => void;
  saveStatus: SaveStatus;
  publishStatus: PublishStatus;
  editorMode: EditorMode;
  markdownView: MarkdownView;
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  colorPickerOpen: boolean;
  setColorPickerOpen: (open: boolean) => void;
  slashCommandOpen: boolean;
  setSlashCommandOpen: (open: boolean) => void;
  slashCommand: string;
  slashCommandPosition: SlashCommandPosition;
  slashCommandStartPos: number;
  editorRef: React.RefObject<HTMLDivElement>;
  colorPickerRef: React.RefObject<HTMLDivElement>;
  
  // 함수들
  toggleMarkdownMode: () => void;
  handleMarkdownChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSave: () => void;
  handlePublish: () => void;
  toggleColorPicker: () => void;
  applyColor: (color: string) => void;
  applyBold: () => void;
  insertImage: () => void;
  insertVideo: () => void;
  toggleMarkdownView: () => void;
  handleEditorClick: () => void;
  handleSlashCommandSelect: (command: (editor: any) => void) => void;
  setMarkdownView: (view: MarkdownView) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("제목 없음");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("idle");
  const [slashCommandOpen, setSlashCommandOpen] = useState(false);
  const [slashCommand, setSlashCommand] = useState("");
  const [slashCommandPosition, setSlashCommandPosition] = useState<SlashCommandPosition>({ top: 0, left: 0 });
  const [slashCommandStartPos, setSlashCommandStartPos] = useState(0);
  const [editorMode, setEditorMode] = useState<EditorMode>('richtext');
  const [markdownContent, setMarkdownContent] = useState("");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [markdownView, setMarkdownView] = useState<MarkdownView>("edit");

  const editorRef = React.useRef<HTMLDivElement>(null);
  const colorPickerRef = React.useRef<HTMLDivElement>(null);

  // Tiptap 에디터 초기화
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
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    autofocus: true,
    onUpdate: ({ editor }) => {
      // 현재 커서 위치의 텍스트 확인
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(
        Math.max(0, from - 10), // 최대 10자 앞까지 확인
        from,
        " ",
      );

      // Rich Text 모드일 때만 슬래시 명령어 감지
      if (editorMode === 'richtext') {
        // 슬래시 명령어 감지
        const slashIndex = text.lastIndexOf("/");
        if (slashIndex > -1) {
          const command = text.slice(slashIndex);
          if (command === "/" || command.startsWith("/")) {
            // 슬래시 위치 계산
            const slashPos = from - (command.length - slashIndex);
            setSlashCommandStartPos(slashPos);

            // 슬래시 명령어 설정
            setSlashCommand(command);
            setSlashCommandOpen(true);

            // 슬래시 위치의 좌표 계산
            setTimeout(() => {
              if (editor && editorRef.current) {
                const coords = editor.view.coordsAtPos(slashPos);
                const editorRect = editorRef.current.getBoundingClientRect();

                // 에디터 컨테이너 기준으로 상대적인 위치 계산
                setSlashCommandPosition({
                  top: coords.top - editorRect.top + editorRef.current.scrollTop + 20,
                  left: coords.left - editorRect.left + editorRef.current.scrollLeft,
                });
              }
            }, 0);
          }
        } else {
          // 슬래시가 없는 경우 메뉴 닫기
          setSlashCommandOpen(false);
        }
      }
    },
  });

  // 에디터 내용이 변경될 때 Markdown 내용 업데이트
  useEffect(() => {
    if (editor && editorMode === 'markdown') {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      setMarkdownContent(markdown);
    }
  }, [editor, editorMode]);

  // Markdown 모드 전환
  const toggleMarkdownMode = useCallback(() => {
    if (editor) {
      if (editorMode === 'richtext') {
        // Rich Text -> Markdown 모드로 전환
        const html = editor.getHTML();
        const markdown = turndownService.turndown(html);
        setMarkdownContent(markdown);
        setMarkdownView("edit");
        setEditorMode('markdown');
      } else {
        // Markdown -> Rich Text 모드로 전환
        try {
          const html = marked(markdownContent);
          editor.commands.setContent(html);
          setEditorMode('richtext');
        } catch (error) {
          console.error("마크다운 변환 오류:", error);
        }
      }
    }
  }, [editor, editorMode, markdownContent]);

  // Markdown 내용이 변경될 때 처리
  const handleMarkdownChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value);
  }, []);

  // 컴포넌트 마운트 시 에디터에 포커스
  useEffect(() => {
    if (editor && !editor.isFocused && editorMode === 'richtext') {
      editor.commands.focus();
    }
  }, [editor, editorMode]);

  // 색상 선택기 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerOpen && colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setColorPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colorPickerOpen]);

  // 슬래시 명령어 메뉴 닫기 이벤트
  useEffect(() => {
    const handleClickOutside = () => {
      setSlashCommandOpen(false);
    };

    if (slashCommandOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [slashCommandOpen]);

  const handleSave = useCallback(() => {
    if (!editor) return;

    setSaveStatus("saving");

    // 현재 에디터 내용 가져오기
    const content = editorMode === 'markdown' ? markdownContent : editor.getHTML();

    // 저장 로직 (실제로는 API 호출 등이 들어갈 수 있음)
    setTimeout(() => {
      // 저장 완료 상태로 변경
      setSaveStatus("saved");

      // 2초 후 상태 초기화
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 500);
  }, [editor, editorMode, markdownContent]);

  const handlePublish = useCallback(() => {
    if (!editor) return;

    setPublishStatus("publishing");

    // 현재 에디터 내용 가져오기
    const content = editorMode === 'markdown' ? markdownContent : editor.getHTML();

    // 발행 로직 (실제로는 API 호출 등이 들어갈 수 있음)
    setTimeout(() => {
      // 발행 완료 상태로 변경
      setPublishStatus("published");

      // 2초 후 상태 초기화
      setTimeout(() => {
        setPublishStatus("idle");
      }, 2000);
    }, 1000);
  }, [editor, editorMode, markdownContent]);

  // 슬래시 명령어 선택 시 처리
  const handleSlashCommandSelect = useCallback(
    (command: (editor: any) => void) => {
      if (!editor) return;

      // 슬래시 명령어 텍스트 제거
      if (slashCommandStartPos) {
        editor
          .chain()
          .focus()
          .deleteRange({
            from: slashCommandStartPos,
            to: slashCommandStartPos + slashCommand.length,
          })
          .run();
      }

      // 선택된 명령 실행
      command(editor);
      setSlashCommandOpen(false);

      // 명령 실행 후 에디터에 포커스 유지
      setTimeout(() => {
        editor.commands.focus();
      }, 10);
    },
    [editor, slashCommand, slashCommandStartPos]
  );

  // 에디터 클릭 시 포커스 유지
  const handleEditorClick = useCallback(() => {
    if (editor && !editor.isFocused && editorMode === 'richtext') {
      editor.commands.focus();
    }
  }, [editor, editorMode]);

  // 색상 선택기 토글
  const toggleColorPicker = useCallback(() => {
    setColorPickerOpen((prev) => !prev);
  }, []);

  // 색상 적용 함수
  const applyColor = useCallback(
    (color: string) => {
      if (editor) {
        editor.chain().focus().setColor(color).run();
        setColorPickerOpen(false);
      }
    },
    [editor]
  );

  // 볼드 적용 함수
  const applyBold = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  }, [editor]);

  // 이미지 삽입 함수
  const insertImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      if (!editor) return;

      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === "string") {
            editor.chain().focus().setImage({ src: result }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  // 비디오 삽입 함수
  const insertVideo = useCallback(() => {
    if (!editor) return;

    const url = prompt("YouTube 비디오 URL을 입력하세요:");
    if (url) {
      // YouTube URL에서 ID 추출
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(youtubeRegex);

      if (match && match[1]) {
        const videoId = match[1];
        editor.chain().focus().setYoutubeVideo({ src: videoId }).run();
      } else {
        alert("유효한 YouTube URL이 아닙니다.");
      }
    }
  }, [editor]);

  // 마크다운 뷰 토글
  const toggleMarkdownView = useCallback(() => {
    setMarkdownView((prev) => (prev === "edit" ? "preview" : "edit"));
  }, []);

  return (
    <EditorContext.Provider
      value={{
        editor,
        title,
        setTitle,
        saveStatus,
        publishStatus,
        editorMode,
        markdownView,
        markdownContent,
        setMarkdownContent,
        colorPickerOpen,
        setColorPickerOpen,
        slashCommandOpen,
        setSlashCommandOpen,
        slashCommand,
        slashCommandPosition,
        slashCommandStartPos,
        editorRef,
        colorPickerRef,
        
        // 함수들
        toggleMarkdownMode,
        handleMarkdownChange,
        handleSave,
        handlePublish,
        toggleColorPicker,
        applyColor,
        applyBold,
        insertImage,
        insertVideo,
        toggleMarkdownView,
        handleEditorClick,
        handleSlashCommandSelect,
        setMarkdownView,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor2() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor2 must be used within an EditorProvider");
  }
  return context;
} 