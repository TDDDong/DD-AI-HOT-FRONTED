import { computed, ref } from 'vue'
import { fetchHistoryDaily, fetchTodayAfterPersist, fetchTodayDaily } from '../api/aiNewsService'
import type { AiNewsArticle, AiNewsDaily, HistoryNewsDayItem } from '../types/aiNews'

const todayDaily = ref<AiNewsDaily | null>(null)
const historyItems = ref<HistoryNewsDayItem[]>([])
const articleIdx = ref(0)
const loading = ref(false)
const syncing = ref(false)
const error = ref<string | null>(null)

const todayArticles = computed(() => todayDaily.value?.articles ?? [])

const currentArticle = computed<AiNewsArticle | null>(() => {
  if (todayArticles.value.length === 0) return null
  return todayArticles.value[articleIdx.value] ?? null
})

const hasTodayArticles = computed(() => todayArticles.value.length > 0)
const canSwitchArticle = computed(() => todayArticles.value.length > 1)

function applyTodayDaily(daily: AiNewsDaily | null): void {
  todayDaily.value = daily
  articleIdx.value = 0
}

async function loadToday(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    applyTodayDaily(await fetchTodayDaily())
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
    applyTodayDaily(null)
  } finally {
    loading.value = false
  }
}

async function syncTodayAiNews(): Promise<void> {
  syncing.value = true
  error.value = null

  try {
    applyTodayDaily(await fetchTodayAfterPersist())
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
    historyItems.value = await fetchHistoryDaily(days)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
    historyItems.value = []
  } finally {
    loading.value = false
  }
}

function prevArticle(): void {
  if (todayArticles.value.length <= 1) return
  articleIdx.value = (articleIdx.value - 1 + todayArticles.value.length) % todayArticles.value.length
}

function nextArticle(): void {
  if (todayArticles.value.length <= 1) return
  articleIdx.value = (articleIdx.value + 1) % todayArticles.value.length
}

export function useAiNews() {
  return {
    todayDaily,
    todayArticles,
    currentArticle,
    historyItems,
    articleIdx,
    loading,
    syncing,
    error,
    hasTodayArticles,
    canSwitchArticle,
    loadToday,
    syncTodayAiNews,
    loadHistory,
    prevArticle,
    nextArticle,
  }
}
