'use client';

import { X } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { Document, BasePanelProps } from '../../types';
import { TouchTarget } from '@/components/Button';

interface DocumentPanelProps extends BasePanelProps {
  documentsData: Document[];
  onDocumentClick: (doc: Document) => void;
  onOpenDocumentEditor: () => void;
  onOpenDocumentArchive: () => void;
}

export default function DocumentPanel({
  isOpen,
  onClose,
  documentsData,
  onDocumentClick,
  onOpenDocumentEditor,
  onOpenDocumentArchive,
}: DocumentPanelProps) {
  const { isMobileView } = useSidebar();

  if (!isOpen) return null;

  return (
    <div className={`
      h-full
      overflow-y-auto 
      bg-[hsl(var(--sidebar-background))]
      ${isMobileView ? 'py-6 px-4' : 'p-4'}
    `}>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold text-[hsl(var(--sidebar-foreground))]">문서</h2>
        <TouchTarget>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 hover:bg-[hsl(var(--sidebar-accent))] transition-colors duration-200"
            aria-label="문서 패널 닫기"
          >
            <X className="size-5 text-[hsl(var(--sidebar-foreground))]" />
          </button>
        </TouchTarget>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={onOpenDocumentEditor}
          className="flex-1 rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary))]/90 transition-colors duration-200"
        >
          새 문서 작성
        </button>
        <button
          type="button"
          onClick={onOpenDocumentArchive}
          className="flex-1 rounded-md bg-[hsl(var(--secondary))] px-3 py-2 text-sm font-semibold text-[hsl(var(--secondary-foreground))] shadow-sm ring-1 ring-inset ring-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors duration-200"
        >
          아카이브
        </button>
      </div>

      <div>
        <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2">최근 문서</h3>
        <div className="grid grid-cols-1 gap-3">
          {(documentsData || []).slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              className="group rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => onDocumentClick(doc)}
              onKeyDown={(e) => e.key === 'Enter' && onDocumentClick(doc)}
              tabIndex={0}
              role="button"
              aria-label={`${doc.title} 문서 열기`}
            >
              <h3 className="text-sm font-medium text-[hsl(var(--card-foreground))] group-hover:text-[hsl(var(--primary))] truncate">
                {doc.title}
              </h3>
              <div className="mt-1 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                <span>{doc.category}</span>
                <span>{doc.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 