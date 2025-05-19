// 공통 타입 정의

/**
 * 문서 객체 타입
 */
export interface Document {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  author: string;
  content: string; 
}

/**
 * 프로젝트 객체 타입
 */
export interface Project {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
  team: string; 
}

/**
 * 대시보드 네비게이션 아이템 타입
 */
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current?: boolean; 
  hasPanel?: boolean;
}

/**
 * 패널 기본 속성 타입
 */
export interface BasePanelProps {
  isOpen: boolean;
  onClose: () => void;
} 