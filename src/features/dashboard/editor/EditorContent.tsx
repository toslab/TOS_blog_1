'use client';

import React from 'react';
import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { useEditor2 } from '../../../app/dashboard/contexts/EditorContext';
import SlashCommandMenu from './SlashCommandMenu';
import MarkdownEditor from './MarkdownEditor';
import { cn } from '@/lib/utils';

export default function EditorContent() {
  const { 
    editor, 
    editorMode, 
    editorRef, 
    handleEditorClick 
  } = useEditor2();

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={cn(
        "flex-1 overflow-y-auto relative",
        editorMode === 'richtext' ? "p-panel-padding-x lg:p-panel-padding-y" : "p-0" // 'wysiwyg'를 'richtext'로 변경
      )} 
      ref={editorRef} 
      onClick={handleEditorClick}
    >
      {editorMode === 'markdown' ? (
        <MarkdownEditor /> // MarkdownEditor 내부 스타일도 확인 필요
      ) : (
        <>
          <TiptapEditorContent 
            editor={editor} 
            // prose 스타일은 dashboard.css에서 관리되도록 하고,
            // 여기서는 기본 배경 및 텍스트 색상만 지정하거나, 
            // dashboard.css의 .ProseMirror 스타일과 일치하도록 조정합니다.
            className={cn(
              "prose prose-sm sm:prose-base dark:prose-invert max-w-none h-full flex-1", // dark:prose-invert 추가
              "focus:outline-none",
              "text-text-primary bg-transparent"
            )}
          />
          <SlashCommandMenu />
        </>
      )}
    </div>
  );
} 