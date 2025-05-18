'use client';

import RichTextEditor from '../rich-text-editor'; // 새로 리팩토링된 RichTextEditor를 사용
import { Button } from "@/components/Button"; // Button 컴포넌트 사용을 위해 import

interface RichTextEditorViewProps {
  onClose: () => void; // 에디터를 닫는 콜백 함수
}

export default function RichTextEditorView({ onClose }: RichTextEditorViewProps) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">새 문서 작성</h1>
        <Button 
          onClick={onClose} 
          className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          돌아가기
        </Button>
      </div>
      <RichTextEditor />
    </div>
  );
} 