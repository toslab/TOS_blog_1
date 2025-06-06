//features/dashboard/components/views/documents/DocumentsFilters.tsx

'use client';

import React from 'react';
import { Input } from '@/components/dashboard_UI/input';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
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
import { Search, Filter, X, SortAsc } from 'lucide-react';
import { DocumentCategory } from '@/features/dashboard/types/document';
import { cn } from '@/lib/utils';

interface DocumentsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  categories: DocumentCategory[];
  availableTags: string[];
  sortBy: 'updated' | 'created' | 'name';
  onSortChange: (sort: 'updated' | 'created' | 'name') => void;
}

export default function DocumentsFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  categories,
  availableTags,
  sortBy,
  onSortChange,
}: DocumentsFiltersProps) {
  const [showTagFilter, setShowTagFilter] = React.useState(false);

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    selectedTags.length;

  const clearFilters = () => {
    onCategoryChange('all');
    onTagsChange([]);
  };

  return (
    <div className="flex items-center gap-4 flex-1">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="문서 검색..."
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 카테고리</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
                <span className="text-xs text-gray-500 ml-auto">
                  {category.documentCount}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tag Filter */}
      <Popover open={showTagFilter} onOpenChange={setShowTagFilter}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "gap-2",
              selectedTags.length > 0 && "border-purple-500"
            )}
          >
            <Filter className="w-4 h-4" />
            태그
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">태그 필터</h4>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      onTagsChange(selectedTags.filter(t => t !== tag));
                    } else {
                      onTagsChange([...selectedTags, tag]);
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTagsChange([])}
                className="w-full"
              >
                태그 필터 초기화
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-32">
          <SortAsc className="w-4 h-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">최근 수정</SelectItem>
          <SelectItem value="created">최근 생성</SelectItem>
          <SelectItem value="name">이름순</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
        >
          <X className="w-4 h-4 mr-1" />
          필터 초기화
        </Button>
      )}
    </div>
  );
}