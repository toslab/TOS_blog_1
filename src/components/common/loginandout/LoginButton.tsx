// components/common/loginandout/LoginButton.tsx
import { Button } from '@/components/common/Button'
import { ArrowRightIcon } from '@heroicons/react/16/solid'

export function LoginButton() {
  return (
    <Button
      plain
      className="group flex items-center rounded-full bg-white py-2 px-4 md:py-1.5 md:px-3 lg:py-2 lg:px-4 whitespace-nowrap shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition dark:bg-zinc-800 dark:ring-white/10 dark:hover:ring-white/20"
      href="/auth/login"
    >
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 md:text-sm md:tracking-tight lg:text-sm lg:tracking-normal whitespace-nowrap">
        Log in
      </span>
      <ArrowRightIcon className="flex-shrink-0 ml-1.5 md:ml-1 lg:ml-1.5 h-4 w-4 md:h-3 md:w-3 lg:h-4 lg:w-4 text-zinc-700 dark:text-zinc-200 transition-transform group-hover:translate-x-1" />
    </Button>
  )
}