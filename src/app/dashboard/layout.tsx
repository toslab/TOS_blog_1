import type React from "react"
import "./styles/dashboard.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from '@/app/providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "접을 수 있는 대시보드",
  description: "PNG 아이콘과 접기 애니메이션이 있는 대시보드",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full bg-white">
      <body className={`${inter.className} h-full`}>
        <Providers attribute="class" defaultTheme="light">
          {children}
        </Providers>
      </body>
    </html>
  )
}
