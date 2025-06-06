//features/dashboard/types/document.ts

export interface Document {
    id: string;
    title: string;
    content: string;
    contentHtml?: string;
    excerpt?: string;
    author: {
      id: string;
      username: string;
      fullName: string;
      profileImage?: string;
    };
    type: 'markdown' | 'richtext' | 'code' | 'diagram';
    status: 'draft' | 'private' | 'shared' | 'published';
    tags: string[];
    category?: {
      id: string;
      name: string;
      color: string;
    };
    collaborators?: Array<{
      id: string;
      username: string;
      fullName: string;
      profileImage?: string;
      permission: 'view' | 'edit' | 'admin';
    }>;
    metadata: {
      wordCount: number;
      readingTime: number;
      lastSaved?: string;
      version: number;
    };
    settings: {
      isTemplate: boolean;
      templateName?: string;
      allowComments: boolean;
      allowExport: boolean;
      exportFormats?: ('pdf' | 'docx' | 'html' | 'markdown')[];
    };
    createdAt: string;
    updatedAt: string;
    lastAccessedAt?: string;
    isFavorite?: boolean;
    parentId?: string; // For document hierarchy
    attachments?: Array<{
      id: string;
      name: string;
      url: string;
      size: number;
      type: string;
    }>;
  }
  
  export interface DocumentCategory {
    id: string;
    name: string;
    color: string;
    icon?: string;
    documentCount: number;
  }
  
  export interface DocumentTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
    category?: string;
    tags?: string[];
    thumbnail?: string;
  }
