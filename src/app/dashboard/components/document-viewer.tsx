"use client"

import { useState } from "react"
import { Button } from "@/components/Button"
import { marked } from "marked"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/dashboard_UI/dialog"

interface DocumentViewerProps {
  document: {
    id: number
    title: string
    category: string
    lastUpdated: string
    author: string
    content: string
  }
  onClose: () => void
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(document.content)

  // 마크다운을 HTML로 변환
  const renderMarkdown = () => {
    return { __html: marked(content) }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{document.title}</DialogTitle>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              {document.category}
            </span>
            <span className="mr-2">작성자: {document.author}</span>
            <span>마지막 수정: {document.lastUpdated}</span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <textarea
              className="w-full h-full min-h-[400px] p-4 border rounded-md font-mono"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div className="prose max-w-none" dangerouslySetInnerHTML={renderMarkdown()} />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "미리보기" : "편집"}
          </Button>
          {isEditing && <Button onClick={() => setIsEditing(false)}>저장</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
