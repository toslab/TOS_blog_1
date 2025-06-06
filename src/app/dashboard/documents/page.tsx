import { Suspense } from 'react';
import DocumentsView from '@/features/dashboard/components/views/documents/DocumentsView';
import DocumentsSkeleton from '@/features/dashboard/components/views/documents/DocumentsSkeleton';

export default function DocumentsPage() {
  return (
    <Suspense fallback={<DocumentsSkeleton />}>
      <DocumentsView />
    </Suspense>
  );
}