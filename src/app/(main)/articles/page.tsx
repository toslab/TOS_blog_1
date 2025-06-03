// src/app/(main)/articles/page.tsx
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getAllTags, getTagCounts } from '@/lib/articles'
import ArticlesPageClient from './articles-client'

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}

export default async function ArticlesPage() {
  try {
    // 서버에서 데이터 가져오기
    const [articles, allTags, tagCounts] = await Promise.all([
      getAllArticles(),
      getAllTags(),
      getTagCounts(),
    ])

    // 데이터 검증
    if (!articles || articles.length === 0) {
      return (
        <ArticlesPageClient 
          articles={[]} 
          allTags={[]} 
          tagCounts={{}} 
        />
      )
    }

    return (
      <ArticlesPageClient 
        articles={articles} 
        allTags={allTags} 
        tagCounts={tagCounts} 
      />
    )
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    // 에러 발생시 404 페이지로 이동하거나 에러 페이지 표시
    notFound()
  }
}