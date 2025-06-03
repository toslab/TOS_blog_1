// src/components/common/Dropdown.tsx

'use client'

import { Fragment, ReactNode } from 'react'
import Link from 'next/link'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

export interface DropdownItem {
  name: string
  description?: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DropdownSection {
  title?: string
  description?: string
  items: DropdownItem[]
}

export interface DropdownFooter {
  text: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface DropdownProps {
  // 트리거 버튼 관련
  label: string
  isActive?: boolean
  className?: string
  
  // 드롭다운 메뉴 관련
  sections: DropdownSection[]
  footer?: DropdownFooter
  width?: string
  position?: 'left' | 'right'
  
  // 모바일 버전
  variant?: 'desktop' | 'mobile'
  mobileHref?: string
}

export function Dropdown({
  label,
  isActive = false,
  className,
  sections,
  footer,
  width = 'w-80',
  position = 'left',
  variant = 'desktop',
  mobileHref = '#'
}: DropdownProps) {

  // 모바일 버전은 단순한 링크
  if (variant === 'mobile') {
    return (
      <Link 
        href={mobileHref} 
        className="block py-3 text-base font-medium whitespace-nowrap"
      >
        {label}
      </Link>
    )
  }

  // 데스크탑 버전은 드롭다운
  return (
    <Menu as="div" className={clsx("relative", className)}>
      <MenuButton
        className={clsx(
          'relative flex items-center gap-1 px-6 py-2 transition whitespace-nowrap',
          isActive
            ? 'text-teal-500 dark:text-teal-400'
            : 'hover:text-teal-500 dark:hover:text-teal-400',
        )}
      >
        {label}
        <ChevronDownIcon className="h-4 w-4 text-zinc-500" />
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
        )}
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className={clsx(
          'absolute z-10 mt-6 origin-top rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-zinc-800 dark:ring-white/10',
          width,
          position === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
        )}>
          <div className="p-6">
            {/* 섹션들 렌더링 */}
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* 섹션 헤더 */}
                {(section.title || section.description) && (
                  <div className={clsx(
                    "border-b border-zinc-100 pb-4 dark:border-zinc-700",
                    sectionIndex === 0 ? "mb-4" : "mb-4 mt-4"
                  )}>
                    {section.title && (
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {section.title}
                      </h3>
                    )}
                    {section.description && (
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {section.description}
                      </p>
                    )}
                  </div>
                )}

                {/* 섹션 아이템들 */}
                <div className={clsx(
                  "space-y-1",
                  sectionIndex > 0 && !section.title && !section.description ? "mt-4" : ""
                )}>
                  {section.items.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        href={item.href}
                        className="group flex items-start gap-3 rounded-lg p-3 text-sm transition hover:bg-zinc-50 ui-active:bg-zinc-50 ui-not-active:hover:bg-zinc-50 dark:hover:bg-zinc-700/50 dark:ui-active:bg-zinc-700/50"
                      >
                        {item.icon && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 group-hover:bg-teal-100 dark:bg-teal-500/10 dark:group-hover:bg-teal-500/20">
                            <item.icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    </MenuItem>
                  ))}
                </div>
              </div>
            ))}

            {/* 푸터 섹션 */}
            {footer && (
              <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-700">
                <MenuItem>
                  <Link
                    href={footer.href}
                    className="flex w-full items-center justify-center rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700 ui-active:bg-teal-700"
                  >
                    {footer.icon && <footer.icon className="mr-2 h-4 w-4" />}
                    {footer.text}
                  </Link>
                </MenuItem>
              </div>
            )}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}