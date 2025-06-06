'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { Separator } from '@/components/dashboard_UI/separator';
import { ScrollArea } from '@/components/dashboard_UI/scroll-area';
import { 
  History, X, Clock, User, FileText, 
  RotateCcw, Eye, GitBranch, Save 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DocumentVersion {
  id: string;
  version: number;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: {
    type: 'created' | 'edited' | 'renamed' | 'shared' | 'status_changed';
    description: string;
    details?: string;
  };
  createdAt: string;
  wordCount: number;
  isCurrent?: boolean;
}

interface DocumentHistoryProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore?: (version: DocumentVersion) => void;
  onPreview?: (version: DocumentVersion) => void;
}

// Mock data - 실제로는 API에서 가져올 데이터
const mockVersions: DocumentVersion[] = [
  {
    id: 'v7',
    version: 7,
    title: '프로젝트 기획서 v2.1',
    content: '수정된 최신 내용...',
    author: {
      id: 'user1',
      name: '김개발',
      avatar: '/avatars/kim.jpg'
    },
    changes: {
      type: 'edited',
      description: '내용 수정',
      details: '3개 문단 추가, 2개 이미지 삽입'
    },
    createdAt: '2024-01-15T10:30:00Z',
    wordCount: 1250,
    isCurrent: true
  },
  {
    id: 'v6',
    version: 6,
    title: '프로젝트 기획서',
    content: '이전 버전 내용...',
    author: {
      id: 'user2',
      name: '박기획',
      avatar: '/avatars/park.jpg'
    },
    changes: {
      type: 'status_changed',
      description: '문서 공개',
      details: '임시저장에서 공개로 변경'
    },
    createdAt: '2024-01-15T09:15:00Z',
    wordCount: 1180,
  },
  {
    id: 'v5',
    version: 5,
    title: '프로젝트 기획서',
    content: '더 이전 버전...',
    author: {
      id: 'user1',
      name: '김개발',
      avatar: '/avatars/kim.jpg'
    },
    changes: {
      type: 'edited',
      description: '목차 구성 변경',
      details: '챕터 2, 3 순서 변경'
    },
    createdAt: '2024-01-14T16:45:00Z',
    wordCount: 1150,
  },
  {
    id: 'v4',
    version: 4,
    title: '프로젝트 기획서',
    content: '초기 버전...',
    author: {
      id: 'user3',
      name: '이디자인',
      avatar: '/avatars/lee.jpg'
    },
    changes: {
      type: 'shared',
      description: '팀원과 공유',
      details: '김개발, 박기획에게 편집 권한 부여'
    },
    createdAt: '2024-01-14T14:20:00Z',
    wordCount: 980,
  },
  {
    id: 'v3',
    version: 3,
    title: '프로젝트 기획서',
    content: '초기 버전...',
    author: {
      id: 'user1',
      name: '김개발',
      avatar: '/avatars/kim.jpg'
    },
    changes: {
      type: 'renamed',
      description: '제목 변경',
      details: '"새 프로젝트"에서 "프로젝트 기획서"로 변경'
    },
    createdAt: '2024-01-14T11:10:00Z',
    wordCount: 850,
  },
  {
    id: 'v2',
    version: 2,
    title: '새 프로젝트',
    content: '초기 내용...',
    author: {
      id: 'user1',
      name: '김개발',
      avatar: '/avatars/kim.jpg'
    },
    changes: {
      type: 'edited',
      description: '내용 추가',
      details: '개요 섹션 작성 완료'
    },
    createdAt: '2024-01-14T10:00:00Z',
    wordCount: 650,
  },
  {
    id: 'v1',
    version: 1,
    title: '새 프로젝트',
    content: '문서 생성...',
    author: {
      id: 'user1',
      name: '김개발',
      avatar: '/avatars/kim.jpg'
    },
    changes: {
      type: 'created',
      description: '문서 생성',
      details: '새 문서가 생성되었습니다'
    },
    createdAt: '2024-01-14T09:30:00Z',
    wordCount: 120,
  },
];

export default function DocumentHistory({ 
  documentId, 
  isOpen, 
  onClose, 
  onRestore, 
  onPreview 
}: DocumentHistoryProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 실제로는 API 호출
      setVersions(mockVersions);
    }
  }, [isOpen, documentId]);

  const getChangeIcon = (type: DocumentVersion['changes']['type']) => {
    switch (type) {
      case 'created': return <FileText className="w-4 h-4 text-green-600" />;
      case 'edited': return <GitBranch className="w-4 h-4 text-blue-600" />;
      case 'renamed': return <FileText className="w-4 h-4 text-orange-600" />;
      case 'shared': return <User className="w-4 h-4 text-purple-600" />;
      case 'status_changed': return <Save className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeColor = (type: DocumentVersion['changes']['type']) => {
    switch (type) {
      case 'created': return 'bg-green-100 text-green-800';
      case 'edited': return 'bg-blue-100 text-blue-800';
      case 'renamed': return 'bg-orange-100 text-orange-800';
      case 'shared': return 'bg-purple-100 text-purple-800';
      case 'status_changed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl max-h-[90vh] m-4 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            문서 히스토리
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[600px] p-6">
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div 
                  key={version.id}
                  className={`
                    relative flex items-start space-x-4 p-4 rounded-lg border transition-colors
                    ${selectedVersion === version.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                    ${version.isCurrent ? 'ring-2 ring-green-200 bg-green-50' : ''}
                  `}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  {/* Timeline Line */}
                  {index < versions.length - 1 && (
                    <div className="absolute left-8 top-12 w-px h-16 bg-gray-200" />
                  )}
                  
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src={version.author.avatar} />
                    <AvatarFallback className="text-xs">
                      {version.author.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">
                          버전 {version.version}: {version.title}
                        </h4>
                        {version.isCurrent && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            현재
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(version.createdAt), { 
                          addSuffix: true, 
                          locale: ko 
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1">
                        {getChangeIcon(version.changes.type)}
                        <Badge className={`text-xs ${getChangeColor(version.changes.type)}`}>
                          {version.changes.description}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        by {version.author.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {version.wordCount}자
                      </span>
                    </div>
                    
                    {version.changes.details && (
                      <p className="text-sm text-gray-600 mb-3">
                        {version.changes.details}
                      </p>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {onPreview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreview(version);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          미리보기
                        </Button>
                      )}
                      {!version.isCurrent && onRestore && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestore(version);
                          }}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          복원
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
