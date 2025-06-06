'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { Label } from '@/components/dashboard_UI/label';
import { Textarea } from '@/components/dashboard_UI/textarea';
import { Badge } from '@/components/dashboard_UI/badge';
import { Separator } from '@/components/dashboard_UI/separator';
import { Switch } from '@/components/dashboard_UI/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { 
  Settings, Save, X, Plus, Globe, Lock, 
  Users, FileText, Tag, Folder, Calendar 
} from 'lucide-react';
import { Document, DocumentCategory } from '@/features/dashboard/types/document';
import TagInput from './TagInput';

interface DocumentSettingsProps {
  document: Document;
  categories: DocumentCategory[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Partial<Document>) => void;
}

export default function DocumentSettings({ 
  document, 
  categories, 
  isOpen, 
  onClose, 
  onSave 
}: DocumentSettingsProps) {
  const [title, setTitle] = useState(document.title);
  const [excerpt, setExcerpt] = useState(document.excerpt || '');
  const [tags, setTags] = useState(document.tags);
  const [categoryId, setCategoryId] = useState(document.category?.id || '');
  const [status, setStatus] = useState(document.status);
  const [settings, setSettings] = useState(document.settings);
  const [allowComments, setAllowComments] = useState(document.settings.allowComments);
  const [allowExport, setAllowExport] = useState(document.settings.allowExport);
  const [isTemplate, setIsTemplate] = useState(document.settings.isTemplate);
  const [templateName, setTemplateName] = useState(document.settings.templateName || '');

  const handleSave = () => {
    const updatedDocument: Partial<Document> = {
      title,
      excerpt,
      tags,
      category: categoryId ? categories.find(c => c.id === categoryId) : undefined,
      status,
      settings: {
        ...settings,
        allowComments,
        allowExport,
        isTemplate,
        templateName: isTemplate ? templateName : undefined,
      },
    };
    
    onSave(updatedDocument);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto m-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            문서 설정
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              기본 정보
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="문서 제목을 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">요약</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="문서 요약을 입력하세요"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* 분류 및 태그 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" />
              분류 및 태그
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">카테고리 없음</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <TagInput
                tags={tags}
                onChange={setTags}
                placeholder="태그를 입력하세요"
              />
            </div>
          </div>

          <Separator />

          {/* 공개 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              공개 설정
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="status">공개 상태</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      임시저장
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      비공개
                    </div>
                  </SelectItem>
                  <SelectItem value="shared">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      공유됨
                    </div>
                  </SelectItem>
                  <SelectItem value="published">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      게시됨
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* 기능 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              기능 설정
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowComments">댓글 허용</Label>
                  <p className="text-sm text-gray-500">
                    다른 사용자가 이 문서에 댓글을 달 수 있습니다
                  </p>
                </div>
                <Switch
                  id="allowComments"
                  checked={allowComments}
                  onCheckedChange={setAllowComments}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowExport">내보내기 허용</Label>
                  <p className="text-sm text-gray-500">
                    다른 사용자가 이 문서를 다운로드할 수 있습니다
                  </p>
                </div>
                <Switch
                  id="allowExport"
                  checked={allowExport}
                  onCheckedChange={setAllowExport}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isTemplate">템플릿으로 설정</Label>
                  <p className="text-sm text-gray-500">
                    이 문서를 템플릿으로 사용할 수 있습니다
                  </p>
                </div>
                <Switch
                  id="isTemplate"
                  checked={isTemplate}
                  onCheckedChange={setIsTemplate}
                />
              </div>
              
              {isTemplate && (
                <div className="space-y-2 ml-4">
                  <Label htmlFor="templateName">템플릿 이름</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="템플릿 이름을 입력하세요"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 저장 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
