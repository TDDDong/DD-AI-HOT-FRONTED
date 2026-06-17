import { formatUtcDate, parseApiDate, utcDateDaysAgo } from '../composables/useDate'
import { getDailyAiNews, getDailyAiNewsSafe } from './aiNews'
import type { AiNewsDaily, HistoryNewsDayItem } from '../types/aiNews'

export async function fetchTodayDaily(): Promise<AiNewsDaily | null> {
  try {
    return await getDailyAiNews()
  } catch {
    return null
  }
}

export async function fetchHistoryDaily(days: number): Promise<HistoryNewsDayItem[]> {
  const requests = Array.from({ length: days }, async (_, offset) => {
    const dateStr = formatUtcDate(utcDateDaysAgo(offset))
    const daily = await getDailyAiNewsSafe(dateStr)

    return {
      date: parseApiDate(dateStr),
      dateStr,
      isToday: offset === 0,
      title: daily?.title ?? '',
      dailyPageUrl: daily?.dailyPageUrl ?? null,
      articles: daily?.articles ?? [],
    }
  })

  return Promise.all(requests)
}
