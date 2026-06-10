import type { ApiErrorBody } from '../types/englishWord'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new Error(err.error ?? `请求失败: ${response.status}`)
  }

  return response.json() as Promise<T>
}
