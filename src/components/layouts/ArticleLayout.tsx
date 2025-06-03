// src/components/layouts/ArticleLayout.tsx

'use client'

import { Container } from '@/components/layouts/Container'
import { formatDate } from '@/lib/formatDate'
import { type ArticleWithSlug } from '@/lib/articles'

export function ArticleLayout({
  article,
  children,
}: {
  article: ArticleWithSlug
  children: React.ReactNode
}) {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl ">
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                {article.title}
              </h1>
              <time
                dateTime={article.date}
                className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                <span className="ml-3">{formatDate(article.date)}</span>
              </time>
              {article.description && (
                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                  {article.description}
                </p>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            <div className="mt-8 prose prose-zinc max-w-none dark:prose-invert">
              {children}
            </div>
          </article>
        </div>
      </div>
    </Container>
  )
}