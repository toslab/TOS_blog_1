'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, X, Star, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Badge } from './badge';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  showPrimaryBadge?: boolean; // 대표 이미지 표시 여부
  enableReordering?: boolean; // 순서 변경 가능 여부
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
  showPrimaryBadge = false,
  enableReordering = false,
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // 여기서 실제 업로드 로직 구현
    // 임시로 URL.createObjectURL 사용
    const newUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    
    if (multiple) {
      onChange([...value, ...newUrls].slice(0, maxFiles));
    } else {
      onChange([newUrls[0]]);
    }
  }, [value, onChange, multiple, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple,
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (!enableReordering) return;
    
    const newValue = [...value];
    const [movedItem] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, movedItem);
    onChange(newValue);
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    moveImage(index, 0);
  };

  return (
    <div className="space-y-4">
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
          )}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragActive
              ? "이미지를 놓으세요"
              : "클릭하거나 이미지를 드래그하세요"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {multiple ? `최대 ${maxFiles}개` : '1개'}, JPG/PNG/WebP
          </p>
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                
                {/* Primary Badge */}
                {showPrimaryBadge && index === 0 && (
                  <Badge className="absolute top-2 left-2 gap-1">
                    <Star className="w-3 h-3" />
                    대표
                  </Badge>
                )}
                
                {/* Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {showPrimaryBadge && index !== 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryImage(index)}
                    >
                      대표 설정
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Drag Handle */}
                {enableReordering && (
                  <div className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-gray-800/80 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-1 text-center">
                {index + 1}번째 이미지
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}