'use client'

import { type Metadata } from 'next'
import Link from 'next/link'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { Container } from '@/components/layouts/Container'

// 스크롤 애니메이션을 위한 컴포넌트
function AnimatedRole({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={clsx(
        'transform transition-all duration-700 ease-out',
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// 서비스 아코디언 컴포넌트
function ServiceAccordion() {
  const [openIndices, setOpenIndices] = useState<number[]>([])
  const [closingIndex, setClosingIndex] = useState<number | null>(null)
  
  const toggleService = (index: number) => {
    if (openIndices.includes(index)) {
      // 닫을 때
      setClosingIndex(index)
      setOpenIndices(prev => prev.filter(i => i !== index))
      // 애니메이션이 끝난 후 closingIndex를 초기화
      setTimeout(() => {
        setClosingIndex(null)
      }, 100) // transition duration과 맞춤
    } else {
      // 열 때
      setOpenIndices(prev => [...prev, index])
    }
  }
  
  const services = [
    {
      number: "001",
      title: "티백 OEM 및 새로운 상품 개발",
      description: "귀사의 브랜드를 위한 티백 OEM 생산과 혁신적인 차 제품을 개발합니다. 맞춤형 블렌딩, 패키지 디자인, 소량 생산부터 대량 생산까지 원하는 형태로 제작 가능합니다.",
      categories: ["티백OEM", "상품개발", "맞춤형블렌딩", "패키지디자인", "브랜드제품"]
    },
    {
      number: "002", 
      title: "티(TEA) 익스피리언스 프로그램",
      description: "임직원 교육과 고객 체험을 위한 차 문화 프로그램입니다. 티 소믈리에 과정, VIP 다회, 팀빌딩 워크샵 등을 통해 특별한 경험과 함께 팀워크와 고객 만족도를 높입니다.",
      categories: ["기업교육", "팀빌딩", "VIP체험", "티소믈리에", "문화마케팅"]
    },
    {
      number: "003",
      title: "K-Tea 해외 진출 컨설팅",
      description: "한국 차 문화의 글로벌 진출을 돕습니다. 현지화 전략, K-Culture 융복합 상품 개발, 바이어 매칭, 아마존 등 글로벌 플랫폼 입점까지 원스톱 솔루션을 제공합니다.",
      categories: ["K-Tea", "수출컨설팅", "글로벌마케팅", "현지화전략", "이커머스"]
    },
    {
      number: "004",
      title: "차넷(Tea-Net) 비즈니스 살롱",
      description: "차를 매개로 한 프리미엄 네트워킹 플랫폼입니다. 월간 CEO 티 살롱, 분기별 비즈니스 매칭, 연간 글로벌 포럼을 통해 새로운 비즈니스 기회를 창출합니다.",
      categories: ["비즈니스네트워킹", "CEO모임", "파트너십", "프리미엄살롱", "글로벌포럼"]
    }
  ]
  
  return (
    <>
      {services.map((service, index) => (
        <div key={index} className="border-b border-zinc-800 last:border-0">
          <button
            onClick={() => toggleService(index)}
            className="w-full py-8 flex items-center justify-between text-left"
          >
            <div className="flex items-start gap-8 flex-1">
              <span className={clsx(
                "text-sm transition-colors duration-300",
                openIndices.includes(index) ? "text-white" : "text-zinc-600"
              )}>
                {service.number}
              </span>
              
              {/* 닫혔을 때 제목 표시 - fade in 효과 추가 */}
              {!openIndices.includes(index) && (
                <h3 className={clsx(
                  "text-2xl sm:text-3xl font-medium text-white transition-all duration-75",
                  closingIndex === index 
                    ? "opacity-0 transform translate-y-2" 
                    : "opacity-100 transform translate-y-0"
                )}>
                  {service.title}
                </h3>
              )}
            </div>
            
            <div className={clsx(
              "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0",
              openIndices.includes(index) ? "border-zinc-400" : "border-zinc-600"
            )}>
              <span className="text-zinc-400 text-2xl font-light transition-opacity duration-200">
                {openIndices.includes(index) ? '−' : '+'}
              </span>
            </div>
          </button>
          
          {/* 확장되는 콘텐츠 영역 */}
          <div 
            className={clsx(
              "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
              openIndices.includes(index) 
                ? "max-h-[700px]" 
                : "max-h-0"
            )}
          >
            {/* 실제 콘텐츠 */}
            <div className="grid grid-cols-12 gap-8 px-0 sm:px-4">
              <div className="col-span-12 sm:col-start-2 sm:col-span-11">
                <div className={clsx(
                  "space-y-6 pb-12 transition-all duration-500 delay-100",
                  openIndices.includes(index) 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                )}>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-medium text-white mb-4">
                      {service.title}
                    </h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-4 flex-wrap">
                    <span className="text-sm text-zinc-500 mt-2">Categories</span>
                    <div className="flex flex-wrap gap-3">
                      {service.categories.map((category, catIndex) => (
                        <span 
                          key={catIndex}
                          className="px-6 py-2.5 rounded-full bg-white text-sm text-black font-medium"
                        >
                          {category}
                        </span>
                      ))}
                      <span className="px-6 py-2.5 rounded-full bg-white text-sm text-black font-medium">
                        6+
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default function About() {
  return (
    <>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-7xl mx-auto">
          {/* 왼쪽: About us 라벨과 제목 */}
          <div>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">
              About us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              경험을 큐레이션<br />
              합니다
            </h1>
          </div>
          
          {/* 오른쪽: 설명 텍스트 */}
          <div className="lg:pt-12">
            <div className="space-y-6 text-base lg:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                AI 시대, 생산성을 넘어 진정한 가치란 무엇일까요?
              </p>
              <p>
                우린 일상의 여백에서 답을 찾았습니다. 바쁜 하루를 멈추고 차 한 잔을 우리는 시간. 그 짧은 의례가 제게는 나를 돌아보고, 새로운 영감을 얻는 순간이었습니다.
              </p>
              <p>
                이제 그 경험을 나눕니다.
              </p>
            </div>
          </div>
        </div>

      </Container>

      {/* Services Section - Full Width */}
      <div className="mt-32 px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-zinc-950 py-24 rounded-[3rem]">
          <Container>
            <div className="flex items-baseline gap-4 mb-16">
              <span className="text-sm text-zinc-500">◯ What we do</span>
              <h2 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white">
                Services<span className="text-zinc-500">.</span>
              </h2>
            </div>
            
            <div className="space-y-0">
              <ServiceAccordion />
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link
                href="/contact"
                className="group relative inline-flex items-center rounded-full bg-white border border-transparent px-8 py-3 text-sm font-semibold text-zinc-950 transition-all duration-150 hover:bg-white/[0.03] hover:text-white hover:border-white/20 overflow-hidden"
              >
                <span className="relative block overflow-hidden h-5">
                  <span className="block transition-transform duration-150 ease-out group-hover:-translate-y-5">
                    Get started
                  </span>
                  <span className="absolute top-5 left-0 block transition-transform duration-150 ease-out group-hover:-translate-y-5 text-white">
                    Get started
                  </span>
                </span>
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}