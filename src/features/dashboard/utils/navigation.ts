// features/dashboard/utils/navigation.ts

import { 
  FileText, Users, CheckSquare, Calendar, 
  Settings, Plus, Archive, Clock, Filter,
  User, Lock, Bell, Shield, CreditCard,
  Activity, ShoppingBag, Package, Brain, 
  GitBranch, BarChart3
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  type: 'link' | 'action' | 'separator' | 'header';
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
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
      { id: 'new-project', name: '새 프로젝트', type: 'action', icon: Plus },
      { id: 'new-document', name: '새 문서', type: 'action', icon: Plus },
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
  '/dashboard/articles': {
    title: '아티클',
    items: [
      { id: 'all-articles', name: '모든 아티클', type: 'link', href: '/dashboard/articles', icon: FileText },
      { id: 'my-articles', name: '내 아티클', type: 'link', href: '/dashboard/articles?filter=mine', icon: Users },
      { id: 'drafts', name: '초안', type: 'link', href: '/dashboard/articles?status=draft', icon: FileText },
      { id: 'published', name: '발행됨', type: 'link', href: '/dashboard/articles?status=published', icon: CheckSquare },
      { id: 'separator-1', name: '', type: 'separator' },
      { id: 'new-article', name: '새 아티클 작성', type: 'action', icon: Plus },
    ],
    footer: '아티클 작성 및 관리'
  },
  '/dashboard/calendar': {
    title: '예약관리',
    items: [
      { id: 'month-view', name: '월간 보기', type: 'link', href: '/dashboard/calendar?view=month', icon: Calendar },
      { id: 'week-view', name: '주간 보기', type: 'link', href: '/dashboard/calendar?view=week', icon: Calendar },
      { id: 'day-view', name: '일간 보기', type: 'link', href: '/dashboard/calendar?view=day', icon: Calendar },
      { id: 'separator-1', name: '', type: 'separator' },
      { id: 'new-event', name: '새 일정', type: 'action', icon: Plus },
    ],
    footer: '예약 및 일정 관리'
  },
  '/dashboard/ecommerce': {
    title: '이커머스',
    items: [
      { id: 'products', name: '상품 관리', type: 'link', href: '/dashboard/ecommerce/products', icon: ShoppingBag },
      { id: 'orders', name: '주문 관리', type: 'link', href: '/dashboard/ecommerce/orders', icon: Package },
      { id: 'customers', name: '고객 관리', type: 'link', href: '/dashboard/ecommerce/customers', icon: Users },
      { id: 'separator-1', name: '', type: 'separator' },
      { id: 'analytics', name: '분석', type: 'link', href: '/dashboard/ecommerce/analytics', icon: BarChart3 },
    ],
    footer: '온라인 스토어 관리'
  },
  '/dashboard/inventory': {
    title: '재고 관리',
    items: [
      { id: 'stock', name: '재고 현황', type: 'link', href: '/dashboard/inventory', icon: Package },
      { id: 'incoming', name: '입고 관리', type: 'link', href: '/dashboard/inventory/incoming', icon: Plus },
      { id: 'outgoing', name: '출고 관리', type: 'link', href: '/dashboard/inventory/outgoing', icon: Archive },
      { id: 'separator-1', name: '', type: 'separator' },
      { id: 'reports', name: '보고서', type: 'link', href: '/dashboard/inventory/reports', icon: FileText },
    ],
    footer: '재고 추적 및 관리'
  },
  '/dashboard/research': {
    title: 'AI 연구',
    items: [
      { id: 'chat', name: 'AI 채팅', type: 'link', href: '/dashboard/research/chat', icon: Brain },
      { id: 'models', name: '모델 관리', type: 'link', href: '/dashboard/research/models', icon: Brain },
      { id: 'prompts', name: '프롬프트 라이브러리', type: 'link', href: '/dashboard/research/prompts', icon: FileText },
      { id: 'separator-1', name: '', type: 'separator' },
      { id: 'experiments', name: '실험', type: 'link', href: '/dashboard/research/experiments', icon: Activity },
    ],
    footer: 'AI 연구 및 실험'
  },
  '/dashboard/workflow': {
    title: '워크플로우',
    items: [
      { id: 'automation', name: '자동화', type: 'link', href: '/dashboard/workflow/automation', icon: GitBranch },
      { id: 'templates', name: '템플릿', type: 'link', href: '/dashboard/workflow/templates', icon: FileText },
      { id: 'running', name: '실행 중', type: 'link', href: '/dashboard/workflow/running', icon: Activity },
      { id: 'history', name: '실행 기록', type: 'link', href: '/dashboard/workflow/history', icon: Clock },
    ],
    footer: '업무 자동화 관리'
  },
  '/dashboard/analytics': {
    title: '분석',
    items: [
      { id: 'overview', name: '개요', type: 'link', href: '/dashboard/analytics', icon: BarChart3 },
      { id: 'sales', name: '매출 분석', type: 'link', href: '/dashboard/analytics/sales', icon: BarChart3 },
      { id: 'traffic', name: '트래픽 분석', type: 'link', href: '/dashboard/analytics/traffic', icon: Activity },
      { id: 'performance', name: '성과 분석', type: 'link', href: '/dashboard/analytics/performance', icon: Activity },
    ],
    footer: '비즈니스 인사이트'
  },
  '/dashboard/settings': {
    title: '설정',
    items: [
      { id: 'profile', name: '프로필', type: 'link', href: '/dashboard/settings?tab=profile', icon: User },
      { id: 'security', name: '보안', type: 'link', href: '/dashboard/settings?tab=security', icon: Lock },
      { id: 'notifications', name: '알림', type: 'link', href: '/dashboard/settings?tab=notifications', icon: Bell },
      { id: 'subscription', name: '구독', type: 'link', href: '/dashboard/settings?tab=subscription', icon: Shield },
      { id: 'billing', name: '결제', type: 'link', href: '/dashboard/settings?tab=billing', icon: CreditCard },
      { id: 'team', name: '팀', type: 'link', href: '/dashboard/settings?tab=team', icon: Users },
    ],
    footer: '계정 및 환경설정 관리'
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

// 액션 핸들러를 위한 헬퍼 함수 (개선됨)
export function handleMenuAction(actionId: string, router: any) {
  console.log(`Handling action: ${actionId}`);
  
  switch (actionId) {
    case 'new-project':
      router.push('/dashboard/projects/new');
      break;
    case 'new-document':
    case 'new-doc':
      router.push('/dashboard/documents/new');
      break;
    case 'new-article':
      router.push('/dashboard/articles/new');
      break;
    case 'new-event':
      router.push('/dashboard/calendar/new');
      break;
    default:
      console.log(`No handler for action: ${actionId}`);
  }
}