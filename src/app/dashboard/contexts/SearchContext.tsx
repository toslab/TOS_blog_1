'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';
import { Document, Project } from '../types';

interface SearchContextType {
  // 검색 상태
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  
  // 필터링된 데이터
  filteredProjects: Project[];
  filteredDocuments: Document[];
  
  // 데이터 액세스
  allProjects: Project[];
  allDocuments: Document[];
  
  // 검색 유틸리티
  clearSearch: () => void;
  searchInContent: (content: string) => boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
  projectsData: Project[];
  documentsData: Document[];
}

export function SearchProvider({ children, projectsData, documentsData }: SearchProviderProps) {
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState("");
  
  // 메모이제이션된 필터링 로직
  const filteredProjects = useMemo(() => {
    if (searchQuery.trim() === "") return projectsData;
    
    const query = searchQuery.toLowerCase();
    return projectsData.filter((project) =>
      project.name.toLowerCase().includes(query) ||
      project.status.toLowerCase().includes(query) ||
      project.team.toLowerCase().includes(query)
    );
  }, [searchQuery, projectsData]);
  
  const filteredDocuments = useMemo(() => {
    if (searchQuery.trim() === "") return documentsData;
    
    const query = searchQuery.toLowerCase();
    return documentsData.filter((doc) =>
      doc.title.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query) ||
      doc.author.toLowerCase().includes(query) ||
      (doc.content && doc.content.toLowerCase().includes(query))
    );
  }, [searchQuery, documentsData]);
  
  // 유틸리티 함수
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);
  
  const searchInContent = useCallback((content: string) => {
    if (!searchQuery.trim() || !content) return false;
    return content.toLowerCase().includes(searchQuery.toLowerCase());
  }, [searchQuery]);

  return (
    <SearchContext.Provider 
      value={{
        // 검색 상태
        searchQuery,
        setSearchQuery,
        
        // 필터링된 데이터
        filteredProjects,
        filteredDocuments,
        
        // 원본 데이터
        allProjects: projectsData,
        allDocuments: documentsData,
        
        // 유틸리티 함수
        clearSearch,
        searchInContent,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 