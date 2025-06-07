import { Suspense } from 'react';
import ProductsView from '@/features/dashboard/components/views/ecommerce/products/ProductsView';
import ProductsSkeleton from '@/features/dashboard/components/views/ecommerce/products/ProductsSkeleton';

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsView />
    </Suspense>
  );
}