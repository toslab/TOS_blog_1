// app/(main)/articles/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getArticle, getAllArticleSlugs } from '@/lib/articles'

// 동적 라우트 페이지
export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }
  
  // 해당 slug의 MDX 컴포넌트를 동적으로 import
  // 이 부분은 수동으로 관리해야 합니다
  let MDXContent
  
  switch (params.slug) {
    case 'introducing-animaginary':
      MDXContent = (await import('../introducing-animaginary/page.mdx')).default
      break
    case 'crafting-a-design-system-for-a-multiplanetary-future':
      MDXContent = (await import('../crafting-a-design-system-for-a-multiplanetary-future/page.mdx')).default
      break
    case 'rewriting-the-cosmos-kernel-in-rust':
      MDXContent = (await import('../rewriting-the-cosmos-kernel-in-rust/page.mdx')).default
      break
    // 새 글 추가 시 여기에 case 추가
    default:
      notFound()
  }
  
  return <MDXContent />
}

// 정적 경로 생성 (빌드 시)
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  
  return slugs.map((slug) => ({
    slug,
  }))
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {}
  }
  
  return {
    title: article.title,
    description: article.description,
  }
}