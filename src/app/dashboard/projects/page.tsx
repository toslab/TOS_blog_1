// app/dashboard/projects/page.tsx

import { Suspense } from 'react';
import ProjectsView from '@/features/dashboard/components/views/projects/ProjectsView';
import ProjectsSkeleton from '@/features/dashboard/components/views/projects/ProjectsSkeleton';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsView />
    </Suspense>
  );
}