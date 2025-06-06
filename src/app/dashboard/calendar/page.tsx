import { Suspense } from 'react';
import CalendarView from '@/features/dashboard/components/views/calendar/CalendarView';
import CalendarSkeleton from '@/features/dashboard/components/views/calendar/CalendarSkeleton';

export default function CalendarPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarView />
    </Suspense>
  );
}