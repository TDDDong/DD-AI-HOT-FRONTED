import { quotesMock } from '../data/quotes.mock'
import { dayOfYear } from '../composables/useDate'
import type { HistoryQuoteItem, Quote } from '../types/quote'

const STORAGE_KEY = 'dq:todayIdx'

function getTodayIdx(): number {
  const today = new Date()
  const fallback = dayOfYear(today) % quotesMock.length
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return fallback

  const parsed = parseInt(raw, 10)
  if (isNaN(parsed) || parsed < 0) return fallback

  return parsed % quotesMock.length
}

export async function fetchTodayQuote(): Promise<Quote> {
  await new Promise((resolve) => setTimeout(resolve, 0))
  return quotesMock[getTodayIdx()]
}

export async function fetchHistoryQuotes(days: number): Promise<HistoryQuoteItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 0))

  const today = new Date()
  const todayIdx = getTodayIdx()
  const items: HistoryQuoteItem[] = []

  for (let d = 0; d < days; d++) {
    const date = new Date(today)
    date.setDate(date.getDate() - d)
    const isToday = d === 0

    const quote = isToday
      ? quotesMock[todayIdx % quotesMock.length]
      : quotesMock[(date.getFullYear() * 1000 + dayOfYear(date)) % quotesMock.length]

    items.push({ date, isToday, quote })
  }

  return items
}

export function getQuotesPool(): Quote[] {
  return quotesMock
}
