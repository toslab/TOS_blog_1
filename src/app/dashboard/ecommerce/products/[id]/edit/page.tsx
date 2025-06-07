import ProductForm from '@/features/dashboard/components/views/ecommerce/products/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm mode="edit" productId={params.id} />;
}