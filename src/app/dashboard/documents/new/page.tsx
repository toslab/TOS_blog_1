//app/dashboard/documents/new/page.tsx
'use client';

import DocumentEditor from '@/features/dashboard/components/views/documents/editor/DocumentEditor';

export default function NewDocumentPage() {
  return <DocumentEditor mode="create" />;
}