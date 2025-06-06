//features/dashboard/components/views/documents/editor/TagInput.tsx

'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/dashboard_UI/badge';
import { Input } from '@/components/dashboard_UI/input';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
  className?: string;
}

export default function TagInput({
  tags,
  onChange,
  placeholder = "태그 입력...",
  maxTags = 10,
  suggestions = [],
  className
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion)
  );

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag && 
      !tags.includes(trimmedTag) && 
      tags.length < maxTags
    ) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0 && filteredSuggestions.length > 0);
  };

  return (
    <div className={cn("relative flex-1", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0 && filteredSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-0 px-0 focus-visible:ring-0"
          disabled={tags.length >= maxTags}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                addTag(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {tags.length >= maxTags && (
        <p className="text-xs text-gray-500 mt-1">
          최대 {maxTags}개의 태그만 추가할 수 있습니다.
        </p>
      )}
    </div>
  );
}