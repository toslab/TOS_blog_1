'use client';

import React, { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils'

// 버튼 기본 스타일 정의
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// 버튼 컴포넌트 props 인터페이스
export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'href' | 'className' | 'children' | 'type' // 'form', 'formAction' 등은 이미 ButtonHTMLAttributes에 포함
  >,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  plain?: boolean;
}

// 버튼 컴포넌트
export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, href, children, type: buttonType, plain, ...rest }, ref) => {
  const classes = plain ? className : cn(buttonVariants({ variant, size, className }));

  if (href) {
    // rest에서 button 전용 속성들 제거
    const {
      form,
      formAction,
      formEncType,
      formMethod,
      formNoValidate,
      formTarget,
      value,
      ...anchorProps
    } = rest;

    return (
      <Link
        href={href}
        className={classes}
        {...(anchorProps as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={buttonType || 'button'}
      className={classes}
      ref={ref}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';

// 모바일 터치 영역을 최적화하기 위한 컴포넌트
interface TouchTargetProps {
  children: ReactNode;
  className?: string;
}

export const TouchTarget: React.FC<TouchTargetProps> = ({ children, className }) => {
  return (
    <div 
      className={cn(
        'relative inline-block', 
        className
      )}
    >
      {/* 실제 클릭 가능한 영역을 더 넓게 확장 */}
      <div className="absolute -inset-3 md:-inset-2" />
      {children}
    </div>
  );
};
TouchTarget.displayName = 'TouchTarget';
