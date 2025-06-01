'use client';

// import { useSession, signOut } from 'next-auth/react'; // UserProfileDropdown으로 이동
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // BellIcon 제거
// DropdownMenu 관련 import 제거 (UserProfileDropdown으로 이동)
// import Link from 'next/link'; // UserProfileDropdown에서 사용
// import Image from 'next/image'; // UserProfileDropdown에서 사용
// import { Settings } from 'lucide-react'; // UserProfileDropdown으로 이동
import { useSidebar } from '../../../app/dashboard/contexts/SidebarContext';
import UserProfileDropdown from '../ui_parts/UserProfileDropdown'; // 새로 생성한 컴포넌트 import
import NotificationBell from '../ui_parts/NotificationBell'; // 새로 생성한 컴포넌트 import

// userNavigation 제거 (UserProfileDropdown으로 이동)

interface DashboardHeaderProps {
  // onSettingsClick prop 제거
}

export default function DashboardHeader({ }: DashboardHeaderProps) { // props에서 onSettingsClick 제거
  const { setSidebarOpen } = useSidebar();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon aria-hidden="true" className="size-6" />
      </button>

      <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden dark:bg-gray-700" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form action="#" method="GET" className="relative flex flex-1">
           <label htmlFor="search-field" className="sr-only">
             Search
           </label>
           <MagnifyingGlassIcon
             aria-hidden="true"
             className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 dark:text-gray-500"
           />
           <input
             id="search-field"
             name="search"
             type="search"
             placeholder="Search..."
             className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
           />
         </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* 알림 아이콘 버튼을 NotificationBell 컴포넌트로 대체 */}
          <NotificationBell />

          <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />

          {/* Profile dropdown을 UserProfileDropdown 컴포넌트로 대체 */}
          <UserProfileDropdown /* onSettingsClick prop 제거 */ />
        </div>
      </div>
    </div>
  );
} 