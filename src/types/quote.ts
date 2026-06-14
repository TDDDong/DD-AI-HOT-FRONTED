export interface Quote {
  en: string
  zh: string
  author: string
}

export interface HistoryQuoteItem {
  date: Date
  isToday: boolean
  quotes: Quote[]
}
