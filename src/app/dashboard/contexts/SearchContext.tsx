'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

// 데이터 타입 정의 (PanelManager.tsx 등에서 가져오거나 공통 타입으로 분리 가능)
interface Document {
  id: number; title: string; category: string; lastUpdated: string; author: string; content: string; 
}
interface Project {
  id: number; name: string; status: string; lastUpdated: string; team: string; 
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  filteredProjects: Project[];
  filteredDocuments: Document[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
  projectsData: Project[];
  documentsData: Document[];
}

export function SearchProvider({ children, projectsData, documentsData }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documentsData);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projectsData);
      setFilteredDocuments(documentsData);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProjects(
        projectsData.filter((project) =>
          project.name.toLowerCase().includes(query) ||
          project.status.toLowerCase().includes(query) ||
          project.team.toLowerCase().includes(query)
        )
      );
      setFilteredDocuments(
        documentsData.filter((doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.category.toLowerCase().includes(query) ||
          doc.author.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, projectsData, documentsData]);

  return (
    <SearchContext.Provider 
      value={{
        searchQuery,
        setSearchQuery,
        filteredProjects,
        filteredDocuments,
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