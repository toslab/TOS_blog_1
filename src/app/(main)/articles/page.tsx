import { type Metadata } from 'next'
import { getAllArticles, getAllTags, getTagCounts } from '@/lib/articles'
import ArticlesPageClient from './articles-client'

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}

export default async function ArticlesPage() {
  // 서버에서 데이터 가져오기
  const [articles, allTags, tagCounts] = await Promise.all([
    getAllArticles(),
    getAllTags(),
    getTagCounts(),
  ])

  return (
    <ArticlesPageClient 
      articles={articles} 
      allTags={allTags} 
      tagCounts={tagCounts} 
    />
  )
}