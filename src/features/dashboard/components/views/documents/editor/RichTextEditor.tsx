//features/dashboard/components/views/documents/RichTextEditor.tsx

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/dashboard_UI/button'; // 이 줄 추가
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSplitView, setIsSplitView] = useState(true);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

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

  return (
    <div className="h-full flex">
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
          <div className="p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom components for better rendering
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
                  ),
                  code: ({ inline, children, className }) => {
                    if (inline) {
                      return (
                        <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={className}>{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-purple-600 hover:text-purple-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {children}
                      </table>
                    </div>
                  ),
                  input: ({ type, checked, disabled }) => {
                    if (type === 'checkbox') {
                      return (
                        <input 
                          type="checkbox" 
                          checked={checked} 
                          disabled={disabled}
                          className="mr-2"
                          readOnly
                        />
                      );
                    }
                    return null;
                  },
                }}
              >
                {content || '*문서 내용을 입력하면 여기에 미리보기가 표시됩니다*'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* View Toggle Buttons */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        <Button
          size="sm"
          variant={!isSplitView && !isPreview ? "default" : "outline"}
          onClick={() => {
            setIsSplitView(false);
            setIsPreview(false);
          }}
        >
          편집
        </Button>
        <Button
          size="sm"
          variant={isSplitView ? "default" : "outline"}
          onClick={() => {
            setIsSplitView(true);
            setIsPreview(false);
          }}
        >
          분할
        </Button>
        <Button
          size="sm"
          variant={!isSplitView && isPreview ? "default" : "outline"}
          onClick={() => {
            setIsSplitView(false);
            setIsPreview(true);
          }}
        >
          미리보기
        </Button>
      </div>
    </div>
  );
}