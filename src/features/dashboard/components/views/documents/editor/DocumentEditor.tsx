//features/dashboard/components/views/documents/editor/DocumentEditor.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { 
  Save, X, FileText, Settings, History, 
  Download, Share2, Tag, Layout, FileCode,
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link,
  Image, Table, CheckSquare, Minus,
  Eye, Edit3, Split, Palette, Heading4, Heading5
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import RichTextEditor from './RichTextEditor';
import DocumentPreview from './DocumentPreview';
import DocumentSettings from './DocumentSettings';
import DocumentHistory from './DocumentHistory';
import TemplateDrawer from './TemplateDrawer';
import TagInput from './TagInput';
import { Document, DocumentTemplate } from '@/features/dashboard/types/document';
import { useDebounce } from '@/features/dashboard/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dashboard_UI/popover';

interface DocumentEditorProps {
  mode: 'create' | 'edit';
  documentId?: string;
}

export default function DocumentEditor({ mode, documentId }: DocumentEditorProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  
  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 1000);

  // Load document data in edit mode
  useEffect(() => {
    if (mode === 'edit' && documentId) {
      loadDocument(documentId);
    }
  }, [mode, documentId]);

  // Auto-save
  useEffect(() => {
    if (mode === 'edit' && (debouncedContent || debouncedTitle)) {
      handleAutoSave();
    }
  }, [debouncedContent, debouncedTitle, mode]);

  // Word count
  useEffect(() => {
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
  }, [content]);

  const loadDocument = async (id: string) => {
    try {
      // Mock data for now
      const mockDoc = {
        title: '프로젝트 제안서',
        content: '# 프로젝트 제안서\n\n## 개요\n\n프로젝트 내용...',
        tags: ['제안서', '프로젝트'],
        template: null
      };
      setTitle(mockDoc.title);
      setContent(mockDoc.content);
      setTags(mockDoc.tags);
    } catch (error) {
      console.error('Failed to load document:', error);
    }
  };

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setIsAutoSaving(false);
  };

  const handleSave = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard/documents');
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'html' | 'markdown' | 'latex') => {
    try {
      console.log(`Exporting as ${format} with template:`, selectedTemplate?.name);
      const filename = `${title || 'document'}.${format}`;
      console.log(`Downloading ${filename}`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const insertMarkdown = useCallback((markdown: string) => {
    const textarea = document.querySelector('textarea');
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
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + insertText.length;
      textarea.selectionEnd = start + insertText.length;
    }, 0);
  }, [content]);

  // 미리 정의된 색상 팔레트
  const colorPalette = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#FF6B6B', '#4ECDC4', '#45B7D1'
  ];

  const insertColorText = (color: string) => {
    insertMarkdown(`<span style="color: ${color};">텍스트</span>`);
    setShowColorPicker(false);
  };

  const toolbarItems = [
    { icon: Bold, label: '굵게', action: () => insertMarkdown('**텍스트**') },
    { icon: Italic, label: '기울임', action: () => insertMarkdown('*텍스트*') },
    { type: 'separator' },
    { icon: Heading1, label: '제목 1', action: () => insertMarkdown('# ') },
    { icon: Heading2, label: '제목 2', action: () => insertMarkdown('## ') },
    { icon: Heading3, label: '제목 3', action: () => insertMarkdown('### ') },
    { icon: Heading4, label: '제목 4', action: () => insertMarkdown('#### ') },
    { icon: Heading5, label: '제목 5', action: () => insertMarkdown('##### ') },
    { type: 'separator' },
    // 색상 버튼을 특별히 처리
    { icon: Palette, label: '텍스트 색상', action: 'color-picker' },
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
              className="text-xl font-semibold border-0 focus-visible:ring-0 px-0 bg-transparent flex-1 min-w-0"
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
              onClick={() => setShowTemplates(true)}
            >
              <Layout className="w-4 h-4 mr-2" />
              템플릿
            </Button>

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
                  <FileText className="w-4 h-4 mr-2" />
                  PDF로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('docx')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Word로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('html')}>
                  <FileCode className="w-4 h-4 mr-2" />
                  HTML로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('markdown')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Markdown으로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('latex')}>
                  <FileCode className="w-4 h-4 mr-2" />
                  LaTeX로 내보내기
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

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor - Full Width Only */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b px-6 py-2">
            <div className="flex items-center gap-1">
              {toolbarItems.map((item, index) => {
                if (item.type === 'separator') {
                  return <Separator key={index} orientation="vertical" className="h-6 mx-2" />;
                }
                
                // 색상 버튼 특별 처리
                if (item.action === 'color-picker') {
                  return (
                    <Popover key={index} open={showColorPicker} onOpenChange={setShowColorPicker}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title={item.label}
                        >
                          <Palette className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">텍스트 색상 선택</h4>
                          
                          {/* 색상 팔레트 */}
                          <div className="grid grid-cols-5 gap-2">
                            {colorPalette.map((color) => (
                              <button
                                key={color}
                                onClick={() => insertColorText(color)}
                                className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                          
                          {/* Hex 코드 입력 */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">사용자 정의 색상</label>
                            <div className="flex gap-2">
                              <Input
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                placeholder="#000000"
                                className="flex-1 font-mono text-sm"
                                pattern="^#[0-9A-Fa-f]{6}$"
                              />
                              <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-10 h-9 rounded border border-gray-300 cursor-pointer"
                              />
                            </div>
                            <Button
                              onClick={() => insertColorText(selectedColor)}
                              size="sm"
                              className="w-full"
                            >
                              적용
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  );
                }
                
                // 일반 버튼들
                const Icon = item.icon!;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={item.action as () => void}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Text Editor */}
          <div className="flex-1 overflow-hidden">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="문서 내용을 입력하세요..."
              template={selectedTemplate}
              documentTitle={title}
              tags={tags}
            />
          </div>
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
            {selectedTemplate && (
              <span className="flex items-center gap-1">
                <Layout className="w-3 h-3" />
                {selectedTemplate.name}
              </span>
            )}
            <span>Markdown</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>

      {/* Template Drawer with animation */}
      <TemplateDrawer
        open={showTemplates}
        onOpenChange={setShowTemplates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={(template) => {
          setSelectedTemplate(template);
          setShowTemplates(false);
        }}
      />
    </div>
  );
}