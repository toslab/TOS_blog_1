import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * tailwind와 함께 사용하기 위한 clsx와 tailwind-merge의 조합 유틸리티
 * clsx로 클래스를 조건부로 결합하고, tailwind-merge로 충돌하는 클래스를 해결
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 