//features/dashboard/components/views/documents/DocumetEditor.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { 
  Save, X, FileText, Settings, History, 
  Download, Share2, MoreVertical, Tag,
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link,
  Image, Table, CheckSquare, Minus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { Badge } from '@/components/dashboard_UI/badge';
import { Separator } from '@/components/dashboard_UI/separator';
import RichTextEditor from './RichTextEditor';
import DocumentSettings from './DocumentSettings';
import DocumentHistory from './DocumentHistory';
import TagInput from './TagInput';
import { Document } from '@/features/dashboard/types/document';
import { useDebounce } from '@/features/dashboard/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { mockDocument } from '../mockData';

interface DocumentEditorProps {
  mode: 'create' | 'edit';
  documentId?: string;
}

export default function DocumentEditor({ mode, documentId }: DocumentEditorProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  
  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 1000);

  // Load document data in edit mode
  useEffect(() => {
    if (mode === 'edit' && documentId) {
      // Mock data loading - 실제로는 API 호출
      const doc = mockDocument;
      setTitle(doc.title);
      setContent(doc.content);
      setTags(doc.tags);
    }
  }, [mode, documentId]);

  // Auto-save
  useEffect(() => {
    if (mode === 'edit' && (debouncedContent || debouncedTitle)) {
      handleAutoSave();
    }
  }, [debouncedContent, debouncedTitle]);

  // Word count
  useEffect(() => {
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
  }, [content]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    // Mock save - 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setIsAutoSaving(false);
  };

  const handleSave = async () => {
    // Mock save - 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/dashboard/documents');
  };

  const handleExport = (format: 'pdf' | 'docx' | 'html' | 'markdown') => {
    // Export logic
    console.log(`Exporting as ${format}`);
  };

  const insertMarkdown = (markdown: string) => {
    // This would be connected to the editor's insert function
    console.log('Inserting:', markdown);
  };

  const toolbarItems = [
    { icon: Bold, label: '굵게', action: () => insertMarkdown('**텍스트**') },
    { icon: Italic, label: '기울임', action: () => insertMarkdown('*텍스트*') },
    { type: 'separator' },
    { icon: Heading1, label: '제목 1', action: () => insertMarkdown('# ') },
    { icon: Heading2, label: '제목 2', action: () => insertMarkdown('## ') },
    { icon: Heading3, label: '제목 3', action: () => insertMarkdown('### ') },
    { type: 'separator' },
    { icon: List, label: '목록', action: () => insertMarkdown('- ') },
    { icon: ListOrdered, label: '번호 목록', action: () => insertMarkdown('1. ') },
    { icon: CheckSquare, label: '체크리스트', action: () => insertMarkdown('- [ ] ') },
    { type: 'separator' },
    { icon: Quote, label: '인용', action: () => insertMarkdown('> ') },
    { icon: Code, label: '코드', action: () => insertMarkdown('`코드`') },
    { icon: Link, label: '링크', action: () => insertMarkdown('[텍스트](URL)') },
    { icon: Image, label: '이미지', action: () => insertMarkdown('![대체텍스트](URL)') },
    { icon: Table, label: '표', action: () => insertMarkdown('| 헤더1 | 헤더2 |\n|-------|-------|\n| 셀1   | 셀2   |') },
    { icon: Minus, label: '구분선', action: () => insertMarkdown('---') },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard/documents')}
            >
              <X className="w-4 h-4" />
            </Button>
            
            <FileText className="w-5 h-5 text-gray-400" />
            
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문서 제목을 입력하세요"
              className="text-xl font-semibold border-0 focus-visible:ring-0 px-0 bg-transparent"
              style={{ width: `${Math.max(200, title.length * 12)}px` }}
            />
            
            {isAutoSaving && (
              <Badge variant="secondary" className="text-xs">
                자동 저장 중...
              </Badge>
            )}
            
            {lastSaved && !isAutoSaving && (
              <span className="text-xs text-gray-500">
                {lastSaved.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}에 저장됨
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              기록
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  내보내기
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  PDF로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('docx')}>
                  Word로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('html')}>
                  HTML로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('markdown')}>
                  Markdown으로 내보내기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant="ghost"
              size="sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              공유
            </Button>
            
            <Button
              size="sm"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex items-center gap-4">
          <Tag className="w-4 h-4 text-gray-400" />
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="태그 추가 (Enter로 구분)"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b px-6 py-2">
        <div className="flex items-center gap-1">
          {toolbarItems.map((item, index) => {
            if (item.type === 'separator') {
              return <Separator key={index} orientation="vertical" className="h-6 mx-2" />;
            }
            
            const Icon = item.icon!;
            return (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={item.action}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="문서 내용을 입력하세요..."
          />
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <DocumentSettings
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* History Panel */}
        {showHistory && (
          <DocumentHistory
            documentId={documentId || ''}
            onClose={() => setShowHistory(false)}
            onRestore={(version) => {
              setContent(version.content);
              setShowHistory(false);
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>{wordCount} 단어</span>
            <span>약 {Math.ceil(wordCount / 200)}분 읽기</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Markdown</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}