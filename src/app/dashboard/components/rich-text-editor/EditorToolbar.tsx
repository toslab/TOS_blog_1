'use client';

import React from 'react';
import { Button } from "@/components/Button";
import {
  Bold,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  UnderlineIcon,
  Strikethrough,
  Palette,
  ImageIcon,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { useEditor2 } from '../../contexts/EditorContext';

// 색상 목록 정의
const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
];

export default function EditorToolbar() {
  const {
    editor,
    colorPickerOpen,
    colorPickerRef,
    toggleColorPicker,
    applyColor,
    applyBold,
    insertImage,
    insertVideo,
  } = useEditor2();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center p-2 border-b overflow-x-auto">
      <div className="flex items-center space-x-1">
        <Button
          variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="p-1"
          title="제목 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="p-1"
          title="제목 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="p-1"
          title="제목 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="sm"
          onClick={applyBold}
          className="p-1"
          title="굵게"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-1"
          title="기울임"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="p-1"
          title="밑줄"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="p-1"
          title="취소선"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        {/* 색상 선택 버튼 */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleColorPicker} 
            className="p-1"
            title="글자 색상"
          >
            <Palette className="w-4 h-4" />
          </Button>

          {colorPickerOpen && (
            <div
              ref={colorPickerRef}
              className="absolute z-50 top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-3 w-64 dark:bg-gray-800 dark:border-gray-700"
            >
              <h3 className="text-sm font-medium mb-2 dark:text-gray-300">글자 색상</h3>
              <div className="grid grid-cols-8 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-sm border border-gray-300 cursor-pointer dark:border-gray-600"
                    style={{ backgroundColor: color }}
                    onClick={() => applyColor(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-1"
          title="글머리 기호 목록"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="p-1"
          title="번호 매기기 목록"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => {
            const url = window.prompt("URL 입력:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className="p-1"
          title="링크 삽입"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        {/* 정렬 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          title="왼쪽 정렬"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          title="가운데 정렬"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          title="오른쪽 정렬"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-1 ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          title="양쪽 정렬"
        >
          <AlignJustify className="w-4 h-4" />
        </Button>

        {/* 이미지 삽입 버튼 */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={insertImage} 
          className="p-1"
          title="이미지 삽입"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>

        {/* 비디오 삽입 버튼 */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={insertVideo} 
          className="p-1"
          title="YouTube 비디오 삽입"
        >
          <Video className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
} 