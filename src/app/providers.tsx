'use client'

import { createContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'

function usePrevious<T>(value: T) {
  let ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    let media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      let systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export const AppContext = createContext<{ previousPathname?: string }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  let previousPathname = usePrevious(pathname)
  
  // 로그인 페이지 감지
  const isLoginPage = pathname === '/login'

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider 
        attribute="class" 
        disableTransitionOnChange
        forcedTheme={isLoginPage ? "light" : undefined} // 로그인 페이지일 때만 라이트 테마 강제 적용
      >
        {!isLoginPage && <ThemeWatcher />} {/* 로그인 페이지에서는 ThemeWatcher 비활성화 */}
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
