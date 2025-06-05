// features/dashboard/stores/dashboardStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardStore {
  // UI State
  sidebarCollapsed: boolean;
  menuPanelOpen: boolean;
  mobileMenuOpen: boolean;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMenuPanelOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleMenuPanel: () => void;
  
  // Preferences
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      // UI State
      sidebarCollapsed: false,
      menuPanelOpen: true,
      mobileMenuOpen: false,
      
      // Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMenuPanelOpen: (open) => set({ menuPanelOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleMenuPanel: () => set((state) => ({ menuPanelOpen: !state.menuPanelOpen })),
      
      // Preferences
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);