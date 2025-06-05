// features/dashboard/components/layout/sidebar/NavigationItem.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface NavigationItemType {
  id: string;
  name: string;
  type: 'link' | 'action' | 'separator' | 'header';
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  badge?: number | string;
  children?: NavigationItemType[];
  isActive?: boolean;
}

interface NavigationItemProps {
  item: NavigationItemType;
  level?: number;
}

export default function NavigationItem({ item, level = 0 }: NavigationItemProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState(false);

  if (item.type === 'separator') {
    return <li className="my-2 border-t border-gray-200 dark:border-gray-700" />;
  }

  if (item.type === 'header') {
    return (
      <li className={cn(
        "px-3 py-2 text-xs font-semibold uppercase tracking-wider",
        "text-gray-500 dark:text-gray-400",
        level > 0 && "pl-8"
      )}>
        {item.name}
      </li>
    );
  }

  const isActive = item.href ? pathname === item.href : false;
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span className="flex-1 truncate">{item.name}</span>
      {item.badge && (
        <Badge variant={isActive ? "secondary" : "outline"} className="ml-2">
          {item.badge}
        </Badge>
      )}
      {hasChildren && (
        <ChevronRight className={cn(
          "w-4 h-4 transition-transform",
          expanded && "rotate-90"
        )} />
      )}
    </>
  );

  const className = cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
    "text-gray-700 dark:text-gray-300",
    "hover:bg-gray-100 dark:hover:bg-gray-700",
    isActive && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    level > 0 && "ml-4"
  );

  return (
    <li>
      {item.type === 'link' && item.href ? (
        <Link href={item.href} className={className}>
          {content}
        </Link>
      ) : (
        <button
          onClick={() => {
            if (item.onClick) item.onClick();
            if (hasChildren) setExpanded(!expanded);
          }}
          className={cn(className, "w-full")}
        >
          {content}
        </button>
      )}

      {hasChildren && expanded && (
        <ul className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavigationItem key={child.id} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}