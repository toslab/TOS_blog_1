'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import type { NavigationItem } from '../../contexts/SidebarContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SidebarProps {
  isMobile?: boolean;
}

export default function Sidebar({ isMobile }: SidebarProps) {
  const {
    collapsed,
    toggleSidebarCollapse,
    activeNavItem,
    navigationItems,
    handleNavItemClick,
    setSidebarOpen,
    documentPanelOpen,
    projectPanelOpen,
  } = useSidebar();

  const internalHandleLinkClick = (item: NavigationItem) => {
    handleNavItemClick(item);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const internalHandleSettingsClick = () => {
    const settingsItem: NavigationItem = { name: 'Settings', href: '#', icon: Settings };
    handleNavItemClick(settingsItem);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`flex grow flex-col gap-y-5 overflow-y-auto bg-white px-2 pb-4 pt-4 dark:bg-gray-800 ${isMobile ? 'px-6' : 'px-2'}`}>
      {!isMobile && (
        <div className="flex justify-end px-1 mb-2">
          <button 
            onClick={toggleSidebarCollapse}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <PanelLeftClose className="size-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>
        </div>
      )}
      {isMobile && <div className="h-8 flex items-center justify-between px-4">
        <span className="text-lg font-semibold text-gray-800 dark:text-white">Menu</span> 
        </div>}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => internalHandleLinkClick(item)}
                    className={classNames(
                      activeNavItem === item.name || 
                      (item.name === 'Documents' && documentPanelOpen) || 
                      (item.name === 'Projects' && projectPanelOpen)
                        ? 'bg-gray-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                      collapsed && !isMobile ? 'justify-center' : '',
                    )}
                  >
                    <item.icon
                      className={classNames(
                        activeNavItem === item.name || (item.name === 'Documents' && documentPanelOpen) || (item.name === 'Projects' && projectPanelOpen)
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-indigo-400',
                        'h-6 w-6 shrink-0',
                      )}
                      aria-hidden="true"
                    />
                    <AnimatePresence>
                      {(!collapsed || isMobile) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="#"
              onClick={internalHandleSettingsClick}
              className={classNames(
                activeNavItem === 'Settings'
                  ? 'bg-gray-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-300'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-indigo-400',
                'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                collapsed && !isMobile ? 'justify-center' : ''
              )}
            >
              <Settings
                className={classNames(
                  activeNavItem === 'Settings'
                  ? 'text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-indigo-400',
                  'h-6 w-6 shrink-0'
                )}
                aria-hidden="true"
              />
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
} 