// src/components/common/SearchInput.tsx
'use client'

import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SearchInput({
  value,
  onChange,
  placeholder = '검색...',
  className,
  debounceMs = 300
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Debounce 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, onChange, debounceMs])

  // 외부에서 value가 변경될 때 (예: 필터 초기화)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={clsx('relative', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-sm text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-500"
        placeholder={placeholder}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <XMarkIcon className="h-5 w-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}