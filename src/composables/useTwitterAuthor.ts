import { computed, ref } from 'vue'
import { RequestTimeoutError } from '../api/index'
import { getAuthorSyncState, listFollowingWithStatus, listPosts, syncPosts } from '../api/twitter'
import { findFollowingAuthor } from './useTwitterFeed'
import type {
  SyncTwitterPostsResult,
  TwitterAuthorSyncState,
  TwitterFollowingItem,
  TwitterPost,
} from '../types/twitter'

const posts = ref<TwitterPost[]>([])
const author = ref<TwitterFollowingItem | null>(null)
const syncState = ref<TwitterAuthorSyncState | null>(null)
const loading = ref(false)
const syncing = ref(false)
const error = ref<string | null>(null)
const syncError = ref<string | null>(null)
const syncMessage = ref<string | null>(null)
const lastSyncResult = ref<SyncTwitterPostsResult | null>(null)
const activeHandle = ref<string | null>(null)

const hasPosts = computed(() => posts.value.length > 0)
const isSynced = computed(() => syncState.value?.synced ?? false)

function getPostTimestamp(post: TwitterPost): number {
  const parsed = Date.parse(post.createdAt)
  if (!Number.isNaN(parsed)) return parsed

  const [year, month, day] = post.date.split('-').map(Number)
  return new Date(year, month - 1, day).getTime()
}

function sortPostsByTimeDesc(list: TwitterPost[]): TwitterPost[] {
  return [...list].sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a))
}

async function refreshAuthorData(handle: string): Promise<void> {
  const [postList, state] = await Promise.all([listPosts(handle, 50), getAuthorSyncState(handle)])
  posts.value = sortPostsByTimeDesc(postList)
  syncState.value = state
}

async function runSync(handle: string): Promise<SyncTwitterPostsResult> {
  syncing.value = true
  syncError.value = null
  syncMessage.value = null

  try {
    const result = await syncPosts(handle)
    lastSyncResult.value = result
    await refreshAuthorData(handle)

    if (result.persistedCount === 0) {
      syncMessage.value = '暂无新推文'
    } else {
      syncMessage.value = `已同步 ${result.persistedCount} 条新推文`
    }

    return result
  } catch (e) {
    if (e instanceof RequestTimeoutError) {
      syncError.value = `${e.message}，twitter-cli 仍在后台执行时可稍后刷新页面查看`
    } else {
      syncError.value = e instanceof Error ? e.message : '同步失败'
    }
    throw e
  } finally {
    syncing.value = false
  }
}

async function resolveAuthorProfile(handle: string): Promise<void> {
  const normalized = handle.replace(/^@/, '').toLowerCase()
  if (author.value?.screenName.replace(/^@/, '').toLowerCase() === normalized) {
    return
  }

  const cached = findFollowingAuthor(handle)
  if (cached) {
    author.value = cached
    return
  }

  try {
    const list = await listFollowingWithStatus()
    const found =
      list.items.find((item) => item.screenName.replace(/^@/, '').toLowerCase() === normalized) ??
      null
    if (found) {
      author.value = found
    }
  } catch {
    // 保留已有资料
  }
}

async function loadAuthorDetail(handle: string, seedAuthor?: TwitterFollowingItem): Promise<void> {
  const normalized = handle.replace(/^@/, '').toLowerCase()
  const sameAuthor = activeHandle.value === normalized
  activeHandle.value = normalized

  const seed = seedAuthor ?? findFollowingAuthor(handle)
  if (seed) {
    author.value = seed
  }

  const hasCachedPosts = sameAuthor && posts.value.length > 0

  if (!sameAuthor) {
    posts.value = []
    syncState.value = null
    error.value = null
    syncError.value = null
    syncMessage.value = null
    lastSyncResult.value = null
  }

  loading.value = !hasCachedPosts

  try {
    const tasks: Promise<void>[] = [refreshAuthorData(handle)]
    if (!seed) {
      tasks.push(resolveAuthorProfile(handle))
    }
    await Promise.all(tasks)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载博主数据失败'
  } finally {
    loading.value = false
  }
}

function resetAuthorState(): void {
  activeHandle.value = null
  posts.value = []
  author.value = null
  syncState.value = null
  loading.value = false
  syncing.value = false
  error.value = null
  syncError.value = null
  syncMessage.value = null
  lastSyncResult.value = null
}

export function useTwitterAuthor() {
  return {
    posts,
    author,
    syncState,
    loading,
    syncing,
    error,
    syncError,
    syncMessage,
    lastSyncResult,
    hasPosts,
    isSynced,
    loadAuthorDetail,
    refreshAuthorData,
    runSync,
    resetAuthorState,
  }
}
