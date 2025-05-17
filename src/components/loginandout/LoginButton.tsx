import { Button } from '@/components/Button'
import { ArrowRightIcon } from '@heroicons/react/16/solid'

export function LoginButton() {
  return (
    <Button
      plain
      // 버튼 전체 패딩: 모바일, 태블릿(md), 데스크톱(lg) 구분
      className="group py-2.5 px-4 md:py-1.5 md:px- lg:py-2 lg:px-4"
      href="/login"
    >
      {/* 텍스트: 모바일, 태블릿(md), 데스크톱(lg) 글자 크기 구분 */}
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100 md:text-sm md:tracking-tight lg:text-sm lg:tracking-normal">
        Log in
      </span>
      {/* 아이콘: 모바일, 태블릿(md), 데스크톱(lg) 크기 및 왼쪽 여백(간격) 구분 */}
      <ArrowRightIcon className="ml-1.5 md:ml-1 lg:ml-1.5 h-4 w-4 md:h-3 md:w-3 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  )
}