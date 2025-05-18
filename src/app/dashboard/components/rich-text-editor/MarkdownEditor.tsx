'use client';

import React from 'react';
import { Button } from "@/components/Button";
import { Edit, Eye } from "lucide-react";
import { useEditor2 } from '../../contexts/EditorContext';
import { Textarea } from "@/components/dashboard_UI/textarea";
import { marked } from "marked";

export default function MarkdownEditor() {
  const {
    markdownContent,
    markdownView,
    setMarkdownView,
    handleMarkdownChange,
  } = useEditor2();

  return (
    <>
      <div className="flex items-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button
            className={markdownView === "edit" ? "bg-gray-200 dark:bg-gray-700" : ""}
            onClick={() => setMarkdownView("edit")}
          >
            <Edit className="w-4 h-4 mr-2" />
            편집
          </Button>
          <Button
            className={markdownView === "preview" ? "bg-gray-200 dark:bg-gray-700" : ""}
            onClick={() => setMarkdownView("preview")}
          >
            <Eye className="w-4 h-4 mr-2" />
            미리보기
          </Button>
        </div>
      </div>

      {markdownView === "edit" ? (
        <Textarea
          value={markdownContent}
          onChange={handleMarkdownChange}
          className="w-full h-full min-h-[400px] font-mono text-sm resize-none border-none focus:ring-0"
          placeholder="Markdown 코드를 입력하세요..."
        />
      ) : (
        <div
          className="prose max-w-none h-full border-none outline-none p-4 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: marked(markdownContent) }}
        />
      )}
    </>
  );
} 