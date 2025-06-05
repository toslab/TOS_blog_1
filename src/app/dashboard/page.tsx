import { Suspense } from 'react';
import DashboardView from '@/features/dashboard/components/views/home/DashboardView';
import DashboardSkeleton from '@/features/dashboard/components/views/home/DashboardSkeleton';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardView />
    </Suspense>
  );
}