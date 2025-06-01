import { type Metadata } from 'next'

import { Providers } from '@/app/providers'

import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s - TOSLAB',
    default: 'TOSLAB',
  },
  description:
    '엔지니어이자 창업가이며, 틴지오브소울의 Project Owner로 활동하고 있습니다. 시장 트렌드와 기업 분석을 바탕으로 지속 가능한 기획과 전략을 주도하며, 고객과 사용자가 변화하는 시장 흐름을 빠르게 포착해 자신만의 혁신을 경험할 수 있도록 트렌드 중심의 프로젝트를 만들어가고 있습니다.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="h-full">
        <Providers>
          {/* dashboard 외부 경로에만 Layout 사용 (children에게 판단 위임) */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
