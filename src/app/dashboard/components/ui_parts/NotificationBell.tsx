'use client';

import { BellIcon } from '@heroicons/react/24/outline';

interface NotificationBellProps {
  // 향후 알림 개수나 클릭 시 동작을 위한 props 추가 가능
  // count?: number;
  // onClick?: () => void;
}

export default function NotificationBell({ /* count, onClick */ }: NotificationBellProps) {
  return (
    <button 
      type="button" 
      className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
      // onClick={onClick} // 필요시 클릭 핸들러 연결
    >
      <span className="sr-only">View notifications</span>
      <BellIcon aria-hidden="true" className="size-6" />
      {/* {count && count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
          {count}
        </span>
      )} */}
    </button>
  );
} 