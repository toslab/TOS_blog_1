'use client';

import { X, Search as SearchIcon } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { Project, BasePanelProps } from '../../types';
import { TouchTarget } from '@/components/Button';

interface ProjectPanelProps extends BasePanelProps {
  onProjectClick?: (project: Project) => void;
  onOpenNewProject?: () => void;
}

// classNames 유틸리티 함수
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProjectPanel({
  isOpen,
  onClose,
  onProjectClick,
  onOpenNewProject,
}: ProjectPanelProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredProjects,
  } = useSearch();

  const { isMobileView } = useSidebar();

  if (!isOpen) return null;

  return (
    <div className={`
      h-full
      overflow-y-auto 
      bg-[hsl(var(--sidebar-background))]
      ${isMobileView ? 'py-6 px-4' : 'p-4'}
    `}>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold text-[hsl(var(--sidebar-foreground))]">프로젝트</h2>
        <TouchTarget>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 hover:bg-[hsl(var(--sidebar-accent))] transition-colors duration-200"
            aria-label="프로젝트 패널 닫기"
          >
            <X className="size-5 text-[hsl(var(--sidebar-foreground))]" />
          </button>
        </TouchTarget>
      </div>
      
      <div className="relative mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="size-4 text-[hsl(var(--muted-foreground))]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="프로젝트 검색..."
          className="block w-full rounded-md border-0 py-2 pl-10 text-sm 
                    bg-[hsl(var(--background))] 
                    text-[hsl(var(--foreground))]
                    ring-1 ring-inset ring-[hsl(var(--border))] 
                    placeholder:text-[hsl(var(--muted-foreground))] 
                    focus:ring-2 focus:ring-inset focus:ring-[hsl(var(--ring))]
                    transition-colors duration-200"
          aria-label="프로젝트 검색창"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(filteredProjects || []).length > 0 ? (
          (filteredProjects || []).map((project: Project) => (
            <div
              key={project.id}
              className="group rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => onProjectClick && onProjectClick(project)}
              onKeyDown={(e) => e.key === 'Enter' && onProjectClick && onProjectClick(project)}
              tabIndex={0}
              role="button"
              aria-label={`${project.name} 프로젝트 열기`}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium text-[hsl(var(--card-foreground))] group-hover:text-[hsl(var(--primary))] truncate">
                  {project.name}
                </h3>
                <span
                  className={classNames(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                    project.status === "진행 중"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : project.status === "완료"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                  )}
                >
                  {project.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                <span>{project.team}</span>
                <span>{project.lastUpdated}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-[hsl(var(--muted-foreground))] col-span-2">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={onOpenNewProject}
          className="w-full rounded-md bg-[hsl(var(--primary))] px-3 py-2 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary))]/90 transition-colors duration-200"
        >
          새 프로젝트
        </button>
      </div>
    </div>
  );
} 