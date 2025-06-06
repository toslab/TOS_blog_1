//app/dashboard/documents/[id]/edit/page.tsx

'use client';

import DocumentEditor from '@/features/dashboard/components/views/documents/editor/DocumentEditor';

export default function EditDocumentPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <DocumentEditor mode="edit" documentId={params.id} />;
}