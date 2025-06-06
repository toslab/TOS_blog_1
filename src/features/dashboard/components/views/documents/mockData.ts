//features/dashboard/components/views/documents/mockData.ts

import { Document, DocumentCategory } from '@/features/dashboard/types/document';

export const mockCategories: DocumentCategory[] = [
  { id: '1', name: '기술 문서', color: '#3B82F6', icon: '📘', documentCount: 12 },
  { id: '2', name: '회의록', color: '#10B981', icon: '📝', documentCount: 8 },
  { id: '3', name: '제안서', color: '#F59E0B', icon: '📄', documentCount: 5 },
  { id: '4', name: '가이드', color: '#EF4444', icon: '📖', documentCount: 7 },
  { id: '5', name: '리서치', color: '#8B5CF6', icon: '🔬', documentCount: 4 },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Next.js 14 마이그레이션 가이드',
    content: `# Next.js 14 마이그레이션 가이드

## 개요
Next.js 14로의 마이그레이션을 위한 단계별 가이드입니다.

### 주요 변경사항
- App Router 안정화
- Server Actions 정식 출시
- 성능 개선

### 마이그레이션 단계
1. 의존성 업데이트
2. 설정 파일 수정
3. 코드 변경사항 적용

\`\`\`bash
npm install next@14
\`\`\`

> **Note**: 마이그레이션 전 백업을 권장합니다.`,
    author: {
      id: 'current-user',
      username: 'john.doe',
      fullName: '김철수',
      profileImage: '/avatars/john.jpg'
    },
    type: 'markdown',
    status: 'published',
    tags: ['Next.js', 'React', '마이그레이션', '가이드'],
    category: {
      id: '4',
      name: '가이드',
      color: '#EF4444'
    },
    metadata: {
      wordCount: 156,
      readingTime: 1,
      lastSaved: '2024-01-15T10:30:00Z',
      version: 3
    },
    settings: {
      isTemplate: false,
      allowComments: true,
      allowExport: true,
      exportFormats: ['pdf', 'docx', 'markdown']
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastAccessedAt: '2024-01-15T14:00:00Z',
    isFavorite: true
  },
  {
    id: '2',
    title: '2024년 1분기 프로젝트 회의록',
    content: `# 2024년 1분기 프로젝트 회의록

**일시**: 2024년 1월 10일 오후 2시
**참석자**: 김철수, 이영희, 박민수, 정지은

## 논의 사항

### 1. 프로젝트 현황 공유
- 개발 진행률: 65%
- 주요 이슈: API 연동 지연

### 2. 향후 계획
- [ ] API 문서 업데이트
- [ ] 테스트 코드 작성
- [x] UI 디자인 검토

### 3. 액션 아이템
| 담당자 | 업무 | 기한 |
|--------|------|------|
| 김철수 | API 연동 | 1/20 |
| 이영희 | 테스트 작성 | 1/25 |`,
    author: {
      id: '2',
      username: 'jane.smith',
      fullName: '이영희',
      profileImage: '/avatars/jane.jpg'
    },
    type: 'markdown',
    status: 'shared',
    tags: ['회의록', 'Q1', '프로젝트'],
    category: {
      id: '2',
      name: '회의록',
      color: '#10B981'
    },
    collaborators: [
      {
        id: '1',
        username: 'john.doe',
        fullName: '김철수',
        profileImage: '/avatars/john.jpg',
        permission: 'edit'
      },
      {
        id: '3',
        username: 'mike.park',
        fullName: '박민수',
        profileImage: '/avatars/mike.jpg',
        permission: 'view'
      }
    ],
    metadata: {
      wordCount: 89,
      readingTime: 1,
      lastSaved: '2024-01-10T15:00:00Z',
      version: 2
    },
    settings: {
      isTemplate: false,
      allowComments: true,
      allowExport: true,
      exportFormats: ['pdf', 'docx']
    },
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T15:00:00Z',
    isFavorite: false
  },
  {
    id: '3',
    title: 'TypeScript 베스트 프랙티스',
    content: `# TypeScript 베스트 프랙티스

## 1. 타입 안정성
항상 명시적인 타입을 사용하세요.

## 2. 인터페이스 vs 타입
- 객체 타입은 interface 사용
- 유니온 타입은 type 사용

## 3. 제네릭 활용
재사용 가능한 컴포넌트를 위해 제네릭을 활용하세요.`,
    author: {
      id: 'current-user',
      username: 'john.doe',
      fullName: '김철수',
      profileImage: '/avatars/john.jpg'
    },
    type: 'markdown',
    status: 'private',
    tags: ['TypeScript', '개발', '베스트프랙티스'],
    category: {
      id: '1',
      name: '기술 문서',
      color: '#3B82F6'
    },
    metadata: {
      wordCount: 234,
      readingTime: 2,
      version: 1
    },
    settings: {
      isTemplate: true,
      templateName: 'TypeScript 가이드 템플릿',
      allowComments: false,
      allowExport: true,
      exportFormats: ['markdown']
    },
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-08T11:30:00Z'
  }
];

export const mockDocument = mockDocuments[0];

export const documentTemplates = [
  {
    id: '1',
    name: '회의록 템플릿',
    description: '표준 회의록 작성을 위한 템플릿',
    content: `# [회의 제목]

**일시**: 2024년 0월 0일 오전/오후 0시
**장소**: 
**참석자**: 

## 회의 목적

## 논의 사항

### 1. [주제 1]
- 

### 2. [주제 2]
- 

## 결정 사항

## 액션 아이템
| 담당자 | 업무 내용 | 기한 |
|--------|-----------|------|
|        |           |      |

## 다음 회의
- **일시**: 
- **안건**: `,
    category: '회의록',
    tags: ['회의록', '템플릿']
  },
  {
    id: '2',
    name: '기술 문서 템플릿',
    description: '기술 문서 작성을 위한 표준 템플릿',
    content: `# [기술 문서 제목]

## 개요

## 목적

## 기술 사양

### 요구사항
- 

### 아키텍처
- 

## 구현 상세

### 1. [섹션 1]

### 2. [섹션 2]

## 테스트

## 참고 자료
- `,
    category: '기술 문서',
    tags: ['기술문서', '템플릿']
  }
];