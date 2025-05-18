'use client';

import React from 'react';
import { EditorProvider } from '../../contexts/EditorContext';
import EditorHeader from './EditorHeader';
import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';

export default function RichTextEditor() {
  return (
    <EditorProvider>
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <EditorHeader />
        <EditorToolbar />
        <EditorContent />
      </div>
    </EditorProvider>
  );
} 