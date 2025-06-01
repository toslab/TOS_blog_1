'use client';

import Reports from '../reports'; // 기존 Reports 컴포넌트 사용
import { Button } from "@/components/common/Button"; // Button 컴포넌트 사용을 위해 import

interface ReportsViewProps {
  onClose: () => void; // 보고서 뷰를 닫는 콜백 함수
}

export default function ReportsView({ onClose }: ReportsViewProps) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">웹사이트 분석 보고서</h1>
        <Button 
          outline 
          onClick={onClose} 
          className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          돌아가기
        </Button>
      </div>
      <Reports />
    </div>
  );
} 