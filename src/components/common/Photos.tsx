// src/components/Photos.tsx
'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useRef, useState, useCallback } from 'react';

// 이미지 import 경로는 실제 프로젝트에 맞게 확인해주세요.
import image1 from '@/images/photos/image-1.jpg';
import image2 from '@/images/photos/image-2.jpg';
import image3 from '@/images/photos/image-3.jpg';
import image4 from '@/images/photos/image-4.jpg';
import image5 from '@/images/photos/image-5.jpg';

export default function Photos() {
  const rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2'];
  const imageSources = [image1, image2, image3, image4, image5];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      if (maxScrollLeft > 0) {
        const progress = scrollLeft / maxScrollLeft;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    }
  }, []);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseLeaveOrUp = () => {
    if (!scrollContainerRef.current) return;
    isDragging.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = 'auto';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div className="mt-16 sm:mt-20">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-5 overflow-x-auto overflow-y-hidden py-4 scroll-smooth scroll-snap-type-x-mandatory sm:gap-8 md:px-4 cursor-grab justify-center
        scrollbar-hide
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {imageSources.map((image, imageIndex) => {
          const relativePosition = scrollProgress * (imageSources.length - 1) - imageIndex;
          const parallaxFactor = 0.5 - Math.min(0.5, Math.abs(relativePosition) * 0.3);
          const parallaxOffset = parallaxFactor * 40 - 20;
          // const opacityFactor = 1 - Math.min(1, Math.abs(relativePosition) * 0.7); // 투명도 계산 로직 주석 처리
          // const opacity = Math.max(0.3, opacityFactor); // 투명도 계산 로직 주석 처리
          const scaleFactor = 1 + Math.max(0, (0.3 - Math.abs(relativePosition) * 0.3)) * 0.1;
          const isPriority = imageIndex < 2;

          return (
            <div
              key={image.src || `photo-${imageIndex}`}
              className={clsx(
                'relative aspect-9/10 w-60 flex-none overflow-hidden rounded-xl bg-zinc-100 scroll-snap-align-center sm:w-72 sm:rounded-2xl dark:bg-zinc-800 transition-transform duration-300 ease-out', // opacity 관련 transition은 이제 영향 없음
                rotations[imageIndex % rotations.length]
              )}
              style={{
                transform: `translateY(${parallaxOffset}px) scale(${scaleFactor}) ${rotations[imageIndex % rotations.length].includes('rotate') ? (rotations[imageIndex % rotations.length].startsWith('-') ? 'rotate(-2deg)' : 'rotate(2deg)') : ''}`,
                // opacity: opacity, // style 객체에서 opacity 속성 제거 또는 주석 처리
              }}
            >
              <Image
                src={image.src}
                alt={`Photo ${imageIndex + 1}`}
                width={image.width || 400}
                height={image.height || 500}
                sizes="(min-width: 640px) 18rem, 15rem"
                className="absolute inset-0 h-full w-full object-cover"
                draggable="false"
                priority={isPriority}
                loading={isPriority ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}
      </div>
      {/* 하단 스크롤 진행 표시줄 (드래그 바) JSX 완전 제거 */}
    </div>
  );
}