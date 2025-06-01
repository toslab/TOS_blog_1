'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ChevronDown, ChevronUp } from 'lucide-react'; // 확장/축소 아이콘 추가
import { cn } from '@/lib/utils';

export interface SubMenuItem {
  id: string;
  name: string;
  href?: string;
  icon?: LucideIcon;
  type: 'link' | 'header' | 'separator' | 'action';
  isActive?: boolean;
  badgeCount?: number;
  onClick?: () => void;
  isExpandable?: boolean; // 확장 가능한지 여부 (하위 메뉴가 있을 경우)
  isExpanded?: boolean;  // 현재 확장되었는지 여부
  description?: string; // description prop 추가
  imageUrl?: string; // imageUrl prop 추가
  statusText?: string; // statusText prop 추가
  statusClass?: string; // statusClass prop 추가 (배지 스타일용)
  // 하위 메뉴 아이템들 (isExpandable일 경우)
  // subItems?: SubMenuItem[]; 
}

// ListItemProps는 SubMenuItem의 모든 속성을 포함하거나 확장할 수 있습니다.
export interface ListItemProps extends SubMenuItem {}

const ListItem: React.FC<ListItemProps> = ({
  id,
  name,
  href,
  icon: IconComponent,
  type,
  isActive = false,
  badgeCount,
  onClick,
  isExpandable = false,
  isExpanded = false,
  description, // description prop 사용
  imageUrl,
  statusText,
  statusClass,
  // subItems,
}) => {

  if (type === 'separator') {
    return <hr className="my-2 border-border" />;
  }

  if (type === 'header') {
    return (
      <div 
        className="px-3.5 py-2 text-sm font-semibold text-text-secondary tracking-wider uppercase"
        id={id}
      >
        {name}
      </div>
    );
  }

  const baseClasses = cn(
    "flex items-center gap-x-3.5 py-2.5 px-3.5 rounded-lg text-sm font-medium group transition-all duration-200 ease-in-out w-full",
    isActive 
      ? "bg-active-item-background text-active-item-foreground shadow-sm hover:bg-active-item-background/90"
      : "text-text-primary hover:bg-hover-bg-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    type === 'link' && href ? "" : "cursor-pointer",
    onClick ? "" : (type === 'link' && !href ? "cursor-not-allowed opacity-60" : "") // href 없는 link는 비활성
  );

  const iconClasses = cn(
    "h-icon-size w-icon-size flex-shrink-0", // CSS 변수 사용 (--icon-size)
    isActive ? "text-active-item-foreground" : "text-icon-color group-hover:text-text-primary"
  );

  const content = (
    <>
      <div className="flex items-center flex-1 min-w-0">
        {imageUrl && <img src={imageUrl} alt="" className="h-8 w-8 rounded-full mr-3 flex-shrink-0" />} {/* 이미지 표시 추가 */}
        {!imageUrl && IconComponent && <IconComponent className={iconClasses} strokeWidth={isActive ? 'var(--icon-stroke-width-active)' : 'var(--icon-stroke-width)'} />} {/* 이미지 없을 때 아이콘 표시 */} 
        <div className="flex-1 min-w-0">
          <span className="block truncate font-medium text-text-primary group-hover:text-active-item-foreground">{name}</span>
          {description && <span className="block truncate text-xs text-text-muted group-hover:text-active-item-foreground/80">{description}</span>}
        </div>
      </div>
      <div className="flex items-center ml-auto pl-2 flex-shrink-0">
        {statusText && (
            <span className={cn("text-xs px-2 py-0.5 rounded-full whitespace-nowrap mr-2", statusClass)}>
                {statusText}
            </span>
        )} {/* 상태 텍스트 배지 추가 */}
        {badgeCount && badgeCount > 0 && (
          <span 
            className={cn(
              "py-0.5 px-2 rounded-full text-xs font-semibold",
              isActive 
                ? "bg-active-item-foreground text-active-item-background"
                : "bg-notification-badge-bg text-notification-badge-text"
            )}
          >
            {badgeCount}
          </span>
        )}
        {isExpandable && (
          isExpanded 
            ? <ChevronUp className={cn("h-4 w-4 text-icon-color", isActive && "text-active-item-foreground")} /> 
            : <ChevronDown className={cn("h-4 w-4 text-icon-color", isActive && "text-active-item-foreground")} />
        )}
      </div>
    </>
  );

  if (type === 'link' && href) {
    return (
      <li>
        <Link href={href} className={baseClasses} aria-current={isActive ? 'page' : undefined}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button 
        type="button" 
        className={baseClasses} 
        onClick={onClick} 
        aria-pressed={isActive && type === 'action' ? true : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
        disabled={type === 'link' && !href} // href 없는 link는 비활성
      >
        {content}
      </button>
    </li>
  );
};

export default ListItem; 