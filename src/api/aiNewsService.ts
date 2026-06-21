import { formatUtcDate, parseApiDate, utcDateDaysAgo } from '../composables/useDate'
import { fetchAndPersistAiNews, getDailyAiNews, getDailyAiNewsSafe } from './aiNews'
import type { AiNewsDaily, HistoryNewsDayItem } from '../types/aiNews'

export async function fetchTodayDaily(): Promise<AiNewsDaily | null> {
  try {
    return await getDailyAiNews()
  } catch {
    return null
  }
}

/** 抓取落库后，再查询当天日报 */
export async function fetchTodayAfterPersist(): Promise<AiNewsDaily | null> {
  await fetchAndPersistAiNews()
  return fetchTodayDaily()
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
