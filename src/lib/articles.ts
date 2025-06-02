// lib/articles.ts
interface Article {
  title: string
  description: string
  author: string
  date: string
  tags: string[]
}

export interface ArticleWithSlug extends Article {
  slug: string
}

// 정적 imports 맵
const articleImports = {
  'introducing-animaginary': () => import('@/app/(main)/articles/introducing-animaginary/page.mdx'),
  'crafting-a-design-system-for-a-multiplanetary-future': () => import('@/app/(main)/articles/crafting-a-design-system-for-a-multiplanetary-future/page.mdx'),
  'rewriting-the-cosmos-kernel-in-rust': () => import('@/app/(main)/articles/rewriting-the-cosmos-kernel-in-rust/page.mdx'),
  // 새 글 추가 시 여기에 추가
} as const

export async function getAllArticles(): Promise<ArticleWithSlug[]> {
  const entries = Object.entries(articleImports)
  
  const articles = await Promise.all(
    entries.map(async ([slug, importFn]) => {
      try {
        const module = await importFn()
        
        // MDX 모듈에서 article export 확인
        if (!module.article) {
          console.warn(`No article export found in ${slug}`)
          return null
        }
        
        return {
          slug,
          ...module.article,
          tags: module.article.tags || []
        } as ArticleWithSlug
      } catch (error) {
        console.error(`Error loading article ${slug}:`, error)
        return null
      }
    })
  )
  
  // null 값 필터링 및 날짜 기준 정렬
  return articles
    .filter((article): article is ArticleWithSlug => article !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export async function getArticle(slug: string): Promise<ArticleWithSlug | null> {
  const importFn = articleImports[slug as keyof typeof articleImports]
  
  if (!importFn) {
    console.warn(`No import function found for slug: ${slug}`)
    return null
  }
  
  try {
    const module = await importFn()
    
    if (!module.article) {
      console.warn(`No article export found in ${slug}`)
      return null
    }
    
    return {
      slug,
      ...module.article,
      tags: module.article.tags || []
    }
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error)
    return null
  }
}

// 모든 고유한 태그 가져오기
export async function getAllTags(): Promise<string[]> {
  const articles = await getAllArticles()
  const tagSet = new Set<string>()
  
  articles.forEach(article => {
    article.tags?.forEach(tag => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

// 특정 태그를 가진 글들만 가져오기
export async function getArticlesByTag(tag: string): Promise<ArticleWithSlug[]> {
  const articles = await getAllArticles()
  return articles.filter(article => article.tags?.includes(tag))
}

// 태그별 글 개수 가져오기
export async function getTagCounts(): Promise<Record<string, number>> {
  const articles = await getAllArticles()
  const tagCounts: Record<string, number> = {}
  
  articles.forEach(article => {
    article.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return tagCounts
}

// 글 슬러그 타입 (타입 안전성을 위해)
export type ArticleSlug = keyof typeof articleImports

// 모든 글 슬러그 배열 가져오기
export function getAllArticleSlugs(): ArticleSlug[] {
  return Object.keys(articleImports) as ArticleSlug[]
}