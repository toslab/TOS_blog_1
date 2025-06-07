import { Suspense } from 'react';
import ShippingView from '@/features/dashboard/components/views/ecommerce/shipping/ShippingView';
import ShippingSkeleton from '@/features/dashboard/components/views/ecommerce/shipping/ShippingSkeleton';

export default function ShippingPage() {
  return (
    <Suspense fallback={<ShippingSkeleton />}>
      <ShippingView />
    </Suspense>
  );
}