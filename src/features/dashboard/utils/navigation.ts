// features/dashboard/utils/navigation.ts

import { 
    FileText, Users, CheckSquare, Calendar, 
    Settings, Plus, Archive, Clock, Filter 
  } from 'lucide-react';
  
  export interface MenuItem {
    id: string;
    name: string;
    type: 'link' | 'action' | 'separator' | 'header';
    href?: string;
    onClick?: () => void;
    icon?: any;
    badge?: number | string;
  }
  
  interface MenuData {
    title: string;
    items: MenuItem[];
    footer?: string;
  }
  
  const menuConfigs: Record<string, MenuData> = {
    '/dashboard': {
      title: '대시보드',
      items: [
        { id: 'overview', name: '개요', type: 'link', href: '/dashboard', icon: FileText },
        { id: 'activity', name: '최근 활동', type: 'link', href: '/dashboard/activity', icon: Clock },
        { id: 'separator-1', name: '', type: 'separator' },
        { id: 'quick-actions', name: '빠른 작업', type: 'header' },
        { id: 'new-project', name: '새 프로젝트', type: 'action', icon: Plus, onClick: () => console.log('New project') },
        { id: 'new-document', name: '새 문서', type: 'action', icon: Plus, onClick: () => console.log('New document') },
      ],
    },
    '/dashboard/projects': {
      title: '프로젝트',
      items: [
        { id: 'all-projects', name: '모든 프로젝트', type: 'link', href: '/dashboard/projects', icon: FileText },
        { id: 'my-projects', name: '내 프로젝트', type: 'link', href: '/dashboard/projects?filter=mine', icon: Users, badge: 3 },
        { id: 'archived', name: '보관된 프로젝트', type: 'link', href: '/dashboard/projects?filter=archived', icon: Archive },
        { id: 'separator-1', name: '', type: 'separator' },
        { id: 'filters', name: '필터', type: 'header' },
        { id: 'active', name: '진행중', type: 'link', href: '/dashboard/projects?status=active', icon: CheckSquare },
        { id: 'planning', name: '계획중', type: 'link', href: '/dashboard/projects?status=planning', icon: Calendar },
        { id: 'completed', name: '완료됨', type: 'link', href: '/dashboard/projects?status=completed', icon: CheckSquare },
      ],
      footer: '프로젝트 관리 및 협업'
    },
    '/dashboard/documents': {
      title: '문서 관리',
      items: [
        { id: 'all-docs', name: '모든 문서', type: 'link', href: '/dashboard/documents', icon: FileText },
        { id: 'my-docs', name: '내 문서', type: 'link', href: '/dashboard/documents?filter=mine', icon: Users },
        { id: 'shared', name: '공유된 문서', type: 'link', href: '/dashboard/documents?filter=shared', icon: Users },
        { id: 'separator-1', name: '', type: 'separator' },
        { id: 'new-doc', name: '새 문서 만들기', type: 'action', icon: Plus },
      ],
    },
  };
  
  export function getMenuItemsForPath(pathname: string, user: any): MenuData | null {
    // 정확한 경로 매칭
    if (menuConfigs[pathname]) {
      return menuConfigs[pathname];
    }
  
    // 부모 경로 매칭
    const segments = pathname.split('/');
    while (segments.length > 0) {
      segments.pop();
      const parentPath = segments.join('/') || '/';
      if (menuConfigs[parentPath]) {
        return menuConfigs[parentPath];
      }
    }
  
    return null;
  }