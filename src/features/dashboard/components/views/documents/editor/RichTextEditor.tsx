'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/dashboard_UI/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { DocumentTemplate } from '@/features/dashboard/types/document';
import { Badge } from '@/components/dashboard_UI/badge';
import { 
  Bold, Italic, Heading1, Heading2, Heading3, Heading4, Heading5,
  List, ListOrdered, Quote, Code, Link, Image, Table, CheckSquare, Minus, Palette
} from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

// 슬래시 커맨드 정의
const slashCommands = [
  { icon: Heading1, label: '제목 1', command: '# ', keywords: ['h1', '제목1'] },
  { icon: Heading2, label: '제목 2', command: '## ', keywords: ['h2', '제목2'] },
  { icon: Heading3, label: '제목 3', command: '### ', keywords: ['h3', '제목3'] },
  { icon: Heading4, label: '제목 4', command: '#### ', keywords: ['h4', '제목4'] },
  { icon: Heading5, label: '제목 5', command: '##### ', keywords: ['h5', '제목5'] },
  { icon: Bold, label: '굵게', command: '**텍스트**', keywords: ['bold', '굵게'] },
  { icon: Italic, label: '기울임', command: '*텍스트*', keywords: ['italic', '기울임'] },
  { icon: List, label: '목록', command: '- ', keywords: ['list', '목록'] },
  { icon: ListOrdered, label: '번호 목록', command: '1. ', keywords: ['ol', '번호'] },
  { icon: CheckSquare, label: '체크리스트', command: '- [ ] ', keywords: ['todo', '체크'] },
  { icon: Quote, label: '인용', command: '> ', keywords: ['quote', '인용'] },
  { icon: Code, label: '코드', command: '`코드`', keywords: ['code', '코드'] },
  { icon: Link, label: '링크', command: '[텍스트](URL)', keywords: ['link', '링크'] },
  { icon: Image, label: '이미지', command: '![대체텍스트](URL)', keywords: ['image', '이미지'] },
  { icon: Table, label: '표', command: '| 헤더1 | 헤더2 |\n|-------|-------|\n| 셀1   | 셀2   |', keywords: ['table', '표'] },
  { icon: Minus, label: '구분선', command: '---', keywords: ['hr', '구분선'] },
  { icon: Palette, label: '빨간색 텍스트', command: '<span style="color: #ef4444;">텍스트</span>', keywords: ['red', '빨간색'] },
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  template?: DocumentTemplate | null;
  documentTitle?: string;
  tags?: string[];
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder,
  template,
  documentTitle = '',
  tags = []
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSplitView, setIsSplitView] = useState(true);
  
  // 슬래시 커맨드 상태
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [slashStartPos, setSlashStartPos] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // 필터된 명령어 목록
  const filteredCommands = slashCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Listen for insertMarkdown events from toolbar
  useEffect(() => {
    const handleInsertMarkdown = (event: CustomEvent) => {
      const markdown = event.detail;
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);

      let insertText = markdown;
      if (markdown.includes('텍스트')) {
        insertText = markdown.replace('텍스트', selectedText || '텍스트');
      }

      const newContent = 
        content.substring(0, start) + 
        insertText + 
        content.substring(end);
      
      onChange(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + insertText.length;
        textarea.selectionEnd = start + insertText.length;
      }, 0);
    };

    window.addEventListener('insertMarkdown' as any, handleInsertMarkdown);
    return () => {
      window.removeEventListener('insertMarkdown' as any, handleInsertMarkdown);
    };
  }, [content, onChange]);

  // Emit view mode changes
  useEffect(() => {
    const viewMode = isPreview ? 'preview' : (isSplitView ? 'split' : 'edit');
    const event = new CustomEvent('viewModeChange', { detail: viewMode });
    window.dispatchEvent(event);
  }, [isPreview, isSplitView]);

  // Sync scroll between editor and preview
  const handleScroll = (source: 'editor' | 'preview') => {
    if (!isSplitView) return;
    
    const sourceEl = source === 'editor' ? textareaRef.current : editorRef.current;
    const targetEl = source === 'editor' ? editorRef.current : textareaRef.current;
    
    if (sourceEl && targetEl) {
      const percentage = sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight);
      targetEl.scrollTop = percentage * (targetEl.scrollHeight - targetEl.clientHeight);
    }
  };

  // 정확한 커서 위치 계산 함수
  const getCursorPosition = (textarea: HTMLTextAreaElement, position: number) => {
    const textBeforeCursor = textarea.value.substring(0, position);
    const lines = textBeforeCursor.split('\n');
    const currentLineIndex = lines.length - 1;
    const currentLineText = lines[currentLineIndex];
    
    // textarea의 스타일 정보 가져오기
    const styles = window.getComputedStyle(textarea);
    const fontSize = parseFloat(styles.fontSize);
    const lineHeight = parseFloat(styles.lineHeight) || fontSize * 1.5;
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingLeft = parseFloat(styles.paddingLeft);
    
    // 텍스트 너비 측정을 위한 임시 span 생성
    const span = document.createElement('span');
    span.style.font = styles.font;
    span.style.fontSize = styles.fontSize;
    span.style.fontFamily = styles.fontFamily;
    span.style.fontWeight = styles.fontWeight;
    span.style.letterSpacing = styles.letterSpacing;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre';
    span.textContent = currentLineText;
    document.body.appendChild(span);
    
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);
    
    const rect = textarea.getBoundingClientRect();
    
    return {
      top: rect.top + paddingTop + (currentLineIndex * lineHeight) - textarea.scrollTop + lineHeight + 4,
      left: rect.left + paddingLeft + textWidth + 8 // `/` 문자 너비만큼 추가
    };
  };

  // 슬래시 메뉴 표시 - 정확한 위치 계산
  const showSlashMenuAtCursor = (textarea: HTMLTextAreaElement, position: number) => {
    const cursorPos = getCursorPosition(textarea, position);
    
    // 화면 경계 확인 및 조정
    const menuWidth = 256; // w-64 = 16rem = 256px
    const menuHeight = 200; // max-h-[200px]
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let finalLeft = cursorPos.left;
    let finalTop = cursorPos.top;
    
    // 오른쪽 경계 확인
    if (finalLeft + menuWidth > viewportWidth) {
      finalLeft = viewportWidth - menuWidth - 16;
    }
    
    // 아래쪽 경계 확인
    if (finalTop + menuHeight > viewportHeight) {
      finalTop = cursorPos.top - menuHeight - 8; // 위로 표시
    }
    
    setSlashMenuPosition({
      top: finalTop,
      left: finalLeft
    });
    setShowSlashMenu(true);
  };

  // 선택된 항목이 보이도록 스크롤 조정 - 개선된 버전
  useEffect(() => {
    if (showSlashMenu && slashMenuRef.current && filteredCommands.length > 0) {
      const menuElement = slashMenuRef.current;
      const selectedButton = menuElement.querySelector(`[data-index="${selectedCommandIndex}"]`) as HTMLElement;
      
      if (selectedButton) {
        // scrollIntoView를 사용하여 부드럽게 스크롤
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // 필요한 경우에만 스크롤
          inline: 'nearest'
        });
      }
    }
  }, [selectedCommandIndex, showSlashMenu, filteredCommands.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    // 슬래시 메뉴가 열려있을 때의 키 처리
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCommandIndex(prev => {
          const nextIndex = prev < filteredCommands.length - 1 ? prev + 1 : 0;
          return nextIndex;
        });
        return;
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCommandIndex(prev => {
          const nextIndex = prev > 0 ? prev - 1 : filteredCommands.length - 1;
          return nextIndex;
        });
        return;
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        insertSlashCommand(filteredCommands[selectedCommandIndex]);
        return;
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        hideSlashMenu();
        return;
      }
    }

    // `/` 키 처리 - 줄의 시작에서만
    if (e.key === '/' && isLineStart(value, start)) {
      // `/` 입력 후 위치 계산을 위해 다음 프레임에서 실행
      setTimeout(() => {
        setSlashStartPos(start);
        setSearchQuery('');
        setSelectedCommandIndex(0);
        showSlashMenuAtCursor(textarea, start + 1); // `/` 다음 위치
      }, 0);
      return;
    }

    // 슬래시 메뉴가 열려있을 때 검색어 업데이트
    if (showSlashMenu && e.key.length === 1) {
      setSearchQuery(prev => prev + e.key);
      setSelectedCommandIndex(0);
      return;
    }

    if (showSlashMenu && e.key === 'Backspace') {
      if (searchQuery.length > 0) {
        setSearchQuery(prev => prev.slice(0, -1));
        setSelectedCommandIndex(0);
      } else {
        hideSlashMenu();
      }
      return;
    }

    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // List continuation
    if (e.key === 'Enter') {
      const currentLine = value.substring(0, start).split('\n').pop() || '';
      
      // Check if current line is a list item
      const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (listMatch) {
        e.preventDefault();
        const indent = listMatch[1];
        const marker = listMatch[2];
        
        // If the current list item is empty, remove it and decrease indent
        if (currentLine.trim() === marker) {
          const newValue = value.substring(0, start - currentLine.length) + '\n' + value.substring(end);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - currentLine.length + 1;
          }, 0);
        } else {
          // Continue the list
          const nextMarker = marker.match(/\d+/) ? `${parseInt(marker) + 1}.` : marker;
          const newValue = value.substring(0, end) + `\n${indent}${nextMarker} ` + value.substring(end);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = end + indent.length + nextMarker.length + 2;
          }, 0);
        }
      }
    }

    // Bold/Italic shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        const selectedText = value.substring(start, end) || 'bold text';
        const newValue = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = start + 2 + selectedText.length;
        }, 0);
      } else if (e.key === 'i') {
        e.preventDefault();
        const selectedText = value.substring(start, end) || 'italic text';
        const newValue = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = start + 1;
          textarea.selectionEnd = start + 1 + selectedText.length;
        }, 0);
      }
    }
  };

  // 줄의 시작인지 확인
  const isLineStart = (text: string, position: number): boolean => {
    if (position === 0) return true;
    const beforeCursor = text.substring(0, position);
    const lastNewlineIndex = beforeCursor.lastIndexOf('\n');
    const currentLineText = beforeCursor.substring(lastNewlineIndex + 1);
    return currentLineText.trim() === '';
  };

  // 슬래시 메뉴 숨기기
  const hideSlashMenu = () => {
    setShowSlashMenu(false);
    setSearchQuery('');
    setSelectedCommandIndex(0);
  };

  // 슬래시 커맨드 삽입
  const insertSlashCommand = (command: typeof slashCommands[0]) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const value = textarea.value;
    const beforeSlash = value.substring(0, slashStartPos);
    const afterCursor = value.substring(textarea.selectionStart);
    
    let insertText = command.command;
    if (insertText.includes('텍스트')) {
      insertText = insertText.replace('텍스트', '');
    }

    const newValue = beforeSlash + insertText + afterCursor;
    onChange(newValue);
    
    hideSlashMenu();
    
    setTimeout(() => {
      textarea.focus();
      const cursorPos = slashStartPos + insertText.length;
      textarea.selectionStart = textarea.selectionEnd = cursorPos;
    }, 0);
  };

  // Render preview with template
  const renderPreview = () => {
    if (!template) {
      // Default preview
      return (
        <div className="p-6">
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-4">{documentTitle || '제목 없음'}</h1>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {content || '*문서 내용을 입력하면 여기에 미리보기가 표시됩니다*'}
            </ReactMarkdown>
          </article>
        </div>
      );
    }

    // Template preview
    const markdownHtml = (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    );

    const processedHtml = template.html
      .replace('{{title}}', documentTitle)
      .replace('{{content}}', '<div id="markdown-content"></div>')
      .replace('{{tags}}', tags.map(tag => `<span class="tag">${tag}</span>`).join(''));

    return (
      <div className="h-full">
        <style dangerouslySetInnerHTML={{ __html: template.styles }} />
        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
        <div className="hidden" id="markdown-source">
          {markdownHtml}
        </div>
      </div>
    );
  };

  // Move markdown content to template after render
  useEffect(() => {
    if (template) {
      const source = document.getElementById('markdown-source');
      const target = document.getElementById('markdown-content');
      if (source && target) {
        target.innerHTML = source.innerHTML;
      }
    }
  }, [content, template]);

  // 스크롤이나 리사이즈 시 메뉴 위치 업데이트
  useEffect(() => {
    const updateMenuPosition = () => {
      if (showSlashMenu && textareaRef.current) {
        const cursorPos = getCursorPosition(textareaRef.current, slashStartPos + 1);
        setSlashMenuPosition({
          top: cursorPos.top,
          left: cursorPos.left
        });
      }
    };

    if (showSlashMenu) {
      window.addEventListener('scroll', updateMenuPosition, true);
      window.addEventListener('resize', updateMenuPosition);
      
      return () => {
        window.removeEventListener('scroll', updateMenuPosition, true);
        window.removeEventListener('resize', updateMenuPosition);
      };
    }
  }, [showSlashMenu, slashStartPos]);

  return (
    <div className="h-full flex relative">
      {/* Editor */}
      <div className={cn(
        "h-full overflow-hidden",
        isSplitView ? "w-1/2 border-r" : "w-full",
        isPreview && !isSplitView && "hidden"
      )}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onScroll={() => handleScroll('editor')}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-full p-6 resize-none",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "font-mono text-sm leading-relaxed",
            "focus:outline-none",
            "placeholder:text-gray-400"
          )}
          spellCheck={false}
        />
      </div>

      {/* 슬래시 커맨드 메뉴 */}
      {showSlashMenu && (
        <div
          ref={slashMenuRef}
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-64 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          style={{
            top: slashMenuPosition.top,
            left: slashMenuPosition.left,
            scrollBehavior: 'smooth'
          }}
        >
          {filteredCommands.map((command, index) => {
            const Icon = command.icon;
            return (
              <button
                key={command.label}
                data-index={index}
                className={cn(
                  "w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150",
                  index === selectedCommandIndex && "bg-purple-100 dark:bg-purple-900/30 border-l-2 border-purple-500"
                )}
                onClick={() => insertSlashCommand(command)}
                onMouseEnter={() => setSelectedCommandIndex(index)}
              >
                <Icon className={cn(
                  "w-4 h-4",
                  index === selectedCommandIndex ? "text-purple-600 dark:text-purple-400" : "text-gray-500"
                )} />
                <span className={cn(
                  "text-sm",
                  index === selectedCommandIndex ? "text-purple-900 dark:text-purple-100 font-medium" : "text-gray-700 dark:text-gray-300"
                )}>
                  {command.label}
                </span>
              </button>
            );
          })}
          {filteredCommands.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              명령어를 찾을 수 없습니다
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {(isSplitView || isPreview) && (
        <div
          ref={editorRef}
          className={cn(
            "h-full overflow-y-auto bg-white dark:bg-gray-800",
            isSplitView ? "w-1/2" : "w-full"
          )}
          onScroll={() => handleScroll('preview')}
        >
          {renderPreview()}
        </div>
      )}
    </div>
  );
}