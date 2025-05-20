'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Underline as UnderlineIcon,
  Strikethrough,
  Palette,
  Image as ImageIcon,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { useEditor2 } from '../../contexts/EditorContext';
import { cn } from '@/lib/utils';

// 색상 목록 정의
const CSS_COLORS = [
  "var(--text-primary)", "var(--text-secondary)", "var(--text-muted)", 
  "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--destructive))",
];
const HEX_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
];

const ToolbarButton = ({ isActive, onClick, title, children, className }: {
  isActive?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    size="icon"
    onClick={onClick}
    className={cn(
        "h-8 w-8 p-1.5 rounded-sm",
        isActive ? "bg-active-item-background text-active-item-foreground hover:bg-active-item-background/90" 
                 : "text-icon-color hover:bg-hover-bg-light hover:text-text-primary",
        className
    )}
    title={title}
    type="button"
  >
    {children}
  </Button>
);

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

  const handleApplyColor = (colorValue: string) => {
    if (colorValue.startsWith('var(')) {
      const tempResolvedColor = getComputedStyle(document.documentElement).getPropertyValue(colorValue.slice(4, -1)).trim();
      applyColor(tempResolvedColor || 'hsl(var(--primary))');
    } else {
      applyColor(colorValue);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-panel-background sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-0.5 p-0.5 bg-background rounded-md border border-border">
        <ToolbarButton isActive={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="제목 1">
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="제목 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="제목 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-0.5 p-0.5 bg-background rounded-md border border-border">
        <ToolbarButton isActive={editor.isActive("bold")} onClick={applyBold} title="굵게">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="기울임">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄">
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="취소선">
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
      </div>
      
      <div className="relative flex items-center gap-0.5 p-0.5 bg-background rounded-md border border-border">
        <ToolbarButton isActive={colorPickerOpen} onClick={toggleColorPicker} title="글자 색상">
          <Palette className="h-4 w-4" />
        </ToolbarButton>
        {colorPickerOpen && (
          <div
            ref={colorPickerRef}
            className="absolute z-50 top-full left-0 mt-1 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border p-3 w-auto min-w-[200px]"
          >
            <h3 className="text-sm font-medium mb-2 text-text-primary">글자 색상</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {[...CSS_COLORS, ...HEX_COLORS].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-sm border border-border cursor-pointer hover:ring-2 hover:ring-ring ring-offset-1 ring-offset-popover transition-all"
                  style={{ backgroundColor: color.startsWith('var(') ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue(color.slice(4,-1)).trim() || '0 0% 0%'})` : color }}
                  onClick={() => handleApplyColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-0.5 p-0.5 bg-background rounded-md border border-border">
        <ToolbarButton isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="글머리 기호 목록">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="번호 매기기 목록">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive("link")} onClick={() => {
          const url = window.prompt("URL 입력:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} title="링크 삽입">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
      
      <div className="flex items-center gap-0.5 p-0.5 bg-background rounded-md border border-border">
        <ToolbarButton isActive={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="왼쪽 정렬">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="가운데 정렬">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="오른쪽 정렬">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton isActive={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="양쪽 정렬">
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-0.5 p-0.5 bg-background rounded-md border border-border">
        <ToolbarButton onClick={insertImage} title="이미지 삽입">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertVideo} title="YouTube 비디오 삽입">
          <Video className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
} 