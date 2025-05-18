import glob from 'fast-glob'
import fs from 'fs'
import path from 'path'

interface Article {
  title: string
  description: string
  author: string
  date: string
}

export interface ArticleWithSlug extends Article {
  slug: string
}

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { article } = (await import(`../app/(main)/articles/${articleFilename}`)) as {
    default: React.ComponentType
    article: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...article,
  }
}

const articlesDirectory = path.join(process.cwd(), 'src/app/(main)/articles') // 경로 확인!

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/(main)/articles',
  })
  console.log('Found article filenames:', articleFilenames) // 파일 목록 확인

  if (articleFilenames.length === 0) {
    console.log('No article files found in ./src/app/(main)/articles/')
    return [] // 파일이 없으면 빈 배열 반환
  }

  let articles = await Promise.all(
    articleFilenames.map(async (filename) => {
      try {
        return await importArticle(filename)
      } catch (error) {
        console.error(`Error importing article ${filename}:`, error)
        return null // 오류 발생 시 null 반환
      }
    })
  )

  articles = articles.filter(article => article !== null) // null 제거
  console.log('Processed articles:', articles) // 처리된 아티클 객체 목록 확인

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { article } = (await import(`../app/(main)/articles/${articleFilename}`)) as {
    default: React.ComponentType
    article: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...article,
  }
}
