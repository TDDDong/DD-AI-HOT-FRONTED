import { computed, ref } from 'vue'
import { fetchHistoryQuotes, fetchTodayQuote, getQuotesPool } from '../api/quote'
import { dayOfYear } from './useDate'
import { readStorageNumber, writeStorageNumber } from './useLocalStorage'
import type { HistoryQuoteItem, Quote } from '../types/quote'

const STORAGE_KEY = 'dq:todayIdx'

const todayQuote = ref<Quote | null>(null)
const historyItems = ref<HistoryQuoteItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const quotesPool = getQuotesPool()

function initTodayIdx(): number {
  const today = new Date()
  const fallback = dayOfYear(today) % quotesPool.length
  const idx = readStorageNumber(STORAGE_KEY, fallback)
  return idx % quotesPool.length
}

const todayIdx = ref(initTodayIdx())

const currentQuote = computed(() => {
  if (todayQuote.value) return todayQuote.value
  return quotesPool[todayIdx.value % quotesPool.length]
})

async function loadTodayQuote(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    todayQuote.value = await fetchTodayQuote()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
    todayQuote.value = quotesPool[todayIdx.value % quotesPool.length]
  } finally {
    loading.value = false
  }
}

async function loadHistory(days = 7): Promise<void> {
  loading.value = true
  error.value = null
  try {
    historyItems.value = await fetchHistoryQuotes(days)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
    historyItems.value = []
  } finally {
    loading.value = false
  }
}

function prevQuote(): void {
  todayIdx.value = (todayIdx.value - 1 + quotesPool.length) % quotesPool.length
  writeStorageNumber(STORAGE_KEY, todayIdx.value)
  todayQuote.value = quotesPool[todayIdx.value]
}

export function useQuotes() {
  return {
    todayIdx,
    currentQuote,
    historyItems,
    loading,
    error,
    loadTodayQuote,
    loadHistory,
    prevQuote,
  }
}
