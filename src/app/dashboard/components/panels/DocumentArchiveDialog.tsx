'use client';

import { X, Search as SearchIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/dashboard_UI/dialog';
import { useSearch } from '../../contexts/SearchContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { Document } from '../../types';
import { TouchTarget } from '@/components/Button';

interface DocumentArchiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentClick: (doc: Document) => void;
}

export default function DocumentArchiveDialog({
  isOpen,
  onClose,
  onDocumentClick,
}: DocumentArchiveDialogProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredDocuments,
  } = useSearch();

  const { isMobileView } = useSidebar();

  if (!isOpen) return null;

  // 카테고리에 따른 색상 클래스 반환 함수
  const getCategoryColorClass = (category: string) => {
    switch(category) {
      case "계획":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "전략":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "보고서":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "연구":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        max-w-4xl w-full 
        max-h-[80vh] 
        flex flex-col 
        bg-[hsl(var(--background))] 
        border border-[hsl(var(--border))] 
        shadow-xl 
        transition-all duration-200
        ${isMobileView ? 'p-0 rounded-t-lg max-h-[90vh] h-[90vh]' : 'rounded-lg'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">문서 아카이브</h2>
          <TouchTarget>
            <button 
              onClick={onClose} 
              className="rounded-full p-1 hover:bg-[hsl(var(--accent))] transition-colors duration-200"
              aria-label="문서 아카이브 닫기"
            >
              <X className="size-5 text-[hsl(var(--muted-foreground))]" />
            </button>
          </TouchTarget>
        </div>
        <div className="p-4 border-b border-[hsl(var(--border))]">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="size-4 text-[hsl(var(--muted-foreground))]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="문서 검색..."
              className="block w-full rounded-md border-0 py-2 pl-10 text-sm
                      bg-[hsl(var(--background))] 
                      text-[hsl(var(--foreground))]
                      ring-1 ring-inset ring-[hsl(var(--border))] 
                      placeholder:text-[hsl(var(--muted-foreground))] 
                      focus:ring-2 focus:ring-inset focus:ring-[hsl(var(--ring))]
                      transition-colors duration-200"
              aria-label="문서 아카이브 검색창"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(filteredDocuments || []).length > 0 ? (
              (filteredDocuments || []).map((doc: Document) => (
                <div
                  key={doc.id}
                  className="group rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => onDocumentClick(doc)}
                  onKeyDown={(e) => e.key === 'Enter' && onDocumentClick(doc)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${doc.title} 문서 열기`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-[hsl(var(--card-foreground))] group-hover:text-[hsl(var(--primary))] truncate">
                      {doc.title}
                    </h3>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColorClass(doc.category)}`}>
                      {doc.category}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                    <span>{doc.author}</span>
                    <span>{doc.lastUpdated}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-[hsl(var(--muted-foreground))] col-span-2">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 