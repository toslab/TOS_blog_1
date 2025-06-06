'use client';

import React, { useState } from 'react';
import { Input } from '@/components/dashboard_UI/input';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/dashboard_UI/popover';
import { Search, Filter, X, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: {
    status: string;
    priority: string;
    assignee: string;
    dueDate: string;
    labels: string[];
    search: string;
  };
  onChange: (filters: any) => void;
  assignees?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  availableLabels?: string[];
}

const statusOptions = [
  { value: 'all', label: '모든 상태' },
  { value: 'todo', label: '할 일' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'review', label: '검토 중' },
  { value: 'done', label: '완료' },
];

const priorityOptions = [
  { value: 'all', label: '모든 우선순위' },
  { value: 'urgent', label: '긴급' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' },
];

const dueDateOptions = [
  { value: 'all', label: '모든 기한' },
  { value: 'overdue', label: '지연' },
  { value: 'today', label: '오늘' },
  { value: 'tomorrow', label: '내일' },
  { value: 'this_week', label: '이번 주' },
  { value: 'next_week', label: '다음 주' },
  { value: 'no_due_date', label: '기한 없음' },
];

export default function TaskFilters({ 
  filters, 
  onChange, 
  assignees = [], 
  availableLabels = [] 
}: TaskFiltersProps) {
  const [searchValue, setSearchValue] = React.useState(filters.search);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value && value.length > 0;
    if (key === 'labels') return Array.isArray(value) && value.length > 0;
    return value && value !== 'all';
  }).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ ...filters, search: searchValue });
  };

  const clearFilters = () => {
    setSearchValue('');
    onChange({
      status: 'all',
      priority: 'all',
      assignee: 'all',
      dueDate: 'all',
      labels: [],
      search: '',
    });
  };

  const toggleLabel = (label: string) => {
    const newLabels = filters.labels.includes(label)
      ? filters.labels.filter(l => l !== label)
      : [...filters.labels, label];
    onChange({ ...filters, labels: newLabels });
  };

  return (
    <div className="space-y-4">
      {/* 기본 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="작업 검색..."
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

        {/* 상태 필터 */}
        <Select 
          value={filters.status} 
          onValueChange={(value) => onChange({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 우선순위 필터 */}
        <Select 
          value={filters.priority} 
          onValueChange={(value) => onChange({ ...filters, priority: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 고급 필터 토글 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          고급 필터
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* 필터 초기화 */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X className="w-4 h-4" />
            초기화
          </Button>
        )}
      </div>

      {/* 고급 필터 */}
      {showAdvanced && (
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          {/* 담당자 필터 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              담당자
            </label>
            <Select 
              value={filters.assignee} 
              onValueChange={(value) => onChange({ ...filters, assignee: value })}
            >
              <SelectTrigger className="w-[160px]">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue placeholder="담당자 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 담당자</SelectItem>
                <SelectItem value="unassigned">미할당</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 기한 필터 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              기한
            </label>
            <Select 
              value={filters.dueDate} 
              onValueChange={(value) => onChange({ ...filters, dueDate: value })}
            >
              <SelectTrigger className="w-[140px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="기한 선택" />
              </SelectTrigger>
              <SelectContent>
                {dueDateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 라벨 필터 */}
          {availableLabels.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                라벨
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-[140px] justify-start">
                    라벨 선택
                    {filters.labels.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {filters.labels.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60" align="start">
                  <div className="space-y-2">
                    {availableLabels.map((label) => (
                      <label
                        key={label}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.labels.includes(label)}
                          onChange={() => toggleLabel(label)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      )}

      {/* 활성 필터 표시 */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status !== 'all' && (
            <Badge variant="outline" className="gap-1">
              상태: {statusOptions.find(o => o.value === filters.status)?.label}
              <button
                onClick={() => onChange({ ...filters, status: 'all' })}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.priority !== 'all' && (
            <Badge variant="outline" className="gap-1">
              우선순위: {priorityOptions.find(o => o.value === filters.priority)?.label}
              <button
                onClick={() => onChange({ ...filters, priority: 'all' })}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.labels.map((label) => (
            <Badge key={label} variant="outline" className="gap-1">
              {label}
              <button
                onClick={() => toggleLabel(label)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
