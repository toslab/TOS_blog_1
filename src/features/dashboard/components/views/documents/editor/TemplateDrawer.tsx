//features/dashboard/components/views/documents/editor/TemplateDrawer.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ScrollArea } from '@/components/dashboard_UI/scroll-area';
import { Input } from '@/components/dashboard_UI/input';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Search, FileText, Check, Layout, X } from 'lucide-react';
import { DocumentTemplate } from '@/features/dashboard/types/document';
import { cn } from '@/lib/utils';

// Mock templates
const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: '비즈니스 보고서',
    description: '전문적인 비즈니스 보고서 템플릿',
    category: 'business',
    html: `
      <div class="document-container">
        <header class="document-header">
          <h1 class="document-title">{{title}}</h1>
          <div class="document-meta">
            <span class="date">{{date}}</span>
            <div class="tags">{{tags}}</div>
          </div>
        </header>
        <main class="document-content">
          {{content}}
        </main>
        <footer class="document-footer">
          <p>© 2024 Your Company</p>
        </footer>
      </div>
    `,
    styles: `
      .document-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        font-family: 'Georgia', serif;
      }
      .document-header {
        border-bottom: 2px solid #333;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .document-title {
        font-size: 2.5em;
        color: #1a1a1a;
        margin: 0;
      }
      .document-meta {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        color: #666;
      }
      .tags .tag {
        display: inline-block;
        background: #e0e0e0;
        padding: 2px 8px;
        border-radius: 3px;
        margin-left: 5px;
        font-size: 0.9em;
      }
      .document-content {
        line-height: 1.8;
        color: #333;
      }
      .document-footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
        text-align: center;
        color: #999;
      }
    `,
    thumbnail: '<div style="background: linear-gradient(to bottom, #f0f0f0, #fff); padding: 20px;"><h3 style="color: #333;">Business Report</h3></div>',
    features: ['헤더/푸터', '태그 지원', '인쇄 최적화'],
  },
  {
    id: '2',
    name: '학술 논문',
    description: 'APA 스타일 학술 논문 템플릿',
    category: 'academic',
    html: `
      <div class="paper-container">
        <h1 class="paper-title">{{title}}</h1>
        <div class="paper-abstract">
          <h2>Abstract</h2>
          <p>{{abstract}}</p>
        </div>
        <div class="paper-content">
          {{content}}
        </div>
      </div>
    `,
    styles: `
      .paper-container {
        max-width: 650px;
        margin: 0 auto;
        padding: 1in;
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 2;
      }
      .paper-title {
        text-align: center;
        font-size: 16pt;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .paper-abstract {
        margin: 30px 0;
      }
      .paper-abstract h2 {
        text-align: center;
        font-size: 14pt;
        font-weight: bold;
      }
      .paper-content h1, .paper-content h2, .paper-content h3 {
        font-size: 14pt;
        font-weight: bold;
        margin: 20px 0 10px 0;
      }
    `,
    thumbnail: '<div style="background: #fff; padding: 20px; font-family: serif;"><h3>Academic Paper</h3></div>',
    features: ['APA 스타일', '더블 스페이싱', '참고문헌'],
  },
];

interface TemplateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: DocumentTemplate | null;
  onSelectTemplate: (template: DocumentTemplate | null) => void;
}

export default function TemplateDrawer({
  open,
  onOpenChange,
  selectedTemplate,
  onSelectTemplate,
}: TemplateDrawerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'business', name: '비즈니스' },
    { id: 'academic', name: '학술' },
    { id: 'report', name: '보고서' },
    { id: 'proposal', name: '제안서' },
    { id: 'memo', name: '메모' },
  ];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
                         template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onClose={onOpenChange} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

      {/* Drawer Container */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:max-w-lg sm:duration-700"
            >
              <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
                {/* Header */}
                <div className="px-6 py-6 border-b dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Layout className="w-5 h-5" />
                        문서 템플릿
                      </DialogTitle>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        문서에 적용할 템플릿을 선택하세요
                      </p>
                    </div>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="relative rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Search */}
                  <div className="px-6 py-4 border-b dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="템플릿 검색..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="px-6 py-4 border-b dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Templates List */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {/* No Template Option */}
                      <button
                        onClick={() => {
                          onSelectTemplate(null);
                          onOpenChange(false);
                        }}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border transition-all",
                          "hover:shadow-md hover:border-purple-300",
                          selectedTemplate === null && 
                          "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">기본 템플릿</h4>
                          {selectedTemplate === null && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          템플릿 없이 기본 스타일로 문서를 작성합니다
                        </p>
                      </button>

                      {filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            onSelectTemplate(template);
                            onOpenChange(false);
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-lg border transition-all",
                            "hover:shadow-md hover:border-purple-300",
                            selectedTemplate?.id === template.id && 
                            "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{template.name}</h4>
                            {selectedTemplate?.id === template.id && (
                              <Check className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {template.description}
                          </p>
                          
                          {/* Template Preview */}
                          <div className="relative h-32 bg-gray-50 dark:bg-gray-800 rounded border overflow-hidden">
                            <div 
                              className="absolute inset-0 scale-[0.3] origin-top-left pointer-events-none"
                              style={{ width: '333%', height: '333%' }}
                            >
                              <style dangerouslySetInnerHTML={{ __html: template.styles }} />
                              <div dangerouslySetInnerHTML={{ __html: template.thumbnail }} />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                            {template.features?.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t dark:border-gray-700 px-6 py-4">
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                      className="mr-3"
                    >
                      취소
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>
                      완료
                    </Button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}