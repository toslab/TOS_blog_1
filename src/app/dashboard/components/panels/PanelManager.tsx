'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../../contexts/SidebarContext';
import { useSearch } from '../../contexts/SearchContext';
import DocumentViewer from '../document-viewer';
import DocumentPanel from './DocumentPanel';
import ProjectPanel from './ProjectPanel';
import DocumentArchiveDialog from './DocumentArchiveDialog';
import { Document, Project } from '../../types';

interface PanelManagerProps {
  children: ReactNode;
  documentsData: Document[];
  onOpenDocumentEditor: () => void;
  handleDocumentClick: (doc: Document) => void;
}

export default function PanelManager({
  children,
  documentsData,
  onOpenDocumentEditor,
  handleDocumentClick,
}: PanelManagerProps) {
  const {
    documentPanelOpen,
    setDocumentPanelOpen,
    projectPanelOpen,
    setProjectPanelOpen,
    isMobileView,
  } = useSidebar();

  const {
    filteredProjects,
    filteredDocuments,
  } = useSearch();

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentArchiveOpen, setDocumentArchiveOpenInternal] = useState(false);

  // 패널 스타일 정의
  const panelBaseStyle: React.CSSProperties = {
    width: isMobileView ? 'var(--panel-width-mobile, 100%)' : 'var(--panel-width)',
    position: 'fixed',
    top: 0,
    paddingTop: 'var(--header-height, 4rem)',
    height: '100vh',
    zIndex: 'var(--z-panel, 20)',
  };

  const panelDesktopStyle: React.CSSProperties = {
    ...panelBaseStyle,
    left: 'var(--sidebar-width)',
    animation: 'slideInFromLeft var(--transition-normal, 250ms) var(--ease-out, cubic-bezier(0, 0, 0.2, 1))',
  };

  const panelMobileStyle: React.CSSProperties = {
    ...panelBaseStyle,
    left: 0,
    width: '100%',
    paddingTop: 'calc(var(--header-height, 4rem) + 1rem)',
    animation: 'slideInFromBottom var(--transition-normal, 250ms) var(--ease-out, cubic-bezier(0, 0, 0.2, 1))',
  };

  const internalAndExternalDocumentClickHandler = (doc: Document) => {
    handleDocumentClick(doc);
    setSelectedDocument(doc);
    setDocumentPanelOpen(false);
    setDocumentArchiveOpenInternal(false);
    setProjectPanelOpen(false);
  };

  const closeDocumentViewer = () => {
    setSelectedDocument(null);
  };

  return (
    <>
      {/* Document Panel */}
      <AnimatePresence>
        {documentPanelOpen && (
          <div
            className="panel-container overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--sidebar-background))] shadow-lg"
            style={isMobileView ? panelMobileStyle : panelDesktopStyle}
          >
            <DocumentPanel 
              isOpen={documentPanelOpen} 
              onClose={() => setDocumentPanelOpen(false)}
              documentsData={documentsData}
              onDocumentClick={internalAndExternalDocumentClickHandler}
              onOpenDocumentEditor={onOpenDocumentEditor}
              onOpenDocumentArchive={() => setDocumentArchiveOpenInternal(true)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Project Panel */}
      <AnimatePresence>
        {projectPanelOpen && (
          <div
            className="panel-container overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--sidebar-background))] shadow-lg"
            style={isMobileView ? panelMobileStyle : panelDesktopStyle}
          >
            <ProjectPanel 
              isOpen={projectPanelOpen} 
              onClose={() => setProjectPanelOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Document Archive Dialog */}
      <DocumentArchiveDialog 
        isOpen={documentArchiveOpen}
        onClose={() => setDocumentArchiveOpenInternal(false)}
        onDocumentClick={internalAndExternalDocumentClickHandler}
      />

      {/* DocumentViewer */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" 
             style={{
               zIndex: 'var(--z-document-viewer, 60)',
               animation: 'fadeIn var(--transition-fast, 150ms) var(--ease-out, cubic-bezier(0, 0, 0.2, 1))'
             }}>
          <DocumentViewer document={selectedDocument} onClose={closeDocumentViewer} />
        </div>
      )}

      {/* 자식 컴포넌트 렌더링 */}
      {children}
    </>
  );
} 