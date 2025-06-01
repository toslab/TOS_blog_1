'use client';

import { X, Search as SearchIcon, Briefcase, PlusCircle } from 'lucide-react';
import { useSearch } from '../../../app/dashboard/contexts/SearchContext';
import { useSidebar } from '../../../app/dashboard/contexts/SidebarContext';
import { Project, BasePanelProps } from '../../../app/dashboard/types';
import ListItem from '../common/ListItem';
import { cn } from '@/lib/utils';

interface ProjectPanelProps extends BasePanelProps {
  onProjectClick?: (project: Project) => void;
  onOpenNewProject?: () => void;
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

  const projectListItems = (filteredProjects || []).map(project => ({
    id: `project-${project.id}`,
    name: project.name,
    onClick: () => onProjectClick && onProjectClick(project),
    icon: Briefcase,
    type: 'link' as const,
    meta: `${project.team} - ${project.lastUpdated}`,
    status: project.status,
  }));

  return (
    <div 
      className={cn(
        "h-full overflow-y-auto bg-panel-background rounded-xl shadow-panel",
        isMobileView ? "p-4" : "p-panel-padding-x lg:p-panel-padding-y",
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">프로젝트</h2>
        {onClose && (
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md hover:bg-hover-bg-light transition-colors duration-200"
              aria-label="패널 닫기"
            >
              <X className="h-5 w-5 text-icon-color" />
            </button>
        )}
      </div>
      
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <SearchIcon className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="프로젝트 검색..."
          className="block w-full rounded-lg border-0 py-2.5 pl-11 text-sm 
                     bg-background text-text-primary 
                     ring-1 ring-inset ring-border 
                     placeholder:text-text-muted 
                     focus:ring-2 focus:ring-inset focus:ring-ring
                     transition-colors duration-200"
          aria-label="프로젝트 검색창"
        />
      </div>

      <div className="mb-6">
        {projectListItems.length > 0 ? (
          <ul className="space-y-1">
            {projectListItems.map((item) => (
              <ListItem 
                key={item.id} 
                id={item.id}
                name={item.name}
                type={item.type}
                icon={item.icon}
                onClick={item.onClick}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-sm text-text-muted">
            {searchQuery ? '검색 결과가 없습니다.' : '프로젝트가 없습니다.'}
          </div>
        )}
      </div>

      {onOpenNewProject && (
        <button
          type="button"
          onClick={onOpenNewProject}
          className="w-full flex items-center justify-center gap-x-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <PlusCircle className="h-5 w-5" />
          새 프로젝트 생성
        </button>
      )}
    </div>
  );
} 