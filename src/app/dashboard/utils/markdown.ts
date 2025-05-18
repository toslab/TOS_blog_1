import TurndownService from "turndown"

// Turndown 서비스 인스턴스 생성 및 설정
export const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
})

// 테이블 지원 추가
turndownService.addRule("table", {
  filter: ["table"],
  replacement: (content, node) => {
    const tableContent = content.trim()
    return "\n\n" + tableContent + "\n\n"
  },
})

// 이미지 처리 개선
turndownService.addRule("image", {
  filter: "img",
  replacement: (content, node) => {
    const alt = node.getAttribute("alt") || ""
    const src = node.getAttribute("src") || ""
    return `![${alt}](${src})`
  },
})
