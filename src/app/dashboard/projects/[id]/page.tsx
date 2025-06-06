// app/dashboard/projects/[id]/page.tsx

import { Suspense } from 'react';
import ProjectDetailView from '@/features/dashboard/components/views/projects/ProjectDetailView';
import ProjectDetailSkeleton from '@/features/dashboard/components/views/projects/ProjectDetailSkeleton';

export default function ProjectDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailView projectId={params.id} />
    </Suspense>
  );
}
