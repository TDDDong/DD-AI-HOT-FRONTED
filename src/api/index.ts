import type { ApiErrorBody } from '../types/englishWord'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class RequestTimeoutError extends Error {
  readonly timeoutMs: number

  constructor(timeoutMs: number) {
    super(`请求超时（${Math.round(timeoutMs / 1000)} 秒）`)
    this.name = 'RequestTimeoutError'
    this.timeoutMs = timeoutMs
  }
}

export interface RequestOptions extends RequestInit {
  /** 可选：超时毫秒数；twitter-cli 类慢接口建议 ≥ 180000 */
  timeoutMs?: number
}

export async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const { timeoutMs, ...fetchInit } = init ?? {}
  const headers = new Headers(fetchInit.headers)
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | undefined

  if (timeoutMs && timeoutMs > 0) {
    controller = new AbortController()
    timeoutId = setTimeout(() => controller!.abort(), timeoutMs)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchInit,
      headers,
      signal: controller?.signal ?? fetchInit.signal,
    })

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as ApiErrorBody
      throw new Error(err.error ?? `请求失败: ${response.status}`)
    }

    return response.json() as Promise<T>
  } catch (e) {
    if (controller?.signal.aborted) {
      throw new RequestTimeoutError(timeoutMs!)
    }
    throw e
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}
