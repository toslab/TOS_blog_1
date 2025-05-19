'use client'

import { createContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'
import { SessionProvider } from 'next-auth/react'


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
  const [mounted, setMounted] = useState(false)
  
  // 로그인 페이지 감지
  const isLoginPage = pathname === '/login'

  // 클라이언트에서만 ThemeWatcher 렌더링하기 위함
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SessionProvider>
      <AppContext.Provider value={{ previousPathname }}>
        <ThemeProvider 
          attribute="class" 
          disableTransitionOnChange
          forcedTheme={isLoginPage ? "light" : undefined} // 로그인 페이지일 때만 라이트 테마 강제 적용
        >
          {mounted && !isLoginPage && <ThemeWatcher />} {/* 마운트 된 후, 로그인 페이지가 아닐 때만 ThemeWatcher 렌더링*/}
          {children}
        </ThemeProvider>
      </AppContext.Provider>
    </SessionProvider>    
  )
}
