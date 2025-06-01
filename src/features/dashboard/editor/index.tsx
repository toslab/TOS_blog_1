'use client';

import React from 'react';
import { EditorProvider } from '../../../app/dashboard/contexts/EditorContext';
import EditorHeader from './EditorHeader';
import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';
import { cn } from '@/lib/utils';
import { useSidebar } from '../../../app/dashboard/contexts/SidebarContext';

export default function RichTextEditor() {
  const { isMobileView } = useSidebar();
  return (
    <EditorProvider>
      <div 
        className={cn(
          "flex flex-col h-full bg-panel-background rounded-xl shadow-panel",
          isMobileView ? "p-0" : "",
        )}
      >
        <EditorHeader />
        <EditorToolbar />
        <EditorContent />
      </div>
    </EditorProvider>
  );
} 