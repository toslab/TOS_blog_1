//src/features/dashboard/components/views/ecommerce/products/ProductForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Input } from '@/components/dashboard_UI/input';
import { Textarea } from '@/components/dashboard_UI/textarea';
import { Label } from '@/components/dashboard_UI/label';
import { Badge } from '@/components/dashboard_UI/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/dashboard_UI/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard_UI/tabs';
import { 
  ArrowLeft, Save, Package, DollarSign, 
  Truck, Image as ImageIcon, Tag, AlertCircle,
  Plus, X, Loader2
} from 'lucide-react';
import ImageUpload from '@/components/dashboard_UI/ImageUpload';
import { Product, ProductCategory } from '@/features/dashboard/types/ecommerce';
import { cn } from '@/lib/utils';

// 폼 스키마
const productSchema = z.object({
  name: z.string().min(1, '상품명을 입력해주세요'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU를 입력해주세요'),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, '카테고리를 선택해주세요'),
  price: z.number().min(0, '가격은 0 이상이어야 합니다'),
  compareAtPrice: z.number().optional(),
  cost: z.number().optional(),
  stock: z.number().min(0, '재고는 0 이상이어야 합니다'),
  lowStockThreshold: z.number().optional(),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  status: z.enum(['active', 'draft', 'archived']),
  tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      barcode: '',
      categoryId: '',
      price: 0,
      compareAtPrice: undefined,
      cost: undefined,
      stock: 0,
      lowStockThreshold: 10,
      weight: undefined,
      dimensions: {
        length: undefined,
        width: undefined,
        height: undefined,
      },
      status: 'draft',
      tags: [],
    },
  });

  // 카테고리 목록 (실제로는 API에서 가져와야 함)
  const categories: ProductCategory[] = [
    { id: '1', name: '전자제품', slug: 'electronics' },
    { id: '2', name: '의류', slug: 'clothing' },
    { id: '3', name: '식품', slug: 'food' },
    { id: '4', name: '화장품', slug: 'beauty' },
    { id: '5', name: '도서', slug: 'books' },
  ];

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (mode === 'edit' && productId) {
      // 실제로는 API에서 데이터를 가져와야 함
      const mockProduct: Partial<ProductFormData> = {
        name: '샘플 상품',
        description: '이것은 샘플 상품입니다.',
        sku: 'SKU-0001',
        categoryId: '1',
        price: 50000,
        compareAtPrice: 60000,
        cost: 30000,
        stock: 100,
        status: 'active',
      };
      
      form.reset(mockProduct);
      setTags(['신상품', '인기']);
    }
  }, [mode, productId, form]);

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      const payload = {
        ...data,
        tags,
        images: imageUrls.map((url, index) => ({
          id: `img-${index}`,
          url,
          position: index,
        })),
      };
      
      console.log('Submitting:', payload);
      
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/dashboard/ecommerce/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/ecommerce/products')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? '상품 등록' : '상품 수정'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {mode === 'create' ? '새로운 상품을 등록합니다' : '상품 정보를 수정합니다'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {mode === 'create' ? '등록' : '저장'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">기본 정보</TabsTrigger>
              <TabsTrigger value="pricing">가격 및 재고</TabsTrigger>
              <TabsTrigger value="images">이미지</TabsTrigger>
              <TabsTrigger value="shipping">배송 정보</TabsTrigger>
            </TabsList>

            {/* 기본 정보 탭 */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상품명 *</FormLabel>
                        <FormControl>
                          <Input placeholder="상품명을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상품 설명</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="상품에 대한 상세 설명을 입력하세요"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          고객에게 보여질 상품 설명입니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input placeholder="SKU-0000" {...field} />
                          </FormControl>
                          <FormDescription>재고 관리 코드</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>바코드</FormLabel>
                          <FormControl>
                            <Input placeholder="8801234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>카테고리 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="카테고리를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>태그</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="태그를 입력하고 Enter를 누르세요"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상태</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">판매중</SelectItem>
                            <SelectItem value="draft">임시저장</SelectItem>
                            <SelectItem value="archived">보관</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 가격 및 재고 탭 */}
            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>가격 및 재고</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>판매가 *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₩
                              </span>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="compareAtPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비교가</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₩
                              </span>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>할인 전 가격</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>원가</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₩
                              </span>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>수익 계산용</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">재고 관리</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>현재 재고 *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lowStockThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>재고 부족 임계값</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="10" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormDescription>
                              이 수량 이하일 때 재고 부족 알림
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 이미지 탭 */}
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>상품 이미지</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={imageUrls}
                    onChange={setImageUrls}
                    multiple={true}
                    maxFiles={10}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    첫 번째 이미지가 대표 이미지로 사용됩니다. 최대 10개까지 업로드 가능합니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 배송 정보 탭 */}
            <TabsContent value="shipping">
              <Card>
                <CardHeader>
                  <CardTitle>배송 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>무게</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number" 
                              placeholder="0" 
                              className="pr-12"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                              kg
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription>배송비 계산에 사용됩니다</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>크기</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name="dimensions.length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">길이</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  className="pr-8"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  cm
                                </span>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dimensions.width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">너비</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  className="pr-8"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  cm
                                </span>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dimensions.height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">높이</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  className="pr-8"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  cm
                                </span>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}