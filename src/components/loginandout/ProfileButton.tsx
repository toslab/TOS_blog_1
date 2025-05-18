'use client'
import { Fragment } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
// 이메일에서 이니셜 2글자를 가져오는 함수
function getInitials(email: string): string {
  // 이메일에서 @ 앞부분만 추출
  const username = email.split('@')[0]
  // 이름 부분이 2글자 이상이면 첫 2글자 반환
  if (username.length >= 2) {
    return username.substring(0, 2).toUpperCase()
  }
  // 1글자라면 그 글자만 반환
  if (username.length === 1) {
    return username.toUpperCase()
  }
  // 만약 유효하지 않은 이메일이면 기본값 반환
  return 'US'
}
export function ProfileButton() {
  const { data: session } = useSession()
  if (!session?.user) return null
  // 이메일에서 이니셜 추출
  const initials = getInitials(session.user.email || '')
  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    {
      name: 'Sign out',
      href: '#',
      onClick: () => signOut({ callbackUrl: '/' }),
    },
  ]
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative flex items-center rounded-full bg-[#204d4c] p-1 text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none">
        <span className="absolute -inset-1.5" />
        <span className="sr-only">사용자 메뉴 열기</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full">
          {initials}
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={clsx(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  {item.name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
