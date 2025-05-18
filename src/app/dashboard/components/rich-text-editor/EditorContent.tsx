'use client';

import React from 'react';
import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { useEditor2 } from '../../contexts/EditorContext';
import SlashCommandMenu from './SlashCommandMenu';
import MarkdownEditor from './MarkdownEditor';

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
      className="flex-1 p-4 overflow-auto min-h-[400px] relative" 
      ref={editorRef} 
      onClick={handleEditorClick}
    >
      {editorMode === 'markdown' ? (
        <MarkdownEditor />
      ) : (
        <>
          <TiptapEditorContent 
            editor={editor} 
            className="prose max-w-none h-full border-none outline-none dark:prose-invert" 
          />
          <SlashCommandMenu />
        </>
      )}
    </div>
  );
} 