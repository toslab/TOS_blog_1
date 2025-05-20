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

export const AppContext = createContext<{ previousPathname?: string | null }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  let previousPathname = usePrevious(pathname)
  const [mounted, setMounted] = useState(false)
  
  // pathname이 null일 수 있는 경우를 고려
  const isLoginPage = typeof pathname === 'string' && pathname === '/login'

  useEffect(() => {
    setMounted(true)
  }, [])

  // pathname이 null이면 로딩 상태나 빈 화면을 표시할 수 있습니다.
  // 여기서는 간단히 children만 렌더링하도록 두지만, 실제 프로덕션에서는 더 나은 처리가 필요할 수 있습니다.
  if (pathname === null) {
    // 또는 <LoadingSpinner /> 같은 컴포넌트 반환
    return <SessionProvider>{children}</SessionProvider>; 
  }

  return (
    <SessionProvider>
      <AppContext.Provider value={{ previousPathname }}>
        <ThemeProvider 
          attribute="class" 
          disableTransitionOnChange
          forcedTheme={isLoginPage ? "light" : undefined}
        >
          {mounted && !isLoginPage && <ThemeWatcher />} 
          {children}
        </ThemeProvider>
      </AppContext.Provider>
    </SessionProvider>    
  )
}
