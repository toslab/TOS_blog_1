import { Suspense } from 'react';
import OrdersView from '@/features/dashboard/components/views/ecommerce/orders/OrdersView';
import OrdersSkeleton from '@/features/dashboard/components/views/ecommerce/orders/OrdersSkeleton';

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersView />
    </Suspense>
  );
}