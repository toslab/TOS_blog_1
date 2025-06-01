'use client';

import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, ChevronDownIcon, LogOut } from 'lucide-react';
import { useSidebar } from '../../../app/dashboard/contexts/SidebarContext';
import type { NavigationItem } from '../../../app/dashboard/contexts/SidebarContext';

const userNavigationItems: NavigationItem[] = [
  { name: 'Settings', href: '#', icon: Settings },
  { name: 'Sign out', href: '#', icon: LogOut },
];

interface UserProfileDropdownProps {
}

export default function UserProfileDropdown({ }: UserProfileDropdownProps) {
  const { data: session } = useSession();
  const { handleNavItemClick } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>
          <Image
            alt={session?.user?.name ?? 'User avatar'}
            src={session?.user?.image ?? `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
            width={32}
            height={32}
            className="size-8 rounded-full bg-gray-50"
          />
          <span className="hidden lg:flex lg:items-center">
            <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900 dark:text-gray-100">
              {session?.user?.name ?? 'User'}
            </span>
            <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400 dark:text-gray-500" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-800">
        {userNavigationItems.map((item) => (
          <DropdownMenuItem key={item.name} asChild className="dark:hover:bg-gray-700">
            <Link
              href={item.href}
              onClick={(e) => {
                if (item.name === 'Sign out') {
                  e.preventDefault();
                  signOut();
                } else if (item.name === 'Settings') {
                  e.preventDefault();
                  handleNavItemClick(item);
                }
              }}
              className="block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-100"
            >
              {item.icon && <item.icon className="mr-2 inline-block size-4 align-middle" />}
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 