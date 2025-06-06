'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Document, DocumentCategory } from '@/features/dashboard/types/document';
import DocumentsHeader from './DocumentsHeader';
import DocumentsFilters from './DocumentsFilters';
import DocumentsList from './DocumentsList';
import DocumentsGrid from './DocumentsGrid';
import DocumentsEmpty from './DocumentsEmpty';
import { Tabs, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { LayoutGrid, List, Folder, Star, Clock, Archive } from 'lucide-react';
import { mockDocuments, mockCategories } from './mockData';

type ViewMode = 'list' | 'grid';
type FilterTab = 'all' | 'my-documents' | 'shared' | 'favorites' | 'recent' | 'archived';

export default function DocumentsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated');

  // URL 쿼리 파라미터에 따라 초기 탭 설정
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter) {
      const filterMap: Record<string, FilterTab> = {
        'mine': 'my-documents',
        'shared': 'shared',
        'favorites': 'favorites',
        'recent': 'recent',
        'archived': 'archived',
      };
      
      const mappedTab = filterMap[filter];
      if (mappedTab) {
        setActiveTab(mappedTab);
      }
    }
  }, [searchParams]);

  // Mock data - 실제로는 API 호출
  const documents = mockDocuments;
  const categories = mockCategories;

  // 필터링된 문서들
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    // 탭 필터
    switch (activeTab) {
      case 'my-documents':
        filtered = filtered.filter(doc => doc.author.id === 'current-user');
        break;
      case 'shared':
        filtered = filtered.filter(doc => doc.status === 'shared');
        break;
      case 'favorites':
        filtered = filtered.filter(doc => doc.isFavorite);
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(doc => 
          new Date(doc.lastAccessedAt || doc.updatedAt) > oneWeekAgo
        );
        break;
      case 'archived':
        filtered = filtered.filter(doc => doc.status === 'draft'); // 임시로 draft를 archived로 간주
        break;
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category?.id === selectedCategory);
    }

    // 태그 필터
    if (selectedTags.length > 0) {
      filtered = filtered.filter(doc => 
        selectedTags.every(tag => doc.tags.includes(tag))
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, activeTab, searchQuery, selectedCategory, selectedTags, sortBy]);

  // 모든 태그 추출
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    documents.forEach(doc => doc.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }, [documents]);

  const handleCreateDocument = () => {
    router.push('/dashboard/documents/new');
  };

  // 탭 변경 시 URL도 업데이트
  const handleTabChange = (tabId: FilterTab) => {
    setActiveTab(tabId);
    
    // URL 쿼리 파라미터 업데이트
    const tabToFilterMap: Record<FilterTab, string | null> = {
      'all': null,
      'my-documents': 'mine',
      'shared': 'shared',
      'favorites': 'favorites',
      'recent': 'recent',
      'archived': 'archived',
    };
    
    const filterParam = tabToFilterMap[tabId];
    if (filterParam) {
      router.push(`/dashboard/documents?filter=${filterParam}`);
    } else {
      router.push('/dashboard/documents');
    }
  };

  const tabItems = [
    { id: 'all', label: '모든 문서', icon: Folder },
    { id: 'my-documents', label: '내 문서', icon: Folder },
    { id: 'shared', label: '공유된 문서', icon: Folder },
    { id: 'favorites', label: '즐겨찾기', icon: Star },
    { id: 'recent', label: '최근 문서', icon: Clock },
    { id: 'archived', label: '보관함', icon: Archive },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <DocumentsHeader 
        totalCount={filteredDocuments.length}
        onCreate={handleCreateDocument}
      />

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 px-1">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as FilterTab)}
                className={`
                  flex items-center gap-2 pb-3 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filters and View Mode */}
      <div className="flex items-center justify-between gap-4">
        <DocumentsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          categories={categories}
          availableTags={allTags}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="list">
              <List className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="grid">
              <LayoutGrid className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {filteredDocuments.length === 0 ? (
          <DocumentsEmpty 
            onCreate={handleCreateDocument}
            hasFilters={searchQuery !== '' || selectedCategory !== 'all' || selectedTags.length > 0}
          />
        ) : (
          <>
            {viewMode === 'list' ? (
              <DocumentsList documents={filteredDocuments} />
            ) : (
              <DocumentsGrid documents={filteredDocuments} />
            )}
          </>
        )}
      </div>
    </div>
  );
}