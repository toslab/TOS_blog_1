//features/dashboard/components/views/documents/editor/DocumentPreview.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { DocumentTemplate } from '@/features/dashboard/types/document';
import { Badge } from '@/components/dashboard_UI/badge';
import 'highlight.js/styles/github-dark.css';

interface DocumentPreviewProps {
  title: string;
  content: string;
  template?: DocumentTemplate | null;
  tags?: string[];
}

export default function DocumentPreview({ 
  title, 
  content, 
  template,
  tags = []
}: DocumentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (template && previewRef.current) {
      // Apply template styles
      const styleElement = document.createElement('style');
      styleElement.textContent = template.styles || '';
      previewRef.current.appendChild(styleElement);

      return () => {
        if (previewRef.current && styleElement.parentNode) {
          styleElement.remove();
        }
      };
    }
  }, [template]);

  if (!template) {
    // Default preview
    return (
      <div className="h-full overflow-y-auto">
        <article className="max-w-4xl mx-auto p-8">
          <header className="mb-8 pb-8 border-b">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {title || '제목 없음'}
            </h1>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {content || '*문서 내용을 입력하면 여기에 미리보기가 표시됩니다*'}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    );
  }

  // Template preview
  const processedHtml = template.html
    ?.replace('{{title}}', title || '제목 없음')
    .replace('{{content}}', '<div id="markdown-content"></div>')
    .replace('{{tags}}', tags.map(tag => `<span class="tag">${tag}</span>`).join(''))
    .replace('{{date}}', new Date().toLocaleDateString('ko-KR'));

  return (
    <div ref={previewRef} className="h-full overflow-y-auto">
      <div dangerouslySetInnerHTML={{ __html: processedHtml || '' }} />
      
      {/* Hidden div for markdown rendering */}
      <div style={{ display: 'none' }}>
        <div id="markdown-render">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

// Move rendered markdown to template after mount
if (typeof window !== 'undefined') {
  const observer = new MutationObserver(() => {
    const source = document.getElementById('markdown-render');
    const target = document.getElementById('markdown-content');
    if (source && target && source.innerHTML) {
      target.innerHTML = source.innerHTML;
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}