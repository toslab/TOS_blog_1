//features/dashboard/components/views/documents/DocumentsGrid.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/dashboard_UI/card';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { 
  FileText, MoreHorizontal, Star, Clock, 
  Users, Download, Share, Copy, Trash 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { Document } from '@/features/dashboard/types/document';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DocumentsGridProps {
  documents: Document[];
}

export default function DocumentsGrid({ documents }: DocumentsGridProps) {
  const router = useRouter();

  const handleDocumentClick = (document: Document) => {
    router.push(`/dashboard/documents/${document.id}`);
  };

  const handleFavoriteToggle = (e: React.MouseEvent, document: Document) => {
    e.stopPropagation();
    // TODO: API 호출로 즐겨찾기 토글
    console.log('즐겨찾기 토글:', document.id);
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'shared': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document) => (
        <Card 
          key={document.id}
          className="cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => handleDocumentClick(document)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm truncate" title={document.title}>
                    {document.title}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleFavoriteToggle(e, document)}
                >
                  <Star 
                    className={`w-4 h-4 ${
                      document.isFavorite 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-400'
                    }`} 
                  />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Share className="w-4 h-4 mr-2" />
                      공유
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      복사
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* 내용 미리보기 */}
            <p className="text-sm text-gray-600 line-clamp-3">
              {document.content}
            </p>
            
            {/* 태그들 */}
            {document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {document.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {document.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{document.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            {/* 상태 및 정보 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(document.status)}>
                  {document.status === 'published' ? '게시됨' : 
                   document.status === 'draft' ? '임시저장' : 
                   document.status === 'private' ? '비공개' : '공유됨'}
                </Badge>
                {document.category && (
                  <span className="text-gray-400">
                    {document.category.name}
                  </span>
                )}
              </div>
            </div>
            
            {/* 작성자 및 날짜 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={document.author.profileImage} />
                  <AvatarFallback className="text-xs">
                    {document.author.fullName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600 truncate">
                  {document.author.fullName}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(document.updatedAt), { 
                    addSuffix: true, 
                    locale: ko 
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}