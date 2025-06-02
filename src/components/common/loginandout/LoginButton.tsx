// components/common/loginandout/LoginButton.tsx
import { Button } from '@/components/common/Button'
import { ArrowRightIcon } from '@heroicons/react/16/solid'

export function LoginButton() {
  return (
    <Button
      plain
      // flex와 items-center 추가하여 아이콘과 텍스트를 한 줄에 정렬
      className="group flex items-center py-2.5 px-4 md:py-1.5 md:px-3 lg:py-2 lg:px-4 whitespace-nowrap"
      href="/login"
    >
      {/* 텍스트에도 whitespace-nowrap 추가 */}
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100 md:text-sm md:tracking-tight lg:text-sm lg:tracking-normal whitespace-nowrap">
        Log in
      </span>
      {/* flex-shrink-0 추가하여 아이콘이 축소되지 않도록 */}
      <ArrowRightIcon className="flex-shrink-0 ml-1.5 md:ml-1 lg:ml-1.5 h-4 w-4 md:h-3 md:w-3 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  )
}