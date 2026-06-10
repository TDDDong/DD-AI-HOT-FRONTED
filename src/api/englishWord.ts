import { request } from './index'
import type { DailyHotSentencesDto, PersistResultDto } from '../types/englishWord'

/** 拉取随机单词并入库 */
export function persistRandomWord(): Promise<PersistResultDto> {
  return request<PersistResultDto>('/api/v1/english-words/persist', {
    method: 'POST',
  })
}

/** 按日期查询热点例句，date 格式 yyyy-MM-dd，不传则查 UTC 当天 */
export function getDailySentences(date?: string): Promise<DailyHotSentencesDto> {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  return request<DailyHotSentencesDto>(`/api/v1/english-words/daily-sentences${query}`)
}
