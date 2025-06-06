// features/dashboard/components/views/projects/ProjectsFilters.tsx

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectsFiltersProps {
  filters: {
    status: string;
    myProjects: boolean;
    search: string;
  };
  onChange: (filters: any) => void;
}

export default function ProjectsFilters({ filters, onChange }: ProjectsFiltersProps) {
  const [searchValue, setSearchValue] = React.useState(filters.search);
  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ ...filters, search: searchValue });
  };

  const clearFilters = () => {
    setSearchValue('');
    onChange({
      status: 'all',
      myProjects: false,
      search: '',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="프로젝트 검색..."
            className="pl-10 pr-10"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                onChange({ ...filters, search: '' });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Select 
          value={filters.status} 
          onValueChange={(value) => onChange({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="planning">계획중</SelectItem>
            <SelectItem value="active">진행중</SelectItem>
            <SelectItem value="on_hold">보류</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
            <SelectItem value="archived">보관</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={filters.myProjects ? "default" : "outline"}
          size="sm"
          onClick={() => onChange({ ...filters, myProjects: !filters.myProjects })}
        >
          내 프로젝트
        </Button>

        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <Filter className="w-4 h-4" />
            필터 초기화
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
}