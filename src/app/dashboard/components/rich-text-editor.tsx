"use client"

import type React from "react"
import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function RichTextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: "<p>내용을 입력하세요...</p>",
  })

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <EditorContent editor={editor} className="prose max-w-none min-h-[300px] p-4" />
        </div>
      </div>
    </div>
  )
} 