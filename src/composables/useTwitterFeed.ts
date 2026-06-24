import { computed, ref } from 'vue'
import { RequestTimeoutError } from '../api/index'
import { listFollowingWithStatus, refreshFollowing } from '../api/twitter'
import type { TwitterFollowingItem } from '../types/twitter'

const following = ref<TwitterFollowingItem[]>([])
const ownerScreenName = ref<string | null>(null)
const listFetchedAt = ref<string | null>(null)
const total = ref(0)
const loading = ref(false)
const refreshing = ref(false)
const error = ref<string | null>(null)
const refreshError = ref<string | null>(null)
const refreshMessage = ref<string | null>(null)

const hasFollowing = computed(() => following.value.length > 0)
const needsRefresh = computed(() => listFetchedAt.value === null && !hasFollowing.value)

export function findFollowingAuthor(handle: string): TwitterFollowingItem | undefined {
  const normalized = handle.replace(/^@/, '').toLowerCase()
  return following.value.find((item) => item.screenName.toLowerCase() === normalized)
}

function applyListResult(result: Awaited<ReturnType<typeof listFollowingWithStatus>>): void {
  ownerScreenName.value = result.ownerScreenName
  listFetchedAt.value = result.listFetchedAt
  total.value = result.total
  following.value = result.items
}

/** 读库加载关注列表（快） */
async function loadFollowing(max = 0): Promise<void> {
  loading.value = true
  error.value = null

  try {
    applyListResult(await listFollowingWithStatus(max))
  } catch (e) {
    error.value = e instanceof Error ? e.message : '无法读取订阅博主列表'
    following.value = []
    ownerScreenName.value = null
    listFetchedAt.value = null
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** 从 X 刷新关注列表（慢，用户主动触发） */
async function refreshFollowingFromX(max = 0): Promise<void> {
  refreshing.value = true
  refreshError.value = null
  refreshMessage.value = null

  try {
    const result = await refreshFollowing(max, ownerScreenName.value ?? undefined)
    applyListResult(await listFollowingWithStatus(max, result.ownerScreenName))

    const parts: string[] = []
    if (result.inserted > 0) parts.push(`新增 ${result.inserted}`)
    if (result.updated > 0) parts.push(`更新 ${result.updated}`)
    if (result.removed > 0) parts.push(`移除 ${result.removed}`)
    refreshMessage.value = parts.length > 0 ? parts.join('，') : '关注列表已是最新'
  } catch (e) {
    if (e instanceof RequestTimeoutError) {
      refreshError.value = `${e.message}，从 X 拉取关注较慢，请稍后重试`
    } else {
      refreshError.value = e instanceof Error ? e.message : '刷新关注列表失败'
    }
    throw e
  } finally {
    refreshing.value = false
  }
}

export function useTwitterFeed() {
  return {
    following,
    ownerScreenName,
    listFetchedAt,
    total,
    loading,
    refreshing,
    error,
    refreshError,
    refreshMessage,
    hasFollowing,
    needsRefresh,
    loadFollowing,
    refreshFollowingFromX,
    findFollowingAuthor,
  }
}
