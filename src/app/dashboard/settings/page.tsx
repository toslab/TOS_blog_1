// src/app/dashboard/settings/page.tsx

import { Suspense } from 'react';
import SettingsView from '@/features/dashboard/components/views/settings/SettingsView';
import SettingsSkeleton from '@/features/dashboard/components/views/settings/SettingsSkeleton';

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsView />
    </Suspense>
  );
}