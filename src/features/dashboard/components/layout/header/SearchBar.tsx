// features/dashboard/components/layout/header/SearchBar.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Command, FileText, Briefcase, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/features/dashboard/hooks/useDebounce';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'project' | 'document' | 'task' | 'event';
  href: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  // 검색 결과 가져오기
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      // TODO: API 호출
      setTimeout(() => {
        setResults([
          {
            id: '1',
            title: 'K-Tea 프로젝트',
            subtitle: 'PRJ-001',
            type: 'project',
            href: '/dashboard/projects/1'
          },
          {
            id: '2',
            title: '제품 기획서.docx',
            subtitle: '어제 수정됨',
            type: 'document',
            href: '/dashboard/documents/2'
          }
        ]);
        setIsLoading(false);
      }, 500);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project': return Briefcase;
      case 'document': return FileText;
      case 'event': return Calendar;
      default: return FileText;
    }
  };

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="검색 (Cmd+K)"
          className={cn(
            "w-full h-10 pl-10 pr-10 text-sm",
            "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
            "rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500",
            "placeholder:text-gray-400"
          )}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Search Results */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              검색 중...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result) => {
                const Icon = getIcon(result.type);
                return (
                  <li key={result.id}>
                    <button
                      onClick={() => handleSelect(result)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.title}
                        </div>
                        {result.subtitle && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {result.type}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}