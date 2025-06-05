// features/dashboard/components/layout/DashboardLayout.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import IconBar from './sidebar/IconBar';
import MainMenuPanel from './sidebar/MainMenuPanel';
import Header from './header/Header';
import ContentArea from './ContentArea';
import { useDashboardStore } from '../../stores/dashboardStore';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuPanelOpen, setMenuPanelOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setMenuPanelOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 경로 변경시 모바일 메뉴 닫기
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Icon Navigation Bar */}
      <IconBar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMenuToggle={() => {
          if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
          } else {
            setMenuPanelOpen(!menuPanelOpen);
          }
        }}
      />

      {/* Desktop Main Menu Panel */}
      {!isMobile && (
        <MainMenuPanel 
          isOpen={menuPanelOpen && !sidebarCollapsed}
          onClose={() => setMenuPanelOpen(false)}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 md:hidden">
            <MainMenuPanel 
              isOpen={true}
              onClose={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ContentArea>
          {children}
        </ContentArea>
      </div>
    </div>
  );
}