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
    exportFormats?: ('pdf' | 'docx' | 'html' | 'markdown' | 'latex')[];
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
  // 템플릿 관련 추가
  templateId?: string; // 적용된 템플릿 ID
  template?: DocumentTemplate; // 적용된 템플릿 정보
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
  content: string; // 기본 마크다운 콘텐츠
  category?: string;
  tags?: string[];
  thumbnail?: string;
  // 템플릿 스타일링을 위한 추가 필드
  html?: string; // HTML 템플릿 구조
  styles?: string; // CSS 스타일
  features?: string[]; // 템플릿 특징 (예: '헤더/푸터', 'TOC', '참고문헌')
  variables?: string[]; // 템플릿 변수 (예: {{title}}, {{author}}, {{date}})
  previewImage?: string; // 템플릿 미리보기 이미지
  isBuiltIn?: boolean; // 내장 템플릿 여부
  author?: {
    id: string;
    name: string;
  };
  // 템플릿 설정
  settings?: {
    pageSize?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    fontFamily?: string;
    fontSize?: number;
    lineHeight?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// 템플릿 카테고리 타입 추가
export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  templates: DocumentTemplate[];
}

// 문서 내보내기 옵션 타입
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'latex';
  templateId?: string;
  includeMetadata?: boolean;
  includeComments?: boolean;
  includeAttachments?: boolean;
  paperSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
}

// 문서 버전 타입
export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  author: {
    id: string;
    username: string;
    fullName: string;
  };
  changes?: string;
  createdAt: string;
}

// 문서 활동 타입
export interface DocumentActivity {
  id: string;
  documentId: string;
  type: 'created' | 'edited' | 'viewed' | 'shared' | 'exported' | 'commented';
  user: {
    id: string;
    username: string;
    fullName: string;
    profileImage?: string;
  };
  metadata?: any;
  createdAt: string;
}