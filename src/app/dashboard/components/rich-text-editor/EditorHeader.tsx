'use client';

import React from 'react';
import { Button } from "@/components/Button";
import { Save, Send, Code } from "lucide-react";
import { useEditor2 } from '../../contexts/EditorContext';
import { cn } from '@/lib/utils';

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
    <div className="flex items-center justify-between p-panel-padding-x py-3 border-b border-border">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold border-none focus:outline-none focus:ring-0 bg-transparent text-text-primary placeholder:text-text-muted w-full truncate"
          placeholder="문서 제목"
        />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button 
          variant="outline"
          onClick={toggleMarkdownMode} 
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary hover:bg-hover-bg-light"
        >
          <Code className="w-4 h-4" />
          <span className="text-sm font-medium">
            {editorMode === 'markdown' ? "에디터" : "마크다운"}
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={saveStatus !== "idle"}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            saveStatus === "saved" ? "text-green-600 border-green-500 hover:bg-green-50" : "text-text-secondary hover:text-text-primary hover:bg-hover-bg-light"
          )}
        >
          <Save className="w-4 h-4" />
          {saveStatus === "idle" && "임시저장"}
          {saveStatus === "saving" && "저장 중..."}
          {saveStatus === "saved" && "저장됨"}
        </Button>
        <Button 
          onClick={handlePublish} 
          disabled={publishStatus !== "idle"}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90",
            publishStatus === "published" && "bg-green-600 hover:bg-green-700"
          )}
        >
          <Send className="w-4 h-4" />
          {publishStatus === "idle" && "발행하기"}
          {publishStatus === "publishing" && "발행 중..."}
          {publishStatus === "published" && "발행 완료"}
        </Button>
      </div>
    </div>
  );
} 