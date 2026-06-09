export function readStorageNumber(key: string, fallback: number): number {
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback

  const parsed = parseInt(raw, 10)
  if (isNaN(parsed) || parsed < 0) return fallback

  return parsed
}

export function writeStorageNumber(key: string, value: number): void {
  localStorage.setItem(key, String(value))
}
