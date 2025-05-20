'use client';

import { X, FilePlus, Archive, FileText } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { Document, BasePanelProps } from '../../types';
import ListItem from '../common/ListItem';
import { cn } from '@/lib/utils';

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

  const documentListItems = (documentsData || []).slice(0, 5).map(doc => ({
    id: `doc-${doc.id}`,
    name: doc.title,
    onClick: () => onDocumentClick(doc),
    icon: FileText,
    type: 'link' as const,
    meta: `${doc.category} - ${doc.lastUpdated}`,
  }));

  return (
    <div 
      className={cn(
        "h-full overflow-y-auto bg-panel-background rounded-xl shadow-panel",
        isMobileView ? "p-4" : "p-panel-padding-x lg:p-panel-padding-y",
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">문서</h2>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-md hover:bg-hover-bg-light transition-colors duration-200"
            aria-label="패널 닫기"
          >
            <X className="h-5 w-5 text-icon-color" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          type="button"
          onClick={onOpenDocumentEditor}
          className="flex items-center justify-center gap-x-2 flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <FilePlus className="h-5 w-5" />
          새 문서 작성
        </button>
        <button
          type="button"
          onClick={onOpenDocumentArchive}
          className="flex items-center justify-center gap-x-2 flex-1 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Archive className="h-5 w-5" />
          아카이브 보기
        </button>
      </div>

      <div>
        <h3 className="text-base font-semibold text-text-secondary mb-3">최근 문서</h3>
        {documentListItems.length > 0 ? (
          <ul className="space-y-1">
            {documentListItems.map((item) => (
              <ListItem 
                key={item.id} 
                id={item.id}
                name={item.name}
                type={item.type}
                icon={FileText}
                onClick={item.onClick} 
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-muted">최근 문서가 없습니다.</p>
        )}
      </div>
    </div>
  );
} 