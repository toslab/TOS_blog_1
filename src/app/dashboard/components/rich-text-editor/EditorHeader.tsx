'use client';

import React from 'react';
import { Button } from "@/components/Button";
import { Save, Send, Code } from "lucide-react";
import { useEditor2 } from '../../contexts/EditorContext';

export default function EditorHeader() {
  const {
    title,
    setTitle,
    saveStatus,
    publishStatus,
    toggleMarkdownMode,
    handleSave,
    handlePublish,
    editorMode,
  } = useEditor2();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold border-none focus:outline-none focus:ring-0 bg-transparent dark:text-white"
          placeholder="제목 없음"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={toggleMarkdownMode} 
          className="flex items-center gap-1"
        >
          <Code className="w-4 h-4" />
          {editorMode === 'markdown' ? "Rich Text" : "Markdown"}
        </Button>
        <Button
          onClick={handleSave}
          disabled={saveStatus !== "idle"}
          className="flex items-center gap-1"
        >
          <Save className="w-4 h-4" />
          {saveStatus === "idle" && "임시저장"}
          {saveStatus === "saving" && "저장 중..."}
          {saveStatus === "saved" && "저장됨!"}
        </Button>
        <Button 
          onClick={handlePublish} 
          disabled={publishStatus !== "idle"}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Send className="w-4 h-4" />
          {publishStatus === "idle" && "발행"}
          {publishStatus === "publishing" && "발행 중..."}
          {publishStatus === "published" && "발행됨!"}
        </Button>
      </div>
    </div>
  );
} 