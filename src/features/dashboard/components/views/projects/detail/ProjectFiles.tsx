'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { 
  Upload, File, FileText, Image, Film, Archive,
  Download, Trash2, MoreVertical, Search, Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dashboard_UI/dropdown-menu';
import { formatDate } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  uploadedAt: string;
  url: string;
}

interface ProjectFilesProps {
  projectId: string;
}

export default function ProjectFiles({ projectId }: ProjectFilesProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 파일 목록 조회
  const { data: files, isLoading } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      // TODO: API 구현
      return [
        {
          id: '1',
          name: '프로젝트_기획서_v2.pdf',
          size: 2458624,
          type: 'application/pdf',
          uploadedBy: {
            id: '1',
            fullName: '김철수',
          },
          uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          url: '/files/1',
        },
        {
          id: '2',
          name: '로고_디자인.png',
          size: 524288,
          type: 'image/png',
          uploadedBy: {
            id: '2',
            fullName: '이영희',
          },
          uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          url: '/files/2',
        },
      ] as ProjectFile[];
    },
  });

  // 파일 업로드
  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post(`/projects/${projectId}/files/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
    },
  });

  // 파일 삭제
  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      return apiClient.delete(`/projects/${projectId}/files/${fileId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      uploadFile.mutate(file);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Film className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const filteredFiles = files?.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="파일 검색..."
              className="pl-10"
            />
          </div>
        </div>
        
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadFile.isPending}
        >
          <Upload className="w-4 h-4 mr-2" />
          파일 업로드
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          dragActive 
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
            : "border-gray-300 dark:border-gray-700"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            파일을 여기로 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-500">
            최대 100MB까지 업로드 가능
          </p>
        </CardContent>
      </Card>

      {/* Files List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          로딩 중...
        </div>
      ) : filteredFiles?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '아직 업로드된 파일이 없습니다.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFiles?.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-lg",
                      "bg-gray-100 dark:bg-gray-800"
                    )}>
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.uploadedBy.fullName}</span>
                        <span>•</span>
                        <span>
                          {formatDate(new Date(file.uploadedAt), 'yyyy년 MM월 dd일', { locale: ko })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          이름 변경
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          링크 복사
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteFile.mutate(file.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}