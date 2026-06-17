import { request } from './index'
import type { AiNewsArticle, AiNewsDaily } from '../types/aiNews'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function getDailyAiNews(date?: string): Promise<AiNewsDaily> {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  return request<AiNewsDaily>(`/api/v1/ai-news/daily${query}`)
}

/** 指定日期无日报时返回 null，不抛错 */
export async function getDailyAiNewsSafe(date: string): Promise<AiNewsDaily | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/ai-news/daily?date=${encodeURIComponent(date)}`,
    { headers: { Accept: 'application/json' } },
  )

  if (response.status === 404) return null

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? `请求失败: ${response.status}`)
  }

  return response.json() as Promise<AiNewsDaily>
}

export function listAiNewsArticles(params?: {
  from?: string
  to?: string
  tag?: string
  keyword?: string
  limit?: number
}): Promise<AiNewsArticle[]> {
  const qs = new URLSearchParams()
  if (params?.from) qs.set('from', params.from)
  if (params?.to) qs.set('to', params.to)
  if (params?.tag) qs.set('tag', params.tag)
  if (params?.keyword) qs.set('keyword', params.keyword)
  if (params?.limit) qs.set('limit', String(params.limit))
  const query = qs.toString()
  return request<AiNewsArticle[]>(`/api/v1/ai-news/listAll${query ? `?${query}` : ''}`)
}
