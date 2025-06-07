'use client';

import React from 'react';
import { Button } from '@/components/dashboard_UI/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { Filter } from 'lucide-react';

interface ProductsFilterProps {
  filters: {
    status: string;
    category: string;
    stock: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function ProductsFilter({ filters, onFiltersChange }: ProductsFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 상태</SelectItem>
          <SelectItem value="active">판매중</SelectItem>
          <SelectItem value="draft">임시저장</SelectItem>
          <SelectItem value="archived">보관</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filters.category}
        onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 카테고리</SelectItem>
          <SelectItem value="electronics">전자제품</SelectItem>
          <SelectItem value="clothing">의류</SelectItem>
          <SelectItem value="food">식품</SelectItem>
          <SelectItem value="beauty">화장품</SelectItem>
          <SelectItem value="books">도서</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filters.stock}
        onValueChange={(value) => onFiltersChange({ ...filters, stock: value })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="재고" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="in_stock">재고 있음</SelectItem>
          <SelectItem value="low">재고 부족</SelectItem>
          <SelectItem value="out">품절</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}