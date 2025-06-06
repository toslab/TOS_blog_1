//features/dashboard/components/views/documents/DocumentsList.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Document } from '@/features/dashboard/types/document';
import { Badge } from '@/components/dashboard_UI/badge';
import { Button } from '@/components/dashboard_UI/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard_UI/avatar';
import { 
  FileText, MoreVertical, Star, Users, Lock, 
  Globe, Eye, Calendar, Clock, Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DocumentsListProps {
  documents: Document[];
}

export default function DocumentsList({ documents }: DocumentsListProps) {
  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'private':
        return <Lock className="w-3 h-3" />;
      case 'shared':
        return <Users className="w-3 h-3" />;
      case 'published':
        return <Globe className="w-3 h-3" />;
      default:
        return <Eye className="w-3 h-3" />;
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'draft': return '초안';
      case 'private': return '비공개';
      case 'shared': return '공유됨';
      case 'published': return '게시됨';
      default: return status;
    }
  };

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-all duration-200 p-4"
        >
          <div className="flex items-start gap-4">
            {/* Document Icon */}
            <div className={cn(
              "p-2 rounded-lg",
              doc.category ? `bg-opacity-10` : "bg-gray-100 dark:bg-gray-700"
            )}
            style={{ backgroundColor: doc.category?.color + '20' }}>
              <FileText className="w-5 h-5" style={{ color: doc.category?.color }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <Link
                    href={`/dashboard/documents/${doc.id}/edit`}
                    className="text-base font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 line-clamp-1"
                  >
                    {doc.title}
                  </Link>
                  
                  {doc.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {doc.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {doc.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{doc.tags.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Avatar className="w-4 h-4">
                        <AvatarImage src={doc.author.profileImage} />
                        <AvatarFallback className="text-xs">
                          {doc.author.fullName?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{doc.author.fullName}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(doc.updatedAt), { 
                          addSuffix: true, 
                          locale: ko 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{doc.metadata.readingTime}분</span>
                    </div>
                    
                    {doc.collaborators && doc.collaborators.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{doc.collaborators.length + 1}명</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="gap-1 text-xs"
                  >
                    {getStatusIcon(doc.status)}
                    {getStatusLabel(doc.status)}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      // Toggle favorite
                    }}
                  >
                    <Star className={cn(
                      "w-4 h-4",
                      doc.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    )} />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" />
                        열기
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        복제
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        이동
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        공유 설정
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        내보내기
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}