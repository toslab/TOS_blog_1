'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
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
    maxFiles,
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "이미지를 놓으세요"
            : "클릭하거나 이미지를 드래그하세요"}
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt=""
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}