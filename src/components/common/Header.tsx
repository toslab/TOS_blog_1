'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import clsx from 'clsx'
import { LoginButton } from '@/components/common/loginandout/LoginButton'
import { ProfileButton } from '@/components/common/loginandout/ProfileButton'
import { Dropdown, type DropdownSection, type DropdownFooter } from '@/components/common/Dropdown'
import { useSession } from 'next-auth/react'
import {
  CalendarDaysIcon,
  HeartIcon,
  SparklesIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'

import { Container } from '@/components/layouts/Container'
import logoLight from '@/images/photos/TOS LAB.svg'
import logoDark from '@/images/photos/TOS LAB_dark.svg'

// Meetup 드롭다운 데이터
const meetupDropdownData: DropdownSection[] = [
  {
    title: 'TOSLAB Meetup',
    description: '지식과 경험을 나눕니다.',
    items: [
      {
        name: '차넷 (Tea-Net)',
        description: '차와 함께 서로의 경험을 나누는 모임',
        href: '/meetup/tea-net',
        icon: HeartIcon,
      },
      {
        name: '비건페어',
        description: '슬로우라이프를 주제로한 비건페어 프로그램',
        href: '/meetup/vegan-fair',
        icon: SparklesIcon,
      },
      {
        name: '티클래스',
        description: '차와 역사, 문화를 통해 취향을 찾아가는 시간',
        href: '/meetup/tea-class',
        icon: AcademicCapIcon,
      },
      {
        name: '독서모임',
        description: '독서를 통해 관조하며 자신의 생각을 공유하는 모임',
        href: '/meetup/book-club',
        icon: BookOpenIcon,
      }
    ]
  }
]

const meetupDropdownFooter: DropdownFooter = {
  text: '모든 모임 보기',
  href: '/meetup',
  icon: CalendarDaysIcon
}

function CloseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 12.25A4.25 4.25 0 0 1 12.25 8v0a4.25 4.25 0 0 1 4.25 4.25v0a4.25 4.25 0 0 1-4.25 4.25v0A4.25 4.25 0 0 1 8 12.25v0Z" />
      <path
        d="M12.25 3v1.5M21.5 12.25H20M18.791 18.791l-1.06-1.06M18.791 5.709l-1.06 1.06M12.25 20v1.5M4.5 12.25H3M6.77 6.77 5.709 5.709M6.77 17.73l-1.061 1.061"
        fill="none"
      />
    </svg>
  )
}

function MoonIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M17.25 16.22a6.937 6.937 0 0 1-9.47-9.47 7.451 7.451 0 1 0 9.47 9.47ZM12.75 7C17 7 17 2.75 17 2.75S17 7 21.25 7C17 7 17 11.25 17 11.25S17 7 12.75 7Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavItem({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <li>
      <PopoverButton 
        as={Link} 
        href={href} 
        className="block py-3 text-base font-medium whitespace-nowrap"
        onClick={onClick}
      >
        {children}
      </PopoverButton>
    </li>
  )
}

function MobileNavigation({
  className
}: {
  className?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  
  return (
    <Popover className={className}>
      {({ open }) => (
        <>
          <PopoverButton className="group flex items-center rounded-full bg-white/90 p-2.5 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20">
            {open ? (
              <CloseIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
            ) : (
              <MenuIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
            )}
          </PopoverButton>
          
          <PopoverBackdrop
            transition
            className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-xs duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-black/80"
          />
          
          <PopoverPanel
            transition
            className="fixed inset-x-4 top-20 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 duration-150 data-closed:scale-95 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <nav>
              <ul className="divide-y divide-zinc-100 text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                <MobileNavItem href="/about">About</MobileNavItem>
                <MobileNavItem href="/articles">Articles</MobileNavItem>
                <MobileNavItem href="/projects">Projects</MobileNavItem>
                <li className="py-3">
                  <Dropdown
                    label="Meet-up"
                    sections={meetupDropdownData}
                    footer={meetupDropdownFooter}
                    variant="mobile"
                    mobileHref="/meetup"
                  />
                </li>
                <MobileNavItem href="/uses">Porfolio</MobileNavItem>
              </ul>
              
              {/* 다크모드 토글 */}
              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-100/5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-3 text-base font-medium"
                  onClick={() => setTheme(otherTheme)}
                >
                  <span className="text-zinc-800 dark:text-zinc-200">
                    {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </span>
                  <div className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-800">
                    {resolvedTheme === 'dark' ? (
                      <SunIcon className="h-5 w-5 fill-zinc-100 stroke-zinc-500" />
                    ) : (
                      <MoonIcon className="h-5 w-5 fill-zinc-700 stroke-zinc-500" />
                    )}
                  </div>
                </button>
              </div>
            </nav>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

function NavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  let isActive = usePathname() === href

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'relative block px-6 py-2 transition whitespace-nowrap',
          isActive
            ? 'text-teal-500 dark:text-teal-400'
            : 'hover:text-teal-500 dark:hover:text-teal-400',
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
        )}
      </Link>
    </li>
  )
}

function DesktopNavigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  const pathname = usePathname()
  const isMeetupActive = pathname.startsWith('/meetup')

  return (
    <nav {...props}>
      <ul className="flex gap-2 rounded-full bg-white/90 px-10 py-3 text-sm font-medium text-zinc-800 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <NavItem href="/about">About</NavItem>
        <NavItem href="/articles">Articles</NavItem>
        <NavItem href="/projects">Projects</NavItem>
        <li>
          <Dropdown
            label="Meet-up"
            isActive={isMeetupActive}
            sections={meetupDropdownData}
            footer={meetupDropdownFooter}
            variant="desktop"
            width="w-80"
            position="left"
          />
        </li>
        <NavItem href="/uses">Portfolio</NavItem>
      </ul>
    </nav>
  )
}

function ThemeToggle() {
  let { resolvedTheme, setTheme } = useTheme()
  let otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  let [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
      className="group rounded-full bg-white/90 px-3 py-2 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
      onClick={() => setTheme(otherTheme)}
    >
      <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-teal-50 [@media(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600" />
      <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-500 transition dark:block [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500 [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400" />
    </button>
  )
}

function clamp(number: number, a: number, b: number) {
  let min = Math.min(a, b)
  let max = Math.max(a, b)
  return Math.min(Math.max(number, min), max)
}

function AvatarContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        className,
        'rounded-md',
      )}
      {...props}
    />
  )
}

function Avatar({
  large = false,
  className,
  currentLogo,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & {
  large?: boolean;
  currentLogo: any;
}) {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={clsx(className, 'pointer-events-auto')}
      {...props}
    >
      <Image
        src={currentLogo}
        alt="TOS LAB Logo"
        sizes={large ? '4rem' : '3.25rem'}
        className={clsx(
          'object-contain transform scale-[2] sm:scale-[2.5] lg:scale-[2.25]',
          large ? 'h-6 w-20' : 'h-4 w-14 sm:h-5 sm:w-16 lg:h-4.5 lg:w-15',
        )}
        priority
      />
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  
  let isHomePage = pathname === '/'
  let headerRef = useRef<React.ElementRef<'div'>>(null)
  let isInitial = useRef(true)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (pathname === '/login') return;
    
    let downDelay = 0
    let upDelay = 64

    function setProperty(property: string, value: string) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return
      }

      let { top, height } = headerRef.current.getBoundingClientRect()
      let scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight,
      )

      if (isInitial.current) {
        setProperty('--header-position', 'sticky')
      }

      setProperty('--content-offset', `${downDelay}px`)

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`)
        setProperty('--header-mb', `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        let offset = Math.max(height, scrollY - upDelay)
        setProperty('--header-height', `${offset}px`)
        setProperty('--header-mb', `${height - offset}px`)
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`)
        setProperty('--header-mb', `${-scrollY}px`)
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
      }
    }

    function updateStyles() {
      updateHeaderStyles()
      isInitial.current = false
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
  }, [isHomePage, pathname])
  
  const isLoginPage = pathname === '/login'
  if (isLoginPage) {
    return null
  }
  
  const logoForAvatar = mounted && resolvedTheme === 'dark' ? logoDark : logoLight;
  
  return (
    <>
      <header
        className="pointer-events-none relative z-50 flex flex-none flex-col"
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)',
        }}
      >
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position:
              'var(--header-position)' as React.CSSProperties['position'],
          }}
        >
          <Container
            className="top-(--header-top,--spacing(6)) w-full px-4 sm:px-6 lg:px-8 xl:px-8"
            style={{
              position:
                'var(--header-inner-position)' as React.CSSProperties['position'],
            }}
          >
            <div className="relative flex items-center">
              {/* 모바일 레이아웃 (lg 미만에서 표시) */}
              <div className="flex lg:hidden items-center w-full">
                {/* 로고 */}
                <AvatarContainer>
                  <Avatar currentLogo={logoForAvatar} />
                </AvatarContainer>
                
                {/* 중앙 공간 확보 */}
                <div className="flex-1" />
                
                {/* 로그인/프로필 + 버거 메뉴 */}
                <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  {session?.user ? <ProfileButton /> : <LoginButton />}
                  <MobileNavigation />
                </div>
              </div>
              
              {/* 데스크탑 레이아웃 (lg 이상에서 표시) */}
              <div className="hidden lg:flex lg:items-center lg:w-full lg:gap-4">
                {/* 로고 */}
                <div className="flex flex-1 items-center">
                  <AvatarContainer>
                    <Avatar currentLogo={logoForAvatar} />
                  </AvatarContainer>
                </div>
                
                {/* 데스크탑 네비게이션 */}
                <div className="flex flex-1 justify-center">
                  <DesktopNavigation className="pointer-events-auto" />
                </div>
                
                {/* 데스크탑 오른쪽 버튼들 */}
                <div className="flex justify-end flex-1">
                  <div className="pointer-events-auto flex items-center gap-4">
                    {session?.user ? <ProfileButton /> : <LoginButton />}
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && (
        <div
          className="flex-none"
          style={{ height: 'var(--content-offset)' }}
        />
      )}
    </>
  )
}