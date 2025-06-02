'use client'

import { useState, useMemo } from 'react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid'

import { Card } from '@/components/common/Card'
import { SimpleLayout } from '@/components/common/SimpleLayout'
import { type ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        {/* 태그 표시 */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {getTagLabel(tag)}
              </span>
            ))}
          </div>
        )}
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 max-md:hidden"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

// 태그 레이블 변환
function getTagLabel(tag: string): string {
  const tagLabels: Record<string, string> = {
    'programming': '프로그래밍',
    'leadership': '리더십',
    'product-design': '제품 디자인',
    'software-design': '소프트웨어 디자인',
    'company-building': '회사 경영',
    'aerospace': '항공우주',
    'technology': '기술',
    'career': '커리어',
  }
  return tagLabels[tag] || tag
}

// ArticlesPageClient 컴포넌트
interface ArticlesPageClientProps {
  articles: ArticleWithSlug[]
  allTags: string[]
  tagCounts: Record<string, number>
}

export default function ArticlesPageClient({ 
  articles, 
  allTags, 
  tagCounts 
}: ArticlesPageClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 선택된 태그에 따라 글 필터링
  const filteredArticles = useMemo(() => {
    if (selectedTags.length === 0) {
      return articles
    }
    return articles.filter(article => 
      selectedTags.some(tag => article.tags?.includes(tag))
    )
  }, [articles, selectedTags])

  // 태그 선택/해제 토글
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // 모든 필터 초기화
  const clearFilters = () => {
    setSelectedTags([])
  }

  return (
    <SimpleLayout
      title="Writing on software design, company building, and the aerospace industry."
      intro="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
    >
      {/* 필터 섹션 */}
      <div className="mb-8">
        <div className="border-b border-zinc-200 pb-5 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              필터
            </h3>
            
            {/* 데스크톱 필터 */}
            <div className="hidden sm:block">
              <PopoverGroup className="flex items-center gap-4">
                <Popover className="relative">
                  <PopoverButton className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
                    <span>태그</span>
                    {selectedTags.length > 0 && (
                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                        {selectedTags.length}
                      </span>
                    )}
                    <ChevronDownIcon className="h-4 w-4" />
                  </PopoverButton>

                  <PopoverPanel className="absolute right-0 z-10 mt-3 w-64 origin-top-right rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5 dark:bg-zinc-800 dark:ring-white/10">
                    <div className="space-y-3">
                      {allTags.map(tag => (
                        <label
                          key={tag}
                          className="flex cursor-pointer items-center gap-3 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                            className="h-4 w-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700"
                          />
                          <span className="flex-1 text-zinc-700 dark:text-zinc-300">
                            {getTagLabel(tag)}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {tagCounts[tag]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </PopoverPanel>
                </Popover>
              </PopoverGroup>
            </div>

            {/* 모바일 필터 */}
            <div className="sm:hidden">
              <Disclosure>
                {({ open }) => (
                  <>
                    <DisclosureButton className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
                      <span>태그</span>
                      {selectedTags.length > 0 && (
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                          {selectedTags.length}
                        </span>
                      )}
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-4">
                      <div className="space-y-3">
                        {allTags.map(tag => (
                          <label
                            key={tag}
                            className="flex cursor-pointer items-center gap-3 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag)}
                              onChange={() => toggleTag(tag)}
                              className="h-4 w-4 rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700"
                            />
                            <span className="flex-1 text-zinc-700 dark:text-zinc-300">
                              {getTagLabel(tag)}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {tagCounts[tag]}
                            </span>
                          </label>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>

        {/* 선택된 필터 표시 */}
        {selectedTags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">선택된 태그:</span>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-100 py-1 pr-2 pl-3 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <span>{getTagLabel(tag)}</span>
                  <button
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                모두 지우기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 글 목록 */}
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Article key={article.slug} article={article} />
            ))
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              선택한 태그에 해당하는 글이 없습니다.
            </p>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
}