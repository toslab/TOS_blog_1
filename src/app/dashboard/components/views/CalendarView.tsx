'use client';

import CalendarComponent from '../calendar'; // 기존 CalendarComponent 사용

interface CalendarViewProps {
  onCreateDocument: () => void; // 새 문서 작성 핸들러
}

export default function CalendarView({ onCreateDocument }: CalendarViewProps) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">문서 발행 일정</h1>
        {/* 캘린더 뷰 자체에는 "돌아가기" 버튼이 없을 수 있습니다. 필요시 추가 */}
      </div>
      <CalendarComponent onCreateDocument={onCreateDocument} />
    </div>
  );
} 