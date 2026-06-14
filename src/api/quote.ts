import { getDailySentences, persistRandomWord } from './englishWord'
import { formatUtcDate, parseApiDate, utcDateDaysAgo } from '../composables/useDate'
import type { DailyHotSentencesDto } from '../types/englishWord'
import type { HistoryQuoteItem, Quote } from '../types/quote'

export function mapDailyToQuotes(dto: DailyHotSentencesDto): Quote[] {
  const quotes: Quote[] = []

  for (const word of dto.words) {
    for (const sentence of word.sentences) {
      quotes.push({
        en: sentence.content,
        zh: sentence.cn,
        author: word.word,
      })
    }
  }

  return quotes
}


/** 仅查询 UTC 当天已有例句，不触发入库 */
export async function fetchTodaySentences(): Promise<Quote[]> {
  const dto = await getDailySentences()
  return mapDailyToQuotes(dto)
}

/** 拉取随机单词入库后，再查询当天例句 */
export async function fetchTodaySentencesAfterPersist(): Promise<Quote[]> {
  await persistRandomWord()
  const dto = await getDailySentences()
  return mapDailyToQuotes(dto)
}

export async function fetchHistoryQuotes(days: number): Promise<HistoryQuoteItem[]> {
  const requests = Array.from({ length: days }, async (_, offset) => {
    const dateStr = formatUtcDate(utcDateDaysAgo(offset))
    const dto = await getDailySentences(dateStr)

    return {
      date: parseApiDate(dto.date),
      isToday: offset === 0,
      quotes: mapDailyToQuotes(dto),
    }
  })

  return Promise.all(requests)
}
