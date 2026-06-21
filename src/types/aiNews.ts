export interface AiNewsArticle {
  articleId: string
  id: number
  date: string
  rankNo: number
  title: string
  summary: string
  url: string
  hotwords: string[]
  anchor: string
  filePath: string | null
}

export interface AiNewsDaily {
  date: string
  digestId: number
  title: string
  dailyPageUrl: string | null
  filePath: string | null
  articles: AiNewsArticle[]
}

export interface HistoryNewsDayItem {
  date: Date
  dateStr: string
  isToday: boolean
  title: string
  dailyPageUrl: string | null
  articles: AiNewsArticle[]
}

export interface FetchAiNewsResult {
  reportDate: string
  digestId: number
  insertedArticles: number
  updatedArticles: number
  skippedArticles: number
  totalArticles: number
}
