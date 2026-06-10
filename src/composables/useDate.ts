const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export function formatDate(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日 · ${weekdays[d.getDay()]}`
}

export function dayOfYear(d: Date): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
}

/** API 日期参数：yyyy-MM-dd（UTC） */
export function formatUtcDate(d: Date): string {
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 将 API 返回的 yyyy-MM-dd 解析为本地日历日期（用于展示） */
export function parseApiDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function utcDateDaysAgo(days: number): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days))
}
