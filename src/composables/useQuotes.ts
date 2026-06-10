import { computed, ref } from 'vue'
import {
  fetchHistoryQuotes,
  fetchTodaySentences,
  fetchTodaySentencesAfterPersist,
} from '../api/quote'
import type { HistoryQuoteItem, Quote } from '../types/quote'

const todaySentences = ref<Quote[]>([])
const historyItems = ref<HistoryQuoteItem[]>([])
const todayIdx = ref(0)
const loading = ref(false)
const syncing = ref(false)
const error = ref<string | null>(null)

const currentQuote = computed<Quote | null>(() => {
  if (todaySentences.value.length === 0) return null
  return todaySentences.value[todayIdx.value] ?? null
})

const hasTodaySentences = computed(() => todaySentences.value.length > 0)
const canPrevQuote = computed(() => todaySentences.value.length > 1)

function applyTodayQuotes(quotes: Quote[]): void {
  todaySentences.value = quotes
  todayIdx.value = 0
}

async function loadToday(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    applyTodayQuotes(await fetchTodaySentences())
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
    applyTodayQuotes([])
  } finally {
    loading.value = false
  }
}

async function syncTodaySentences(): Promise<void> {
  syncing.value = true
  error.value = null

  try {
    applyTodayQuotes(await fetchTodaySentencesAfterPersist())
  } catch (e) {
    error.value = e instanceof Error ? e.message : '获取失败'
  } finally {
    syncing.value = false
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
  if (todaySentences.value.length <= 1) return
  todayIdx.value = (todayIdx.value - 1 + todaySentences.value.length) % todaySentences.value.length
}

export function useQuotes() {
  return {
    todayIdx,
    currentQuote,
    todaySentences,
    historyItems,
    loading,
    syncing,
    error,
    hasTodaySentences,
    canPrevQuote,
    loadToday,
    syncTodaySentences,
    loadHistory,
    prevQuote,
  }
}
