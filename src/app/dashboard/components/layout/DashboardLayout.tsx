'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent } from '@/components/dashboard_UI/sheet';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebar, NavigationItem } from '../../contexts/SidebarContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

function InnerDashboardLayout({ children }: DashboardLayoutProps) {
  const {
    sidebarOpen,
    setSidebarOpen,
    collapsed,
  } = useSidebar();

  const sidebarWidth = collapsed ? "5rem" : "18rem";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-white dark:bg-gray-800">
          <Sidebar
            isMobile
          />
        </SheetContent>
      </Sheet>

      <motion.div
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Sidebar
        />
      </motion.div>

      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          marginLeft: `var(--sidebar-width, ${sidebarWidth})`,
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayoutWithProvider(props: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <InnerDashboardLayout {...props} />
    </SidebarProvider>
  );
} 